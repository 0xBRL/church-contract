import testChurchDeployment from "./tests/testChurchDeployment";
import testChurchManagement from "./tests/testChurchManagement";
import testApproveWeddings from "./tests/transactions/testApproveWeddings";
import testCreateWeddings from "./tests/transactions/testCreateWeddings";
import testDonate from "./tests/transactions/testDonate";
import testRevokeWeddings from "./tests/transactions/testRevokeWeddings";

function testChurch(this: Mocha.Suite) {
  describe("🛠 Deployment", testChurchDeployment);

  describe("👀 Management", testChurchManagement);

  describe("🚗 Transactions", function () {
    describe("💍 Create weddings", testCreateWeddings);
    describe("🤝 Approve weddings", testApproveWeddings);
    describe("💔 Revoke weddings", testRevokeWeddings);
    describe("🙌 Donate of the Church", testDonate);
  });
}

describe("💒 Church", testChurch);
