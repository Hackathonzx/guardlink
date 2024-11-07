const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DelegateGuard - Social Recovery and Backup Delegation Service", function () {
  let DelegateSetup, delegateSetup;
  let RecoveryProcess, recoveryProcess;
  let SecurityLayer, securityLayer;
  let owner, delegate1, delegate2, user;

  before(async function () {
    [owner, delegate1, delegate2, user] = await ethers.getSigners();

    // Deploy DelegateSetup contract
    DelegateSetup = await ethers.getContractFactory("DelegateSetup");
    delegateSetup = await DelegateSetup.deploy();
    await delegateSetup.deployed();

    // Deploy RecoveryProcess contract
    RecoveryProcess = await ethers.getContractFactory("RecoveryProcess");
    recoveryProcess = await RecoveryProcess.deploy(delegateSetup.address);
    await recoveryProcess.deployed();

    // Deploy SecurityLayer contract
    SecurityLayer = await ethers.getContractFactory("SecurityLayer");
    securityLayer = await SecurityLayer.deploy();
    await securityLayer.deployed();
  });

  describe("DelegateSetup", function () {
    it("should add a delegate", async function () {
      await delegateSetup.connect(owner).addDelegate(delegate1.address);
      const isDelegate = await delegateSetup.isDelegate(delegate1.address);
      expect(isDelegate).to.equal(true);
    });

    it("should not add a duplicate delegate", async function () {
      await expect(delegateSetup.connect(owner).addDelegate(delegate1.address)).to.be.revertedWith("Delegate already exists");
    });

    it("should remove a delegate", async function () {
      await delegateSetup.connect(owner).removeDelegate(delegate1.address);
      const isDelegate = await delegateSetup.isDelegate(delegate1.address);
      expect(isDelegate).to.equal(false);
    });
  });

  describe("RecoveryProcess", function () {
    before(async function () {
      // Re-add delegate for testing recovery process
      await delegateSetup.connect(owner).addDelegate(delegate1.address);
    });

    it("should initialize the recovery process", async function () {
      await recoveryProcess.connect(delegate1).initiateRecovery(user.address);
      const recoveryStatus = await recoveryProcess.getRecoveryStatus(user.address);
      expect(recoveryStatus).to.equal("Pending");
    });

    it("should complete the recovery process with delegate approval", async function () {
      await recoveryProcess.connect(delegate1).approveRecovery(user.address);
      const recoveryStatus = await recoveryProcess.getRecoveryStatus(user.address);
      expect(recoveryStatus).to.equal("Approved");
    });

    it("should not allow non-delegates to initiate recovery", async function () {
      await expect(recoveryProcess.connect(user).initiateRecovery(user.address)).to.be.revertedWith("Not a delegate");
    });
  });

  describe("SecurityLayer", function () {
    it("should verify the multi-signature requirement", async function () {
      // Simulating a multi-signature authorization check
      const authorized = await securityLayer.verifyMultiSig([delegate1.address, delegate2.address], user.address);
      expect(authorized).to.equal(true);
    });

    it("should enforce security policies during recovery", async function () {
      // Assuming a security check for recovery
      await securityLayer.enforceSecurityPolicy(user.address);
      const policyStatus = await securityLayer.isPolicyEnforced(user.address);
      expect(policyStatus).to.equal(true);
    });
  });

  describe("Integration Test", function () {
    it("should complete the end-to-end recovery process", async function () {
      // Adding a second delegate
      await delegateSetup.connect(owner).addDelegate(delegate2.address);

      // Initiating and approving recovery by both delegates
      await recoveryProcess.connect(delegate1).initiateRecovery(user.address);
      await recoveryProcess.connect(delegate2).approveRecovery(user.address);

      // Final check
      const recoveryStatus = await recoveryProcess.getRecoveryStatus(user.address);
      expect(recoveryStatus).to.equal("Approved");

      // Security policy check
      const policyStatus = await securityLayer.isPolicyEnforced(user.address);
      expect(policyStatus).to.equal(true);
    });
  });
});
