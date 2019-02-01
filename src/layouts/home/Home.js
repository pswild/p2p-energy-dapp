import React, { Component } from 'react'

class Home extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Welcome to the Future of Energy!</h1>
            <p>A peer-to-peer energy trading platform for community micro-grids. For more on the project, visit our <a href="https://github.com/pswild/p2p-energy-dapp" target="_blank">GitHub</a>.</p>
            <h2>Getting Started</h2>
            <h3>An Ethereum Distributed Application</h3>
            <p>Our system allows you to safely trade electricity with members of your micro-grid community without trusting a utility with your data. The price of electricity is set by an auction mechanism, not a central authority. The details of the auction are kept in a distributed ledger that is shared with each participant, but your consumption data and price preferences are visible only to you.</p>
            <h3>uPort Authentication</h3>
            <p>Set up your secure account with <a href="https://www.uport.me" target="_blank">uPort</a> authentication on your mobile device. Click the login button in the upper-right corner.</p>
            <h2>Background</h2>
            <p>The infrastructure for the generation and distribution of electricity the United States relies primarily on environmentally harmful, carbon-based power plants that are controlled by a natural oligopoly of utility providers. The system is highly centralized, requires transmission over long distances, and is liable to disruption by natural disaster.</p>
            <p> As renewable energy and storage device technology improves, localized production of energy will increase grid efficiency, decrease environmental impact, and create a more resilient energy system. The growing electric vehicle market predicts not only an increased demand for electricity, but also the creation of a battery fleet capable of load-balancing intermittent renewable sources.</p>
            <p>Despite the benefits of decentralization, however, regulation protects the incumbent, vertically-integrated utility companies. The “net metering” policy offered in thirty-eight U.S. states only requires utilities to pay individual producers (“prosumers”) for electricity at “avoided cost”, not market price. These rules are inconsistent between states and lack transparency, often containing additional fees to offset the cost to utilities. Therefore, prosumers and utilities alike have little incentive to invest in renewable energy technology. </p>
            <p>We want to make renewable energy more affordable. Our goal is to develop a more efficient, environmentally-friendly, and reliable energy system in the United States by solving the problem prosumers face selling electricity back to the grid.</p>
            <p>Thank you for joining us!</p>
            <h2>License</h2>
            <p>This distributed application was built using the <a href="https://truffleframework.com/boxes/react-uport" target="_blank">react-uport</a> Truffle Box. The React/Redux portions of the authentication functionality are provided by a <a href="https://github.com/mjrussell/redux-auth-wrapper" target="_blank">wrapper</a>.</p>          </div>
        </div>
      </main>
    )
  }
}

export default Home
