import { connect } from 'react-redux'
import TestButton from './TestButton'
import { test } from './TestButtonActions'

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTestClick: (event) => {
      event.preventDefault();

      dispatch(test())
    }
  }
}

const TestButtonContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TestButton)

export default TestButtonContainer
