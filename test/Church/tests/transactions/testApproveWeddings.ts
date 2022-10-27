import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import useChurchTestsHook from "../../../hooks/useChurchTestsHook";
import { createWedding } from "../../../helpers/createWeddings";

export default function testApproveWeddings() {
  const churchTests = useChurchTestsHook();

  it("Should approve the wedding for the one participant", async function (): Promise<void> {
    const { church, alice, bob } = await loadFixture(churchTests);
    await createWedding({
      church,
      participants: [alice.address, bob.address],
      owner: alice,
    });

    const id = 0;
    await expect(await church.connect(alice).approveWedding(id))
      .to.emit(church, "ApproveWedding")
      .withArgs(alice.address, id);
  });

  it("Should approve the wedding for the all participants", async function (): Promise<void> {
    const { church, alice, bob } = await loadFixture(churchTests);
    await createWedding({
      church,
      participants: [alice.address, bob.address],
      owner: alice,
    });

    const id = 0;
    await expect(church.connect(alice).approveWedding(id))
      .to.emit(church, "ApproveWedding")
      .withArgs(alice.address, id);
    await expect(church.connect(bob).approveWedding(id)).to.emit(church, "ApproveWedding").withArgs(bob.address, id);
  });

  it("Should not approve the wedding", async function (): Promise<void> {
    const { church, alice, bob, carol } = await loadFixture(churchTests);
    await createWedding({
      church,
      participants: [alice.address, bob.address],
      owner: alice,
    });

    const id = 0;
    await expect(
      church.connect(carol).approveWedding(id),
      "check the don't approve the wedding of the others participants"
    ).to.be.reverted;
  });

  it("Should change balance after create weddings", async function (): Promise<void> {
    const { church, alice, bob, carol } = await loadFixture(churchTests);
    await createWedding({
      church,
      participants: [alice.address, bob.address],
      owner: alice,
    });

    const id = 0;
    await expect(
      church.connect(carol).approveWedding(id),
      "check the don't approve the wedding of the others participants"
    ).to.be.reverted;
  });

  it("Shouldn't approve as invalid id", async function (): Promise<void> {
    const { church, alice, bob } = await loadFixture(churchTests);
    await createWedding({
      church,
      participants: [alice.address, bob.address],
      owner: alice,
    });
    const id = 0;
    await expect(church.connect(alice).approveWedding(id + 1)).to.be.revertedWith("Invalid wedding id");
  });
}
