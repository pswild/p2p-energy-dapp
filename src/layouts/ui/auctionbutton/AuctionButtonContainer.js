import { connect } from 'react-redux'
import AuctionButton from './AuctionButton'
import { auction } from './AuctionButtonActions'

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTestClick: (event) => {
      event.preventDefault();

      dispatch(auction())
    }
  }
}

const AuctionButtonContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuctionButton)

export default AuctionButtonContainer
