pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SimpleStorage.sol";

// NOTE: To test using Solidity smart contracts, use the Truffle "Develop"
// feature in the command line:
// $ truffle develop
// $ > test

contract TestSimpleStorage {

  function testItStoresAValue() public {
    // Address of a fresh instance of the SimpleStorage contract deployed to blockchain
    SimpleStorage simpleStorage = SimpleStorage(DeployedAddresses.SimpleStorage());

    // Store the value 89
    simpleStorage.set(89);
    // Expected stored value
    uint expected = 89;

    // Assert values are equivalent
    Assert.equal(simpleStorage.get(), expected, "It should store the value 89.");
  }

}
