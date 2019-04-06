// Project: Energy as a Commodity.
// Description: Testing framework for microgrid using real data.

// Helper functions.
const { expectThrow, increaseTime } = require('./helpers')

// D3 CSV Parser.
import * as D3 from "d3"

// Contracts.
const Auction1B2P = artifacts.require('Auction1B2P.sol')

// Load usage data.
import data_name from './path/to/data.csv'
// ...

// Parse CSV data.
// Parse CSV file.
D3.csv(data).then(function(data) {
  // CSV format: ["Account", "SPID", "MID", "Time", "Channel", "kWh"].

};

// Test.
contract('Auction1B2P', function (accounts) {
  let owner = accounts[0]
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
  let beneficiary = accounts[4]

  let day = 24 * 60 * 60;
  let duration = 3 * day;
  let auction;
  let timestampEnd;

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

  it('Testing whole auction model', async function() {
    for (i = 0; i < 10; i++) {

      //bid1 = CSVDATALINE(i) * 10^18

      await auction.sendTransaction({ value: bid1, from: bidder1 });
      await auction.sendTransaction({ value: bid2, from: bidder2 });
      await auction.sendTransaction({ value: bid3, from: bidder3 });
      await auction.sendTransaction({ value: bid4, from: bidder4 });
      await auction.sendTransaction({ value: bid5, from: bidder5 });
      await auction.sendTransaction({ value: bid6, from: bidder6 });
      await auction.sendTransaction({ value: bid7, from: bidder7 });
      await auction.sendTransaction({ value: bid8, from: bidder8 });
      await auction.sendTransaction({ value: bid9, from: bidder9 });
      await expectThrow(auction.finalize({ from: owner })); // cannot withdraw before the end


      increaseTime(duration + 1);

      var balanceBefore = web3.eth.getBalance(beneficiary).toNumber()
      var bidder1Before = web3.eth.getBalance(beneficiary).toNumber()
      console.log(balanceBefore)
      await auction.finalize({ from: owner });
      var balanceAfter = web3.eth.getBalance(beneficiary).toNumber()
      var winningPrice = balanceAfter-balanceBefore
      console.log(winningPrice)
      assert.equal(balanceBefore + winningPrice, balanceAfter, "beneficiary didn't receive correct amount")
      assert.equal(await auction.winner(), bidder9, "Winner not set up correctly");
      assert.equal(await auction.secondPlace(), bidder8, "Second Place not set up correctly");
    }

    await expectThrow(auction.finalize({ from: owner })); // cannot withdraw more than once
  });

});
