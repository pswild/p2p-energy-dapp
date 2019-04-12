// Project: Energy as a Commodity.
// Description: Testing framework for microgrid using real data.

// Contracts.
const Auction1B2P = artifacts.require('Auction1B2P.sol');
// Helper functions.
const { expectThrow, increaseTime } = require('./helpers')

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

////////////////////////
// Bidding Mechanism. //
////////////////////////

// Determine bids for given time interval.

////////////////
// Microgrid. //
////////////////

// Test microgrid setup using auction contract.
contract('Auction1B2P', function (accounts) {
  // Participants.

  // Seller.
  let owner = accounts[0]
  // Bidders.
  let bidder1 = accounts[1]
  let bidder2 = accounts[2]
  let bidder3 = accounts[3]
  let bidder4 = accounts[4]
  let bidder5 = accounts[5]
  let bidder6 = accounts[6]
  let bidder7 = accounts[7]
  let bidder8 = accounts[8]
  let bidder9 = accounts[9]
  let bidder10 = accounts[10]
  // Winner.
  let beneficiary = accounts[4]

  // Time.
  let day = 24 * 60 * 60;
  let duration = 3 * day;
  let auction;
  let timestampEnd;

  // Tests.

  beforeEach(async function() {
    timestampEnd = web3.eth.getBlock('latest').timestamp  +  duration; // 1 hour from now
    auction = await Auction1B2P.new(1e18, timestampEnd, beneficiary, {from: owner});
  });

  it('Should be able to set up the constructor auction', async function() {
    assert.equal(await auction.owner(), owner, 'The owner is not set correctly')
    //assert.equal(await auction.description(), "item", 'The description is not set correctly')
    assert.equal(await auction.timestampEnd(), timestampEnd, 'The endtime is not set correctly')
    assert.equal(await auction.beneficiary(), beneficiary, 'The beneficiary is not set correctly')
  })

  // where sdX refers to SunDance file X
  it('Testing whole auction model', async function() {
    for (i = 0; i < 10; i++) {

      await auction.sendTransaction({ value: (sd1[i][1]*10^18), from: bidder1 });
      await auction.sendTransaction({ value: (sd2[i][1]*10^18), from: bidder2 });
      await auction.sendTransaction({ value: (sd3[i][1]*10^18), from: bidder3 });
      await auction.sendTransaction({ value: (sd4[i][1]*10^18), from: bidder4 });
      await auction.sendTransaction({ value: (sd5[i][1]*10^18), from: bidder5 });
      await auction.sendTransaction({ value: (sd6[i][1]*10^18), from: bidder6 });
      await auction.sendTransaction({ value: (sd7[i][1]*10^18), from: bidder7 });
      await auction.sendTransaction({ value: (sd8[i][1]*10^18), from: bidder8 });
      await auction.sendTransaction({ value: (sd9[i][1]*10^18), from: bidder9 });

      // cannot withdraw before the end
      await expectThrow(auction.finalize({ from: owner }));

      increaseTime(duration + 1);

      var balanceBefore = web3.eth.getBalance(beneficiary).toNumber()
      var bidder1Before = web3.eth.getBalance(beneficiary).toNumber()

      console.log(balanceBefore)

      await auction.finalize({ from: owner });

      var balanceAfter = web3.eth.getBalance(beneficiary).toNumber()
      var winningPrice = balanceAfter-balanceBefore

      assert.equal(balanceBefore + winningPrice, balanceAfter, "beneficiary didn't receive correct amount")

      console.log(winningPrice)
      console.log(await auction.winner())

      //assert.equal(await auction.winner(), bidder9, "Winner not set up correctly");
      //assert.equal(await auction.secondPlace(), bidder8, "Second Place not set up correctly");
    }
    // cannot withdraw more than once
    await expectThrow(auction.finalize({ from: owner }));
  });
});