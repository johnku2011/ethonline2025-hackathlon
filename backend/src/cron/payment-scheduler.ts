import { SubscriptionProcessor } from '../services/subscription-processor';

interface SubscriptionRecord {
  userAddress: `0x${string}`;
  planId: bigint;
}

export class PaymentScheduler {
  private processor: SubscriptionProcessor;
  private activeSubscriptions: Map<string, SubscriptionRecord>;
  private checkInterval: NodeJS.Timeout | null = null;

  constructor(processor: SubscriptionProcessor) {
    this.processor = processor;
    this.activeSubscriptions = new Map();
  }

  /**
   * Add a subscription to the monitoring list
   */
  addSubscription(userAddress: `0x${string}`, planId: bigint) {
    const key = `${userAddress}-${planId}`;
    this.activeSubscriptions.set(key, { userAddress, planId });
    console.log(`Added subscription to monitor: ${key}`);
  }

  /**
   * Remove a subscription from monitoring
   */
  removeSubscription(userAddress: `0x${string}`, planId: bigint) {
    const key = `${userAddress}-${planId}`;
    this.activeSubscriptions.delete(key);
    console.log(`Removed subscription from monitor: ${key}`);
  }

  /**
   * Check all subscriptions and process payments if needed
   */
  async checkAllSubscriptions() {
    console.log(`Checking ${this.activeSubscriptions.size} subscriptions...`);

    const promises = Array.from(this.activeSubscriptions.values()).map(
      async (sub) => {
        try {
          // Check if payment is needed
          const needsPayment = await this.processor.needsPayment(
            sub.userAddress,
            sub.planId
          );

          if (needsPayment) {
            console.log(
              `Payment needed for ${sub.userAddress}, plan ${sub.planId}`
            );
            const success = await this.processor.processPayment(
              sub.userAddress,
              sub.planId
            );

            if (!success) {
              console.error(
                `Failed to process payment for ${sub.userAddress}, plan ${sub.planId}`
              );
            }
          }

          // Always update expiration status
          await this.processor.updateExpiration(sub.userAddress, sub.planId);
        } catch (error) {
          console.error(
            `Error processing subscription ${sub.userAddress}-${sub.planId}:`,
            error
          );
        }
      }
    );

    await Promise.all(promises);
  }

  /**
   * Start the payment scheduler
   * @param intervalMs Check interval in milliseconds (default: 1 hour)
   */
  start(intervalMs: number = 60 * 60 * 1000) {
    if (this.checkInterval) {
      console.warn('Scheduler already running');
      return;
    }

    console.log(`Starting payment scheduler (interval: ${intervalMs}ms)`);

    // Run immediately on start
    this.checkAllSubscriptions();

    // Then run on interval
    this.checkInterval = setInterval(() => {
      this.checkAllSubscriptions();
    }, intervalMs);
  }

  /**
   * Stop the payment scheduler
   */
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('Payment scheduler stopped');
    }
  }

  /**
   * Get current subscription count
   */
  getSubscriptionCount(): number {
    return this.activeSubscriptions.size;
  }
}
