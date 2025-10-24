import { buildModule } from '@nomicfoundation/hardhat-ignition';
import { parseUnits } from 'viem';

/**
 * Hardhat Ignition module for deploying MockMorphoVault
 *
 * This module demonstrates the Builder Pattern through Ignition's buildModule API.
 * It defines the deployment configuration in a declarative way.
 */
const MockMorphoVaultModule = buildModule('MockMorphoVaultModule', (m) => {
  // Get deployment parameters (with defaults for testnet)
  const pyusdAddress = m.getParameter(
    'pyusdAddress',
    '0x0000000000000000000000000000000000000000' // Will be replaced during deployment
  );

  // Deploy MockMorphoVault
  const morphoVault = m.contract('MockMorphoVault', [pyusdAddress]);

  // Return deployed contracts for use in other modules or scripts
  return { morphoVault };
});

export default MockMorphoVaultModule;
