import React, { Component } from 'react'

// Web3.
import Web3 from 'web3'

//////////////
// Profile. //
//////////////

class Profile extends Component {
  constructor(props, { authData }) {
    super(props)

    // Set state.
    this.state = {
      mounted: null,
      web3: null,
      accounts: null
    };

    // uPort authentication information.
    authData = this.props;
  }

  // Load Web3.
  async componentDidMount() {
    // Register mounted.
    this.mounted = true;

    try {
      // Web3.
      var web3 = window.web3;

      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider);

      // Enable MetaMask.
      await web3.currentProvider.enable();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // MetaMask account change.
      var selected = accounts[0];
      var accountInterval = setInterval(async function() {
        // Stop if unmounted.
        if (!this.mounted) {
          clearInterval(accountInterval);
        }
        // Monitor changes.
        accounts = await web3.eth.getAccounts();
        if (accounts[0] !== selected) {
          // Log.
          console.log("MetaMask account changed.");

          // Update state.
          selected = accounts[0];
          this.setState({ accounts });
        }
      }.bind(this), 100);

      // Set web3 and accounts to the state.
      this.setState({ web3, accounts });
    } catch (error) {
      // Throw error.
      alert(`Failed to load web3 or accounts.`);
      console.error(error);
    }
  }

  // Prepare to unmount.
  componentWillUnmount() {
    // Register unmount.
    this.mounted = false;
  }

  render() {

    // Handle loading issues.
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Profile</h1>

            <p><strong>Congratulations, {this.props.authData.name}!</strong></p>
            <p>If you're seeing this page, you've logged in with uPort successfully. Navigate to your dashboard for more information.</p>

            <h2>Contact Information</h2>

            <p>Change these details in your uPort mobile app to see them reflected here.</p>

            <p>
              <strong><i>Name</i></strong><br />
              {this.props.authData.name}<br />
            </p>

            <p>
              <strong><i>Email</i></strong><br />
              {this.props.authData.email}<br />
            </p>

            <p>
              <strong><i>Phone</i></strong><br />
              {this.props.authData.phone}<br />
            </p>

            <p>
              <strong><i>Location</i></strong><br />
              {this.props.authData.country}<br />
            </p>

            <h2>Ethereum Account</h2>
            <p>Display current Ether balance here.</p>

            <p>
              <strong><i>Ethereum Address</i></strong><br />
              {this.state.accounts[0]}<br />
            </p>

            <p>
              <strong><i>Network Address</i></strong><br />
              {this.props.authData.networkAddress}<br />
            </p>

            <p>
              <strong><i>Public Key</i></strong><br />
              {this.props.authData.publicEncKey}<br />
            </p>

            <h2>Grid Statistics</h2>
            <p>Diplay information about the microgrid here.</p>

          </div>
        </div>
      </main>
    )
  }
}

export default Profile
