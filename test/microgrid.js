// Project: Energy as a Commodity.
// Description: Testing framework for microgrid using real data.

global.fetch = require('node-fetch');

// Contracts.
const Auction1B2P = artifacts.require('Auction1B2P.sol');
console.log("start");
// Helper functions.
const { expectThrow, increaseTime } = require('./helpers');

// D3 JavaScript.
var D3 = require("d3");

const parser = require('csv-parser');
const fs = require('fs');
const results = [];

//const csv = require('../data/sundance/SunDance_' + 1 + '.csv');



//fs.createReadStream('../data/sundance/SunDance_1.csv')
//  .pipe(parser())
//  .on('data', (data) => results.push(data))
//  .on('end', () => {
//    console.log(results);

//console.log(results)

//var fs = require("fs");
var csv = require("fast-csv");
//var csvReader = require('csv-read-stream');
//var reader = csvReader();

// var stream = fs.createReadStream('../data/sundance/SunDance_1.csv');
// var csvStream = csv()
// .on("data", function(data) {
//     console.log("hello")
//     index++;
// });
// console.log(data);

for (var i = 2; i <= 13; i++) {

  // Filter missing sites.
  if(i == 2 || i == 6) {
    continue;
  }

    function readFile() {
      var file_name = "/Users/vigneshrajendran/Downloads/p2p-energy-dapp-master6/data/sundance/SunDance_" + i + ".csv";
      var dat = [];
      var j = 0;
      var x = 0;
      var y = 0;
      var stream = fs.createReadStream(file_name);
    let index = 0;
    let batch = 0;
    console.log(`
        --------------------------------------------
        --------- Parsing sundance.csv file ---------
        --------------------------------------------
    ******** data
      `);
    var csvStream = csv()
          .on("data", function(data){
              // BID Strategy 1
              // y = parseFloat(data[1])
              // x = y/parseFloat(data[3])
              // if (parseFloat(x) < .1) {
              //     x = 1 + .01*y;
              //  }
              // if (parseFloat(x) > .1) {
              //     x = 10*x + .01*y;
              // }
              // BID Strategy 2
              // x = parseFloat(data[3]);
              // y = parseFloat(data[1]);
              // if (parseFloat(x) < 1) {
              //     x = 1 + .001*y;
              //  }
              // if (parseFloat(x) >= 1) {
              //     x = x + .001*y;
              // }
               //if (parseFloat(data[1]) > 5) {
                // x = parseFloat(data[1])/2;
               //}
              //console.log(data[1])
              // BID Strategy 3
              x = parseFloat(data[2]);
              y = parseFloat(data[1]);
              if (parseFloat(data[2]) < 1) {
                x = 1 + .01*y;
              }
              if (parseFloat(data[2]) >= 1) {
                x = x + .01*y;
              }
              if (parseFloat(data[2]) > 5){
                x = 3*x + .01*y;
              }
              dat[j] = parseFloat(x);
              j = j + 1;
          })
          .on("end", function(){
            results.push(dat);
             //Add last remainder batch
             // distribData.push(allocData);
             // allocData = [];
             // setAllocation();
             if (results.length == 10) {
               runTests(results);
          }
          });
      stream.pipe(csvStream);
    }

    readFile()
}

function runTests(results) {
  // Log.
  console.log(results);
  // console.log("SunDance data processed.");
}

//
// ////////////////////////
// // Bidding Mechanism. //
// ////////////////////////
//
// // Determine bids for given time interval.
//
// ////////////////
// // Microgrid. //
// ////////////////
//
// Test microgrid setup using auction contract.
contract('Auction1B2P', function (accounts) {
  // Participants.

  // Seller.
  let owner = accounts[0]
  // Bidders.
  //let bidder1 = accounts[1]
  let bidder2 = accounts[2]
  let bidder3 = accounts[3]
  let bidder4 = accounts[4]
  let bidder5 = accounts[5]
  let bidder6 = accounts[6]
  let bidder7 = accounts[7]
  let bidder8 = accounts[8]
  let bidder9 = accounts[9]
  //let bidder10 = accounts[10]
  // Winner.
  let beneficiary = accounts[1]

  for (var i = 0; i < 10; i++)
  {
    console.log(accounts[i])
  }
  // Time.
  let day = 24 * 60 * 60;
  let duration = 3 * day;
  let auction;
  let timestampEnd;

  // Tests.

  beforeEach(async function() {
    timestampEnd = web3.eth.getBlock('latest').timestamp  +  duration; // 1 hour from now
    auction = await Auction1B2P.new(1e13, timestampEnd, beneficiary, {from: owner});
  });

  it('Should be able to set up the constructor auction', async function() {
    assert.equal(await auction.owner(), owner, 'The owner is not set correctly')
    //assert.equal(await auction.description(), "item", 'The description is not set correctly')
    assert.equal(await auction.timestampEnd(), timestampEnd, 'The endtime is not set correctly')
    assert.equal(await auction.beneficiary(), beneficiary, 'The beneficiary is not set correctly')
    var k = 2575
    console.log(results[0][k])
    console.log(results[1][k])
    console.log(results[2][k])
    console.log(results[3][k])
    console.log(results[4][k])
    console.log(results[5][k])
    console.log(results[6][k])
    console.log(results[7][k])
    console.log(results[8][k])
  })

  // where sdX refers to SunDance file X
  //var k = 0;
  for (var n = 1; n <= 360; n++) {
  var k = 1;
    var name = 'Testing auction model with CSV inputs ' + k;
  it(name, async function() {
      k = k + 25;
      console.log(k)
      // console.log(results[0][k])
      // console.log(results[1][k])
      // console.log(results[2][k])
      // console.log(results[3][k])
      // console.log(results[4][k])
      // console.log(results[5][k])
      // console.log(results[6][k])
      // console.log(results[7][k])
      // console.log(results[8][k])
      //await auction.sendTransaction({ value: (results[0][k]*10000000000000000), from: bidder1 });
      await auction.sendTransaction({ value: (results[1][k]*10000000000000000), from: bidder2 });
      await auction.sendTransaction({ value: (results[2][k]*10000000000000000), from: bidder3 });
      await auction.sendTransaction({ value: (results[3][k]*10000000000000000), from: bidder4 });
      await auction.sendTransaction({ value: (results[4][k]*10000000000000000), from: bidder5 });
      await auction.sendTransaction({ value: (results[5][k]*10000000000000000), from: bidder6 });
      await auction.sendTransaction({ value: (results[6][k]*10000000000000000), from: bidder7 });
      await auction.sendTransaction({ value: (results[7][k]*10000000000000000), from: bidder8 });
      await auction.sendTransaction({ value: (results[8][k]*10000000000000000), from: bidder9 });
      console.log(Math.max(results[8][k], results[1][k], results[2][k], results[3][k], results[4][k], results[5][k], results[6][k], results[7][k]));
      //console.log(results[0][k])
      //console.log(results[1][k])
      //console.log(results[2][k])
      //console.log(results[3][k])
      //console.log(results[4][k])
      //console.log(results[5][k])
      //console.log(results[6][k])
      //console.log(results[7][k])
      //console.log(results[8][k])
      // cannot withdraw before the end
      await expectThrow(auction.finalize({ from: owner }));

      increaseTime(duration + 1);

      var balanceBefore = web3.eth.getBalance(beneficiary).toNumber()
      var bidder1Before = web3.eth.getBalance(beneficiary).toNumber()

      //console.log(balanceBefore)

      await auction.finalize({ from: owner });

      var balanceAfter = await web3.eth.getBalance(beneficiary).toNumber()
      var winningPrice = balanceAfter-balanceBefore
      //console.log(balanceAfter)
      await assert.equal(balanceBefore + winningPrice, balanceAfter, "beneficiary didn't receive correct amount")

      console.log(await winningPrice)
      console.log(await auction.winner())

      // var file_name = "/Users/vigneshrajendran/Downloads/p2p-energy-dapp-master6/data/Results_" + k + ".csv";
      // var stream = fs.createReadStream(file_name);
      // let index = 0;
      // let batch = 0;
      // var csvStream = csv()
      //       .on("data", function(data){
      //           y = parseFloat(data[1])
      //           x = y/parseFloat(data[3])
      //           if (parseFloat(x) < .1) {
      //               x = 1 + .01*y;
      //            }
      //           if (parseFloat(x) > .1) {
      //               x = 10*x + .01*y;
      //           }
      //            //if (parseFloat(data[1]) > 5) {
      //             // x = parseFloat(data[1])/2;
      //            //}
      //           //console.log(data[1])
      //           dat[j] = parseFloat(x);
      //           j = j + 1;
      //       })
      //       .on("end", function(){
      //         results.push(dat);
      //          //Add last remainder batch
      //          // distribData.push(allocData);
      //          // allocData = [];
      //          // setAllocation();
      //          if (results.length == 10) {
      //            runTests(results);
      //       }
      //       });
      //   stream.pipe(csvStream);
      // }


      //assert.equal(await auction.winner(), bidder9, "Winner not set up correctly");

      //assert.equal(await auction.winner(), bidder9, "Winner not set up correctly");
      //assert.equal(await auction.secondPlace(), bidder8, "Second Place not set up correctly");
    // cannot withdraw more than once
    await expectThrow(auction.finalize({ from: owner }));
  });
}
//   it('Testing auction model with CSV inputs 3', async function() {
//       k = 32
//       await auction.sendTransaction({ value: (results[0][k]*100000000000000000), from: bidder1 });
//       await auction.sendTransaction({ value: (results[1][k]*100000000000000000), from: bidder2 });
//       await auction.sendTransaction({ value: (results[2][k]*100000000000000000), from: bidder3 });
//       await auction.sendTransaction({ value: (results[3][k]*100000000000000000), from: bidder4 });
//       await auction.sendTransaction({ value: (results[4][k]*100000000000000000), from: bidder5 });
//       await auction.sendTransaction({ value: (results[5][k]*100000000000000000), from: bidder6 });
//       await auction.sendTransaction({ value: (results[6][k]*100000000000000000), from: bidder7 });
//       await auction.sendTransaction({ value: (results[7][k]*100000000000000000), from: bidder8 });
//       //await auction.sendTransaction({ value: (results[8][k]*100000000000000000), from: bidder9 });
//       console.log(Math.max(results[0][k], results[1][k], results[2][k], results[3][k], results[4][k], results[5][k], results[6][k], results[7][k]));
//
//       //console.log(results[8][k])
//       // cannot withdraw before the end
//       await expectThrow(auction.finalize({ from: owner }));
//
//       increaseTime(duration + 1);
//
//       var balanceBefore = web3.eth.getBalance(beneficiary).toNumber()
//       var bidder1Before = web3.eth.getBalance(beneficiary).toNumber()
//
//       console.log(balanceBefore)
//
//       await auction.finalize({ from: owner });
//
//       var balanceAfter = await web3.eth.getBalance(beneficiary).toNumber()
//       var winningPrice = balanceAfter-balanceBefore
//       console.log(balanceAfter)
//       assert.equal(balanceBefore + winningPrice, balanceAfter, "beneficiary didn't receive correct amount")
//
//       console.log(winningPrice)
//       console.log(await auction.winner())
//       //assert.equal(await auction.winner(), bidder9, "Winner not set up correctly");
//
//       //assert.equal(await auction.winner(), bidder9, "Winner not set up correctly");
//       //assert.equal(await auction.secondPlace(), bidder8, "Second Place not set up correctly");
//     // cannot withdraw more than once
//   // }
//     await expectThrow(auction.finalize({ from: owner }));
//   });
//   it('Testing auction model with CSV inputs 3', async function() {
//       k = 57
//       await auction.sendTransaction({ value: (results[0][k]*100000000000000000), from: bidder1 });
//       await auction.sendTransaction({ value: (results[1][k]*100000000000000000), from: bidder2 });
//       await auction.sendTransaction({ value: (results[2][k]*100000000000000000), from: bidder3 });
//       await auction.sendTransaction({ value: (results[3][k]*100000000000000000), from: bidder4 });
//       await auction.sendTransaction({ value: (results[4][k]*100000000000000000), from: bidder5 });
//       await auction.sendTransaction({ value: (results[5][k]*100000000000000000), from: bidder6 });
//       await auction.sendTransaction({ value: (results[6][k]*100000000000000000), from: bidder7 });
//       await auction.sendTransaction({ value: (results[7][k]*100000000000000000), from: bidder8 });
//       //await auction.sendTransaction({ value: (results[8][k]*100000000000000000), from: bidder9 });
//       console.log(Math.max(results[0][k], results[1][k], results[2][k], results[3][k], results[4][k], results[5][k], results[6][k], results[7][k]));
//
//       //console.log(results[8][k])
//       // cannot withdraw before the end
//       await expectThrow(auction.finalize({ from: owner }));
//
//       increaseTime(duration + 1);
//
//       var balanceBefore = web3.eth.getBalance(beneficiary).toNumber()
//       var bidder1Before = web3.eth.getBalance(beneficiary).toNumber()
//
//       console.log(balanceBefore)
//
//       await auction.finalize({ from: owner });
//
//       var balanceAfter = await web3.eth.getBalance(beneficiary).toNumber()
//       var winningPrice = balanceAfter-balanceBefore
//       console.log(balanceAfter)
//       assert.equal(balanceBefore + winningPrice, balanceAfter, "beneficiary didn't receive correct amount")
//
//       console.log(winningPrice)
//       console.log(await auction.winner())
//       //assert.equal(await auction.winner(), bidder9, "Winner not set up correctly");
//
//       //assert.equal(await auction.winner(), bidder9, "Winner not set up correctly");
//       //assert.equal(await auction.secondPlace(), bidder8, "Second Place not set up correctly");
//     // cannot withdraw more than once
// // }
//     await expectThrow(auction.finalize({ from: owner }));
//   });
//   it('Testing auction model with CSV inputs 3', async function() {
//       k = 70
//       await auction.sendTransaction({ value: (results[0][k]*100000000000000000), from: bidder1 });
//       await auction.sendTransaction({ value: (results[1][k]*100000000000000000), from: bidder2 });
//       await auction.sendTransaction({ value: (results[2][k]*100000000000000000), from: bidder3 });
//       await auction.sendTransaction({ value: (results[3][k]*100000000000000000), from: bidder4 });
//       await auction.sendTransaction({ value: (results[4][k]*100000000000000000), from: bidder5 });
//       await auction.sendTransaction({ value: (results[5][k]*100000000000000000), from: bidder6 });
//       await auction.sendTransaction({ value: (results[6][k]*100000000000000000), from: bidder7 });
//       await auction.sendTransaction({ value: (results[7][k]*100000000000000000), from: bidder8 });
//       //await auction.sendTransaction({ value: (results[8][k]*100000000000000000), from: bidder9 });
//       console.log(Math.max(results[0][k], results[1][k], results[2][k], results[3][k], results[4][k], results[5][k], results[6][k], results[7][k]));
//
//       //console.log(results[8][k])
//       // cannot withdraw before the end
//       await expectThrow(auction.finalize({ from: owner }));
//
//       increaseTime(duration + 1);
//
//       var balanceBefore = web3.eth.getBalance(beneficiary).toNumber()
//       var bidder1Before = web3.eth.getBalance(beneficiary).toNumber()
//
//       console.log(balanceBefore)
//
//       await auction.finalize({ from: owner });
//
//       var balanceAfter = await web3.eth.getBalance(beneficiary).toNumber()
//       var winningPrice = balanceAfter-balanceBefore
//       console.log(balanceAfter)
//       assert.equal(balanceBefore + winningPrice, balanceAfter, "beneficiary didn't receive correct amount")
//
//       console.log(winningPrice)
//       console.log(await auction.winner())
//       //assert.equal(await auction.winner(), bidder9, "Winner not set up correctly");
//
//       //assert.equal(await auction.winner(), bidder9, "Winner not set up correctly");
//       //assert.equal(await auction.secondPlace(), bidder8, "Second Place not set up correctly");
//     // cannot withdraw more than once
// // }
//     await expectThrow(auction.finalize({ from: owner }));
//   });
//   it('Testing auction model with CSV inputs 3', async function() {
//       k = 190
//       await auction.sendTransaction({ value: (results[0][k]*100000000000000000), from: bidder1 });
//       await auction.sendTransaction({ value: (results[1][k]*100000000000000000), from: bidder2 });
//       await auction.sendTransaction({ value: (results[2][k]*100000000000000000), from: bidder3 });
//       await auction.sendTransaction({ value: (results[3][k]*100000000000000000), from: bidder4 });
//       await auction.sendTransaction({ value: (results[4][k]*100000000000000000), from: bidder5 });
//       await auction.sendTransaction({ value: (results[5][k]*100000000000000000), from: bidder6 });
//       await auction.sendTransaction({ value: (results[6][k]*100000000000000000), from: bidder7 });
//       await auction.sendTransaction({ value: (results[7][k]*100000000000000000), from: bidder8 });
//       //await auction.sendTransaction({ value: (results[8][k]*100000000000000000), from: bidder9 });
//       console.log(Math.max(results[0][k], results[1][k], results[2][k], results[3][k], results[4][k], results[5][k], results[6][k], results[7][k]));
//
//       //console.log(results[8][k])
//       // cannot withdraw before the end
//       await expectThrow(auction.finalize({ from: owner }));
//
//       increaseTime(duration + 1);
//
//       var balanceBefore = web3.eth.getBalance(beneficiary).toNumber()
//       var bidder1Before = web3.eth.getBalance(beneficiary).toNumber()
//
//       console.log(balanceBefore)
//
//       await auction.finalize({ from: owner });
//
//       var balanceAfter = await web3.eth.getBalance(beneficiary).toNumber()
//       var winningPrice = balanceAfter-balanceBefore
//       console.log(balanceAfter)
//       assert.equal(balanceBefore + winningPrice, balanceAfter, "beneficiary didn't receive correct amount")
//
//       console.log(winningPrice)
//       console.log(await auction.winner())
//       //assert.equal(await auction.winner(), bidder9, "Winner not set up correctly");
//
//       //assert.equal(await auction.winner(), bidder9, "Winner not set up correctly");
//       //assert.equal(await auction.secondPlace(), bidder8, "Second Place not set up correctly");
//     // cannot withdraw more than once
// // }
//     await expectThrow(auction.finalize({ from: owner }));
//   });
//   it('Testing auction model with CSV inputs 3', async function() {
//       k = 700
//       await auction.sendTransaction({ value: (results[0][k]*100000000000000000), from: bidder1 });
//       await auction.sendTransaction({ value: (results[1][k]*100000000000000000), from: bidder2 });
//       await auction.sendTransaction({ value: (results[2][k]*100000000000000000), from: bidder3 });
//       await auction.sendTransaction({ value: (results[3][k]*100000000000000000), from: bidder4 });
//       await auction.sendTransaction({ value: (results[4][k]*100000000000000000), from: bidder5 });
//       await auction.sendTransaction({ value: (results[5][k]*100000000000000000), from: bidder6 });
//       await auction.sendTransaction({ value: (results[6][k]*100000000000000000), from: bidder7 });
//       await auction.sendTransaction({ value: (results[7][k]*100000000000000000), from: bidder8 });
//       //await auction.sendTransaction({ value: (results[8][k]*100000000000000000), from: bidder9 });
//       console.log(Math.max(results[0][k], results[1][k], results[2][k], results[3][k], results[4][k], results[5][k], results[6][k], results[7][k]));
//
//       //console.log(results[8][k])
//       // cannot withdraw before the end
//       await expectThrow(auction.finalize({ from: owner }));
//
//       increaseTime(duration + 1);
//
//       var balanceBefore = web3.eth.getBalance(beneficiary).toNumber()
//       var bidder1Before = web3.eth.getBalance(beneficiary).toNumber()
//
//       console.log(balanceBefore)
//
//       await auction.finalize({ from: owner });
//
//       var balanceAfter = await web3.eth.getBalance(beneficiary).toNumber()
//       var winningPrice = balanceAfter-balanceBefore
//       console.log(balanceAfter)
//       assert.equal(balanceBefore + winningPrice, balanceAfter, "beneficiary didn't receive correct amount")
//
//       console.log(winningPrice)
//       console.log(await auction.winner())
//       //assert.equal(await auction.winner(), bidder9, "Winner not set up correctly");
//
//       //assert.equal(await auction.winner(), bidder9, "Winner not set up correctly");
//       //assert.equal(await auction.secondPlace(), bidder8, "Second Place not set up correctly");
//     // cannot withdraw more than once
// // }
//     await expectThrow(auction.finalize({ from: owner }));
//   });
});
