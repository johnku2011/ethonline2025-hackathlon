import { expect } from "chai";
import hre from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { parseUnits, getAddress } from "viem";

describe("PyUSDSubscription", function () {
  async function deployFixture() {
    const [owner, merchant, subscriber, feeCollector] = await hre.viem.getWalletClients();

    // Deploy mock PyUSD token
    const mockToken = await hre.viem.deployContract("MockERC20", [
      "PayPal USD",
      "PYUSD",
      6n, // 6 decimals like real PyUSD
    ]);

    // Deploy subscription contract
    const subscription = await hre.viem.deployContract("PyUSDSubscription", [
      mockToken.address,
      feeCollector.account.address,
    ]);

    const publicClient = await hre.viem.getPublicClient();

    // Mint tokens to subscriber
    const mintAmount = parseUnits("10000", 6); // 10,000 PYUSD
    await mockToken.write.mint([subscriber.account.address, mintAmount]);

    // Approve subscription contract
    await mockToken.write.approve(
      [subscription.address, mintAmount],
      { account: subscriber.account }
    );

    return {
      subscription,
      mockToken,
      owner,
      merchant,
      subscriber,
      feeCollector,
      publicClient,
    };
  }

  describe("Deployment", function () {
    it("Should set the right PyUSD token", async function () {
      const { subscription, mockToken } = await loadFixture(deployFixture);
      expect(await subscription.read.pyusdToken()).to.equal(getAddress(mockToken.address));
    });

    it("Should set the right fee collector", async function () {
      const { subscription, feeCollector } = await loadFixture(deployFixture);
      expect(await subscription.read.feeCollector()).to.equal(
        getAddress(feeCollector.account.address)
      );
    });

    it("Should set default platform fee to 2.5%", async function () {
      const { subscription } = await loadFixture(deployFixture);
      expect(await subscription.read.platformFeePercent()).to.equal(250n);
    });
  });

  describe("Plan Management", function () {
    it("Should create a new plan", async function () {
      const { subscription, merchant } = await loadFixture(deployFixture);

      const planName = "Premium Plan";
      const amount = parseUnits("10", 6); // 10 PYUSD
      const interval = 30n * 24n * 60n * 60n; // 30 days

      const hash = await subscription.write.createPlan(
        [planName, amount, interval],
        { account: merchant.account }
      );

      const plan = await subscription.read.plans([1n]);
      expect(plan[1]).to.equal(planName); // name
      expect(plan[2]).to.equal(amount); // amount
      expect(plan[3]).to.equal(interval); // interval
      expect(plan[4]).to.equal(true); // active
      expect(plan[5]).to.equal(getAddress(merchant.account.address)); // merchant
    });

    it("Should revert when creating plan with empty name", async function () {
      const { subscription, merchant } = await loadFixture(deployFixture);

      await expect(
        subscription.write.createPlan(
          ["", parseUnits("10", 6), 30n * 24n * 60n * 60n],
          { account: merchant.account }
        )
      ).to.be.rejectedWith("Plan name cannot be empty");
    });

    it("Should update plan by owner", async function () {
      const { subscription, merchant } = await loadFixture(deployFixture);

      await subscription.write.createPlan(
        ["Basic Plan", parseUnits("5", 6), 30n * 24n * 60n * 60n],
        { account: merchant.account }
      );

      const newName = "Updated Plan";
      const newAmount = parseUnits("15", 6);

      await subscription.write.updatePlan(
        [1n, newName, newAmount, true],
        { account: merchant.account }
      );

      const plan = await subscription.read.plans([1n]);
      expect(plan[1]).to.equal(newName);
      expect(plan[2]).to.equal(newAmount);
    });
  });

  describe("Subscriptions", function () {
    it("Should subscribe to a plan", async function () {
      const { subscription, merchant, subscriber, mockToken } =
        await loadFixture(deployFixture);

      const amount = parseUnits("10", 6);
      await subscription.write.createPlan(
        ["Premium Plan", amount, 30n * 24n * 60n * 60n],
        { account: merchant.account }
      );

      const balanceBefore = await mockToken.read.balanceOf([
        subscriber.account.address,
      ]);

      await subscription.write.subscribe([1n], { account: subscriber.account });

      const sub = await subscription.read.subscriptions([1n]);
      expect(sub[0]).to.equal(1n); // planId
      expect(sub[1]).to.equal(getAddress(subscriber.account.address)); // subscriber
      expect(sub[3]).to.be.greaterThan(0n); // active

      const balanceAfter = await mockToken.read.balanceOf([
        subscriber.account.address,
      ]);
      expect(balanceBefore - balanceAfter).to.equal(amount);
    });

    it("Should process recurring payment", async function () {
      const { subscription, merchant, subscriber, mockToken, publicClient } =
        await loadFixture(deployFixture);

      const amount = parseUnits("10", 6);
      const interval = 30n * 24n * 60n * 60n;

      await subscription.write.createPlan(
        ["Premium Plan", amount, interval],
        { account: merchant.account }
      );

      await subscription.write.subscribe([1n], { account: subscriber.account });

      // Fast forward time
      await time.increase(Number(interval));

      const balanceBefore = await mockToken.read.balanceOf([
        subscriber.account.address,
      ]);

      await subscription.write.processPayment([1n]);

      const balanceAfter = await mockToken.read.balanceOf([
        subscriber.account.address,
      ]);
      expect(balanceBefore - balanceAfter).to.equal(amount);
    });

    it("Should cancel subscription", async function () {
      const { subscription, merchant, subscriber } = await loadFixture(
        deployFixture
      );

      await subscription.write.createPlan(
        ["Premium Plan", parseUnits("10", 6), 30n * 24n * 60n * 60n],
        { account: merchant.account }
      );

      await subscription.write.subscribe([1n], { account: subscriber.account });

      await subscription.write.cancelSubscription([1n], {
        account: subscriber.account,
      });

      const sub = await subscription.read.subscriptions([1n]);
      expect(sub[4]).to.equal(false); // active = false
    });
  });

  describe("Fee Management", function () {
    it("Should update platform fee by owner", async function () {
      const { subscription, owner } = await loadFixture(deployFixture);

      await subscription.write.updatePlatformFee([500n], {
        account: owner.account,
      }); // 5%

      expect(await subscription.read.platformFeePercent()).to.equal(500n);
    });

    it("Should not allow fee above 10%", async function () {
      const { subscription, owner } = await loadFixture(deployFixture);

      await expect(
        subscription.write.updatePlatformFee([1001n], { account: owner.account })
      ).to.be.rejectedWith("Fee cannot exceed 10%");
    });
  });
});

