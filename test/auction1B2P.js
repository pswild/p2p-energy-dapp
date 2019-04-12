/* eslint-disable no-undef */ // Avoid the linter considering truffle elements as undef.
const Auction1B2P = artifacts.require('Auction1B2P.sol')
const { expectThrow, increaseTime } = require('./helpers')

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

  it('Should be able to send a bid above the initial price', async function() {
    await auction.sendTransaction({ value: 2e18, from: bidder1 });
    //assert.equal(await auction.price(), 1e18, "Price not set up correctly");
    assert.equal(await auction.winner(), bidder1, "Winner not set up correctly");
  })

  it('Should not be able to bid twice', async function() {
    await auction.sendTransaction({ value: 1.2e18, from: bidder1 });
    await expectThrow(auction.sendTransaction({value: 1.4e18, from: bidder1}));
  })

  it('Should not be able to send a bid below the initial price', async function() {
    await expectThrow(auction.sendTransaction({ value: 0.5e18, from: bidder1 }));
  })

  it('Should not be able to send a bid after the end of auction', async function() {
    increaseTime(duration + 1);
    await expectThrow(auction.sendTransaction({ value: 1e18, from: bidder1 }));
  })

  it('Should be able to outbid', async function() {
    await auction.sendTransaction({ value: 1e18, from: bidder1 });
    await auction.sendTransaction({ value: 1.25e18, from: bidder2 });
    //assert.equal(await auction.price(), 1.25e18, "Price not set up correctly");
    assert.equal(await auction.winner(), bidder2, "Winner not set up correctly");
  })

  it('Should not be able to outbid if bid too low', async function() {
    await auction.sendTransaction({ value: 1e18, from: bidder1 });
    await expectThrow(auction.sendTransaction({ value: .8e18, from: bidder2 }));
    //assert.equal(await auction.price(), 1e18, "Price not set up correctly");
    assert.equal(await auction.winner(), bidder1, "Winner not set up correctly");
  });

  it('Beneficiary should receive ETH equal to second place bid', async function() {
    await auction.sendTransaction({ value: 1e18, from: bidder1 });
    await auction.sendTransaction({ value: 3e18, from: bidder2 });
    await auction.sendTransaction({ value: 5e18, from: bidder3 });
    await expectThrow(auction.finalize({ from: owner })); // cannot withdraw before the end

    increaseTime(duration + 1);

    var balanceBefore = web3.eth.getBalance(beneficiary).toNumber()
    console.log(balanceBefore)
    await auction.finalize({ from: owner });
    var balanceAfter = web3.eth.getBalance(beneficiary).toNumber()
    console.log(balanceAfter-balanceBefore)
    assert.equal(balanceBefore + 3e18, balanceAfter, "beneficiary didn't receive correct amount")
    assert.equal(await auction.winner(), bidder3, "Winner not set up correctly");
    assert.equal(await auction.secondPlace(), bidder2, "Second Place not set up correctly");

    await expectThrow(auction.finalize({ from: owner })); // cannot withdraw more than once
  });

  it('Should fail if some random guy wants a refund', async function() {
    await auction.sendTransaction({ value: 1e18, from: bidder1 });
    increaseTime(duration + 1);
    await expectThrow(auction.refund({ from: bidder2 }));
  });

  it('Should be able to withdraw', async function() {
    await auction.sendTransaction({ value: 1e18, from: bidder1 });
    await auction.sendTransaction({ value: 1.25e18, from: bidder2 });

    var balanceBeforeA = web3.eth.getBalance(bidder1).toNumber()
    await auction.refund({ from: bidder1 })
    var balanceAfterA = web3.eth.getBalance(bidder1).toNumber()
    assert.closeTo(balanceBeforeA + 1e18, balanceAfterA, 0.01 * 1e18, "bidder 1 didn't receive correct refund"); // closeTo because of the gas fees
  });

  it('Testing whole auction model', async function() {
    await auction.sendTransaction({ value: 1e18, from: bidder1 });
    await auction.sendTransaction({ value: 3e18, from: bidder2 });
    await auction.sendTransaction({ value: 5e18, from: bidder3 });
    await auction.sendTransaction({ value: 4e18, from: bidder4 });
    await auction.sendTransaction({ value: 2e18, from: bidder5 });
    await auction.sendTransaction({ value: 6e18, from: bidder6 });
    await auction.sendTransaction({ value: 7e18, from: bidder7 });
    await auction.sendTransaction({ value: 8e18, from: bidder8 });
    await auction.sendTransaction({ value: 9e18, from: bidder9 });
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

    await expectThrow(auction.finalize({ from: owner })); // cannot withdraw more than once
  });

  //it('Should NOT be able to withdraw if the highest bidder', async function() {
    //await auction.sendTransaction({ value: 1e18, from: bidderA });
    //await expectThrow( auction.refund({ from: bidderA }) );
  //});

});
