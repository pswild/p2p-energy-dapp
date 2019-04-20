import React, { Component } from 'react'

// Web3.
import Web3 from 'web3'

////////////
// Setup. //
////////////

// Microgrid statistics.
var microgrid = 98;

// Utility statistics: $/kWh.
var utilityRate = 12;
var buyBackRate = 3;

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
      accounts: null,
      balance: null,
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

      // Use web3 to get the user's account.
      const accounts = await web3.eth.getAccounts();

      // Use web3 to get the user's balance.
      await web3.eth.getBalance(accounts[0], (err, balance) => {
        balance = web3.utils.fromWei(balance, "ether") + " ETH";
        this.setState({ balance });
      }).bind(this);

      // MetaMask account change.
      var selected = accounts[0];
      var accountInterval = setInterval(async function() {
        // Stop if unmounted.
        if (!this.mounted) {
          clearInterval(accountInterval);
        } else {
          // Monitor changes.
          accounts = await web3.eth.getAccounts();
          if (accounts[0] !== selected) {
            // Log.
            console.log("MetaMask account changed.");

            // Get balance.
            await web3.eth.getBalance(accounts[0], (err, balance) => {
              balance = web3.utils.fromWei(balance, "ether") + " ETH";
              this.setState({ balance });
            }).bind(this);

            // Update state.
            selected = accounts[0];
            this.setState({ accounts });
          }
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

            <p>
              <strong>Welcome, {this.props.authData.name}!</strong>
            </p>
            <p>
              Navigate to the <strong>Dashboard</strong> tab to view your past production and consumption, or the <strong>Auction</strong> tab to buy and sell electricity.
            </p>

            <div id="wrapper">

              <div id="left">

                <h2>Contact Information</h2>

                <p>You may change these details in your uPort mobile app.</p>

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

              </div>

              <div id="right">

                <h2>Ethereum Account</h2>

                <p>
                  <strong><i>Ethereum Address</i></strong><br />
                  {this.state.accounts[0]}<br />
                </p>

                <p>
                  <strong><i>Account Balance</i></strong><br />
                  {this.state.balance}<br />
                </p>

                <h2>Grid Configuration</h2>
                <p>See information about the microgrid here.</p>

                <p>
                  <strong><i>Community Membership</i></strong><br />
                  {microgrid} users.<br />
                </p>

                <p>
                  <strong><i>Utility Rate</i></strong><br />
                  {utilityRate} cents per kilowatt-hour.<br />
                </p>

                <p>
                  <strong><i>Buy-Back Rate</i></strong><br />
                  {buyBackRate} cents per kilowatt-hour.<br />
                </p>

              </div>

            </div>

          </div>
        </div>
      </main>
    )
  }
}

export default Profile
