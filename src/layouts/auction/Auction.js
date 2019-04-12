import React, { Component } from 'react'

// UI Components
import TestButtonContainer from '../ui/testbutton/TestButtonContainer'
import AuctionForm from './AuctionForm.js'

// D3 JavaScript.
import * as D3 from "d3"

///////////
// Data. //
///////////

// SunDance CSV format:
// ["date", "use", "gen", "grid"].

// Sites array format:
// [site]

// Points array format:
// [point]

// Site object format:
// {"name": site_name, "points": [point]}

// Point object format:
// {"date": date, "use": use, "gen": gen, grid": grid}

// Log.
console.log("SunDance data: ");

// List of sites.
var sites = [];

// Process each site.
for (var i = 1; i <= 100; i++) {
  // Filter missing sites.
  if(i == 2 || i == 6) {
    continue
  }

  // Site name.
  var site_name = '../../../data/sundance/SunDance_' + i + '.csv';
  // Load site data.
  const csv = require('../../../data/sundance/SunDance_' + i + '.csv');

  // Parse CSV files.
  D3.csv(csv).then(function(csv) {
    // List of points at site.
    var points = [];

    // Read each line of CSV.
    for (var j = 0; j < csv.length; j++) {

      // Create new date object.
      var csvDate = csv[j].date.split(" ");

      var calendar = csvDate[0].split("/");
      var period = csvDate[1].split(":");
      var ampm = csvDate[2];

      var year = "20" + calendar[2];
      var month = calendar[0];
      var day = calendar[1];

      var hour = parseInt(period[0], 10);
      if (ampm === "PM") {
        hour += 12;
      }

      var date = new Date(year, month, day, hour);

      // Point.
      let point = {
        date: date,
        use: csv[j].use,
        gen: csv[j].gen,
        grid: csv[j].grid
      }

      // Add to points.
      points.push(point);
    }

    // Return.
    return points;
  }).then(function(points) {
    // Site.
    let site = {
      name: "",
      points: points
    }
    // Add to sites.
    sites.push(site);
  })
}

// Log.
// console.log(sites);

////////////////////////
// Bidding Mechanism. //
////////////////////////

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
          <AuctionForm></AuctionForm>

        </div>
      </div>
    </main>
    );
  }
}

export default Auction