// Project: Energy as a Commodity.
// Description: Testing framework for microgrid using real data.

// Contracts.
var Auction = artifacts.require("./Auction.sol");

// D3 JavaScript.
const D3 = require("d3");

///////////
// Grid. //
///////////

// Set up microgrid parameters.

///////////
// Data. //
///////////

// SunDance CSV format:
// ["date", "use", "gen", "grid"].

// Sites array format:
// [site]

// Points array format:
// [point]

// Site object format:
// {"name": file_name, "points": [point]}

// Point object format:
// {"date": date, "use": use, "gen": gen, grid": grid}

// Log.
console.log("SunDance data: ");

// List of sites.
var sites = [];

// Process each site.
for (var i = 1; i <= 100; i++) {
  // Filter missing sites.
  if(i == 2 || i == 6) {
    continue
  }

  // Site name.
  var site_name = '../data/sundance/SunDance_' + i + '.csv';

  // NOTE: Site name is not being passed to asynchronous function.

  // Load site data.
  const csv = require('../data/sundance/SunDance_' + i + '.csv');

  // Parse CSV files.
  D3.csv(csv).then(function(csv) {
    // List of points at site.
    var points = [];

    // Read each line of CSV.
    for (var j = 0; j < csv.length; j++) {

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

      // Point.
      let point = {
        date: date,
        use: csv[j].use,
        gen: csv[j].gen,
        grid: csv[j].grid
      }

      // Add to points.
      points.push(point);
    }

    // Return.
    return points;
  }).then(function(points) {
    // Site.
    let site = {
      name: "",
      points: points
    }
    // Add to sites.
    sites.push(site);
  })
}

// Log.
// console.log(sites);

//////////
// Bid. //
//////////

// Current date and time.
var current = new Date();
var currentYear = current.getFullYear();
var currentMonth = current.getMonth() + 1;
var currentDay = current.getDate();
var currentHour = current.getHours();
var currentMinute = current.getMinutes();
var currentSecond = current.getSeconds();

// Auction period: [year, month, day, hour].
var nextHour = currentHour + 1;
var nextAuction = [currentYear, currentMonth, currentDay, nextHour];
var nextAuctionString =
  currentMonth + "/" +
  currentDay + "/" +
  currentYear + " at " +
  nextHour + ":00.";

// Ascertain bids of each user.

///////////
// Test. //
///////////

contract('Auction', function (accounts) {

  it("...should bid the value 5.", function() {
    return Auction.deployed().then(function(instance) {
      auctionInstance = instance;

      return auctionInstance.bid(5, {from: accounts[0]});
    }).then(function() {
      return auctionInstance.get.call();
    }).then(function(value) {
      assert.equal(value, 5, "The value 5 was not bid.");
    });
  });

});