import React, { Component } from 'react'

// D3.
import * as D3 from "d3"
// Recharts components.
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

class UsageChart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
      	<h3>Energy Usage</h3>
        <AreaChart width={1400} height={400} data={this.props.data} syncId="anyId"
              margin={{top: 10, right: 30, left: 0, bottom: 0}}>
          <XAxis dataKey="date" label="Date" tickCount={5} interval="preserveEnd" tickFormatter={D3.timeFormat('%B')} type='number' scale='time' domain={['auto', 'auto']}/>
          <YAxis label="kWh"/>
          <Tooltip />
          <Area type='monotone' dataKey='use' stroke='#8884d8' fill='#8884d8'/>
        </AreaChart>
        <h3>Energy Production</h3>
        <AreaChart width={1400} height={400} data={this.props.data} syncId="anyId"
              margin={{top: 10, right: 30, left: 0, bottom: 0}}>
          <XAxis dataKey="date" label="Date" tickCount={5} interval="preserveEnd" tickFormatter={D3.timeFormat('%B')} type='number' scale='time' domain={['auto', 'auto']}/>
          <YAxis label="kWh"/>
          <Tooltip />
          <Area type='monotone' dataKey='gen' stroke='#82ca9d' fill='#82ca9d'/>
        </AreaChart>
      </div>
    );
  }
}

export default UsageChart