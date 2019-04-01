var Auction = artifacts.require("./Auction.sol");
var Auction1B1P = artifacts.require("./Auction1B1P.sol");
var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Auction1B2P = artifacts.require("./Auction1B2P.sol");

let timestampEnd = web3.eth.getBlock('latest').timestamp  +  3600;
let buyback = 1e18;
//var accounts = web3.eth.getAccounts();
//let wallet = accounts[4];
let wallet = 0x4f6baa92aA8f4732eCf858CC6931d5bfF574A773;

module.exports = function(deployer) {
  deployer.deploy(Auction);
  deployer.deploy(Auction1B1P, buyback, timestampEnd, wallet);
  deployer.deploy(Auction1B2P, buyback, timestampEnd, wallet);
  deployer.deploy(SimpleStorage);
};
