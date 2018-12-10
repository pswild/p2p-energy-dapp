var Auction = artifacts.require("./Auction.sol");

contract('Auction', function(accounts) {

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
