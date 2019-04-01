var Auction = artifacts.require("./Auction.sol");
var Auction1B1P = artifacts.require("./Auction1B1P.sol");
var SimpleStorage = artifacts.require("./SimpleStorage.sol");

module.exports = function(deployer) {
  deployer.deploy(Auction);
  deployer.deploy(Auction1B1P);
  deployer.deploy(SimpleStorage);
};
