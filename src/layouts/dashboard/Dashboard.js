import React, { Component } from 'react'

// UI Components
import TestButtonContainer from './ui/testbutton/TestButtonContainer'

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
import data from './data/jan18_jan19.csv'

// Current date and time.
var current = new Date();
var currentYear = current.getFullYear();
var currentMonth = current.getMonth() + 1;
var currentDay = current.getDate();
var currentHour = current.getHours();
var currentMinute = current.getMinutes();
var currentSecond = current.getSeconds();
// Log to console.
console.log(current);
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
    var time = data[i].Time.split(" ");

    var calendar = time[0].split("/");
    var period = time[1].split(":");
    var ampm = time[2];

    var year = calendar[2];
    var month = calendar[0];
    var day = calendar[1];

    var date = new Date(year, month, day);

    var hour = parseInt(period[0], 10);
    if (ampm === "PM") {
      hour += 12;
    }

    // Add data point.
    values.push({x: i, y: data[i].kWh});
  }

  // Update graph.
  usage = [
    {
      label: 'Energy Usage',
      values: values
    }
  ];
});

class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props);
    authData = this.props;
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">

            <h1>Dashboard</h1>
            <p><strong>Congratulations, {this.props.authData.name}!</strong></p>
            <p>If you're seeing this page, you've logged in with uPort successfully. Navigate to your profile for more information.</p>

            <h2>Auction</h2>
            <p>Specify your auction preferences here.</p>


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
