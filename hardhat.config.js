require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: "0.8.9",
     defaultNetwork: "matic",
     networks: {
        hardhat: {},
        matic: {
           url: "https://rpc-mumbai.maticvigil.com",
           accounts: [process.env.REACT_APP_PRIVATE_KEY]
        }
     },
  etherscan: {
    apiKey: process.env.REACT_APP_ETHERSCAN_KEY
  }
};