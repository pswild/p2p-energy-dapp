import React, { Component } from 'react'

// D3 JavaScript.
import * as D3 from "d3"
import * as ReactD3 from 'react-d3'

// Load CMP data.
import data from '../../../data/jan18_jan19.csv'

/////////////////////////
// Data visualization. //
/////////////////////////

// Green Button CSV format:
// ["Account", "SPID", "MID", "Time", "Channel", "kWh"].

// CMP data.
var usage = [];
// Parse CSV file.
D3.csv(data).then(function(data) {
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

////////////////
// Dashboard. //
////////////////

class Dashboard extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">

            <h1>Dashboard</h1>

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
              yAxis={{label: "kW"}}/>

            <h3>Energy Production</h3>
            <p>Display energy production graph here.</p>

            <h3>Storage Capacity</h3>
            <p>Display storage capacity here.</p>

          </div>
        </div>
      </main>
    )
  }
}

export default Dashboard