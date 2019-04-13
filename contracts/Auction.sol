 pragma solidity ^0.4.24;

contract Auction {

  /**************
   * Structures *
   **************/

  /*********************
   * Storage Variables *
   *********************/

  /* Static */

  // Utility buyback rate
  uint buybackRate = 1;

  // Utility offering price
  uint utilityPrice = 10;

  /* State */

  // Bids in current auction
  mapping (address => uint) public bids;

  /*************
   * Functions *
   *************/

  // Place bid
  function bid(uint value) public returns (uint) {
    // Bid must be between the buyback rate and grid price
    require(buybackRate < value && value < utilityPrice);
    // Place bid
    bids[msg.sender] = value;
    // Return bid value
    return value;
  }

  // View bid
  function get() public view returns (uint) {
    // Return bid for this member
    return bids[msg.sender];
  }
}