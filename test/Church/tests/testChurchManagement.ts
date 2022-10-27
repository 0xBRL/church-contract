import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import useChurchTestsHook from "../../hooks/useChurchTestsHook";
import { ethers } from "hardhat";
import { createWedding, createWeddings } from "../../helpers/createWeddings";

function testChurchManagementFee() {
  const churchTests = useChurchTestsHook();

  it("Should change fee for the one ether", async function (): Promise<void> {
    const { church, owner, alice, STARTING_FEE } = await loadFixture(churchTests);
    const newFee = ethers.utils.parseEther("1");

    expect(await church.connect(alice).viewFee()).to.equal(STARTING_FEE);
    await (await church.connect(owner).setFee(newFee)).wait();
    expect(await church.connect(owner).viewFee()).to.equal(newFee);
  });

  it("Should order with the new fee", async function (): Promise<void> {
    const { church, owner, alice, bob } = await loadFixture(churchTests);
    const participants = [alice.address, bob.address];
    const newFee = ethers.utils.parseEther("1");

    await (await church.connect(owner).setFee(newFee)).wait();

    await createWedding({
      church,
      participants,
      owner: alice,
      isAsync: true,
      value: "1",
    });

    expect(await church.connect(alice).viewBalance()).to.equal(newFee);
  });

  it("Should change fee for the zero ether", async function (): Promise<void> {
    const { church, owner, alice, bob } = await loadFixture(churchTests);
    const participants = [alice.address, bob.address];
    const newFee = ethers.utils.parseEther("0");

    await (await church.connect(owner).setFee(newFee)).wait();
    expect(await church.connect(alice).viewFee()).to.equal(newFee);

    await createWedding({
      church,
      participants,
      owner,
      isAsync: true,
      value: "0",
    });

    expect(await church.connect(alice).viewBalance()).to.equal(newFee);
  });

  it("Shouldn't change fee because don't owner", async function (): Promise<void> {
    const { church, alice } = await loadFixture(churchTests);
    const oldFee = ethers.utils.parseEther("0.1");
    const newFee = ethers.utils.parseEther("1");

    await expect(church.connect(alice).setFee(newFee)).to.revertedWith("Ownable: caller is not the owner");
    expect(await church.connect(alice).viewFee()).to.equal(oldFee);
  });
}

function testChurchManagementBalance() {
  const churchTests = useChurchTestsHook();

  it("Should create 5 weddings with 'fee = 0.025 ETHER'", async function (): Promise<void> {
    const { church, owner, othersAddrs } = await loadFixture(churchTests);
    const amount = 5;
    const newFee = ethers.utils.parseEther("0.025");

    await (await church.connect(owner).setFee(newFee)).wait();

    await createWeddings({
      church,
      addrs: othersAddrs,
      amount: amount,
      isAsync: true,
      value: "0.025",
    });

    expect(await church.viewBalance()).to.equal(newFee.mul(amount));
  });

  it("Should transfer balance for owner", async function (): Promise<void> {
    const { church, owner, othersAddrs } = await loadFixture(churchTests);
    const amount = 5;
    const newValue = "0.025";
    const newFee = ethers.utils.parseEther(newValue);
    await (await church.connect(owner).setFee(newFee)).wait();

    await createWeddings({
      church,
      addrs: othersAddrs,
      amount: amount,
      isAsync: true,
      value: newValue,
    });

    const oldBalance = await owner.getBalance();
    const transaction = await church.connect(owner).transferBalanceForOwner();
    const receipt = await transaction.wait();
    const gasSpent = receipt.gasUsed.mul(receipt.effectiveGasPrice);

    expect(await owner.getBalance()).to.equal(oldBalance.sub(gasSpent).add(newFee.mul(amount)));
    expect(await church.viewBalance()).to.equal(0);
  });

  it("Should transfer balance is zero for owner", async function (): Promise<void> {
    const { church, owner } = await loadFixture(churchTests);
    const amount = 0;
    const newFee = ethers.utils.parseEther("0.025");
    await (await church.connect(owner).setFee(newFee)).wait();

    const oldBalance = await owner.getBalance();
    const transaction = await church.connect(owner).transferBalanceForOwner();
    const receipt = await transaction.wait();
    const gasSpent = receipt.gasUsed.mul(receipt.effectiveGasPrice);

    expect(await owner.getBalance()).to.equal(oldBalance.sub(gasSpent).add(newFee.mul(amount)));
    expect(await church.viewBalance()).to.equal(0);
  });

  it("Shouldn't transfer balance because not owner", async function (): Promise<void> {
    const { church, alice, othersAddrs } = await loadFixture(churchTests);
    const amount = 2;

    await createWeddings({
      church,
      addrs: othersAddrs,
      amount: amount,
      isAsync: true,
    });

    await expect(church.connect(alice).transferBalanceForOwner()).to.revertedWith("Ownable: caller is not the owner");
  });
}

export default function testChurchManagement() {
  describe("💸 Fees", testChurchManagementFee);
  describe("🍯 Balance", testChurchManagementBalance);
}
