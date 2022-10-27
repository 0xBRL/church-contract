import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import useChurchTestsHook from "../../../hooks/useChurchTestsHook";

export default function testDonate(): void {
  const churchTests = useChurchTestsHook();

  it("Should receive donation", async function (): Promise<void> {
    const { church, alice } = await loadFixture(churchTests);

    const value = ethers.utils.parseEther(Math.random().toString());

    await expect(
      church.connect(alice).donate({
        value,
      })
    )
      .to.emit(church, "NewDonation")
      .withArgs(alice.address, value.toString());

    expect(await church.viewBalance()).to.equal(value);
  });

  it("Should receive donations and transfer the balance for the owner", async function (): Promise<void> {
    const { church, owner, othersAddrs } = await loadFixture(churchTests);

    let donation = BigNumber.from(0);
    for (let cursor = 0; cursor < 10; cursor++) {
      const donor = othersAddrs[cursor];
      const value = ethers.utils.parseEther(Math.random().toString());

      await expect(
        church.connect(donor).donate({
          value,
        })
      )
        .to.emit(church, "NewDonation")
        .withArgs(donor.address, value.toString());

      donation = donation.add(value);
    }

    const oldBalance = await owner.getBalance();
    const transaction = await church.connect(owner).transferBalanceForOwner();
    const receipt = await transaction.wait();
    const gasSpent = receipt.gasUsed.mul(receipt.effectiveGasPrice);

    expect(await owner.getBalance()).to.equal(oldBalance.sub(gasSpent).add(donation));
    expect(await church.viewBalance()).to.equal(0);
  });

  it("Shouldn't receive donation because value is 0", async function (): Promise<void> {
    const { church, alice } = await loadFixture(churchTests);

    await expect(
      church.connect(alice).donate({
        value: "0",
      })
    ).to.revertedWith("Amount donated equal to or below 0");
  });
}
