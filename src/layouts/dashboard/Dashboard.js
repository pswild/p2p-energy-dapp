import React, { Component } from 'react'

// UI Components
import TestButtonContainer from './testbutton/TestButtonContainer'

class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Dashboard</h1>
            <p><strong>Congratulations, {this.props.authData.name}!</strong></p>
            <p>If you're seeing this page, you've logged in with uPort successfully. Navigate to your profile for more information.</p>
          </div>
        </div>
        <TestButtonContainer />
      </main>
    )
  }
}

export default Dashboard
