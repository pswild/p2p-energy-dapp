// Project: Energy as a Commodity.
// Description: Testing framework for microgrid using real data.

// Contracts.
var Auction = artifacts.require("./Auction.sol");

///////////
// Grid. //
///////////

// Set up microgrid parameters.

///////////
// Data. //
///////////

// Load necessary data.

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
console.log("Next auction: " + nextAuctionString);

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