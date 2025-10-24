import hre from 'hardhat';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Simple deployment script without Hardhat Ignition
 * Compatible with Hardhat 3.x
 */
async function main() {
  console.log('🚀 Deploying to localhost (Hardhat Node)...\n');

  // Connect to network
  const connection = await hre.network.connect();
  const [deployer] = await connection.viem.getWalletClients();
  const publicClient = await connection.viem.getPublicClient();
  
  console.log('Deployer:', deployer.account.address);

  // 1. Deploy MockPyUSD
  console.log('\n📝 Step 1: Deploying MockPyUSD...');
  const pyusd = await connection.viem.deployContract('MockPyUSD', []);
  const pyusdAddress = pyusd.address;
  console.log('✅ MockPyUSD:', pyusdAddress);

  // 2. Deploy MockMorphoVault
  console.log('\n📝 Step 2: Deploying MockMorphoVault...');
  const vault = await connection.viem.deployContract('contracts/mocks/MockMorphoVault.sol:MockMorphoVault', [pyusdAddress]);
  const vaultAddress = vault.address;
  console.log('✅ MockMorphoVault:', vaultAddress);

  // 3. Deploy SubscriptionManager
  console.log('\n📝 Step 3: Deploying SubscriptionManager...');
  const manager = await connection.viem.deployContract('SubscriptionManager', [
    pyusdAddress,        // _paymentToken
    vaultAddress,        // _morphoVault
    deployer.account.address, // _backend
    deployer.account.address, // _owner
  ]);
  const managerAddress = manager.address;
  console.log('✅ SubscriptionManager:', managerAddress);

  // Save deployment addresses
  const deployment = {
    network: 'localhost',
    chainId: 31337,
    timestamp: new Date().toISOString(),
    contracts: {
      pyusd: pyusdAddress,
      morphoVault: vaultAddress,
      subscriptionManager: managerAddress,
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

