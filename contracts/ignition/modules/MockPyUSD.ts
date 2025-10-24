import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

/**
 * Hardhat Ignition module for deploying MockPyUSD (for testing)
 */
const MockPyUSDModule = buildModule('MockPyUSDModule', (m) => {
  // Deploy MockPyUSD token
  const pyusd = m.contract('MockPyUSD', []);

  return { pyusd };
});

export default MockPyUSDModule;

