import React, { Component } from 'react'

// UI Components
import TestButtonContainer from '../ui/testbutton/TestButtonContainer'
import AuctionForm from './AuctionForm.js'

class Auction extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">

          <h1>Auction</h1>
          <p><i>Specify your auction preferences here.</i></p>

          <h2>Start an Auction</h2>
          <TestButtonContainer></TestButtonContainer>

          <h2>Make a Bid</h2>
          <AuctionForm></AuctionForm>

        </div>
      </div>
    </main>
    );
  }
}

export default Auction