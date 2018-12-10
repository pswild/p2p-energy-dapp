module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  // Network configuration: see Truffle documentation for details.
  networks: {
    // To deploy to the Ganache network, issue the following terminal command:
    // $ truffle migrate --network ganache
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any ID
    },

    // Both Ropsten and Rinkeby require the "geth" commandline interface.

    // To deploy to the Ropsten network, issue the following terminal command:
    // $ truffle migrate --network ropsten
    ropsten: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 3 // Ropsten ID
    },
    // To deploy to the Rinkeby network, issue the following terminal command:
    // $ truffle migrate --network rinkeby
    rinkeby: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 4
    }
  }
};
