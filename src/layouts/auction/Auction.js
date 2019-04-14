import React, { Component } from 'react'

// UI Components
import AuctionForm from './AuctionForm.js'

////////////
// Setup. //
////////////

// User object.
function User(name, addr, data, use, gen, batt) {
  this.name = name; // User name.
  this.addr = addr; // Ethereum address.
  this.data = data; // SunDance data file name.
  this.use = use;   // Electricity usage for current time interval.
  this.gen = gen;   // Electricity generation for current time
  this.batt = batt; // Current battery level.
}

// Ethereum addresses hosted on Ganache.
var addresses = [
  "0x8E2077Ab0E6D14AF306106303d879d8b4F580e3f",
  "0x301D2749B559BC9933b7bA85E5151f2b075DA5eB",
  "0x4cE4f8F59B69474860d533191685edA6afA83B89",
  "0x9956168BfD29AE6cadcDbe0A820b069f06Af5F7f",
  "0xD73c86f2B6cbb14c01F4C634B461D20aa86BD7e1",
  "0x3D43D1c22Ddd267AC0cE677AcA7c96f31b547234",
  "0x42C8E0299Fd33b57Fa10628228bDfE1c6f013868",
  "0x8328Bff14018a2Bd2498B5A04158ADb726185D60",
  "0xfD2a5AFEE3A3c8C892Fed5A0CCfE705Fd06c6663",
  "0x4917B088806dA204F406127520Cf06F8E82e17B9"
];

// Users.
var users = [];
for (var i = 0; i < 10; i++) {
  // Create a new user.
  users.push(
    new User("user" + i, addresses[i], "SunDance_9" + i + ".csv", 0, 0, 0)
  );
}

// Log.
// console.log(users);

// Battery capacities (Tesla Powerwall 2): kWh.
const capacity = 13.5;

// Microgrid statistics.
var size = 10;

// Electricity statistics.
var grossUsage = 0; // kWh.
var grossGeneration = 0; // kWh.
var net = 0; // kWh.

// Utility statistics: $/kWh.
var utilityPrice = 10;
var buyBackRate = 5;

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

          <AuctionForm nextAuctionString={nextAuctionString}/>

        </div>
      </div>
    </main>
    );
  }
}

export default Auction