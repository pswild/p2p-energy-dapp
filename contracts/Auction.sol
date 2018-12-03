 pragma solidity ^0.4.24;

contract Auction {

  /**************
   * Structures *
   **************/

  /*********************
   * Storage Variables *
   *********************/

  /* Static */

  // Members of the micro-grid
  address[10] public members;

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

    // Return value
    return value;
  }

  // Withdraw funds
  /* function withdraw(uint value) public returns (uint) {

  } */
}