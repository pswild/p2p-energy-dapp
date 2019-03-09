pragma solidity ^0.4.23;

// THIS IS A SEALED-BID FIRST PRICE AUCTION
contract Auction {

  //string public description;
  //string public instructions; // will be used for delivery address or email
  uint public utilityBuyBackRate;
  bool public initialPrice = true; // at first asking price is OK, then +25% required
  uint public timestampEnd;
  address public beneficiary;
  bool public finalized = false;

  address public owner;
  address public winner;
  mapping(address => uint) public bids;
  address[] public accountsList;
  function getAccountListLenght() public constant returns(uint) { return accountsList.length; } // lenght is not accessible from DApp, exposing convenience method: https://stackoverflow.com/questions/43016011/getting-the-length-of-public-array-variable-getter

  uint public increaseTimeIfBidBeforeEnd = 24 * 60 * 60;
  uint public increaseTimeBy = 24 * 60 * 60;

  event BidEvent(address indexed bidder, uint value, uint timestamp); // cannot have event and struct with the same name
  event Refund(address indexed bidder, uint value, uint timestamp);


  modifier onlyOwner { require(owner == msg.sender, "only owner"); _; }
  modifier onlyWinner { require(winner == msg.sender, "only winner"); _; }
  modifier ended { require(now > timestampEnd, "not ended yet"); _; }


  //function setDescription(string _description) public onlyOwner() {
  //  description = _description;
  //}

  // TODO: Override this method in the derived functions, think about on-chain / off-chain communication mechanism
  //function setInstructions(string _instructions) public ended() onlyWinner()  {
  //  instructions = _instructions;
  //}

  //constructor(uint _price, string _description, uint _timestampEnd, address _beneficiary) public {
  constructor(uint _utilityBuyBackRate, uint _timestampEnd, address _beneficiary) public {
    require(_timestampEnd > now, "end of the auction must be in the future");
    owner = msg.sender;
    utilityBuyBackRate = _utilityBuyBackRate;
    //description = _description;
    timestampEnd = _timestampEnd;
    beneficiary = _beneficiary;
  }

  // Same for all the derived contract, it's the implementation of refund() and bid() that differs
  function() public payable {
    if (msg.value == 0) {
      refund();
    } else {
      bid();
    }
  }

  function bid() public payable {
    require(now < timestampEnd, "auction has ended"); // sending ether only allowed before the end
    require(bids[msg.sender] == 0, "you can only bid once");


    bids[msg.sender] = msg.value;
    accountsList.push(msg.sender); // this is the first bid, therefore adding

    require(bids[msg.sender] >= utilityBuyBackRate, "bid too low, minimum is the utilityBuyBackRate");

    if (now > timestampEnd - increaseTimeIfBidBeforeEnd) {
      timestampEnd = now + increaseTimeBy;
    }

    initialPrice = false;
    //price = bids[msg.sender]; makes the bid the new low, not needed here
    if (bids[msg.sender] > bids[winner]) {
      winner = msg.sender;
    }

    emit BidEvent(winner, msg.value, now);
  }

  function finalize() public ended() onlyOwner() {
    require(finalized == false, "can withdraw only once");
    require(initialPrice == false, "can withdraw only if there were bids");

    finalized = true;
    beneficiary.transfer(bids[winner]);
  }

  function refund(address addr) private {
    require(addr != winner, "winner cannot refund");
    require(bids[addr] > 0, "refunds only allowed if you sent something");

    uint refundValue = bids[addr];
    bids[addr] = 0;
    addr.transfer(refundValue);

    emit Refund(addr, refundValue, now);
  }

  function refund() public {
    refund(msg.sender);
  }

  function refundOnBehalf(address addr) public onlyOwner() {
    refund(addr);
  }

}
