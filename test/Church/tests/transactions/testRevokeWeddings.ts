import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import useChurchTestsHook from "../../../hooks/useChurchTestsHook";
import { createWedding } from "../../../helpers/createWeddings";

export default function testRevokeWeddings() {
  const churchTests = useChurchTestsHook();

  it("Should revoke the wedding", async function (): Promise<void> {
    const { church, alice, bob } = await loadFixture(churchTests);
    await createWedding({
      church,
      participants: [alice.address, bob.address],
      owner: alice,
    });

    const id = 0;
    await church.connect(alice).approveWedding(id);
    await church.connect(bob).approveWedding(id);

    await expect(await church.connect(alice).revokeWedding(id))
      .to.emit(church, "RevokeWedding")
      .withArgs(alice.address, id);
    await expect(await church.connect(bob).revokeWedding(id))
      .to.emit(church, "RevokeWedding")
      .withArgs(bob.address, id);
  });

  it("Should not revoke as it has not been approved", async function (): Promise<void> {
    const { church, alice, bob } = await loadFixture(churchTests);
    await createWedding({
      church,
      participants: [alice.address, bob.address],
      owner: alice,
    });

    const id = 0;
    await church.connect(alice).approveWedding(id);
    await expect(church.connect(bob).revokeWedding(id)).to.be.revertedWith("Only approved");
  });

  it("Should not revoke as not participant", async function (): Promise<void> {
    const { church, alice, bob, carol, david } = await loadFixture(churchTests);
    await createWedding({
      church,
      participants: [alice.address, bob.address],
      owner: carol,
    });
    const id = 0;
    await church.connect(alice).approveWedding(id);
    await church.connect(bob).approveWedding(id);

    await expect(church.connect(carol).revokeWedding(id)).to.be.revertedWith("Only participants");
    await expect(church.connect(david).revokeWedding(id)).to.be.revertedWith("Only participants");
  });

  it("Shouldn't revoke as it has already been revoked", async function (): Promise<void> {
    const { church, alice, bob } = await loadFixture(churchTests);
    await createWedding({
      church,
      participants: [alice.address, bob.address],
      owner: alice,
    });
    const id = 0;
    await church.connect(alice).approveWedding(id);
    await church.connect(bob).approveWedding(id);

    await church.connect(alice).revokeWedding(id);
    await expect(church.connect(alice).revokeWedding(id)).to.be.revertedWith("Already revoked");
  });

  it("Shouldn't revoke as invalid id", async function (): Promise<void> {
    const { church, alice, bob } = await loadFixture(churchTests);
    await createWedding({
      church,
      participants: [alice.address, bob.address],
      owner: alice,
    });
    const id = 0;
    await church.connect(alice).approveWedding(id);
    await church.connect(bob).approveWedding(id);

    await expect(church.connect(alice).revokeWedding(id + 1)).to.be.revertedWith("Invalid wedding id");
  });
}
