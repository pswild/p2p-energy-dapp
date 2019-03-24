import store from '../../store'
import Web3 from 'web3'

export const WEB3_INITIALIZED = 'WEB3_INITIALIZED'
function web3Initialized(results) {
  return {
    type: WEB3_INITIALIZED,
    payload: results
  }
}

let getWeb3 = new Promise(function(resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function(dispatch) {
    var results
    var web3 = window.web3
    var isMetaMask

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Confirm MetaMask is being used.
      isMetaMask = web3.currentProvider.isMetaMask;
      if (isMetaMask) {
        console.log("MetaMask is Web3 provider.")
      }

      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider)

      results = {
        web3Instance: web3
      }

      console.log('Injected web3 detected.');

      resolve(store.dispatch(web3Initialized(results)))
    } else {

      // Fallback to localhost if no web3 injection. We've configured this to
      // use the development console's port (9545) or Ganache (8545) by default.
      var provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545')

      web3 = new Web3(provider)

      results = {
        web3Instance: web3
      }

      console.log('No web3 instance injected, using local Web3.');

      resolve(store.dispatch(web3Initialized(results)))
    }
  })
})

export default getWeb3
