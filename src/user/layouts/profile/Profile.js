import React, { Component } from 'react'

class Profile extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Profile</h1>
            <p>Change these details in your uPort mobile app to see them reflected here.</p>
            <h2>Contact Information</h2>

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
              {this.props.authData.did}<br />
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
            <p>Diplay information about the microgrid here. Use Google Maps React for visualization of the microgrid.</p>

          </div>
        </div>
      </main>
    )
  }
}

export default Profile
