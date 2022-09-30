const { nextISSTimeForMyLocation } = require('./iss');

nextISSTimeForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  console.log("Brilliant, look up!\n");

  for (const pass of passTimes) {

    const date = new Date(0);
    date.setUTCSeconds(pass.risetime);

    console.log(`Next pass: ${date} for ${pass.duration} seconds.\n`);
  }
});
