import React, { Component } from 'react'

// Web3.
import Web3 from 'web3'

// Contracts.
import SimpleStorageContract from '../../../build/contracts/SimpleStorage.json'

// UI Components
import TestButtonContainer from './ui/testbutton/TestButtonContainer'

// Bootstrap (React 16+).

// Load Bootstrap components individually.
// import Card from 'react-bootstrap/Card'
// import Button from 'react-bootstrap/Button'

// <Card className="text-center">
//   <Card.Header>Auction</Card.Header>
//   <Card.Body>
//     <Card.Title>Welcome to the auction!</Card.Title>
//     <Card.Text>
//       Here you can buy and sell electricity with other members of your microgrid community.
//     </Card.Text>
//     <Button variant="primary">Link to auction information.</Button>
//   </Card.Body>
//   <Card.Footer className="text-muted">For more information, visit our GitHub.</Card.Footer>
// </Card>

// D3 JavaScript Visualization.
import * as D3 from "d3"
import * as ReactD3 from 'react-d3'

// Load usage data.
import data from '../../../data/jan18_jan19.csv'

// Data visualization.

// Current date and time.
var current = new Date();
var currentYear = current.getFullYear();
var currentMonth = current.getMonth() + 1;
var currentDay = current.getDate();
var currentHour = current.getHours();
var currentMinute = current.getMinutes();
var currentSecond = current.getSeconds();
// Auction period: [year, month, day, hour].
var nextAuction = [currentYear, currentMonth, currentDay, currentHour];

// Energy usage data.
var usage = [];
// Parse CSV file.
D3.csv(data).then(function(data) {
  // CSV format: ["Account", "SPID", "MID", "Time", "Channel", "kWh"].

  // Values.
  var values = [];
  // Read each line of CSV.
  for (var i = 0; i < data.length; i++) {
    // Create new date.
    var csvTime = data[i].Time.split(" ");

    var calendar = csvTime[0].split("/");
    var period = csvTime[1].split(":");
    var ampm = csvTime[2];

    var year = "20" + calendar[2];
    var month = calendar[0];
    var day = calendar[1];

    var hour = parseInt(period[0], 10);
    if (ampm === "PM") {
      hour += 12;
    }

    var date = new Date(year, month, day, hour);

    // Add data point.
    values.push({x: date, y: data[i].kWh});
  }

  // Update graph.
  usage = [
    {
      label: 'Energy Usage',
      values: values
    }
  ];
});

// Dashboard.

class Dashboard extends Component {

  constructor(props, { authData }) {
    super(props);
    this.state= {
      storageValue: "[Error]",
      web3: null,
      accounts: null,
      contract: null
    };

    // uPort authentication information.
    authData = this.props;
  }

  // Load contract.
  async componentDidMount() {
    try {
      // Web3.
      var web3 = window.web3

      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider)

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Log details.
      console.log("Deployed Network ID: " + networkId);
      console.log("Deployed Network Contract Address: " + deployedNetwork.address);
      console.log("Accounts: " + accounts);

      // Set web3, accounts, and contract to the state, and then proceed with an example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  // Test contract.
  async runExample() {
    const {
      accounts,
      contract
    } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">

            <h1>Dashboard</h1>

            <p><strong>Congratulations, {this.props.authData.name}!</strong></p>
            <p>If you're seeing this page, you've logged in with uPort successfully. Navigate to your profile for more information.</p>

            <h2>Simple Storage</h2>
            <div>The stored value is: {this.state.storageValue}</div>

            <h2>Statistics</h2>
            <h3>Energy Usage</h3>
            <p>Display energy usage graph here.</p>
            <ReactD3.AreaChart
              data={usage}
              width={1400}
              height={400}
              yOrientation='right'
              margin={{top: 10, bottom: 50, left: 50, right: 10}}
              xAxis={{label: "Time"}}
              yAxis={{label: "kWh"}}/>
            <h3>Energy Production</h3>
            <p>Display energy production graph here.</p>
            <h3>Storage Capacity</h3>
            <p>Display storage capacity here.</p>

            <h2>Component Testing</h2>
            <TestButtonContainer />

          </div>
        </div>
      </main>
    )
  }
}

export default Dashboard
