import React, { Component } from 'react'

// Web3.
import Web3 from 'web3'

// Contracts.
import SimpleStorageContract from '../../../build/contracts/SimpleStorage.json'

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
var microgrid = 98;

// Electricity statistics.
var grossUsage = 0; // kWh.
var grossGeneration = 0; // kWh.
var net = 0; // kWh.

// Utility statistics: $/kWh.
var utilityPrice = 12;
var buyBackRate = 3;

///////////////////
// Auction form. //
///////////////////

class AuctionForm extends Component {
  constructor(props) {
    super(props);

    // Set state.
    this.state = {
      mounted: null,
      web3: null,
      accounts: null,
      contract: null,
      consumption: null,
      production: null,
      capacity: null,
      time: null,
      next: null,

      value: "",
      bid: "[No bids have been submitted.]"
    };

    // Handle changes.
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Load Web3.
  async componentDidMount() {
    // Register mounted.
    this.mounted = true;

    // Current time.
    var timeInterval = setInterval(async function() {
      // Stop if unmounted.
      if (!this.mounted) {
        clearInterval(timeInterval);
      } else {
        // Update state.
        this.setState({
          time: new Date().toLocaleString(),
          next: 60 - new Date().getMinutes()
        });
      }
    }.bind(this), 100);

    try {
      // Web3.
      var web3 = window.web3;

      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider);

      // Enable MetaMask.
      await web3.currentProvider.enable();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // MetaMask account change.
      var selected = accounts[0];
      var accountInterval = setInterval(async function() {
        // Stop if unmounted.
        if (!this.mounted) {
          clearInterval(accountInterval);
        } else {
          // Monitor changes.
          accounts = await web3.eth.getAccounts();
          if (accounts[0] !== selected) {
            // Log.
            console.log("MetaMask account changed.");

            // Update state.
            selected = accounts[0];
            this.setState({
              accounts, value: "", bid: "[No bids have been submitted.]"
            });
          }
        }
      }.bind(this), 100);

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state.
      this.setState(
        { web3, accounts, contract: instance },
        this.initalize
      );
    } catch (error) {
      // Throw error.
      alert(`Failed to load web3, accounts, or contract.`);
      console.error(error);
    }
  }

  // Prepare to unmount.
  componentWillUnmount() {
    // Register unmount.
    this.mounted = false;
  }

  // Submit bid.
  async handleSubmit(event) {
    // Prevent page reload.
    event.preventDefault();

    // Log.
    console.log("Bid submitted.");

    // Get state.
    const {
      contract
    } = this.state;

    // Stores a given value.
    await contract.methods.set(this.state.value).send({
      from: this.state.accounts[0]
    });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Set state.
    this.setState({
      bid: response
    });
  }

  handleChange(event) {
    // Set state.
    this.setState({
      value: event.target.value
    });
  }

  // Initialize auction.
  async initialize() {
    try  {
      // Log.
      console.log("Auction initialized.")

    } catch (error) {
      // Throw error.
      alert(`Failed to initalize auction.`);
      console.error(error);
    }
  }

  // Finalize auction.
  async finalize() {
    try  {
      // Log.
      console.log("Auction finalized.");

    } catch (error) {
      // Throw error.
      alert(`Failed to finalize auction.`);
      console.error(error);
    }
  }

  render() {

    // Handle loading issues.
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    if (!this.state.time) {
      return <div>Loading current time...</div>;
    }

    return (

      <div>

        <h2>Account Details</h2>
        <p>
          <strong><i>Ethereum Address</i></strong><br />
          {this.state.accounts[0]}<br />
        </p>

        <h2>Start an Auction</h2>
        <p>
          <strong><i>Current Time</i></strong><br />
          {this.state.time}<br />
        </p>

        <p>
          <strong><i>Current Auction</i></strong><br />
          The auction period ends in {this.state.next} minutes.<br />
        </p>

        <h2>Make a Bid</h2>
        <p>Input bid ($) here.</p>

          <form onSubmit={this.handleSubmit}>
            <label>
              <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
            <div>
              <p>Bid: {this.state.bid}</p>
            </div>
          </form>

        <h2>End an Auction</h2>
        <p>See the auction results here.</p>

        <button onClick={() => {this.finalize()}}>End Auction</button>

        <h2>Statistics</h2>
        <p>See data from the last auction period here.</p>
        <p>
          <strong><i>Electricity Consumption</i></strong><br />
          {this.state.consumption}<br />
        </p>

        <p>
          <strong><i>Electricity Production</i></strong><br />
          {this.state.production}<br />
        </p>

        <p>
          <strong><i>Storage Capacity</i></strong><br />
          {capacity} kilowatt-hours.<br />
        </p>

        <p>See information about the microgrid here.</p>

        <p>
          <strong><i>Number of Members</i></strong><br />
          {microgrid}<br />
        </p>

        <p>See information about the utility provider here.</p>

        <p>
          <strong><i>Utility Rate</i></strong><br />
          {utilityPrice} cents per kilowatt-hour.<br />
        </p>

        <p>
          <strong><i>Buy-Back Rate</i></strong><br />
          {buyBackRate} cents per kilowatt-hour.<br />
        </p>

      </div>

    );
  }
}

export default AuctionForm