var Auction = artifacts.require("./Auction.sol");
// var Auction1B1P = artifacts.require("./Auction1B1P.sol");
// var Auction1B2P = artifacts.require("./Auction1B2P.sol");
// var AuctionMM = artifacts.require("./AuctionMM.sol");
var SimpleStorage = artifacts.require("./SimpleStorage.sol");

module.exports = function(deployer) {
  deployer.deploy(Auction);
  // deployer.deploy(Auction1B1P);
  // deployer.deploy(Auction1B2P);
  // deployer.deploy(AuctionMM);
  deployer.deploy(SimpleStorage);
};
