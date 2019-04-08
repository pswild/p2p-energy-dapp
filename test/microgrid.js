// Project: Energy as a Commodity.
// Description: Testing framework for microgrid using real data.

// Contracts.
const Auction1B2P = artifacts.require('Auction1B2P.sol');

// D3 JavaScript.
const D3 = require("d3");

////////////////////
// Data analysis. //
////////////////////

// SunDance CSV format:
// ["date", "use", "gen", "grid"].

// Site object format:
// {"name": file_name, "points": [points]}

// Point object format:
// {"date": date, "use": use, "gen": gen, grid": grid}

// SunDance.
var sundance = [];

// Process SunDance data.
for (var i = 1; i <= 100; i++) {
  // Filter missing files.
  if(i == 2 || i == 6) {
    continue
  }

  // Site object.
  let site = new Object();
  var file_name = '../data/sundance/SunDance_' + i + '.csv';
  var points = [];

  // Load SunDance data.
  const csv = require('../data/sundance/SunDance_' + i + '.csv');

  // Parse CSV files.
  D3.csv(csv).then(function(csv) {
    // Read each line of CSV.
    for (var j = 0; j < csv.length; j++) {
      // Point object.
      let point = new Object();

      // Create new date object.
      var csvDate = csv[j].date.split(" ");

      var calendar = csvDate[0].split("/");
      var period = csvDate[1].split(":");
      var ampm = csvDate[2];

      var year = "20" + calendar[2];
      var month = calendar[0];
      var day = calendar[1];

      var hour = parseInt(period[0], 10);
      if (ampm === "PM") {
        hour += 12;
      }

      var date = new Date(year, month, day, hour);

      // Point properties.
      point = {
        date: date,
        use: csv[j].use,
        gen: csv[j].gen,
        grid: csv[j].grid
      }

      // Add to points.
      points.push(point);
    }

    // Site properties.
    site = {
      name: file_name,
      points: points
    }

    // Add site to SunDance.
    sundance.push(site);
  })
}

// Log.
// console.log(sundance);

///////////////
// Microgrid //
///////////////

// Test microgrid setup using auction contract.
contract('Auction1B2P', function (accounts) {

});