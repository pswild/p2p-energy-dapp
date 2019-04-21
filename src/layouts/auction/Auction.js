import React, { Component } from 'react'

// UI Components
import AuctionForm from './AuctionForm.js'

//////////////
// Auction. //
//////////////

class Auction extends Component {
  constructor(props) {
    super(props);

    // Set state.
    this.state = {};
  }

  async componentDidMount() {
    // Log.
    // console.log("Auction component mounted.");
  }

  render() {
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">

          <h1>Auction</h1>

          <p>
            <i>Specify your auction preferences here.</i>
          </p>

          <p>
            A new auction starts on every hour. You may buy or sell electricity at any point. When the auction ends, you will be compensated or charged accordingly.
          </p>

          <AuctionForm />

        </div>
      </div>
    </main>
    );
  }
}

export default Auction