import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-gas-reporter";
import "solidity-coverage";

import * as dotenv from "dotenv";

import "./tasks/deploy";
import { NetworkUserConfig } from "hardhat/types/config";

dotenv.config();

const bscTestnet: NetworkUserConfig = {
  url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  chainId: 97,
  accounts: [process.env.TEST_ETH_ACCOUNT_PRIVATE_KEY!],
};

const bscMainnet: NetworkUserConfig = {
  url: "https://bsc-dataseed.binance.org/",
  chainId: 56,
  accounts: [process.env.TEST_ETH_ACCOUNT_PRIVATE_KEY!],
};

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    bscTestnet: bscTestnet,
    bscMainnet: bscMainnet,
    hardhat: {
      mining: {
        auto: true,
        interval: 1000,
      },
      allowUnlimitedContractSize: true,
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.TEST_ETH_ACCOUNT_PRIVATE_KEY !== undefined
          ? [process.env.TEST_ETH_ACCOUNT_PRIVATE_KEY]
          : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
