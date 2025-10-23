import hre from 'hardhat';
import { ignition } from 'hardhat';
import MockPyUSDModule from '../ignition/modules/MockPyUSD';
import MockMorphoVaultModule from '../ignition/modules/MockMorphoVault';
import SubscriptionManagerModule from '../ignition/modules/SubscriptionManager';
import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Deploy all contracts to Arbitrum Sepolia Testnet
 * Requires: PRIVATE_KEY in .env
 */
async function main() {
  console.log('🚀 Deploying to Arbitrum Sepolia Testnet...\n');

  const network = hre.network.name;
  const chainId = hre.network.config.chainId || 421614;

  console.log('Network:', network);
  console.log('Chain ID:', chainId);

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
    network: 'arbitrumSepolia',
    chainId: chainId,
    timestamp: new Date().toISOString(),
    deployer: deployer.account.address,
    contracts: {
      pyusd: await pyusd.address,
      morphoVault: await morphoVault.address,
      subscriptionManager: await subscriptionManager.address,
    },
    explorer: {
      pyusd: `https://sepolia.arbiscan.io/address/${await pyusd.address}`,
      morphoVault: `https://sepolia.arbiscan.io/address/${await morphoVault.address}`,
      subscriptionManager: `https://sepolia.arbiscan.io/address/${await subscriptionManager.address}`,
    },
  };

  const outputPath = join(__dirname, '../../deployments-testnet.json');
  writeFileSync(outputPath, JSON.stringify(deployment, null, 2));

  console.log('\n✅ Deployment complete!');
  console.log('\n📄 Addresses saved to: deployments-testnet.json');
  console.log('\n🔍 View on Arbiscan:');
  console.log('   PyUSD:', deployment.explorer.pyusd);
  console.log('   MorphoVault:', deployment.explorer.morphoVault);
  console.log(
    '   SubscriptionManager:',
    deployment.explorer.subscriptionManager
  );
  console.log('\n📋 Copy these addresses to:');
  console.log('   - frontend/src/lib/contracts/addresses.ts (421614)');
  console.log('   - backend/.env (SUBSCRIPTION_MANAGER_ADDRESS)');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
