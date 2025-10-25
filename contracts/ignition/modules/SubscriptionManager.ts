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
const SubscriptionManagerModule = buildModule(
  'SubscriptionManagerModule',
  (m) => {
    // Get the deployer account to use as default owner
    const deployer = m.getAccount(0);

    // Get deployment parameters
    const pyusdAddress = m.getParameter(
      'pyusdAddress',
      '0x0000000000000000000000000000000000000000' // Will be replaced during deployment
    );

    const morphoVaultAddress = m.getParameter(
      'morphoVaultAddress',
      '0x0000000000000000000000000000000000000000' // Will be replaced during deployment
    );

    const backend = m.getParameter(
      'backend',
      deployer // Use deployer as default backend
    );

    const owner = m.getParameter(
      'owner',
      deployer // Use deployer as default owner
    );

    // Deploy SubscriptionManager with dependencies
    // Constructor: (paymentToken, morphoVault, backend, owner)
    const subscriptionManager = m.contract(
      'contracts/SubscriptionManager.sol:SubscriptionManager',
      [pyusdAddress, morphoVaultAddress, backend, owner]
    );

    // Return deployed contracts for frontend configuration
    return {
      subscriptionManager,
    };
  }
);

export default SubscriptionManagerModule;
