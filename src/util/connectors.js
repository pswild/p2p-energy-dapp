import { Connect } from 'uport-connect'

export let uport = new Connect('Peer-To-Peer Energy Trading')
export const web3 = uport.getWeb3()
