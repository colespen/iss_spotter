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
  });
};

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
  });
};

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
  });
};

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
        callbackFn(null, flyover);
      });
    });
  });
};

module.exports = { nextISSTimeForMyLocation };