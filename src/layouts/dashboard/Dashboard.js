import React, { Component } from 'react'

// D3.
import * as D3 from "d3"
// React D3.
import * as ReactD3 from 'react-d3'

// Web3.
import Web3 from 'web3'

// UI Components
import UsageChart from './UsageChart.js'

////////////////
// Dashboard. //
////////////////

class Dashboard extends Component {

  constructor(props) {
    super(props);

    // Set state.
    this.state = {
      mounted: null,
      web3: null,
      accounts: null,
      users: null,
      usage: null,
      generation: null,
      netmeter: null
    };
  }

  // Load Web3.
  async componentDidMount() {
    // Register mounted.
    this.mounted = true;

    try {
      // Web3.
      var web3 = window.web3;

      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider);

      // Enable MetaMask.
      await web3.currentProvider.enable();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

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

      // Map Ethereum addresses to SunDance data.
      // [key, value]: [eth_addr, sundance_data]
      var users = new Map();
      for (var i = 0; i < 10; i++) {
        var sundance = require('../../../data/sundance/SunDance_9' + i + '.csv');
        users.set(addresses[i], sundance);
      }

      // MetaMask account change.
      var selected = accounts[0];
      var accountInterval = setInterval(async function() {
        // Stop if unmounted.
        if (!this.mounted) {
          clearInterval(accountInterval);
        } else  {
          // Monitor changes.
          accounts = await web3.eth.getAccounts();
          if (accounts[0] !== selected) {
            // Log.
            console.log("MetaMask account changed.");

            selected = accounts[0];
            var user = users.get(selected);
            this.setState(
              { accounts, usage: null, generation: null, netmeter: null },
              this.process
            );
          }
        }
      }.bind(this), 100);

      // Set web3, accounts, and users to the state.
      this.setState(
        { web3, accounts, users },
        this.process
      );
    } catch (error) {
      // Throw error.
      alert(`Failed to load web3 or accounts.`);
      console.error(error);
    }
  }

  // Prepare to unmount.
  componentWillUnmount() {
    // Register unmount.
    this.mounted = false;
  }

  // Process data.
  async process() {
    try {
      // Usage graph.
      var usage;
      // Generation graph.
      var generation;
      // Net meter graph.
      var netmeter;

      // Usage data.
      var use = [];
      // Generation data.
      var gen = [];
      // Net data.
      var net = [];
      // Synchronized data.
      var synch = [];

      // Parse CSV file.
      D3.csv(this.state.users.get(this.state.accounts[0])).then(function(data) {
        // Values.
        var values = [];
        // Read each line of CSV.
        for (var i = 0; i < data.length; i++) {
          // Create new date object.
          var date = data[i].date.split(" ");

          var calendar = date[0].split("/");
          var period = date[1].split(":");

          var year = "20" + calendar[2];
          var month = calendar[0];
          var day = calendar[1];

          var hour = parseInt(period[0], 10);

          var dateObj = new Date(year, month, day, hour);

          // Date format.
          var ms = +dateObj;

          // Calculations.
          var outvar = data[i].use.replace(/-|\s/g,"");
          var invar = data[i].gen.replace(/-|\s/g,"");
          var diff = invar - outvar;

          // Add data points.
          use.push({x: dateObj, y: outvar});
          gen.push({x: dateObj, y: invar});
          net.push({x: dateObj, y: diff});
          synch.push({date: ms, use: outvar, gen: invar});
        }

        // Update usage graph.
        usage = [
          {
            label: 'Usage',
            values: use
          }
        ];
        // Update generation graph.
        generation = [
          {
            label: 'Generation',
            values: gen
          }
        ];
        // Update net meter graph.
        netmeter = [
          {
            label: 'Net Meter',
            values: net
          }
        ];

        // Set usage, generation, and netmeter to state.
        this.setState({ usage, generation, netmeter } );
      }.bind(this));
    } catch (error) {
      // Throw error.
      alert(`Failed to load data.`);
      console.error(error);
    }
  }

  render() {

    // Handle loading issues.
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    if (!this.state.usage || !this.state.generation || !this.state.netmeter) {
      return <div>Loading data...</div>;
    }

    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">

            <h1>Dashboard</h1>

            <h2>Statistics</h2>

            <h3>Energy Usage</h3>
            <ReactD3.AreaChart
              data={this.state.usage}
              width={1400}
              height={400}
              yOrientation='right'
              margin={{top: 10, bottom: 50, left: 50, right: 10}}
              xAxis={{label: 'Time'}}
              yAxis={{label: 'kWh'}}
              xAxisTickInterval={{unit: 'month', interval: 2}}/>

            <h3>Energy Production</h3>
            <ReactD3.AreaChart
              data={this.state.generation}
              width={1400}
              height={400}
              yOrientation='right'
              margin={{top: 10, bottom: 50, left: 50, right: 10}}
              xAxis={{label: 'Time'}}
              yAxis={{label: 'kW'}}
              xAxisTickInterval={{unit: 'month', interval: 2}}/>

            <h3>Net Metering</h3>
            <p>Display net metering graph here.</p>

            <h3>Storage Capacity</h3>
            <p>Display storage capacity here.</p>

          </div>
        </div>
      </main>
    )
  }
}

export default Dashboard