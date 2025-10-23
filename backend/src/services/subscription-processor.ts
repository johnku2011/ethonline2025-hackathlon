import { createPublicClient, createWalletClient, http, parseAbi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { arbitrumSepolia } from 'viem/chains';

const SUBSCRIPTION_MANAGER_ABI = parseAbi([
  'function processMonthlyPayment(address user, uint256 planId) external',
  'function checkAndUpdateExpiration(address user, uint256 planId) external',
  'function subscriptions(address, uint256) view returns (uint8 subType, uint8 status, uint256 monthlyRate, uint256 yearlyRate, uint256 startTime, uint256 lastPayment, uint256 expirationTime, bool autoPayEnabled, uint256 stakedAmount, uint256 morphoShares)',
  'event MonthlyPaymentProcessed(address indexed user, uint256 indexed planId, uint256 amount, uint256 timestamp)',
]);

interface SubscriptionConfig {
  contractAddress: `0x${string}`;
  backendPrivateKey: `0x${string}`;
  rpcUrl: string;
}

export class SubscriptionProcessor {
  private publicClient;
  private walletClient;
  private account;
  private contractAddress: `0x${string}`;

  constructor(config: SubscriptionConfig) {
    this.contractAddress = config.contractAddress;
    this.account = privateKeyToAccount(config.backendPrivateKey);

    this.publicClient = createPublicClient({
      chain: arbitrumSepolia,
      transport: http(config.rpcUrl),
    });

    this.walletClient = createWalletClient({
      account: this.account,
      chain: arbitrumSepolia,
      transport: http(config.rpcUrl),
    });
  }

  /**
   * Check if a subscription needs payment processing
   */
  async needsPayment(
    userAddress: `0x${string}`,
    planId: bigint
  ): Promise<boolean> {
    try {
      const subscription = await this.publicClient.readContract({
        address: this.contractAddress,
        abi: SUBSCRIPTION_MANAGER_ABI,
        functionName: 'subscriptions',
        args: [userAddress, planId],
      });

      const [subType, status, , , , , expirationTime, autoPayEnabled] =
        subscription;

      // Check if subscription is monthly, active, has auto-pay enabled
      const isMonthly = subType === 0;
      const isActive = status === 1;
      const now = BigInt(Math.floor(Date.now() / 1000));

      // Payment is due if expiration is within 1 day
      const paymentDue = expirationTime - now <= BigInt(86400); // 1 day in seconds

      return isMonthly && isActive && autoPayEnabled && paymentDue;
    } catch (error) {
      console.error(
        `Error checking subscription ${planId} for ${userAddress}:`,
        error
      );
      return false;
    }
  }

  /**
   * Process a monthly payment for a user's subscription
   */
  async processPayment(
    userAddress: `0x${string}`,
    planId: bigint
  ): Promise<boolean> {
    try {
      console.log(`Processing payment for user ${userAddress}, plan ${planId}`);

      const { request } = await this.publicClient.simulateContract({
        address: this.contractAddress,
        abi: SUBSCRIPTION_MANAGER_ABI,
        functionName: 'processMonthlyPayment',
        args: [userAddress, planId],
        account: this.account,
      });

      const hash = await this.walletClient.writeContract(request);

      console.log(`Payment transaction sent: ${hash}`);

      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash,
      });

      console.log(
        `Payment processed successfully for ${userAddress}, plan ${planId}`
      );
      return receipt.status === 'success';
    } catch (error) {
      console.error(
        `Error processing payment for ${userAddress}, plan ${planId}:`,
        error
      );
      return false;
    }
  }

  /**
   * Check and update subscription expiration status
   */
  async updateExpiration(
    userAddress: `0x${string}`,
    planId: bigint
  ): Promise<void> {
    try {
      const { request } = await this.publicClient.simulateContract({
        address: this.contractAddress,
        abi: SUBSCRIPTION_MANAGER_ABI,
        functionName: 'checkAndUpdateExpiration',
        args: [userAddress, planId],
        account: this.account,
      });

      const hash = await this.walletClient.writeContract(request);
      await this.publicClient.waitForTransactionReceipt({ hash });
    } catch (error) {
      console.error(
        `Error updating expiration for ${userAddress}, plan ${planId}:`,
        error
      );
    }
  }

  /**
   * Listen for SubscriptionCreated events to track new subscriptions
   */
  watchNewSubscriptions(
    callback: (user: `0x${string}`, planId: bigint) => void
  ) {
    const unwatch = this.publicClient.watchContractEvent({
      address: this.contractAddress,
      abi: SUBSCRIPTION_MANAGER_ABI,
      eventName: 'MonthlyPaymentProcessed',
      onLogs: (logs) => {
        logs.forEach((log) => {
          if (log.args.user && log.args.planId) {
            callback(log.args.user, log.args.planId);
          }
        });
      },
    });

    return unwatch;
  }
}
