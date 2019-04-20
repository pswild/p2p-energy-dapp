// /* eslint-disable no-undef */ // Avoid the linter considering truffle elements as undef.
// const Auction1B1P = artifacts.require('Auction1B1P.sol')
// const { expectThrow, increaseTime } = require('./helpers')
//
// const parser = require('csv-parser');
// const fs = require('fs');
// const results = [];
//
// var csv = require("fast-csv");
//
// for (var i = 2; i <= 13; i++) {
//
//   // Filter missing sites.
//   if(i == 2 || i == 6) {
//     continue;
//   }
//
//     function readFile() {
//       var file_name = "/Users/vigneshrajendran/Downloads/p2p-energy-dapp-master6/data/sundance/SunDance_" + i + ".csv";
//       var dat = [];
//       var j = 0;
//       var x = 0;
//       var y = 0;
//       var stream = fs.createReadStream(file_name);
//     let index = 0;
//     let batch = 0;
//     console.log(`
//         --------------------------------------------
//         --------- Parsing sundance.csv file ---------
//         --------------------------------------------
//     ******** data
//       `);
//     var csvStream = csv()
//           .on("data", function(data){
//               // BID Strategy 1
//               // y = parseFloat(data[1])
//               // x = y/parseFloat(data[3])
//               // if (parseFloat(x) < .1) {
//               //     x = 1 + .01*y;
//               //  }
//               // if (parseFloat(x) > .1) {
//               //     x = 5*x + .01*y;
//               // }
//               // BID Strategy 2
//               // x = parseFloat(data[3]);
//               // y = parseFloat(data[1]);
//               // if (parseFloat(x) < 1) {
//               //     x = 1 - .001*y;
//               //  }
//               // if (parseFloat(x) >= 1) {
//               //     x = x - .001*y;
//               // }
//                //if (parseFloat(data[1]) > 5) {
//                 // x = parseFloat(data[1])/2;
//                //}
//               //console.log(data[1])
//               // BID Strategy 3
//               // x = parseFloat(data[2]);
//               // y = parseFloat(data[1]);
//               // if (parseFloat(data[2]) < 1) {
//               //   x = 1 + .01*y;
//               // }
//               // if (parseFloat(data[2]) >= 1) {
//               //   x = x + .01*y;
//               // }
//               // if (parseFloat(data[2]) > 5){
//               //   x = 3*x + .01*y;
//               // }
//               dat[j] = parseFloat(x);
//               j = j + 1;
//           })
//           .on("end", function(){
//             results.push(dat);
//              //Add last remainder batch
//              // distribData.push(allocData);
//              // allocData = [];
//              // setAllocation();
//              if (results.length == 10) {
//                runTests(results);
//           }
//           });
//       stream.pipe(csvStream);
//     }
//
//     readFile()
// }
//
// function runTests(results) {
//   // Log.
//   console.log(results);
//   // console.log("SunDance data processed.");
// }
//
// contract('Auction1B1P', function (accounts) {
//   let owner = accounts[0]
//   //let bidder1 = accounts[1]
//   let bidder2 = accounts[2]
//   let bidder3 = accounts[3]
//   let bidder4 = accounts[4]
//   let bidder5 = accounts[5]
//   let bidder6 = accounts[6]
//   let bidder7 = accounts[7]
//   let bidder8 = accounts[8]
//   let bidder9 = accounts[9]
//
//   let beneficiary = accounts[1]
//
//   let day = 24 * 60 * 60;
//   let duration = 3 * day;
//   let auction;
//   let timestampEnd;
//
//   beforeEach(async function() {
//     timestampEnd = web3.eth.getBlock('latest').timestamp  +  duration; // 1 hour from now
//     auction = await Auction1B1P.new(1e13, timestampEnd, beneficiary, {from: owner});
//   });
//
//   it('Should be able to set up the constructor auction', async function() {
//     assert.equal(await auction.owner(), owner, 'The owner is not set correctly')
//     //assert.equal(await auction.description(), "item", 'The description is not set correctly')
//     assert.equal(await auction.timestampEnd(), timestampEnd, 'The endtime is not set correctly')
//     assert.equal(await auction.beneficiary(), beneficiary, 'The beneficiary is not set correctly')
//   })
//
// for (var n = 1; n <= 360; n++) {
//   var name = 'Testing auction model with CSV inputs ' + 1;
//   var k = 1;
//   it(name, async function() {
//   //   var k = 1;
//   k = k + 24;
//   console.log(k);
//   await auction.sendTransaction({ value: (results[1][k]*10000000000000000), from: bidder2 });
//   await auction.sendTransaction({ value: (results[2][k]*10000000000000000), from: bidder3 });
//   await auction.sendTransaction({ value: (results[3][k]*10000000000000000), from: bidder4 });
//   await auction.sendTransaction({ value: (results[4][k]*10000000000000000), from: bidder5 });
//   await auction.sendTransaction({ value: (results[5][k]*10000000000000000), from: bidder6 });
//   await auction.sendTransaction({ value: (results[6][k]*10000000000000000), from: bidder7 });
//   await auction.sendTransaction({ value: (results[7][k]*10000000000000000), from: bidder8 });
//   await auction.sendTransaction({ value: (results[8][k]*10000000000000000), from: bidder9 });
//     await expectThrow(auction.finalize({ from: owner }));
//
//     increaseTime(duration + 1);
//
//     var balanceBefore = web3.eth.getBalance(beneficiary).toNumber()
//     var bidder1Before = web3.eth.getBalance(beneficiary).toNumber()
//
//     //console.log(balanceBefore)
//
//     await auction.finalize({ from: owner });
//
//     var balanceAfter = await web3.eth.getBalance(beneficiary).toNumber()
//     var winningPrice = balanceAfter-balanceBefore
//     //console.log(balanceAfter)
//     await assert.equal(balanceBefore + winningPrice, balanceAfter, "beneficiary didn't receive correct amount")
//
//     console.log(await winningPrice)
//     console.log(await auction.winner())
//
//     await expectThrow(auction.finalize({ from: owner }));
//   });
// }
//
//   // it('Should be able to send a bid above the initial price', async function() {
//   //   await auction.sendTransaction({ value: 2e18, from: bidderA });
//   //   //assert.equal(await auction.price(), 1e18, "Price not set up correctly");
//   //   assert.equal(await auction.winner(), bidderA, "Winner not set up correctly");
//   // })
//   //
//   // it('Should not be able to bid twice', async function() {
//   //   await auction.sendTransaction({ value: 1.2e18, from: bidderA });
//   //   await expectThrow(auction.sendTransaction({value: 1.4e18, from: bidderA}));
//   // })
//   //
//   // it('Should not be able to send a bid below the initial price', async function() {
//   //   await expectThrow(auction.sendTransaction({ value: 0.5e18, from: bidderA }));
//   // })
//   //
//   // it('Should not be able to send a bid after the end of auction', async function() {
//   //   increaseTime(duration + 1);
//   //   await expectThrow(auction.sendTransaction({ value: 1e18, from: bidderA }));
//   // })
//   //
//   // it('Should be able to outbid', async function() {
//   //   await auction.sendTransaction({ value: 1e18, from: bidderA });
//   //   await auction.sendTransaction({ value: 1.25e18, from: bidderB });
//   //   //assert.equal(await auction.price(), 1.25e18, "Price not set up correctly");
//   //   assert.equal(await auction.winner(), bidderB, "Winner not set up correctly");
//   // })
//   //
//   // it('Should not be able to outbid if bid too low', async function() {
//   //   await auction.sendTransaction({ value: 1e18, from: bidderA });
//   //   await expectThrow(auction.sendTransaction({ value: .8e18, from: bidderB }));
//   //   //assert.equal(await auction.price(), 1e18, "Price not set up correctly");
//   //   assert.equal(await auction.winner(), bidderA, "Winner not set up correctly");
//   // });
//   //
//   // it('Beneficiary should receive ETH equal to winning bid', async function() {
//   //   await auction.sendTransaction({ value: 1e18, from: bidderA });
//   //   await auction.sendTransaction({ value: 2e18, from: bidderB });
//   //   await expectThrow(auction.finalize({ from: owner })); // cannot withdraw before the end
//   //
//   //   increaseTime(duration + 1);
//   //
//   //   var balanceBefore = web3.eth.getBalance(beneficiary).toNumber()
//   //   console.log(balanceBefore)
//   //   await auction.finalize({ from: owner });
//   //   var balanceAfter = web3.eth.getBalance(beneficiary).toNumber()
//   //   console.log(balanceAfter)
//   //   assert.equal(balanceBefore + 2e18, balanceAfter, "beneficiary didn't receive correct amount")
//   //
//   //   await expectThrow(auction.finalize({ from: owner })); // cannot withdraw more than once
//   // });
//   //
//   // it('Should fail if some random guy wants a refund', async function() {
//   //   await auction.sendTransaction({ value: 1e18, from: bidderA });
//   //   increaseTime(duration + 1);
//   //   await expectThrow(auction.refund({ from: bidderB }));
//   // });
//   //
//   // it('Should be able to withdraw', async function() {
//   //   await auction.sendTransaction({ value: 1e18, from: bidderA });
//   //   await auction.sendTransaction({ value: 1.25e18, from: bidderB });
//   //
//   //   var balanceBeforeA = web3.eth.getBalance(bidderA).toNumber()
//   //   await auction.refund({ from: bidderA })
//   //   var balanceAfterA = web3.eth.getBalance(bidderA).toNumber()
//   //   assert.closeTo(balanceBeforeA + 1e18, balanceAfterA, 0.01 * 1e18, "bidder A didn't receive correct refund"); // closeTo because of the gas fees
//   // });
//   //
//   //
//   // it('Should NOT be able to withdraw if the highest bidder', async function() {
//   //   await auction.sendTransaction({ value: 1e18, from: bidderA });
//   //   await expectThrow( auction.refund({ from: bidderA }) );
//   // });
//
// });
