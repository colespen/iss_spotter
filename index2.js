const { nextISSTimesForMyLocation } = require('./iss_promised');


nextISSTimesForMyLocation()
.then((passTimes) => {
  printPassTimes(passTimes);
})
.catch(error => {
  console.log("It didn't work: ", error.message);
})


//printer
const printPassTimes = function(passTimes) {
  console.log("Brilliant! Look up:\n")
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass: ${datetime} for ${duration} seconds!\n`);
  }
};