/* eslint-disable no-undef */ // Avoid the linter considering truffle elements as undef.
const Auction1B1P = artifacts.require('Auction1B1P.sol')
const { expectThrow, increaseTime } = require('./helpers')

contract('Auction1B1P', function (accounts) {
  let owner = accounts[0]
  let bidderA = accounts[1]
  let bidderB = accounts[2]
  let bidderC = accounts[3]
  let beneficiary = accounts[4]

  let day = 24 * 60 * 60;
  let duration = 3 * day;
  let auction;
  let timestampEnd;

  beforeEach(async function() {
    timestampEnd = web3.eth.getBlock('latest').timestamp  +  duration; // 1 hour from now
    auction = await Auction1B1P.new(1e18, timestampEnd, beneficiary, {from: owner});
  });

  it('Should be able to set up the constructor auction', async function() {
    assert.equal(await auction.owner(), owner, 'The owner is not set correctly')
    //assert.equal(await auction.description(), "item", 'The description is not set correctly')
    assert.equal(await auction.timestampEnd(), timestampEnd, 'The endtime is not set correctly')
    assert.equal(await auction.beneficiary(), beneficiary, 'The beneficiary is not set correctly')
  })

  it('Should be able to send a bid above the initial price', async function() {
    await auction.sendTransaction({ value: 2e18, from: bidderA });
    //assert.equal(await auction.price(), 1e18, "Price not set up correctly");
    assert.equal(await auction.winner(), bidderA, "Winner not set up correctly");
  })

  it('Should not be able to bid twice', async function() {
    await auction.sendTransaction({ value: 1.2e18, from: bidderA });
    await expectThrow(auction.sendTransaction({value: 1.4e18, from: bidderA}));
  })

  it('Should not be able to send a bid below the initial price', async function() {
    await expectThrow(auction.sendTransaction({ value: 0.5e18, from: bidderA }));
  })

  it('Should not be able to send a bid after the end of auction', async function() {
    increaseTime(duration + 1);
    await expectThrow(auction.sendTransaction({ value: 1e18, from: bidderA }));
  })

  it('Should be able to outbid', async function() {
    await auction.sendTransaction({ value: 1e18, from: bidderA });
    await auction.sendTransaction({ value: 1.25e18, from: bidderB });
    //assert.equal(await auction.price(), 1.25e18, "Price not set up correctly");
    assert.equal(await auction.winner(), bidderB, "Winner not set up correctly");
  })

  it('Should not be able to outbid if bid too low', async function() {
    await auction.sendTransaction({ value: 1e18, from: bidderA });
    await expectThrow(auction.sendTransaction({ value: .8e18, from: bidderB }));
    //assert.equal(await auction.price(), 1e18, "Price not set up correctly");
    assert.equal(await auction.winner(), bidderA, "Winner not set up correctly");
  });

  it('Beneficiary should receive ETH equal to winning bid', async function() {
    await auction.sendTransaction({ value: 1e18, from: bidderA });
    await auction.sendTransaction({ value: 2e18, from: bidderB });
    await expectThrow(auction.finalize({ from: owner })); // cannot withdraw before the end

    increaseTime(duration + 1);

    var balanceBefore = web3.eth.getBalance(beneficiary).toNumber()
    console.log(balanceBefore)
    await auction.finalize({ from: owner });
    var balanceAfter = web3.eth.getBalance(beneficiary).toNumber()
    console.log(balanceAfter)
    assert.equal(balanceBefore + 2e18, balanceAfter, "beneficiary didn't receive correct amount")

    await expectThrow(auction.finalize({ from: owner })); // cannot withdraw more than once
  });

  it('Should fail if some random guy wants a refund', async function() {
    await auction.sendTransaction({ value: 1e18, from: bidderA });
    increaseTime(duration + 1);
    await expectThrow(auction.refund({ from: bidderB }));
  });

  it('Should be able to withdraw', async function() {
    await auction.sendTransaction({ value: 1e18, from: bidderA });
    await auction.sendTransaction({ value: 1.25e18, from: bidderB });

    var balanceBeforeA = web3.eth.getBalance(bidderA).toNumber()
    await auction.refund({ from: bidderA })
    var balanceAfterA = web3.eth.getBalance(bidderA).toNumber()
    assert.closeTo(balanceBeforeA + 1e18, balanceAfterA, 0.01 * 1e18, "bidder A didn't receive correct refund"); // closeTo because of the gas fees
  });


  it('Should NOT be able to withdraw if the highest bidder', async function() {
    await auction.sendTransaction({ value: 1e18, from: bidderA });
    await expectThrow( auction.refund({ from: bidderA }) );
  });

});
