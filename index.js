//require and run main fetch fn

const { nextISSTimeForMyLocation } = require('./iss');

// const IP = '135.23.96.116';
// const coords = { latitude: 43.653226, longitude: -79.3831843 };
// const passTimes = [
//   { risetime: 1664547712, duration: 342 },
//   { risetime: 1664584112, duration: 554 },
//   { risetime: 1664620512, duration: 661 },
//   { risetime: 1664656912, duration: 203 },
//   { risetime: 1664693312, duration: 520 }
// ];

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }
//   console.log('It worked! Returned IP:' , ip);
// });

// fetchCoordsByIP(IP, (error, coords) => {
//   if (error) {
//     return console.log("It didn't work!", error)
//   }
//   console.log('Worked again! Your coordinates:\n', coords)
// })

// fetchISSFlyOverTimes(coords, (error, passTimes) => {
//   if (error) {
//     return console.log("It didn't work!", error);
//   }
//   console.log('Success. You will the ISS pass over according to:\n', passTimes);
// });

nextISSTimeForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error)
  }
  console.log("Brilliant, look up!");

  for (const pass of passTimes) {

    const date = new Date(0);     
    date.setUTCSeconds(pass.risetime);

    console.log(`Next pass: ${date} for ${pass.duration} seconds.`);
  }
});
