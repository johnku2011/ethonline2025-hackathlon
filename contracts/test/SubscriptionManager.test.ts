import { expect } from "chai";
import hre from "hardhat";
import { parseUnits, getAddress } from "viem";

describe("SubscriptionManager", function () {
  let fixtures: Awaited<ReturnType<typeof deployFixture>>;

  async function deployFixture() {
    const connection = await hre.network.connect();
    const [owner, provider, subscriber, feeCollector] = await connection.viem.getWalletClients();

    // Deploy mock PyUSD token (6 decimals)
    const mockToken = await connection.viem.deployContract("MockERC20", [
      "PayPal USD",
      "PYUSD",
      6n,
    ]);

    // Deploy mock Morpho vault
    const mockVault = await connection.viem.deployContract("MockMorphoVault", [
      mockToken.address,
    ]);

    // Deploy SubscriptionManager
    const subscriptionManager = await connection.viem.deployContract("SubscriptionManager", [
      mockToken.address,
      mockVault.address,
      feeCollector.account.address,
    ]);

    const publicClient = await connection.viem.getPublicClient();

    // Mint tokens to subscriber (10,000 PYUSD)
    const mintAmount = parseUnits("10000", 6);
    await mockToken.write.mint([subscriber.account.address, mintAmount]);

    // Approve subscription contract
    await mockToken.write.approve(
      [subscriptionManager.address, mintAmount],
      { account: subscriber.account }
    );

    return {
      subscriptionManager,
      mockToken,
      mockVault,
      owner,
      provider,
      subscriber,
      feeCollector,
      publicClient,
    };
  }

  beforeEach(async function () {
    fixtures = await deployFixture();
  });

  describe("Deployment", function () {
    it("Should set the correct PyUSD token", async function () {
      const { subscriptionManager, mockToken } = fixtures;
      expect(await subscriptionManager.read.pyusdToken()).to.equal(
        getAddress(mockToken.address)
      );
    });

    it("Should set the correct Morpho vault", async function () {
      const { subscriptionManager, mockVault } = fixtures;
      expect(await subscriptionManager.read.morphoVault()).to.equal(
        getAddress(mockVault.address)
      );
    });

    it("Should set the correct fee collector", async function () {
      const { subscriptionManager, feeCollector } = fixtures;
      expect(await subscriptionManager.read.feeCollector()).to.equal(
        getAddress(feeCollector.account.address)
      );
    });

    it("Should set default platform fee to 2.5%", async function () {
      const { subscriptionManager } = fixtures;
      expect(await subscriptionManager.read.platformFeePercent()).to.equal(250n);
    });

    it("Should initialize counters to zero", async function () {
      const { subscriptionManager } = fixtures;
      expect(await subscriptionManager.read.nextPlanId()).to.equal(1n);
      expect(await subscriptionManager.read.nextSubscriptionId()).to.equal(1n);
    });
  });

  describe("Plan Creation", function () {
    it("Should create a new subscription plan", async function () {
      const { subscriptionManager, provider } = fixtures;

      const yearlyPrice = parseUnits("100", 6); // 100 PYUSD/year
      const name = "Premium Plan";
      const description = "Access to premium features";

      await subscriptionManager.write.createPlan(
        [yearlyPrice, name, description],
        { account: provider.account }
      );

      const planId = 1n;
      const plan = await subscriptionManager.read.plans([planId]);

      expect(plan.yearlyPrice).to.equal(yearlyPrice);
      expect(plan.name).to.equal(name);
      expect(plan.description).to.equal(description);
      expect(plan.provider).to.equal(getAddress(provider.account.address));
      expect(plan.isActive).to.equal(true);
      expect(plan.subscriberCount).to.equal(0n);
      expect(plan.totalRevenue).to.equal(0n);
    });
  });
});

