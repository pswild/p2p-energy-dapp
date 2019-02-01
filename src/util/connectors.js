import { Connect, SimpleSigner } from 'uport-connect'

// Connect to the uPort application.
export let uport = new Connect('Peer-To-Peer Energy Trading', {
  clientId: '2oqQV3BHyHrfVkQRVY2XDgrb2XCAXPZkjxm',
  network: 'rinkeby',
  signer: SimpleSigner('205b82a20c9433c384c8ab219cead9aac4eee82c3059e1675ac2fb6c26b03519')
})
export const web3 = uport.getWeb3()