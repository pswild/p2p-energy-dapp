import React, { Component } from 'react'

// Web3.
import Web3 from 'web3'

// Contracts.
import SimpleStorageContract from '../../../build/contracts/SimpleStorage.json'

class AuctionForm extends Component {
  constructor(props) {
    super(props);

    // Set state.
    this.state = {
      value: "",
      bid: "[No bids have been submitted.]",
      bidder: "[No bidders have bidded.]",
      web3: null,
      contract: null
    };

    // Handle changes.
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Load contract.
  async componentDidMount() {
    try {
      // Web3.
      var web3 = window.web3

      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider)

      // Enable MetaMask.
      await web3.currentProvider.enable();

      // NOTE: Acquire confirmation from the MetaMask account that this
      // application may view Ethereum addresses.

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state. Call runExample.
      this.setState(
        {
          web3,
          contract: instance
        },
        this.runExample
      );
    } catch (error) {
      // Throw error.
      alert(`Failed to load web3, accounts, or contract.`);
      console.error(error);
    }
  }

  handleChange(event) {
    // Set state.
    this.setState({
      value: event.target.value
    });
  }

  // Submit bid.
  async handleSubmit(event) {
    // Prevent page reload.
    event.preventDefault();

    // Log.
    console.log("Bid submitted.");

    // Get state.
    const {
      contract
    } = this.state;

    // Use web3 to get the user's accounts.
    const accounts = await this.state.web3.eth.getAccounts();

    // Note: accounts is only populated by the default address selected in
    // MetaMask. This can be accessed at "accounts[0]".

    // Stores a given value.
    await contract.methods.set(this.state.value).send({
      from: accounts[0]
    });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Set state.
    this.setState({
      bid: response,
      bidder: accounts[0]
    });
  }

  // End auction.
  results() {
    // Log.
    console.log("Auction results requested.");
  }

  // Called after component mounts.
  async runExample() {
    try  {
      // Log.
      console.log("Auction initialized.")

    } catch (error) {
      // Throw error.
      alert(`Failed to run example function.`);
      console.error(error);
    }
  }

  render() {
    // Handle loading issues.
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (

      <div>

        <h2>Start an Auction</h2>
        <p>The next auction will run on {this.props.nextAuctionString}</p>

        <h2>Make a Bid</h2>
        <p>Input bid ($) here.</p>

          <form onSubmit={this.handleSubmit}>
            <label>
              <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
            <div>
              <p>The bid is: {this.state.bid}</p>
              <p>The bidder is: {this.state.bidder}</p>
            </div>
          </form>

        <h2>End an Auction</h2>
        <p>See the auction results here.</p>

        <button onClick={() => {this.results()}}>End Auction</button>

      </div>

    );
  }
}

export default AuctionForm