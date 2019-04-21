import React, { Component } from 'react'

// D3.
import * as D3 from "d3"
// Web3.
import Web3 from 'web3'

// Contracts.
import AuctionContract from '../../../build/contracts/Auction.json'

////////////
// Setup. //
////////////

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

// Map Ethereum addresses to data, bids, quantities.
var data = new Map();
for (var i = 0; i < 10; i++) {
  var sundance = require('../../../data/sundance/SunDance_9' + i + '.csv');
  data.set(addresses[i], sundance);
}

// Battery storage capacity: kWh.
const batteryLevel = 5;
const storageCapacity = 13.5;

// Utility rates: $/kWh.
var utilityRate = 12;
var buyBackRate = 3;

///////////////////
// Auction form. //
///////////////////

class AuctionForm extends Component {
  constructor(props) {
    super(props);

    // Set state.
    this.state = {
      // Prevents unmounted state changes.
      mounted: null,
      // Load Web3, accounts, and contract.
      web3: null,
      accounts: null,
      contract: null,
      // Addresses.
      addresses: addresses,
      // Data.
      data: data,
      // Production and consumption.
      consumption: null,
      production: null,
      netmeter: null,
      // Battery storage.
      batteryLevel: batteryLevel,
      storageCapacity: storageCapacity,
      // Current time and date.
      time: null,
      next: null,
      // Conditional rendering.
      isConsumer: false,
      isProducer: false,
      isAuction: false,
      // Bids and quantities.
      bids: new Map(),
      quantities: new Map(),
      // Event handling.
      bidValue: "",
      quantityValue: "",
      bid: "[No bid has been submitted.]",
      quantity: "[No quantity has been submitted.]"
    };

    // Handle changes.
    this.handleBidChange = this.handleBidChange.bind(this);
    this.handleBidSubmit = this.handleBidSubmit.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.handleQuantitySubmit = this.handleQuantitySubmit.bind(this);
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
        this.setState(
          {
            time: new Date().toLocaleString(),
            next: 60 - new Date().getMinutes()
          }
        );
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
            this.setState(
              {
                accounts, consumption: "", production: "", netmeter: "",
                bidValue: "", bid: "[No bid has been submitted.]",
                quantityValue: "", quantity: "[No quantity has been submitted.]"
              },
              this.process
            );
          }
        }
      }.bind(this), 100);

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AuctionContract.networks[networkId];
      const contract = new web3.eth.Contract(
        AuctionContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state.
      this.setState(
        { web3, accounts, contract },
        this.process
      );
      // Initalize auction.
      this.setState(
        this.initialize
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

  ///////////
  // Data. //
  ///////////

  // Process data.
  async process() {
    try {
      // Current time and date.
      var now = new Date();
      var m = now.getMonth() + 1;
      var d = now.getDate();
      var h = now.getHours();

      // Date string.
      var current = m + "/" + d + "/15 " + h + ":00";

      // Parse CSV file.
      D3.csv(this.state.data.get(this.state.accounts[0])).then(function(data) {
        // Consumption.
        var consumption;
        // Production.
        var production;
        // Net metering.
        var netmeter;

        // Read each line of CSV.
        for (var i = 0; i < data.length; i++) {
          // Find matching date.
          if (data[i].date == current) {
            // Correlate data.
            consumption = parseFloat(data[i].use.replace(/-|\s/g,""));
            production = parseFloat(data[i].gen.replace(/-|\s/g,""));
            netmeter = production - consumption;

            // Identify if consumer, producer, or both.
            if (netmeter < 0 || this.state.batteryLevel < this.state.storageCapacity) {
              this.setState({ isConsumer: true });
            }
            if (netmeter > 0 || this.state.batteryLevel > 0) {
              this.setState({ isProducer: true });
            }

            // Round to two decimal places.
            consumption = consumption.toFixed(2);
            production = production.toFixed(2);
            netmeter = netmeter.toFixed(2);

            // Break.
            break;
          }
        }

        // Set consumption and production to state.
        this.setState({ consumption, production, netmeter} );
      }.bind(this));
    } catch (error) {
      // Throw error.
      alert(`Failed to load data.`);
      console.error(error);
    }
  }

  /////////////////////
  // Event handling. //
  /////////////////////

  // Submit bid.
  async handleBidSubmit(event) {
    // Prevent page reload.
    event.preventDefault();

    // Only accept valid bids.
    if (this.state.bidValue < buyBackRate || this.state.bidValue > utilityRate) {
      // Log.
      console.log("Invalid bid.");

      // Throw alert.
      alert(
        "Please submit a bid between the buy-back rate (" +
        buyBackRate +
        " ¢/kWh) and the utility rate (" +
        utilityRate +
        " ¢/kWh)."
      );

      // Set state.
      this.setState({ bidValue: "" });
    } else {
      // Log.
      console.log("Bid submitted.");

      // Submit bid.
      await this.state.contract.methods.bid(this.state.bidValue).send({
        from: this.state.accounts[0]
      });

      // Get bid.
      const response = await this.state.contract.methods.get().call();

      // Set state.
      this.setState({ bid: response });
    }
  }
  // Submit quantity.
  async handleQuantitySubmit(event) {
    // Prevent page reload.
    event.preventDefault();

    // TODO: Only accept valid quantity.
    if (this.state.quantityValue < 0) {
      // Log.
      console.log("Invalid quantity.");

      // Throw alert.
      alert(
        "Please submit a quantity between ..."
      );

      // Set state.
      this.setState({ quantityValue: "" });
    } else {
      // Log.
      console.log("Quantity submitted.");

      // Submit quantity.
      // ...

      // Get quantity.
      // ...

      // Set state.
      this.setState({ quantity: this.state.quantityValue });
    }
  }

  // Handle bid.
  handleBidChange(event) {
    // Set state.
    this.setState({ bidValue: event.target.value });
  }
  // Handle quantity.
  handleQuantityChange(event) {
    // Set state.
    this.setState({ quantityValue: event.target.value });
  }

  //////////////
  // Auction. //
  //////////////

  // Initialize auction.
  async initialize() {
    try  {
      // Log.
      console.log("Auction initialized.")

      // TODO: Start auction on the hour.
      // Recalculate production, consumption, and storage capacity.

      // Timeout length.
      var t0 = new Date();
      var t1 = new Date(
        t0.getFullYear(), t0.getMonth(), t0.getDate(), t0.getHours() + 1,
        0, 0, 0
      );
      var d = t1 - t0;

      // Reset auction on timeout.
      var auctionTimeout = setTimeout(async function() {
        // Stop if unmounted.
        if (!this.mounted) {
          clearTimeout(auctionTimeout);
        } else {
          // Update state.
          this.setState(
            { isAuction: true },
            this.process
          );
        }
      }.bind(this), d);

      // Set state.
      this.setState({ isAuction: true });
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

      // TODO: End auction and display results. Pay if necessary.

      // Set state.
      this.setState({ isAuction: false });
    } catch (error) {
      // Throw error.
      alert(`Failed to finalize auction.`);
      console.error(error);
    }
  }

  // Render component.
  render() {

    // Handle loading issues.
    if (!this.state.web3 || !this.state.accounts || !this.state.contract) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    if (!this.state.consumption || !this.state.production || !this.state.netmeter) {
      return <div>Loading user data...</div>;
    }
    if (!this.state.time) {
      return <div>Loading current time...</div>;
    }

    return (

      <div id="wrapper">

        <div id="left">

          <h2>Auction Details</h2>

          <p>The auction period ends in {this.state.next} minute(s).</p>

          <h3>Buy Electricity</h3>

          {this.state.isConsumer ? (

            <div>

              <p><strong>Buy electricity to meet consumption or store for later.</strong></p>

              <p>Input bid (¢/kWh).</p>

                <form onSubmit={this.handleBidSubmit}>
                  <label>
                    <input type="text" value={this.state.bidValue} onChange={this.handleBidChange} />
                  </label>
                  <input type="submit" value="Submit" />
                  <div>
                    <p>Bid: {this.state.bid}</p>
                  </div>
                </form>

              <p>Input quantity (kWh).</p>

              <form onSubmit={this.handleQuantitySubmit}>
                <label>
                  <input type="text" value={this.state.quantityValue} onChange={this.handleQuantityChange} />
                </label>
                <input type="submit" value="Submit" />
                <div>
                  <p>Quantity: {this.state.quantity}</p>
                </div>
              </form>

            </div>

          ) : (

            <div>

              <p><strong>You have no capacity to store electricity.</strong></p>

            </div>

          )}

          <h3>Sell Electricity</h3>

          {this.state.isProducer ? (

            <div>

              <p><strong>Sell excess electricity on the market.</strong></p>

              {!this.state.isAuction ? (

                <div>

                  <p># Explain auction requirements here. #</p>

                  <button onClick={() => {this.initialize()}}>Enter Auction</button>

                </div>

              ) : (

                <div>

                  <p># Explain compensation here. #</p>

                  <button onClick={() => {this.finalize()}}>End Auction</button>

                </div>

              )}

            </div>

          ) : (

            <div>

              <p><strong>You have no excess electricity to sell.</strong></p>

            </div>

          )}

        </div>

        <div id="right">

          <h2>Account Details</h2>
          <p>
            <strong><i>Ethereum Address</i></strong><br />
            {this.state.accounts[0]}<br />
          </p>

          <h2>Statistics</h2>
          <p>See data from the last auction period here.</p>
          <p>
            <strong><i>Electricity Consumption</i></strong><br />
            {this.state.consumption} kilowatt-hours<br />
          </p>

          <p>
            <strong><i>Electricity Production</i></strong><br />
            {this.state.production} kilowatt-hours<br />
          </p>

          <p>See current capacity for selling or storing electricity here.</p>
          <p>
            <strong><i>Net Production/Consumption</i></strong><br />
            {this.state.netmeter} kilowatt-hours<br />
          </p>

          <p>
            <strong><i>Battery Storage Level</i></strong><br />
            {this.state.batteryLevel} of {this.state.storageCapacity} kilowatt-hours.<br />
          </p>

          <p>See information about the utility provider here.</p>
          <p>
            <strong><i>Utility Rate</i></strong><br />
            {utilityRate} cents per kilowatt-hour.<br />
          </p>

          <p>
            <strong><i>Buy-Back Rate</i></strong><br />
            {buyBackRate} cents per kilowatt-hour.<br />
          </p>

        </div>

      </div>

    );
  }
}

export default AuctionForm