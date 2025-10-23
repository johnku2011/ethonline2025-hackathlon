import { expect } from 'chai';
import hre from 'hardhat';
import { parseUnits, getAddress } from 'viem';

describe('SubscriptionManager', function () {
  let fixtures: Awaited<ReturnType<typeof deployFixture>>;
  let networkHelpers: Awaited<
    ReturnType<typeof hre.network.connect>
  >['networkHelpers'];

  async function deployFixture() {
    const connection = await hre.network.connect();
    const [owner, backend, user1, user2] = await connection.viem.getWalletClients();

    // Deploy MockPyUSD (6 decimals)
    const pyusd = await connection.viem.deployContract('MockPyUSD', []);

    // Deploy MockMorphoVault
    const morphoVault = await connection.viem.deployContract('MockMorphoVault', [
      pyusd.address,
    ]);

    // Deploy SubscriptionManager
    const subscriptionManager = await connection.viem.deployContract(
      'SubscriptionManager',
      [
        pyusd.address,
        morphoVault.address,
        backend.account.address,
        owner.account.address,
      ]
    );

    const publicClient = await connection.viem.getPublicClient();

    // Mint tokens to users (1M PYUSD each)
    const mintAmount = parseUnits('1000000', 6);
    await pyusd.write.mint([user1.account.address, mintAmount]);
    await pyusd.write.mint([user2.account.address, mintAmount]);

    // Users approve subscription manager
    await pyusd.write.approve([subscriptionManager.address, mintAmount], {
      account: user1.account,
    });
    await pyusd.write.approve([subscriptionManager.address, mintAmount], {
      account: user2.account,
    });

    return {
      subscriptionManager,
      pyusd,
      morphoVault,
      owner,
      backend,
      user1,
      user2,
      publicClient,
      viem: connection.viem,
    };
  }

  beforeEach(async function () {
    const connection = await hre.network.connect();
    networkHelpers = connection.networkHelpers;
    fixtures = await deployFixture();
  });

  describe('Deployment', function () {
    it('Should set the correct payment token', async function () {
      const { subscriptionManager, pyusd } = fixtures;
      expect(await subscriptionManager.read.paymentToken()).to.equal(
        getAddress(pyusd.address)
      );
    });

    it('Should set the correct backend address', async function () {
      const { subscriptionManager, backend } = fixtures;
      expect(await subscriptionManager.read.backend()).to.equal(
        getAddress(backend.account.address)
      );
    });
  });

  describe('Plan Management', function () {
    it('Should create a new subscription plan', async function () {
      const { subscriptionManager, owner } = fixtures;

      const monthlyRate = parseUnits('10', 6); // 10 PYUSD
      const yearlyRate = parseUnits('100', 6); // 100 PYUSD

      await subscriptionManager.write.createSubscriptionPlan(
        [monthlyRate, yearlyRate, 'Basic Plan'],
        { account: owner.account }
      );

      const plan = await subscriptionManager.read.subscriptionPlans([1n]);
      expect(plan[0]).to.equal(monthlyRate); // monthlyRate
      expect(plan[1]).to.equal(yearlyRate); // yearlyRate
      expect(plan[2]).to.equal(true); // isActive
      expect(plan[3]).to.equal('Basic Plan'); // name
    });

    it('Should only allow owner to create plans', async function () {
      const { subscriptionManager, user1, viem } = fixtures;

      await viem.assertions.revertWith(
        subscriptionManager.write.createSubscriptionPlan(
          [parseUnits('10', 6), parseUnits('100', 6), 'Unauthorized Plan'],
          { account: user1.account }
        ),
        /OwnableUnauthorizedAccount/
      );
    });
  });

  describe('Monthly Subscriptions', function () {
    beforeEach(async function () {
      const { subscriptionManager, owner } = fixtures;
      // Create a plan first
      await subscriptionManager.write.createSubscriptionPlan(
        [parseUnits('10', 6), parseUnits('100', 6), 'Monthly Plan'],
        { account: owner.account }
      );
    });

    it('Should subscribe monthly without staking', async function () {
      const { subscriptionManager, user1, pyusd } = fixtures;

      const balanceBefore = await pyusd.read.balanceOf([user1.account.address]);

      await subscriptionManager.write.subscribeMonthly([1n, true, false], {
        account: user1.account,
      });

      const sub = await subscriptionManager.read.subscriptions([
        user1.account.address,
        1n,
      ]);
      expect(sub[1]).to.equal(1n); // status = ACTIVE
      expect(sub[7]).to.equal(true); // autoPayEnabled

      const balanceAfter = await pyusd.read.balanceOf([user1.account.address]);
      expect(balanceBefore - balanceAfter).to.equal(parseUnits('10', 6));
    });

    it('Should subscribe monthly with yearly staking', async function () {
      const { subscriptionManager, user1, pyusd } = fixtures;

      const balanceBefore = await pyusd.read.balanceOf([user1.account.address]);

      await subscriptionManager.write.subscribeMonthly([1n, true, true], {
        account: user1.account,
      });

      const sub = await subscriptionManager.read.subscriptions([
        user1.account.address,
        1n,
      ]);
      expect(sub[1]).to.equal(1n); // status = ACTIVE
      expect(sub[8]).to.equal(parseUnits('100', 6)); // stakedAmount
      expect(sub[9]).to.be.greaterThan(0n); // morphoShares

      const balanceAfter = await pyusd.read.balanceOf([user1.account.address]);
      expect(balanceBefore - balanceAfter).to.equal(parseUnits('100', 6));
    });
  });

  describe('Yearly Subscriptions', function () {
    beforeEach(async function () {
      const { subscriptionManager, owner } = fixtures;
      await subscriptionManager.write.createSubscriptionPlan(
        [parseUnits('10', 6), parseUnits('100', 6), 'Yearly Plan'],
        { account: owner.account }
      );
    });

    it('Should subscribe yearly and deposit to vault', async function () {
      const { subscriptionManager, user1, pyusd } = fixtures;

      const balanceBefore = await pyusd.read.balanceOf([user1.account.address]);

      await subscriptionManager.write.subscribeYearly([1n], {
        account: user1.account,
      });

      const sub = await subscriptionManager.read.subscriptions([
        user1.account.address,
        1n,
      ]);
      expect(sub[0]).to.equal(1n); // subType = YEARLY
      expect(sub[1]).to.equal(1n); // status = ACTIVE
      expect(sub[9]).to.be.greaterThan(0n); // morphoShares

      const balanceAfter = await pyusd.read.balanceOf([user1.account.address]);
      expect(balanceBefore - balanceAfter).to.equal(parseUnits('100', 6));
    });
  });
}
