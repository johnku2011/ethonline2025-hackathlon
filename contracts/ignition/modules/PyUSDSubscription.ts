import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const PyUSDSubscriptionModule = buildModule('PyUSDSubscriptionModule', (m) => {
  // Deploy MockPyUSD token for testing
  const pyusd = m.contract('MockPyUSD', []);

  // Deploy MockMorphoVault with PyUSD
  const morphoVault = m.contract(
    'contracts/MockMorphoVault.sol:MockMorphoVault',
    [pyusd]
  );

  // Parameters for SubscriptionManager
  const backend = m.getParameter('backend');
  const owner = m.getParameter('owner');

  // Deploy SubscriptionManager
  const subscriptionManager = m.contract(
    'contracts/SubscriptionManager.sol:SubscriptionManager',
    [pyusd, morphoVault, backend, owner]
  );

  return {
    pyusd,
    morphoVault,
    subscriptionManager,
  };
});

export default PyUSDSubscriptionModule;
