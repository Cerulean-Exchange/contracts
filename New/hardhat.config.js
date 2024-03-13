require("@nomicfoundation/hardhat-toolbox");
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
  solidity: {
    version: "0.8.13",
    settings: {
        optimizer: {
            enabled: true,
            runs: 200,
        },
    },
  },
};