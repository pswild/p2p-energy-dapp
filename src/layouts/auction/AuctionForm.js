import React, { Component } from 'react'

// Web3.
import Web3 from 'web3'

// Contracts.
import SimpleStorageContract from '../../../build/contracts/SimpleStorage.json'

class AuctionForm extends Component {
  constructor(props) {
    super(props);
    this.state= {
      value: "",
      storageValue: "[No bids have been submitted.]",
      web3: null,
      accounts: null,
      contract: null
    };

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

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  // Test contract.
  async handleSubmit(event) {
    event.preventDefault();

    // Alert.
    // alert("The bid is: " + this.state.value)

    // Stores a given value.
    await this.state.contract.methods.set(this.state.value).send({
      from: this.state.accounts[0]
    });

    // Get the value from the contract to prove it worked.
    const response = await this.state.contract.methods.get().call();

    // Update state with the result.
    this.setState({
      storageValue: response
    });
  }

  render() {
    return (

      <form onSubmit={this.handleSubmit}>
        <p>Input bid ($): </p>
        <label>
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
        <p></p>
        <div>The bid is: {this.state.storageValue}</div>
      </form>

    );
  }
}

export default AuctionForm