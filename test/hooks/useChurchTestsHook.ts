import { ethers } from "hardhat";
import { createWedding, createWeddings } from "../helpers/createWeddings";

function useChurchTestsHook() {
  const STARTING_FEE = ethers.utils.parseEther("0.1");

  const deployChurchFixture = async () => {
    const [owner, alice, bob, carol, david, erin, addr1, addr2, addr3, addr4, ...othersAddrs] =
      await ethers.getSigners();

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
      addr1,
      addr2,
      addr3,
      addr4,
      othersAddrs,
      STARTING_FEE,
    };
  };

  return {
    deployChurchFixture,

    createWedding,
    createWeddings,
  };
}

export default useChurchTestsHook;
