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

// SunDance CSV format:
// ["date", "use", "gen", "grid"].

// Site object format:
// {"name": file_name, "points": [point]}

// Point object format:
// {"date": date, "use": use, "gen": gen, grid": grid}

// List of sites.
var sites = [];

// Process each site.
for (var i = 1; i <= 100; i++) {
  // Filter missing sites.
  if(i == 2 || i == 6) {
    continue
  }

  // Site name.
  var site_name = '../../../data/sundance/SunDance_' + i + '.csv';

  // NOTE: Site name is not being passed to asynchronous function.

  // Load site data.
  const csv = require('../../../data/sundance/SunDance_' + i + '.csv');

  // Parse CSV files.
  D3.csv(csv).then(function(csv) {
    // List of points at site.
    var points = [];

    // Read each line of CSV (skip header).
    for (var j = 1; j < csv.length; j++) {

      // Create new date object.
      var csvDate = csv[j].date.split(" ");

      var calendar = csvDate[0].split("/");
      var period = csvDate[1].split(":");
      var ampm = csvDate[2];

      var year = "20" + calendar[2];
      var month = calendar[0];
      var day = calendar[1];

      var hour = parseInt(period[0], 10);
      if (ampm === "PM") {
        hour += 12;
      }

      var date = new Date(year, month, day, hour);

      // Point.
      let point = {
        date: date,
        use: csv[j].use,
        gen: csv[j].gen,
        grid: csv[j].grid
      }

      // Add to points.
      points.push(point);
    }

    // Return.
    return points;
  }).then(function(points) {
    // Site.
    let site = {
      name: "File name not available.",
      points: points
    }
    // Add to sites.
    sites.push(site);
  })
}

// Log.
// console.log(sites);

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