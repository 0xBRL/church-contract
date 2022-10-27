import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import useChurchTestsHook from "../../../hooks/useChurchTestsHook";
import { ethers } from "hardhat";
import { createWedding } from "../../../helpers/createWeddings";

export default function testCreateWeddings() {
  const churchTests = useChurchTestsHook();

  it("Should create the first wedding", async function (): Promise<void> {
    const { church, alice, bob } = await loadFixture(churchTests);
    const participants = [alice.address, bob.address];
    const id = 0;

    await expect(
      createWedding({
        church,
        participants,
        owner: alice,
        isAsync: true,
      })
    )
      .to.emit(church, "NewWedding")
      .withArgs(alice.address, id);

    expect(await church.viewWeddingsAmount()).to.equal(1);
    expect(await church.viewBalance()).to.equal(ethers.utils.parseEther("0.1"));
  });

  it("Should view the wedding by id", async function (): Promise<void> {
    const { Wedding, church, alice, bob } = await loadFixture(churchTests);
    const participants = [alice.address, bob.address];
    const id = 0;

    await createWedding({
      church,
      participants,
      owner: alice,
      isAsync: true,
    });

    const weddingAddress = await church.viewWeddingById(id);
    const wedding = Wedding.attach(weddingAddress);

    expect(await wedding.viewStatus()).to.equal(1);
    expect(await wedding.viewParticipants()).to.eqls(participants);
  });

  it("Should create the 5 weddings", async function (): Promise<void> {
    const { church, othersAddrs } = await loadFixture(churchTests);

    for (let cursor = 0; cursor < 5; cursor++) {
      const addr1 = othersAddrs[cursor];
      const addr2 = othersAddrs[cursor + 1];

      await expect(
        createWedding({
          church,
          participants: [addr1.address, addr2.address],
          owner: addr1,
          isAsync: true,
        }),
        `create the ${cursor} wedding and check event`
      )
        .to.emit(church, "NewWedding")
        .withArgs(addr1.address, cursor);
    }

    expect(await church.viewBalance()).to.equal(ethers.utils.parseEther("0.1").mul(5));
  });

  it("Should create the weddings with 3 participants", async function (): Promise<void> {
    const { church, alice, bob, carol } = await loadFixture(churchTests);

    await expect(
      createWedding({
        church,
        participants: [alice.address, bob.address, carol.address],
        owner: alice,
        isAsync: true,
      })
    )
      .to.emit(church, "NewWedding")
      .withArgs(alice.address, 0);
  });

  it("Shouldn't create the weddings because same address", async function (): Promise<void> {
    const { church, alice } = await loadFixture(churchTests);

    await expect(
      createWedding({
        church,
        participants: [alice.address, alice.address],
        owner: alice,
        isAsync: true,
      })
    ).to.reverted;
  });

  it("Shouldn't create the wedding because any funds", async function (): Promise<void> {
    const { church, alice, bob, carol } = await loadFixture(churchTests);

    await expect(
      createWedding({
        church,
        participants: [alice.address, bob.address, carol.address],
        owner: alice,
        isAsync: true,
        value: "0",
      })
    ).to.revertedWith("Invalid fee for the create wedding");
  });
}
