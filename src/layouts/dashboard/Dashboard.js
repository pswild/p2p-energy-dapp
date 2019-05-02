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
    // Log.
    // console.log("Dashboard component mounted.");

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

            <h2>Electricity Usage (kWh)</h2>
            <ReactD3.AreaChart
              data={this.state.usage}
              width={1400}
              height={400}
              yOrientation='right'
              margin={{top: 10, bottom: 50, left: 50, right: 10}}
              xAxis={{label: 'Time'}}
              yAxis={{label: 'kWh'}}
              xAxisTickInterval={{unit: 'month', interval: 2}}/>

            <h2>Electricity Production (kWh)</h2>
            <ReactD3.AreaChart
              data={this.state.generation}
              width={1400}
              height={400}
              yOrientation='right'
              margin={{top: 10, bottom: 50, left: 50, right: 10}}
              xAxis={{label: 'Time'}}
              yAxis={{label: 'kW'}}
              xAxisTickInterval={{unit: 'month', interval: 2}}/>

          </div>
        </div>
      </main>
    )
  }
}

export default Dashboard