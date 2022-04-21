# Log-Parser

## _A log parser that can:_
- Read an access log file
- Resolve Country and State from IP address (IE MaxMind GeoLite2 Free)
- Translate useragent to device type (Mobile, Desktop, Tablet) and Browser (Safari, Chrome, etc)
- Combine new Geo & Device fields with existing fields on access log file and output/export a CSV

Log parser was built using Docker Dev Environments using NodeJS. Included in this repo is the GeoLite2-City.mmdb database and gobankingrates.com.access.log file for easy testability of functionality. The package-lock.json is also included to ensure proper versioning.

For reference, these were the Node and npm verisons used in creation:
- Node Version 16.14.2
- npm Version 8.5.0

## How to use Log-Parser:

- Clone the repository at https://github.com/nagelfoundation/log-parser.git
- run `npm i`
- run `node logParser.js`

> After `logParser.js` has run you will have a new csv file called `out.csv` that will contain all of the original information with the additions of Country, State, Device and Browser appended to the end of each entry. Should you wish to create a new file be sure to delete the old one first otherwise the new lines will simply be appended to the old file.

> It should also be noted that in the event that Country or State is not found in GeoLite2 "Could not resolve country/state from IP" will appear in its place.

Notes for further development:
- create better error handling to cover all edge cases
- create unit tests