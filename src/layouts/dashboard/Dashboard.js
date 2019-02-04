import React, { Component } from 'react'

// UI Components
import TestButtonContainer from './testbutton/TestButtonContainer'

// Load usage data.
import data from './data.csv';

// ReactD3.
import { AreaChart } from 'react-d3';

// D3.
import * as d3 from "d3";
// import { csv } from 'd3-fetch';
// import { parse } from 'd3-dsv';

// Parse CSV file.
d3.csv(data, function(d) {
  // Log CSV to console.
  console.log(data);

  // Format the given array of objects as CSV.
  // var string = d3.csvFormat(d, ["Account", "SPID", "MID", "Time", "Channel", "kWh"]);

  // for (var i = 0; i < arr.length; i++) {
  // console.log(arr[i].Time);
  // console.log(arr[i].kWh);
  // }
});

var example = [
  {
    label: 'somethingA',
    values: [{x: 0, y: 2}, {x: 1.3, y: 5}, {x: 3, y: 6}, {x: 3.5, y: 6.5}, {x: 4, y: 6}, {x: 4.5, y: 6}, {x: 5, y: 7}, {x: 5.5, y: 8}]
  },
  {
    label: 'somethingB',
    values: [{x: 0, y: 3}, {x: 1.3, y: 4}, {x: 3, y: 7}, {x: 3.5, y: 8}, {x: 4, y: 7}, {x: 4.5, y: 7}, {x: 5, y: 7.8}, {x: 5.5, y: 9}]
  }
];

class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Dashboard</h1>
            <p><strong>Congratulations, {this.props.authData.name}!</strong></p>
            <p>If you're seeing this page, you've logged in with uPort successfully. Navigate to your profile for more information.</p>
            <h2>Energy Usage Visualization</h2>
            <AreaChart
              data={example}
              width={400}
              height={400}
              yOrientation='right'
              margin={{top: 10, bottom: 50, left: 50, right: 10}}/>
            <h2>Test</h2>
            <TestButtonContainer />
          </div>
        </div>
      </main>
    )
  }
}

export default Dashboard
