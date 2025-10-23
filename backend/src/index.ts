import dotenv from 'dotenv';
import { SubscriptionProcessor } from './services/subscription-processor';
import { PaymentScheduler } from './cron/payment-scheduler';

// Load environment variables
dotenv.config();

async function main() {
  console.log('Starting PyUSD Subscription Backend Service...');

  // Validate environment variables
  const contractAddress = process.env
    .SUBSCRIPTION_MANAGER_ADDRESS as `0x${string}`;
  const backendPrivateKey = process.env.BACKEND_PRIVATE_KEY as `0x${string}`;
  const rpcUrl =
    process.env.RPC_URL || 'https://sepolia-rollup.arbitrum.io/rpc';

  if (!contractAddress || !backendPrivateKey) {
    console.error('Missing required environment variables:');
    console.error('- SUBSCRIPTION_MANAGER_ADDRESS');
    console.error('- BACKEND_PRIVATE_KEY');
    process.exit(1);
  }

  // Initialize subscription processor
  const processor = new SubscriptionProcessor({
    contractAddress,
    backendPrivateKey,
    rpcUrl,
  });

  // Initialize payment scheduler
  const scheduler = new PaymentScheduler(processor);

  // Watch for new subscriptions
  processor.watchNewSubscriptions((user, planId) => {
    console.log(`New subscription detected: ${user} - Plan ${planId}`);
    scheduler.addSubscription(user, planId);
  });

  // Start the scheduler (check every hour)
  const checkIntervalMs = parseInt(process.env.CHECK_INTERVAL_MS || '3600000'); // 1 hour default
  scheduler.start(checkIntervalMs);

  console.log('Backend service started successfully!');
  console.log(
    `Checking subscriptions every ${checkIntervalMs / 1000 / 60} minutes`
  );

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down...');
    scheduler.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\nShutting down...');
    scheduler.stop();
    process.exit(0);
  });
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
