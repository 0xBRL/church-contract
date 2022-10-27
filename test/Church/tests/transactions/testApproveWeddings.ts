import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import useChurchTestsHook from "../../../hooks/useChurchTestsHook";

export default function testApproveWeddings() {
  const { deployChurchFixture, createWedding } = useChurchTestsHook();

  it("Should approve the wedding for the one participant", async function (): Promise<void> {
    const { church, addr1, addr2 } = await loadFixture(deployChurchFixture);
    await createWedding({
      church,
      participants: [addr1.address, addr2.address],
      owner: addr1,
    });

    const id = 0;
    await expect(await church.connect(addr1).approveWedding(id))
      .to.emit(church, "ApproveWedding")
      .withArgs(addr1.address, id);
  });

  it("Should approve the wedding for the all participants", async function (): Promise<void> {
    const { church, addr1, addr2 } = await loadFixture(deployChurchFixture);
    await createWedding({
      church,
      participants: [addr1.address, addr2.address],
      owner: addr1,
    });

    const id = 0;
    await expect(church.connect(addr1).approveWedding(id))
      .to.emit(church, "ApproveWedding")
      .withArgs(addr1.address, id);
    await expect(church.connect(addr2).approveWedding(id))
      .to.emit(church, "ApproveWedding")
      .withArgs(addr2.address, id);
  });

  it("Should not approve the wedding", async function (): Promise<void> {
    const { church, addr1, addr2, addr3, addr4 } = await loadFixture(
      deployChurchFixture
    );
    await createWedding({
      church,
      participants: [addr1.address, addr2.address],
      owner: addr1,
    });

    const id = 0;
    await expect(
      church.connect(addr3).approveWedding(id),
      "check the don't approve the wedding of the others participants"
    ).to.be.reverted;
  });

  it("Should change balance after create weddings", async function (): Promise<void> {
    const { church, addr1, addr2, addr3, addr4 } = await loadFixture(
      deployChurchFixture
    );
    await createWedding({
      church,
      participants: [addr1.address, addr2.address],
      owner: addr1,
    });

    const id = 0;
    await expect(
      church.connect(addr3).approveWedding(id),
      "check the don't approve the wedding of the others participants"
    ).to.be.reverted;
  });

  it("Shouldn't approve as invalid id", async function (): Promise<void> {
    const { church, addr1, addr2 } = await loadFixture(deployChurchFixture);
    await createWedding({
      church,
      participants: [addr1.address, addr2.address],
      owner: addr1,
    });
    const id = 0;
    await expect(
      church.connect(addr1).approveWedding(id + 1)
    ).to.be.revertedWith("Invalid wedding id");
  });
}
