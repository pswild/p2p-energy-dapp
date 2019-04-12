var Auction = artifacts.require("./Auction.sol");
// var Auction1B1P = artifacts.require("./Auction1B1P.sol");
// var Auction1B2P = artifacts.require("./Auction1B2P.sol");
// var AuctionMM = artifacts.require("./AuctionMM.sol");
var SimpleStorage = artifacts.require("./SimpleStorage.sol");

// Global variables.
// let timestampEnd = web3.eth.getBlock('latest').timestamp + 3600;
// let wallet = 0x4f6baa92aA8f4732eCf858CC6931d5bfF574A773;
// let buyback = 1e18;

// Export contracts.
module.exports = function(deployer) {
  deployer.deploy(Auction);
  // deployer.deploy(Auction1B1P, buyback, timestampEnd, wallet);
  // deployer.deploy(Auction1B2P, buyback, timestampEnd, wallet);
  // deployer.deploy(AuctionMM);
  deployer.deploy(SimpleStorage);
};
