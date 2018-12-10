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
            <p>
              <strong>Name</strong><br />
              {this.props.authData.name}<br />
              <strong>Email</strong><br />
              {this.props.authData.email}<br />
              <strong>Phone</strong><br />
              {this.props.authData.phone}<br />
              <strong>Location</strong><br />
              {this.props.authData.country}<br />
            </p>
          </div>
        </div>
      </main>
    )
  }
}

export default Profile
