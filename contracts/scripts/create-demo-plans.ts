import hre from 'hardhat';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseUnits } from 'viem';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Create 5 demo subscription plans
 * Run after deploying contracts
 */
async function main() {
  console.log('📝 Creating demo subscription plans...\n');

  // Determine network
  const connection = await hre.network.connect();
  const networkName = connection.networkName;
  const isLocalhost = networkName === 'localhost' || networkName === 'hardhat';

  console.log(`Network: ${networkName}`);

  // Load deployment addresses
  const deploymentFile = isLocalhost
    ? join(__dirname, '../../deployments-localhost.json')
    : join(__dirname, '../../deployments-arbitrum-sepolia.json');

  let deployment;
  try {
    deployment = JSON.parse(readFileSync(deploymentFile, 'utf-8'));
  } catch (error) {
    console.error(
      '❌ Deployment file not found. Please deploy contracts first.'
    );
    process.exit(1);
  }

  const subscriptionManagerAddress = deployment.contracts.subscriptionManager;
  console.log(`SubscriptionManager: ${subscriptionManagerAddress}\n`);

  // Get wallet client (deployer)
  const [deployer] = await connection.viem.getWalletClients();

  // Get contract instance
  const subscriptionManager = await connection.viem.getContractAt(
    'SubscriptionManager',
    subscriptionManagerAddress as `0x${string}`
  );

  // Demo plans (monthly/yearly rates in PyUSD)
  const plans = [
    { name: 'Netflix Premium', monthly: '15', yearly: '144' }, // $15/month
    { name: 'Spotify Premium', monthly: '12', yearly: '115' }, // $12/month
    { name: 'ChatGPT Plus', monthly: '20', yearly: '192' }, // $20/month
    { name: 'GitHub Pro', monthly: '7', yearly: '67' }, // $7/month
    { name: 'Gym Membership', monthly: '50', yearly: '480' }, // $50/month
  ];

  console.log(`Using account: ${deployer.account.address}\n`);

  // Create each plan (PyUSD uses 6 decimals)
  for (const plan of plans) {
    console.log(`Creating: ${plan.name}`);
    console.log(`  Monthly: $${plan.monthly} | Yearly: $${plan.yearly}`);

    const hash = await subscriptionManager.write.createSubscriptionPlan([
      parseUnits(plan.monthly, 6), // PyUSD has 6 decimals
      parseUnits(plan.yearly, 6),
      plan.name,
    ]);

    console.log(`  ✅ Created (tx: ${hash.slice(0, 10)}...)\n`);
  }

  console.log('🎉 All demo plans created!\n');
  console.log('You can now:');
  console.log('  1. Start frontend: cd frontend && pnpm dev');
  console.log('  2. Browse to /subscriptions');
  console.log('  3. Subscribe to plans!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
