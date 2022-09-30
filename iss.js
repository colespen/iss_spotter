//contain most of logic for fectching data from each APIendpoint
const request = require("request");

let URL = 'https://api.ipify.org?format=json'; //find IP
let URL2 = 'http://ipwho.is/'; // find coords via IP
let URL3 = 'https://iss-flyover.herokuapp.com/json/?';

//fetchMyIP will asynchronously return IP using an API
const fetchMyIP = (callback) => {
  // use request to fetch IP address from JSON API
  request(URL, (err, response, body) => {

    if (err) { //if err exit function
      callback(err, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}.`;
      callback(Error(msg), null);
      return;
    }
    const ip = JSON.parse(body).ip;
    callback(null, ip);
    // console.log(ip);
  });
};
/*
//Make single API request to get lat/long for given IPv4
* Input:
*   - The ip (ipv4) address (string)
*   - A callback (to pass back an error or the lat/lng object)
* Returns (via Callback):
*   - An error, if any (nullable)
*   - The lat and lng as an object (null if error). Example:
*     { latitude: '49.27670', longitude: '-123.13000' }
*/
const fetchCoordsByIP = (ip, callback) => {
  request(URL2 + ip, (err, response, body) => {
    if (err) {
      return callback(err, null);
    }
    const data = JSON.parse(body);

    if (!data.success) {
      return callback(Error(`$Error. "success" status: ${data.success}. ${data.message}.`), null);
    }
    const { latitude, longitude } = data;

    callback(null, { latitude, longitude });
    // console.log({ latitude, longitude })
  });
};
/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = (coords, callback) => {

  request(URL3 + "lat=" + coords.latitude + "&lon=" + coords.longitude, (err, response, body) => {

    if (err) {
      return callback(err, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}.`;
      callback(Error(msg), null);
      return;
    }
    const passover = JSON.parse(body).response;
    callback(null, passover);
    // console.log(passover);
  });
};
/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimeForMyLocation = (callbackFn) => {

  fetchMyIP((error, ip) => {
    if (error) {
      return callbackFn(error, null);
    }
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callbackFn(error, null);
      }
      fetchISSFlyOverTimes(coords, (error, flyover) => {
        if (error) {
          return callbackFn(error, null);
        }
        callbackFn(null, flyover)
      });
    });
  });
};

module.exports = { nextISSTimeForMyLocation };