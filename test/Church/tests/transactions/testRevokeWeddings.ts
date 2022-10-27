import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import useChurchTestsHook from "../../../hooks/useChurchTestsHook";

export default function testRevokeWeddings() {
  const { deployChurchFixture, createWedding } = useChurchTestsHook();

  it("Should revoke the wedding", async function (): Promise<void> {
    const { church, addr1, addr2 } = await loadFixture(deployChurchFixture);
    await createWedding({
      church,
      participants: [addr1.address, addr2.address],
      owner: addr1,
    });

    const id = 0;
    await church.connect(addr1).approveWedding(id);
    await church.connect(addr2).approveWedding(id);

    await expect(await church.connect(addr1).revokeWedding(id))
      .to.emit(church, "RevokeWedding")
      .withArgs(addr1.address, id);
    await expect(await church.connect(addr2).revokeWedding(id))
      .to.emit(church, "RevokeWedding")
      .withArgs(addr2.address, id);
  });

  it("Should not revoke as it has not been approved", async function (): Promise<void> {
    const { church, addr1, addr2 } = await loadFixture(deployChurchFixture);
    await createWedding({
      church,
      participants: [addr1.address, addr2.address],
      owner: addr1,
    });

    const id = 0;
    await church.connect(addr1).approveWedding(id);
    await expect(church.connect(addr2).revokeWedding(id)).to.be.revertedWith("Only approved");
  });

  it("Should not revoke as not participant", async function (): Promise<void> {
    const { church, addr1, addr2, addr3, addr4 } = await loadFixture(deployChurchFixture);
    await createWedding({
      church,
      participants: [addr1.address, addr2.address],
      owner: addr3,
    });
    const id = 0;
    await church.connect(addr1).approveWedding(id);
    await church.connect(addr2).approveWedding(id);

    await expect(church.connect(addr3).revokeWedding(id)).to.be.revertedWith("Only participants");
    await expect(church.connect(addr4).revokeWedding(id)).to.be.revertedWith("Only participants");
  });

  it("Shouldn't revoke as it has already been revoked", async function (): Promise<void> {
    const { church, addr1, addr2 } = await loadFixture(deployChurchFixture);
    await createWedding({
      church,
      participants: [addr1.address, addr2.address],
      owner: addr1,
    });
    const id = 0;
    await church.connect(addr1).approveWedding(id);
    await church.connect(addr2).approveWedding(id);

    await church.connect(addr1).revokeWedding(id);
    await expect(church.connect(addr1).revokeWedding(id)).to.be.revertedWith("Already revoked");
  });

  it("Shouldn't revoke as invalid id", async function (): Promise<void> {
    const { church, addr1, addr2 } = await loadFixture(deployChurchFixture);
    await createWedding({
      church,
      participants: [addr1.address, addr2.address],
      owner: addr1,
    });
    const id = 0;
    await church.connect(addr1).approveWedding(id);
    await church.connect(addr2).approveWedding(id);

    await expect(church.connect(addr1).revokeWedding(id + 1)).to.be.revertedWith("Invalid wedding id");
  });
}
