import React from 'react'

const TestButton = ({ onTestClick }) => {
  return(
    <div className="pure-menu-item">
      <a className="pure-menu-link" onClick={(event) => onTestClick(event)}>Test</a>
    </div>
  )
}

export default TestButton
