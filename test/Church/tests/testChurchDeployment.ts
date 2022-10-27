import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import useChurchTestsHook from "../../hooks/useChurchTestsHook";

export default function testChurchDeployment() {
  const { deployChurchFixture } = useChurchTestsHook();

  it("Should set the right owner", async function (): Promise<void> {
    const { church, owner } = await loadFixture(deployChurchFixture);
    expect(await church.owner()).to.equal(owner.address);
  });

  it("Should set balance to 0", async function (): Promise<void> {
    const { church } = await loadFixture(deployChurchFixture);
    expect(
      await church.viewBalance(),
      "check the init balance after deploy of the contract"
    ).to.equal(0);
  });

  it("Should set weddings list to empty", async function (): Promise<void> {
    const { church } = await loadFixture(deployChurchFixture);
    expect(
      await church.viewWeddingsAmount(),
      "check the weddings length after deploy of the contract"
    ).to.equal(0);
  });
}
