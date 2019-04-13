// Project: Energy as a Commodity.
// Description: Testing framework for microgrid using real data.

// Contracts.
var Auction = artifacts.require("./Auction.sol");

// CSV parser.
const csv = require("fast-csv");
const fs = require('fs');

///////////
// Data. //
///////////

// SunDance CSV format:
// ["date", "use", "gen", "grid"].

// Process each site.
for (var i = 1; i <= 1; i++) {

  // Filter missing sites.
  if(i == 2 || i == 6) {
    continue;
  }

  // File reader.
  function readFile(i) {

    // File name.
    var file_name = '/Users/ParkerWild/github/p2p-energy-dapp/data/sundance/SunDance_' + i + '.csv';

    // Log.
    console.log("File name: " + file_name);

    // Create read stream.
    var stream = fs.createReadStream(file_name);

    // Index & batch.
    // let index = 0;
    // let batch = 0;

    // List of points at site.
    var points = [];

    // Create CSV stream.
    var csvStream = csv().on("data", function(data){
        // Data operations.
        // ...

        // Point.
        let point = {
          date: data[0],
          use: data[1],
          gen: data[2],
          grid: data[3]
        }

        // Add to points.
        points.push(point);

      }).on("end", function(){
        // Upon completion.
        // ...

        // Callback.
        callback(points);
      });

    // Pipe.
    stream.pipe(csvStream);
  }

  // Called upon completion of asynchronous "readFile()".
  function callback(points) {
    // Log.
    // console.log(points);
  }

  // Read file.
  readFile(i);
}

///////////
// Grid. //
///////////

// Set up microgrid parameters.

//////////
// Bid. //
//////////

// Ascertain bids of each user.

//////////////
// Auction. //
//////////////

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

// Log.
// console.log("Next auction: " + nextAuctionString);

///////////
// Test. //
///////////

contract('Microgrid', function (accounts) {

  it("...testing the microgrid.", function() {
    // Wait until contract is deployed.
    return Auction.deployed().then(function(instance) {
      // Contract instance.
      auctionInstance = instance;
      // Send bid.
      return auctionInstance.bid(5, {from: accounts[0]} );
    }).then(function() {
      // Get bid.
      return auctionInstance.get.call();
    }).then(function(value) {
      // Assert equal.
      assert.equal(value, 5, "The microgrid test failed.");
    });
  });

});