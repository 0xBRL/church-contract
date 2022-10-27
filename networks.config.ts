import * as dotenv from "dotenv";
import { NetworkUserConfig } from "hardhat/types";

dotenv.config();

const ACCOUNTS = process.env.TEST_ACCOUNT_PRIVATE_KEY !== undefined ? [process.env.TEST_ACCOUNT_PRIVATE_KEY] : [];

export const BSC_TESTNET: NetworkUserConfig = {
  url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  chainId: 97,
  accounts: ACCOUNTS,
};

export const BSC_MAINNET: NetworkUserConfig = {
  url: "https://bsc-dataseed.binance.org/",
  chainId: 56,
  accounts: ACCOUNTS,
};
