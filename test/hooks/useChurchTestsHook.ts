import { ethers } from "hardhat";

function useChurchTestsHook() {
  const STARTING_FEE = ethers.utils.parseEther("0.1");

  const deployChurchFixture = async () => {
    const [owner, alice, bob, carol, david, erin, ...othersAddrs] = await ethers.getSigners();

    const Wedding = await ethers.getContractFactory("Wedding");
    const Church = await ethers.getContractFactory("Church");
    const church = await Church.connect(owner).deploy(STARTING_FEE);
    await church.deployed();
    return {
      Wedding,
      Church,
      church,
      owner,
      alice,
      bob,
      carol,
      david,
      erin,
      othersAddrs,
      STARTING_FEE,
    };
  };

  return deployChurchFixture;
}

export default useChurchTestsHook;
