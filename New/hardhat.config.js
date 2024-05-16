require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: "https://rpc.ankr.com/core",
      },
    },
    testnet: {
      url: "https://rpc.test.btcs.network/",
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      url: "https://rpc.coredao.org/",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      testnet: process.env.TESTNET_API_KEY,
      mainnet: process.env.MAINNET_API_KEY
    },
    customChains: [
      {
        network: "testnet",
        chainId: 1115,
        urls: {
          apiURL: "https://api.test.btcs.network/api",
          browserURL: "https://scan.test.btcs.network/"
        }
      },
       {
        network: "mainnet",
        chainId: 1116,
        urls: {
          apiURL: "https://openapi.coredao.org/api",
          browserURL: "https://scan.coredao.org/"
        }
      }
    ]
  },
  solidity: {
    version: "0.8.13",
    settings: {
        optimizer: {
            enabled: true,
            runs: 100,
        },
    },
  },
};