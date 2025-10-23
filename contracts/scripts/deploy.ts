import hre from 'hardhat';

async function main() {
  console.log('Deploying PyUSDSubscription contract...');

  const [deployer] = await hre.viem.getWalletClients();
  console.log('Deploying with account:', deployer.account.address);

  // PyUSD Token Address on Arbitrum Sepolia
  // You need to update this with the actual PyUSD address on Arbitrum Sepolia
  const pyusdTokenAddress =
    process.env.PYUSD_TOKEN_ADDRESS ||
    '0x0000000000000000000000000000000000000000';

  if (pyusdTokenAddress === '0x0000000000000000000000000000000000000000') {
    console.error('Please set PYUSD_TOKEN_ADDRESS in your .env file');
    process.exit(1);
  }

  // Fee collector address (can be changed later)
  const feeCollectorAddress = deployer.account.address;

  console.log('PyUSD Token Address:', pyusdTokenAddress);
  console.log('Fee Collector Address:', feeCollectorAddress);

  const subscription = await hre.viem.deployContract('PyUSDSubscription', [
    pyusdTokenAddress,
    feeCollectorAddress,
  ]);

  console.log('PyUSDSubscription deployed to:', subscription.address);

  // Wait for a few block confirmations
  console.log('Waiting for block confirmations...');
  await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds

  console.log('\nDeployment completed!');
  console.log('Contract address:', subscription.address);
  console.log('\nTo verify the contract, run:');
  console.log(
    `npx hardhat verify --network arbitrumSepolia ${subscription.address} ${pyusdTokenAddress} ${feeCollectorAddress}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
