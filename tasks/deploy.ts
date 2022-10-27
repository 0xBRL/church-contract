import "@nomiclabs/hardhat-waffle";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

function consoleInfo(contract: any, id: string) {
  console.info(
    `✅ Deployed the ${id}: ${JSON.stringify({
      address: contract.address,
      owner: contract.signer.address,
    })}`
  );
}

task("deploy", "Deploy Contracts").setAction(
  async (_, hre: HardhatRuntimeEnvironment): Promise<void> => {
    try {
      const FEE = hre.ethers.utils.parseEther('0.5')
      if (process.env.TEST_ETH_ACCOUNT_PUBLIC_KEY === undefined) {
        throw "TEST_ETH_ACCOUNT_PUBLIC_KEY not found";
      }

      const owner = await hre.ethers.getSigner(
        process.env.TEST_ETH_ACCOUNT_PUBLIC_KEY
      );

      const Church = await hre.ethers.getContractFactory("Church");
      const church = await Church.connect(owner).deploy(FEE);
      await church.deployed();
      consoleInfo(church, "Church");
      return;
    } catch (error) {
      console.error(`❌ Deploy error: ${JSON.stringify(error)}`);
    }
  }
);
