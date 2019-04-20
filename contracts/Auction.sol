 pragma solidity ^0.4.24;

contract Auction {

  /*********************
   * Storage Variables *
   *********************/

  /* Static */

  // Utility offering rate.
  uint utilityRate = 12;
  // Utility buyback rate.
  uint buybackRate = 3;
  // Electricity supply.
  uint supply;

  /* State */

  // Addresses.
  address[] public addresses;
  // Bids.
  mapping (address => uint) public bids;
  // Quantities.
  mapping (address => uint) public quantities;

  /*************
   * Functions *
   *************/

  // Place bid.
  function bid(uint bid) public returns (uint) {
    // Bid must be between the buyback rate and grid price.
    require(buybackRate <= bid && bid <= utilityRate);
    // Place bid.
    bids[msg.sender] = bid;
    // Return bid value.
    return bid;
  }

  // View bid.
  function get() public view returns (uint) {
    // Return bid for this member.
    return bids[msg.sender];
  }
}