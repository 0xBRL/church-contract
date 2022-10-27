import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import useChurchTestsHook from "../../../hooks/useChurchTestsHook";
import { createWedding } from "../../../helpers/createWeddings";

export default function testApproveWeddings(): void {
  const churchTests = useChurchTestsHook();

  it("Should approve the wedding for the one participant", async function (): Promise<void> {
    const { Wedding, church, alice, bob } = await loadFixture(churchTests);
    const participants = [alice.address, bob.address];
    const id = 0;

    await createWedding({
      church,
      participants,
      owner: alice,
    });

    const weddingAddress = await church.viewWeddingById(id);
    const wedding = Wedding.attach(weddingAddress);

    await expect(await church.connect(alice).approveWedding(id))
      .to.emit(church, "ApproveWedding")
      .withArgs(alice.address, id);

    expect(await wedding.viewApprovals()).to.includes(alice.address);
  });

  it("Should approve the wedding for the all participants", async function (): Promise<void> {
    const { church, alice, bob, Wedding } = await loadFixture(churchTests);
    const participants = [alice.address, bob.address];
    const id = 0;
    await createWedding({
      church,
      participants,
      owner: alice,
    });

    const weddingAddress = await church.viewWeddingById(id);
    const wedding = Wedding.attach(weddingAddress);

    await expect(church.connect(alice).approveWedding(id))
      .to.emit(church, "ApproveWedding")
      .withArgs(alice.address, id);
    await expect(church.connect(bob).approveWedding(id)).to.emit(church, "ApproveWedding").withArgs(bob.address, id);

    expect(await wedding.viewApprovals()).to.eqls(participants);
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
