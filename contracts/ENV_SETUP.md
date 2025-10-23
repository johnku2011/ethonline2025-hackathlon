# Environment Setup

## Required Environment Variables

Create a `.env` file in the `contracts/` directory with the following variables:

```bash
# Arbitrum Sepolia RPC URL
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc

# Private key for deployment (DO NOT commit!)
PRIVATE_KEY=your_private_key_here

# Etherscan API Key for contract verification
ARBISCAN_API_KEY=your_arbiscan_api_key_here

# PyUSD Token Address on Arbitrum Sepolia
PYUSD_ADDRESS=0x0000000000000000000000000000000000000000

# Fee Collector Address (optional, defaults to deployer)
FEE_COLLECTOR_ADDRESS=
```

## Deployment Commands

```bash
# Deploy to local network (for testing)
pnpm deploy:local

# Deploy to Arbitrum Sepolia testnet
pnpm deploy:testnet

# Manually regenerate frontend config
pnpm generate-config
```

## What Happens During Deployment

1. **Hardhat Ignition** deploys contracts to the network
2. Deployment state saved in `ignition/deployments/`
3. **generate-config.ts** script automatically:
   - Reads deployed addresses
   - Copies contract ABIs
   - Generates `app/lib/contracts/addresses.ts`
   - Generates `app/lib/contracts/abis.ts`
4. Frontend can immediately import the new contract addresses

## Redeployment Workflow

For frequent contract modifications during hackathon development:

```bash
# 1. Modify your contract
# 2. Run deployment (automatically updates frontend config)
pnpm deploy:testnet

# 3. Commit changes (keep each commit < 100 lines)
git add .
git commit -m "feat: update contract logic + redeploy"
```

This workflow is optimized for rapid iteration without proxy complexity.

