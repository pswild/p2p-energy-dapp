import React, { Component } from 'react'

// D3.
import * as D3 from "d3"
import * as ReactD3 from 'react-d3'

// Load SunDance data.
import sundance from '../../../data/sundance/SunDance_1.csv'

/////////////////////////
// Data visualization. //
/////////////////////////

// SunDance CSV format:
// ["date", "use", "gen", "grid"].

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

// Parse CSV file.
D3.csv(sundance).then(function(data) {
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

    // Calculations.
    var outvar = data[i].use.replace(/-|\s/g,"");
    var invar = data[i].gen.replace(/-|\s/g,"");
    var diff = invar - outvar;

    // Add data points.
    use.push({x: dateObj, y: outvar});
    gen.push({x: dateObj, y: invar});
    net.push({x: dateObj, y: diff});
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
              yAxis={{label: "kW"}}
              xAxisTickInterval={{unit: 'month', interval: 2}}/>

            <h3>Energy Production</h3>
            <p>Display energy production graph here.</p>
            <ReactD3.AreaChart
              data={generation}
              width={1400}
              height={400}
              yOrientation='right'
              margin={{top: 10, bottom: 50, left: 50, right: 10}}
              xAxis={{label: "Time"}}
              yAxis={{label: "kW"}}
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