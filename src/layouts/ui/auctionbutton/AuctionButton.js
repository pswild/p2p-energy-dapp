import React from 'react'

const AuctionButton = ({ onTestClick }) => {
  return(
    <div>
      <a className="pure-menu-link" onClick={(event) => onTestClick(event)}>Display Results</a>
    </div>
  )
}

export default AuctionButton
