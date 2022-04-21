const fs = require('fs')
    , es = require('event-stream');
const Reader = require('@maxmind/geoip2-node').Reader;
const UAParser = require('ua-parser-js');
const csvWriter = require('csv-write-stream');

const dbBuffer = fs.readFileSync('GeoLite2-City.mmdb')
const reader = Reader.openBuffer(dbBuffer);

const s = fs.createReadStream('gobankingrates.com.access.log')
  .pipe(es.split())
  .pipe(es.mapSync(function(line){

    // pause the readstream
    s.pause();

    // resolves ip to country/state
    let ipAddress = line.split(' ')[0]
    geoLiteResponse = reader.city(ipAddress);
    let country = geoLiteResponse.country?.names.en ? geoLiteResponse.country.names.en : "Could not resolve country from IP"
    let state = geoLiteResponse.subdivisions ? geoLiteResponse.subdivisions[0].names.en : "Could not resolve state from IP"
    line += ` "${country}" "${state}"`

    // parses ua to device/browser
    let parser = new UAParser()
    parser.setUA(line.split('"')[5])
    let res = parser.getResult()
    let device = res.device.type ? res.device.type : "desktop"
    let browser = res.browser.name
    line += ` "${device}" "${browser}"`

    // write csv
    let str = line.split('"')

    let writer = csvWriter()

      if (!fs.existsSync('out.csv'))
          writer = csvWriter({ headers: ['IPAddressAndDate', 'HTTPRequest', 'Response', 'URL', 'UserAgent', 'Country', 'State', 'Device', 'Browser']});
      else
        writer = csvWriter({sendHeaders: false});
    
      writer.pipe(fs.createWriteStream('out.csv', {flags: 'a'}));
      writer.write({
        IPAddressAndDate: str[0],
        HTTPRequest: str[1],
        Response: str[2],
        URL: str[3],
        UserAgent: str[5],
        Country: str[7], 
        State: str[9], 
        Device: str[11], 
        Browser: str[13]
      });
      writer.end();

    // resume readstream
    s.resume()
          
  })
  .on('error', function(err){
      console.log('Error while reading file.', err);
  })
  .on('end', function(){
      console.log('File available as "out.csv".')
  })
);