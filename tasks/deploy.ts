/* eslint-disable no-console */
import "@nomiclabs/hardhat-waffle";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("deploy", "Deploy Contracts").setAction(async (_, hre: HardhatRuntimeEnvironment): Promise<void> => {
  try {
    const FEE = hre.ethers.utils.parseEther("0.5");
    if (process.env.TEST_ACCOUNT_PUBLIC_KEY === undefined) {
      throw "TEST_ACCOUNT_PUBLIC_KEY not found";
    }

    const owner = await hre.ethers.getSigner(process.env.TEST_ACCOUNT_PUBLIC_KEY);

    const Church = await hre.ethers.getContractFactory("Church");
    const church = await Church.connect(owner).deploy(FEE);
    await church.deployed();
    console.info(
      `✅ Deployed the Church: ${JSON.stringify({
        address: church.address,
      })}`
    );
    return;
  } catch (error) {
    console.error(`❌ Deploy error: ${JSON.stringify(error)}`);
  }
});
