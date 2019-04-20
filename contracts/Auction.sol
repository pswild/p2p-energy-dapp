 pragma solidity ^0.4.24;

contract Auction {

  /**************
   * Structures *
   **************/

  /*********************
   * Storage Variables *
   *********************/

  /* Static */

  // Utility offering rate.
  uint utilityRate = 12;

  // Utility buyback rate.
  uint buybackRate = 3;

  /* State */

  // Bids in current auction
  mapping (address => uint) public bids;

  /*************
   * Functions *
   *************/

  // Place bid.
  function bid(uint value) public returns (uint) {
    // Bid must be between the buyback rate and grid price
    require(buybackRate < value && value < utilityRate);
    // Place bid
    bids[msg.sender] = value;
    // Return bid value
    return value;
  }

  // View bid.
  function get() public view returns (uint) {
    // Return bid for this member
    return bids[msg.sender];
  }

  // Choose winner.
}