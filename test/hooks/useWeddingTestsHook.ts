import { ethers } from "hardhat";

function useWeddingTestsHook() {
  const loadWeddingFixture = async () => {
    const [owner, alice, bob, carol, david, erin, ...othersAddrs] = await ethers.getSigners();

    const Wedding = await ethers.getContractFactory("Wedding");

    const signers = {
      owner,
      alice,
      bob,
      carol,
      david,
      erin,
      othersAddrs,
    };
    const factories = {
      Wedding,
    };
    return {
      factories,
      signers,
    };
  };

  return {
    loadWeddingFixture,
  };
}

export default useWeddingTestsHook;
