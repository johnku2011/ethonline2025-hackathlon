import hre from 'hardhat';
import { ignition } from 'hardhat';
import MockPyUSDModule from '../ignition/modules/MockPyUSD';
import MockMorphoVaultModule from '../ignition/modules/MockMorphoVault';
import SubscriptionManagerModule from '../ignition/modules/SubscriptionManager';
import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Deploy all contracts to localhost (Hardhat Node)
 * Make sure to run: npx hardhat node
 */
async function main() {
  console.log('🚀 Deploying to localhost (Hardhat Node)...\n');

  // Get deployer account
  const [deployer] = await hre.viem.getWalletClients();
  console.log('Deployer:', deployer.account.address);

  // 1. Deploy MockPyUSD
  console.log('\n📝 Step 1: Deploying MockPyUSD...');
  const { pyusd } = await ignition.deploy(MockPyUSDModule);
  console.log('✅ MockPyUSD:', await pyusd.address);

  // 2. Deploy MockMorphoVault
  console.log('\n📝 Step 2: Deploying MockMorphoVault...');
  const { morphoVault } = await ignition.deploy(MockMorphoVaultModule, {
    parameters: {
      MockMorphoVaultModule: {
        pyusdAddress: await pyusd.address,
      },
    },
  });
  console.log('✅ MockMorphoVault:', await morphoVault.address);

  // 3. Deploy SubscriptionManager
  console.log('\n📝 Step 3: Deploying SubscriptionManager...');
  const { subscriptionManager } = await ignition.deploy(
    SubscriptionManagerModule,
    {
      parameters: {
        SubscriptionManagerModule: {
          pyusdAddress: await pyusd.address,
          feeCollector: deployer.account.address,
        },
      },
    }
  );
  console.log('✅ SubscriptionManager:', await subscriptionManager.address);

  // Save deployment addresses
  const deployment = {
    network: 'localhost',
    chainId: 31337,
    timestamp: new Date().toISOString(),
    contracts: {
      pyusd: await pyusd.address,
      morphoVault: await morphoVault.address,
      subscriptionManager: await subscriptionManager.address,
    },
  };

  const outputPath = join(__dirname, '../../deployments-localhost.json');
  writeFileSync(outputPath, JSON.stringify(deployment, null, 2));

  console.log('\n✅ Deployment complete!');
  console.log('\n📄 Addresses saved to: deployments-localhost.json');
  console.log('\n📋 Copy these addresses to:');
  console.log('   - frontend/src/lib/contracts/addresses.ts (31337)');
  console.log('   - backend/.env (SUBSCRIPTION_MANAGER_ADDRESS)');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
