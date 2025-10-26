import hre from 'hardhat';
import MockPyUSDModule from '../ignition/modules/MockPyUSD';
import MockMorphoVaultModule from '../ignition/modules/MockMorphoVault';
import SubscriptionManagerModule from '../ignition/modules/SubscriptionManager';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Deploy all contracts to Arbitrum Sepolia Testnet
 * Requires: PRIVATE_KEY in .env
 */
async function main() {
  console.log('🚀 Deploying to Arbitrum Sepolia Testnet...\n');

  // Connect to network
  const connection = await hre.network.connect();
  const [deployer] = await connection.viem.getWalletClients();

  const chainId = 421614; // Arbitrum Sepolia

  console.log('Network: arbitrumSepolia');
  console.log('Chain ID:', chainId);
  console.log('Deployer:', deployer.account.address);

  // 1. Deploy MockPyUSD
  console.log('\n📝 Step 1: Deploying MockPyUSD...');
  const { pyusd } = await connection.ignition.deploy(MockPyUSDModule);
  console.log('✅ MockPyUSD:', pyusd.address);

  // 2. Deploy MockMorphoVault
  console.log('\n📝 Step 2: Deploying MockMorphoVault...');
  const { morphoVault } = await connection.ignition.deploy(
    MockMorphoVaultModule,
    {
      parameters: {
        MockMorphoVaultModule: {
          pyusdAddress: pyusd.address,
        },
      },
    }
  );
  console.log('✅ MockMorphoVault:', morphoVault.address);

  // 3. Deploy SubscriptionManager
  console.log('\n📝 Step 3: Deploying SubscriptionManager...');
  const { subscriptionManager } = await connection.ignition.deploy(
    SubscriptionManagerModule,
    {
      parameters: {
        SubscriptionManagerModule: {
          pyusdAddress: pyusd.address,
          morphoVaultAddress: morphoVault.address,
          backend: deployer.account.address,
          owner: deployer.account.address,
        },
      },
    }
  );
  console.log('✅ SubscriptionManager:', subscriptionManager.address);

  // Save deployment addresses
  const deployment = {
    network: 'arbitrumSepolia',
    chainId: chainId,
    timestamp: new Date().toISOString(),
    deployer: deployer.account.address,
    contracts: {
      pyusd: pyusd.address,
      morphoVault: morphoVault.address,
      subscriptionManager: subscriptionManager.address,
    },
    explorer: {
      pyusd: `https://sepolia.arbiscan.io/address/${pyusd.address}`,
      morphoVault: `https://sepolia.arbiscan.io/address/${morphoVault.address}`,
      subscriptionManager: `https://sepolia.arbiscan.io/address/${subscriptionManager.address}`,
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
