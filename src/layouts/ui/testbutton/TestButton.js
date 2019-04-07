import React from 'react'

const TestButton = ({ onTestClick }) => {
  return(
    <div>
      <a className="pure-menu-link" onClick={(event) => onTestClick(event)}>Auction</a>
    </div>
  )
}

export default TestButton
