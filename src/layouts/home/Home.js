import React, { Component } from 'react'

// Import image.
var image = require('./image.png');

class Home extends Component {
  constructor(props) {
    super(props);

    // Set state.
    this.state = {};
  }

  async componentDidMount() {
    // Log.
    // console.log("Home component mounted.");
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">

            <h1>Welcome to the Future of Energy!</h1>

              <p>A peer-to-peer energy trading platform for community micro-grids. For more on the project, visit our <a href="https://github.com/pswild/p2p-energy-dapp" target="_blank">GitHub</a>.</p>

              <p><strong><i>Thank you for joining us!</i></strong></p>

            <h3>Getting Started</h3>

              <p>Set up your secure account with <a href="https://www.uport.me" target="_blank">uPort</a> authentication on your mobile device and then log in!</p>

              <img
                src={ image }
                style={{ height: 480, width: 960 }}
              />

          </div>
        </div>
      </main>
    )
  }
}

export default Home
