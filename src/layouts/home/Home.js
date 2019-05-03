import React, { Component } from 'react'

// Import image.
var image = require('./image.png');

class Home extends Component {
  constructor(props) {
    super(props);

    // Set state.
    this.state = {};
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">

            <h1>Welcome to the Future of Energy!</h1>

              <p>We are a peer-to-peer energy trading platform for community micro-grids. For more on the project, visit our <a href="https://github.com/pswild/p2p-energy-dapp" target="_blank">GitHub</a>.</p>

              <p><strong><i>Thank you for joining us!</i></strong></p>

            <h3>Getting Started</h3>

              <p>You'll need a <a href="https://www.coinbase.com/" target="_blank">Coinbase</a> account to buy Ethereum, the <a href="https://metamask.io/" target="_blank">MetaMask</a> browser extension, and the <a href="https://www.uport.me" target="_blank">uPort</a> mobile app.</p>

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
