import React, { Component } from 'react'

//////////////
// Imports. //
//////////////

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
const addresses = [
  "0xa35702EEfc4c773c47d970ac1374F70cb0dc9a63",
  "0xE330Af6427e19A4A3b25E09d2C00D022F0E41267",
  "0x044A69fec4536394459c9a3152F9827cbF8C90F2",
  "0x78eD9a3b73E308056a292C3D3438c772dA3aD7F4",
  "0xd78d1a1AA6297419Dd2e9C6B1caF4B8d4Be5Dd3D",
  "0x91F3a1C6F43e58D59c9972C9822014068D8A4ab6",
  "0xD6A41fd0D2f32F5DcDEF90f7e394c2AfB3e51011",
  "0x61F12096D06e6A0a3a647B887B68f13D5b83B839",
  "0x136b4F0630780B1e708B3b7D5B3d092Bea1C2E64",
  "0xc2C3bbd9BD9549Dc2917EdAF31E41F81eabcAC61"
];

// Map Ethereum addresses to account information.
var users = new Map();
for (var i = 0; i < 10; i++) {
  // SunDance data.
  var sundance = require('../../../data/sundance/SunDance_9' + i + '.csv');

  // User object.
  var user = {
    data: sundance,     // Production and consumption data file.
    consumption: null,  // Current consumption.
    production: null,   // Current production.
    netmeter: null     // Current net meter calculation.
  }

  // Add to users.
  users.set(addresses[i], user);
}

// Bids, buyer and seller quantities.
var bids = new Map();
var buyerQuants = new Map();
var sellerQuants = new Map();
// Bidder prices and seller payments.
var prices = new Map();
var payments = new Map();
// Seller quantities sold.
var sold = new Map();
// Battery level.
var storage = new Map();

// Initalize maps.
for (const address of addresses) {
  bids.set(address, "[No bid has been submitted.]");
  buyerQuants.set(address, "[No bid quantity has been submitted.]");
  sellerQuants.set(address, "[No sell quantity has been submitted.]");
  prices.set(address, 0.0);
  payments.set(address, 0.0);
  sold.set(address, 0.0);
  storage.set(address, 0.0);
}

///////////////////////
// Grid Information. //
///////////////////////

// Battery storage capacity: kWh.
const storageCapacity = 13.50;

// Utility rates: $/kWh.
const buyBackRate = 3.0;
const utilityRate = 12.0;

///////////////////
// Auction form. //
///////////////////

class AuctionForm extends Component {
  constructor(props) {
    super(props);

    ////////////
    // State. //
    ////////////

    // Set state.
    this.state = {

      ///////////
      // Web3. //
      ///////////

      // Load Web3, accounts, and contract.
      web3: null,
      accounts: null,
      contract: null,

      ///////////////////
      // Current User. //
      ///////////////////

      // Production, consumption, net meter.
      consumption: null,
      production: null,
      netmeter: null,
      // Battery level.
      batt: null,
      // Demand, supply, and capacity (current auction period).
      // demand: null,
      // supply: null,
      // capacity: null,

      ////////////////////
      // UI Components. //
      ////////////////////

      // Prevents unmounted state changes.
      mounted: null,
      // Current time and date.
      time: null,
      next: null,
      // Conditional rendering.
      isBuyer: false,
      isSeller: false,
      isConsumer: false,
      isProducer: false,
      isAuction: false,
      // Event handling.
      bidValue: "",
      bidQuantityValue: "",
      sellQuantityValue: "",
      bid: "[No bid has been submitted.]",
      bidQuantity: "[No bid quantity has been submitted.]",
      sellQuantity: "[No sell quantity has been submitted.]"
    };

    /////////////////////
    // Event handlers. //
    /////////////////////

    // Handle changes.
    this.handleBidChange = this.handleBidChange.bind(this);
    this.handleBidSubmit = this.handleBidSubmit.bind(this);
    this.handleBidQuantityChange = this.handleBidQuantityChange.bind(this);
    this.handleBidQuantitySubmit = this.handleBidQuantitySubmit.bind(this);
    this.handleSellQuantityChange = this.handleSellQuantityChange.bind(this);
    this.handleSellQuantitySubmit = this.handleSellQuantitySubmit.bind(this);
  }

  // Load Web3.
  async componentDidMount() {
    // Register mounted.
    this.mounted = true;

    ////////////////////
    // Auction Timer. //
    ////////////////////

    // Auction period.
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

      //////////////////////////
      // Web3 Initialization. //
      //////////////////////////

      // Web3.
      var web3 = window.web3;

      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider);

      // Enable MetaMask.
      await web3.currentProvider.enable();

      // Use web3 to get the current account.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AuctionContract.networks[networkId];
      const contract = new web3.eth.Contract(
        AuctionContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      ///////////////
      // MetaMask. //
      ///////////////

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
            await this.setState(
              {
                accounts,
                consumption: users.get(selected).consumption,
                production: users.get(selected).production,
                netmeter: users.get(selected).netmeter,
                batt: storage.get(selected),
                bidValue: "",
                bid: bids.get(selected),
                bidQuantityValue: "",
                bidQuantity: buyerQuants.get(selected),
                sellQuantityValue: "",
                sellQuantity: sellerQuants.get(selected),
                isBuyer: true,
                isSeller: true
              }
            );

            // Identify if consumer, producer, or both.
            if ((parseFloat(storageCapacity) - parseFloat(this.state.batt) - parseFloat(this.state.netmeter)) > 0) {
              this.setState({ isConsumer: true });
            } else {
              this.setState({ isConsumer: false });
            }
            if ((parseFloat(this.state.netmeter) + parseFloat(this.state.batt)) > 0) {
              this.setState({ isProducer: true });
            } else  {
              this.setState({ isProducer: false });
            }

            // Identify if buyer or seller.
            this.identify();
          }
        }
      }.bind(this), 100);

      // Set web3, accounts, and contract to the state.
      this.setState(
        { web3, accounts, contract },
        this.process
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

      /////////////////////////////////////////
      // Consumption, Production, Net Meter. //
      /////////////////////////////////////////

      // Current time and date.
      var now = new Date();
      var m = now.getMonth() + 1;
      var d = now.getDate();
      var h = now.getHours();

      // Date string.
      var current = m + "/" + d + "/15 " + h + ":00";

      // Iterate through all addresses.
      for (const address of addresses) {
        // Parse CSV file.
        const data = await D3.csv(users.get(address).data);

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

            // Round to two decimal places.
            consumption = consumption.toFixed(2);
            production = production.toFixed(2);
            netmeter = netmeter.toFixed(2);

            // Break.
            break;
          }
        }

        // Update users.
        var user = users.get(address);
        user.consumption = consumption;
        user.production = production;
        user.netmeter = netmeter;
        users.set(address, user);
      }

      // Set state.
      this.setState(
        {
          consumption: users.get(this.state.accounts[0]).consumption,
          production: users.get(this.state.accounts[0]).production,
          netmeter: users.get(this.state.accounts[0]).netmeter,
          batt: storage.get(this.state.accounts[0])
        },
        this.initialize
      );

      // Identify if consumer, producer, or both.
      if ((parseFloat(storageCapacity) - parseFloat(this.state.batt) - parseFloat(this.state.netmeter)) > 0) {
        this.setState({ isConsumer: true });
      } else {
        this.setState({ isConsumer: false });
      }
      if ((parseFloat(this.state.netmeter) + parseFloat(this.state.batt)) > 0) {
        this.setState({ isProducer: true });
      } else  {
        this.setState({ isProducer: false });
      }
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
    if ((parseFloat(this.state.bidValue) <= parseFloat(buyBackRate)) || (parseFloat(this.state.bidValue) >= parseFloat(utilityRate))) {
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
      console.log("Valid bid submitted.");

      // Submit bid.
      await this.state.contract.methods.bid(this.state.bidValue).send({
        from: this.state.accounts[0]
      });

      var bid = this.state.bidValue;

      // Add bid.
      bids.set(this.state.accounts[0], bid);

      // Set state.
      await this.setState({
        bidValue: "",
        bid
      });

      // Identify if buyer or seller.
      this.identify();
    }
  }
  // Submit bid quantity.
  async handleBidQuantitySubmit(event) {
    // Prevent page reload.
    event.preventDefault();

    // Available capacity.
    var available = parseFloat(storageCapacity) - parseFloat(this.state.batt) - parseFloat(this.state.netmeter);
    // Only accept valid bid quantity.
    if ((parseFloat(this.state.bidQuantityValue) <= 0) || (parseFloat(this.state.bidQuantityValue) > available)) {
      // Log.
      console.log("Invalid bid quantity.");

      // Throw alert.
      alert(
        "Please submit a bid quantity between 0 kWh and " +
        available +
        " kWh."
      );

      // Set state.
      this.setState({ bidQuantityValue: "" });
    } else {
      // Log.
      console.log("Valid bid quantity submitted.");

      // Submit buy quantity.
      var bidQuantity = this.state.bidQuantityValue;

      // Add quantity.
      buyerQuants.set(this.state.accounts[0], bidQuantity);

      // Set state.
      await this.setState({
        bidQuantityValue: "",
        bidQuantity
      });

      // Identify if buyer or seller.
      this.identify();
    }
  }
  // Submit sell quantity.
  async handleSellQuantitySubmit(event) {
    // Prevent page reload.
    event.preventDefault();

    // Available supply.
    var available = parseFloat(this.state.netmeter) + parseFloat(this.state.batt);
    // Only accept valid sell quantity.
    if ((parseFloat(this.state.sellQuantityValue) <= 0) || (parseFloat(this.state.sellQuantityValue) > available)) {
      // Log.
      console.log("Invalid sell quantity.");

      // Throw alert.
      alert(
        "Please submit a sell quantity between 0 kWh and " +
        available +
        " kWh."
      );

      // Set state.
      this.setState({ sellQuantityValue: "" });
    } else {
      // Log.
      console.log("Valid sell quantity submitted.");

      // Submit sell quantity.
      var sellQuantity = this.state.sellQuantityValue;

      // Add quantity.
      sellerQuants.set(this.state.accounts[0], sellQuantity);

      // Set state.
      await this.setState({
        sellQuantityValue: "",
        sellQuantity
      });

      // Identify if buyer or seller.
      this.identify();
    }
  }


  // Handle bid.
  handleBidChange(event) {
    // Set state.
    this.setState({ bidValue: event.target.value });
  }
  // Handle bid quantity.
  handleBidQuantityChange(event) {
    // Set state.
    this.setState({ bidQuantityValue: event.target.value });
  }
  // Handle sell quantity.
  handleSellQuantityChange(event) {
    // Set state.
    this.setState({ sellQuantityValue: event.target.value });
  }

  //////////////
  // Auction. //
  //////////////

  // Initialize auction.
  async initialize() {
    try  {
      // Log.
      console.log("Auction initialized.")

      // Timeout length.
      var t0 = new Date();
      var t1 = new Date(t0.getFullYear(), t0.getMonth(), t0.getDate(), t0.getHours() + 1, 0, 0, 0);
      var d = t1 - t0;

      // Reset auction on timeout.
      var auctionTimeout = setTimeout(async function() {
        // Stop if unmounted.
        if (!this.mounted) {
          clearTimeout(auctionTimeout);
        } else {
          // Log.
          console.log("A new auction period has begun.")

          // Set consumption, production, net meter, and storage state.
          this.setState( this.process );
        }
      }.bind(this), d);

      // Reinitalize auction data.
      for (const address of addresses) {
        bids.set(address, "[No bid has been submitted.]");
        buyerQuants.set(address, "[No bid quantity has been submitted.]");
        sellerQuants.set(address, "[No sell quantity has been submitted.]");
        prices.set(address, 0.0);
        payments.set(address, 0.0);
        sold.set(address, 0.0);
      }

      // Set state.
      await this.setState({
        bidValue: "",
        bid: "[No bid has been submitted.]",
        bidQuantityValue: "",
        bidQuantity: "[No bid quantity has been submitted.]",
        sellQuantityValue: "",
        sellQuantity: "[No sell quantity has been submitted.]",
        isAuction: true,
        isBuyer: true,
        isSeller: true
      });
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

      // Log.
      console.log("Buyer bid values: ");
      console.log(bids);
      console.log("Buyer bid quantities: ");
      console.log(buyerQuants);
      console.log("Seller quantities: ");
      console.log(sellerQuants);

      //////////////////////
      // Auction Results. //
      //////////////////////

      // Sellers. //

      // Aggregate seller supply.
      var supply = 0.0;
      // List of sellers.
      var sellers = [];
      // Find sellers.
      for (const address of addresses) {
        var quantity = sellerQuants.get(address);
        if (quantity != "[No sell quantity has been submitted.]") {
          // Add seller.
          sellers.push(address);
          // Update supply.
          supply += parseFloat(quantity);
        }
      }
      // Remaining supply.
      var remaining = supply;

      // Buyers. //

      // TODO: duplicate list to delete bids.

      // List of bidders.
      var bidders = [];
      // Previous highest bid.
      var pastBid = Infinity;
      // Address of previous highest bidder.
      var pastAddr = null;
      // Address of current highest bidder.
      var currentAddr = null;
      // Bidder index.
      var index = 0;
      // Order bidders by descending bid value.
      for (var i = 0; i < addresses.length; i++) {
        // Current highest bid bid.
        var currentBid = 0.0;
        // Find next highest bidder.
        for (const address of addresses) {
          // Bid.
          var tempBid = bids.get(address);
          // If bid submitted.
          if (tempBid != "[No bid has been submitted.]") {
            // If higher than current highest bid and lower than previous
            // highest bid, update current highest bid.
            if ((parseFloat(tempBid) > parseFloat(currentBid)) && (parseFloat(tempBid) < parseFloat(pastBid))) {
              currentBid = tempBid;
              currentAddr = address;
            }
          }
        }
        // TODO: Ensure no duplicates.
        if (currentAddr != pastAddr) {
          // Add next highest bidder.
          bidders[index] = currentAddr;
          index++;
          // Update previous bid and bidder.
          pastBid = currentBid;
          pastAddr = currentAddr;
        }
      }

      // Prices and payments. //

      // Bidder index.
      var index = 0;
      // Iterate over bidders while supply remains.
      while(remaining > 0) {

        // Current bidder. //

        // Bidder address.
        var b = bidders[index];
        // If supply exceeds demand, sell remaining supply to the utility.
        if (b == null) {
          // Update sellers' payments.
          for (var i = 0; i < sellers.length; i++) {
            // Seller address.
            var s = sellers[i];
            // Seller quantity.
            var sq = parseFloat(sellerQuants.get(s));
            // Previous seller payment.
            var p = parseFloat(payments.get(s));
            // Total seller quantity sold.
            var ss = parseFloat(sold.get(s));
            // Issue payment proportional to percentage of supply.
            payments.set(s, p + (buyBackRate * (remaining * (sq / supply))));
          }
          // Break.
          break;
        }
        // Bidder bid value.
        var v = parseFloat(bids.get(b));
        // Bidder bid quantity.
        var bq = parseFloat(buyerQuants.get(b));

        // Determine rates. //

        // If bid quantity exceeds remaining supply.
        if (bq >= remaining) {

          // Microgrid. //

          // Update bidder price.
          prices.set(b, ((remaining) * v) + ((bq - remaining) * utilityRate));

          // Update sellers' payments and quantities sold.
          for (var i = 0; i < sellers.length; i++) {
            // Seller address.
            var s = sellers[i];
            // Seller quantity.
            var sq = parseFloat(sellerQuants.get(s));
            // Previous seller payment.
            var p = parseFloat(payments.get(s));
            // Issue payment proportional to percentage of supply.
            payments.set(s, p + (v * (remaining * (sq / supply))));
            // Previous seller quantity sold.
            var ss = parseFloat(sold.get(s));
            // Update seller quantity sold.
            sold.set(s, ss + (remaining * (sq / supply)));
          }

          // Utility grid. //

          // Each of the remaining bidders pay full utility price.
          for (var j = index + 1; j < bidders.length; j++) {
            // Bidder address.
            var o = bidders[j];
            // Bidder bid quantity.
            var oq = parseFloat(buyerQuants.get(o));
            // Update bidder price.
            prices.set(o, (oq * utilityRate));
          }

          // Set remaining supply to zero.
          remaining = 0;
        } else  {

          // Microgrid. //

          // Update bidder price.
          prices.set(b, (bq * v));

          // Update sellers' payments and quantities sold.
          for (var k = 0; k < sellers.length; k++) {
            // Seller address.
            var s = sellers[k];
            // Seller quantity.
            var sq = parseFloat(sellerQuants.get(s));
            // Previous seller payment.
            var p = parseFloat(payments.get(s));
            // Issue payment proportional to percentage of supply.
            payments.set(s, p + (v * (bq * (sq / supply))));
            // Previous seller quantity sold.
            var ss = parseFloat(sold.get(s));
            // Update seller quantity sold.
            sold.set(s, ss + (bq * (sq / supply)));
          }

          // Update remaining supply.
          remaining -= bq;
        }

        // Update bidder index.
        index++;
      }

      // Log.
      console.log("Buyers: ");
      console.log(bidders);
      console.log("Sellers: ");
      console.log(sellers);
      console.log("Buyer prices: ");
      console.log(prices);
      console.log("Seller payments: ");
      console.log(payments);

      // Set state.
      await this.setState({ isAuction: false });

      // Identify if buyer or seller.
      this.identify();
    } catch (error) {
      // Throw error.
      alert(`Failed to finalize auction.`);
      console.error(error);
    }
  }

  // Determine buyer or seller identity.
  identify() {
    // Check auction state.
    if (this.state.isAuction) {
      // Check buyer state.
      if ((this.state.bid != "[No bid has been submitted.]") && (this.state.bidQuantity != "[No bid quantity has been submitted.]")) {
        this.setState({ isSeller: false });
      }
      // Check seller state.
      if (this.state.sellQuantity != "[No sell quantity has been submitted.]") {
        this.setState({ isBuyer: false });
      }
    } else {
      // Check buyer state.
      if ((this.state.bid != "[No bid has been submitted.]") && (this.state.bidQuantity != "[No bid quantity has been submitted.]")) {
        this.setState({ isBuyer: true });
      } else {
        this.setState({ isBuyer: false });
      }
      // Check seller state.
      if (this.state.sellQuantity != "[No sell quantity has been submitted.]") {
        this.setState({ isSeller: true });
      } else {
        this.setState({ isSeller: false });
      }
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

          {this.state.isAuction ? (

            <div>

              <button onClick={() => {this.finalize()}}>Display Results Now</button>

            </div>

          ) : (

            <div>

              <button onClick={() => {this.initialize()}}>Start Another Auction</button>

            </div>

          )}

          <h3>Buy Electricity</h3>

          {this.state.isConsumer ? (

            <div>

              <p><strong>Buy electricity to meet consumption or store for later.</strong></p>

              {this.state.isAuction ? (

                <div>

                {this.state.isBuyer ? (

                  <div>

                    <p>You have {parseFloat(parseFloat(storageCapacity) - parseFloat(this.state.batt) - parseFloat(this.state.netmeter)).toFixed(2)} kWh of available capacity.</p>

                    <p>Input bid value (¢/kWh).</p>

                      <form onSubmit={this.handleBidSubmit}>
                        <label>
                          <input type="text" value={this.state.bidValue} onChange={this.handleBidChange} />
                        </label>
                        <input type="submit" value="Submit" />
                        <div>
                          <p>Bid value: {this.state.bid}</p>
                        </div>
                      </form>

                    <p>Input bid quantity (kWh).</p>

                    <form onSubmit={this.handleBidQuantitySubmit}>
                      <label>
                        <input type="text" value={this.state.bidQuantityValue} onChange={this.handleBidQuantityChange} />
                      </label>
                      <input type="submit" value="Submit" />
                      <div>
                        <p>Bid quantity: {this.state.bidQuantity}</p>
                      </div>
                    </form>

                </div>

                ) : (

                  <div>

                    <p>You can not bid on electricity in the current auction.</p>

                  </div>

                )}

                </div>

            ) : (

            <div>

              {this.state.isBuyer ? (

                <div>

                  <p>You paid {parseFloat(prices.get(this.state.accounts[0])).toFixed(2)} ¢ for {parseFloat(buyerQuants.get(this.state.accounts[0])).toFixed(2)} kWh of electricity (a savings of {parseFloat((parseFloat(buyerQuants.get(this.state.accounts[0])) * parseFloat(utilityRate)) - parseFloat(prices.get(this.state.accounts[0]))).toFixed(2)} ¢).</p>

                </div>

              ) : (

                <div>

                  <p>You did not bid on electricity in the current auction.</p>

                </div>

              )}

            </div>

            )}

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

              {this.state.isAuction ? (

                <div>

                {this.state.isSeller ? (

                  <div>

                    <p>You have {parseFloat(parseFloat(this.state.netmeter) + parseFloat(this.state.batt)).toFixed(2)} kWh of available electricity.</p>

                    <p>Input sell quantity (kWh).</p>

                    <form onSubmit={this.handleSellQuantitySubmit}>
                      <label>
                        <input type="text" value={this.state.sellQuantityValue} onChange={this.handleSellQuantityChange} />
                      </label>
                      <input type="submit" value="Submit" />
                      <div>
                        <p>Sell quantity: {this.state.sellQuantity}</p>
                      </div>
                    </form>

                  </div>

                ) : (

                  <div>

                    <p>You can not sell electricity in the current auction.</p>

                  </div>

                )}

                </div>


              ) : (

              <div>

                {this.state.isSeller ? (

                  <div>

                    <p>You earned {parseFloat(payments.get(this.state.accounts[0])).toFixed(2)} ¢ for {parseFloat(sellerQuants.get(this.state.accounts[0])).toFixed(2)} kWh of electricity (an extra {parseFloat(parseFloat(payments.get(this.state.accounts[0])) - (parseFloat(sellerQuants.get(this.state.accounts[0])) * parseFloat(buyBackRate))).toFixed(2)} ¢).</p>

                  </div>

                ) : (

                  <div>

                    <p>You did not sell electricity in the current auction.</p>

                  </div>

                )}

              </div>

              )}

            </div>

          ) : (

            <div>

              <p><strong>You have no electricity to sell.</strong></p>

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
          <p>See data from the current auction period here.</p>
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
            {this.state.batt} of {storageCapacity} kilowatt-hours.<br />
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