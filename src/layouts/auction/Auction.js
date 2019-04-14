import React, { Component } from 'react'

// UI Components
import AuctionForm from './AuctionForm.js'
import AuctionButtonContainer from '../ui/auctionbutton/AuctionButtonContainer.js'

// Current date and time.
var current = new Date();
var currentYear = current.getFullYear();
var currentMonth = current.getMonth() + 1;
var currentDay = current.getDate();
var currentHour = current.getHours();
var currentMinute = current.getMinutes();
var currentSecond = current.getSeconds();

// Auction period: [year, month, day, hour].
var nextHour = currentHour + 1;
var nextAuction = [currentYear, currentMonth, currentDay, nextHour];
var nextAuctionString =
  currentMonth + "/" +
  currentDay + "/" +
  currentYear + " at " +
  nextHour + ":00.";

// Log.
// console.log("Next auction: " + nextAuctionString);

//////////////
// Auction. //
//////////////

class Auction extends Component {
  constructor(props) {
    super(props);

    // Set state.
    this.state = {};
  }

  render() {
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">

          <h1>Auction</h1>
          <p><i>Specify your auction preferences here.</i></p>

          <h2>Start an Auction</h2>
          <p>The next auction will run on {nextAuctionString}</p>

          <h2>Make a Bid</h2>
          <AuctionForm />

          <h2>End an Auction</h2>
          <p>See the auction results here.</p>
          <AuctionButtonContainer />
        </div>
      </div>
    </main>
    );
  }
}

export default Auction