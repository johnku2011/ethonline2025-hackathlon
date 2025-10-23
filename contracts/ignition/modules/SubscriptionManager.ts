import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import MockMorphoVaultModule from './MockMorphoVault';

/**
 * Hardhat Ignition module for deploying SubscriptionManager
 * 
 * This module demonstrates:
 * 1. Builder Pattern: Using buildModule to construct deployment configuration
 * 2. Template Method Pattern: Defining deployment steps in a reusable template
 * 3. Dependency Management: Composing modules (depends on MockMorphoVault)
 */
const SubscriptionManagerModule = buildModule('SubscriptionManagerModule', (m) => {
  // Get deployment parameters
  const pyusdAddress = m.getParameter(
    'pyusdAddress',
    '0x0000000000000000000000000000000000000000' // Will be replaced during deployment
  );

  const feeCollector = m.getParameter(
    'feeCollector',
    '0x0000000000000000000000000000000000000000' // Will be replaced with deployer address
  );

  // Use the MockMorphoVault module
  const { morphoVault } = m.useModule(MockMorphoVaultModule);

  // Deploy SubscriptionManager with dependencies
  const subscriptionManager = m.contract('SubscriptionManager', [
    pyusdAddress,
    morphoVault,
    feeCollector,
  ]);

  // Return deployed contracts for frontend configuration
  return {
    subscriptionManager,
    morphoVault,
  };
});

export default SubscriptionManagerModule;

