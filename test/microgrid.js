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

// SunDance data.
var sites = [];

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

    // Add site to sites.
    sites.push(site);
  })
}

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