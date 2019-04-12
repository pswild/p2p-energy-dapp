var Auction = artifacts.require("./Auction.sol");
var SimpleStorage = artifacts.require("./SimpleStorage.sol");

// Export contracts.
module.exports = function(deployer) {
  deployer.deploy(Auction);
  deployer.deploy(SimpleStorage);
};
