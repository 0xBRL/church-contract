import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-gas-reporter";
import "solidity-coverage";

import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types/config";

import * as dotenv from "dotenv";

import "./tasks/deploy";

dotenv.config();

const BSC_TESTNET: NetworkUserConfig = {
  url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  chainId: 97,
  accounts: [process.env.TEST_ACCOUNT_PRIVATE_KEY!],
};

const BSC_MAINNET: NetworkUserConfig = {
  url: "https://bsc-dataseed.binance.org/",
  chainId: 56,
  accounts: [process.env.TEST_ACCOUNT_PRIVATE_KEY!],
};

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    hardhat: {},
    bscTestnet: BSC_TESTNET,
    bscMainnet: BSC_MAINNET,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
