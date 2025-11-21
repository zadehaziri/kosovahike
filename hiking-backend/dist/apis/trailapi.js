"use strict";
const request = require('request');
const options = {
    method: 'GET',
    url: 'https://trailapi-trailapi.p.rapidapi.com/trails/%7Bid%7D/maps/',
    headers: {
        'X': 'https://tnmaccess.nationalmap.gov/api/v1/map_services',
        'H': 'https://tnmaccess.nationalmap.gov/api/v1/map_services'
    }
};
request(options, function (error, response, body) {
    if (error)
        throw new Error(error);
    console.log(body);
});
//# sourceMappingURL=trailapi.js.map