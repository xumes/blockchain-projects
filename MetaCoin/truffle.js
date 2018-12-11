const HDWalletProvider = require("truffle-hdwallet-provider-privkey");

const privateKeyRopsten = "9c4b755443df4c2af4adae960d2f7f45a97f254625a1db2cdf8aab4fe4ce47df";
const providerRopsten = new HDWalletProvider(privateKeyRopsten, 'https://ropsten.infura.io/Vt8oXDOhHB8dMP5oyasr')

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      network_id: 3, // official id of the ropsten network
      gasPrice: 4000000000, //(wei = 4 gwei) Default is 100000000000 (100 Shannon/gwei)
      gas: 4600000, //Default is 4712388
      provider: providerRopsten
    }
  }
};
