pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Auction.sol";

// NOTE: To test using Solidity smart contracts, use the Truffle "Develop"
// feature in the command line:
// $ truffle develop
// $ > test

contract TestAuction {

  function testBid() public {
    // Address of a fresh instance of the SimpleStorage contract deployed to blockchain
    Auction auction = Auction(DeployedAddresses.Auction());

    // Bid the value 5
    auction.bid(5);
    // Expected bid value
    uint expected = 5;

    // Assert values are equivalent
    Assert.equal(auction.get(), expected, "It should bid the value 5.");
  }

}
