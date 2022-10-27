import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";

import { Church } from "../../../typechain-types/Church.sol/Church";

interface WeddingsConfig {
  isAsync?: boolean;
}

interface CreateWeddingConfigInner {
  church: Church;
  participants: string[];
  owner: any;
  value?: string;
}
interface CreateWeddingConfig
  extends WeddingsConfig,
    CreateWeddingConfigInner {}

interface CreateWeddingsConfigInner {
  church: Church;
  addrs: SignerWithAddress[];
  amount: number;
}
interface CreateWeddingsConfig
  extends WeddingsConfig,
    CreateWeddingsConfigInner {}

function createWeddingAsync({
  church,
  participants,
  owner,
  value = "0.1",
}: CreateWeddingConfigInner) {
  return church.connect(owner).createWedding(participants, {
    value: ethers.utils.parseEther(value),
  });
}

async function createWeddingSync(config: CreateWeddingConfigInner) {
  const contractTransaction = await createWeddingAsync(config);
  const contractReceipt = await contractTransaction.wait();
  return contractReceipt;
}

async function createWeddingsAsync({
  church,
  addrs,
  amount,
  ...configs
}: CreateWeddingsConfigInner) {
  const contracts = [];
  let addrCursor = 0;
  for (let cursor = 0; cursor < amount; cursor++) {
    if (addrCursor >= addrs.length) {
      addrCursor = 0;
    }
    const addr1 = addrs[addrCursor];
    const addr2 = addrs[addrCursor + 1];

    contracts.push(
      await createWeddingAsync({
        church,
        participants: [addr1.address, addr2.address],
        owner: Math.random() > 0.5 ? addr1 : addr2,
        ...configs,
      })
    );
  }

  return contracts;
}

function createWeddingsSync({
  church,
  addrs,
  amount,
}: CreateWeddingsConfigInner) {
  const contracts = [];
  for (let cursor = 0; cursor < amount; cursor++) {
    const addr1 = addrs[Math.floor(Math.random() * addrs.length)];
    const addr2 = addrs[Math.floor(Math.random() * addrs.length)];

    const contractReceipt = createWeddingSync({
      church,
      participants: [addr1.address, addr2.address],
      owner: Math.random() > 0.5 ? addr1 : addr2,
    });

    contracts.push(
      contractReceipt
    );
  }

  return contracts;
}

export const createWedding = (config: CreateWeddingConfig) =>
  config.isAsync ? createWeddingAsync(config) : createWeddingSync(config);

export const createWeddings = (config: CreateWeddingsConfig) =>
  config.isAsync ? createWeddingsAsync(config) : createWeddingsSync(config);
