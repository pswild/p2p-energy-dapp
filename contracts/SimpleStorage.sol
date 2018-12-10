pragma solidity ^0.4.24;

contract SimpleStorage {
  uint storedData;

  // Set storage variable
  function set(uint x) public {
    storedData = x;
  }

  // Get storage variable
  function get() public view returns (uint) {
    return storedData;
  }
}
