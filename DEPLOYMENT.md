# 🚀 Deployment Guide

## Quick Start

### 1. Environment Setup

Create `.env` file in `contracts/` directory:

```bash
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
PRIVATE_KEY=your_private_key_here
ARBISCAN_API_KEY=your_arbiscan_api_key_here
PYUSD_ADDRESS=0x0000000000000000000000000000000000000000
```

### 2. Deploy to Testnet

```bash
cd contracts
pnpm deploy:testnet
```

**What happens:**

1. ✅ Hardhat Ignition deploys contracts
2. ✅ Saves deployment state to `ignition/deployments/`
3. ✅ Auto-generates `app/lib/contracts/addresses.ts`
4. ✅ Auto-generates `app/lib/contracts/abis.ts`
5. ✅ Frontend is ready to use!

### 3. Verify Contracts (Optional)

```bash
pnpm verify <CONTRACT_ADDRESS> --network arbitrumSepolia
```

## Redeployment Workflow

For frequent contract modifications:

```bash
# 1. Edit your contract
vim contracts/contracts/SubscriptionManager.sol

# 2. Deploy (automatically updates frontend config)
pnpm deploy:testnet

# 3. Commit (small commits < 100 lines)
git add .
git commit -m "feat: improve subscription logic"
```

## Architecture

- **Deployment**: Hardhat Ignition (official Hardhat 3.0 tool)
- **Config Sync**: Automated script (`generate-config.ts`)
- **Design Patterns**: Builder Pattern (Ignition modules), Template Method (deployment flow)
- **No Proxies**: Simple redeployment for hackathon iteration

## Why Ignition over Proxy?

| Feature            | Ignition      | UUPS Proxy        |
| ------------------ | ------------- | ----------------- |
| Setup Complexity   | ⭐ Simple     | ⭐⭐⭐⭐ Complex  |
| Redeployment Speed | ⚡ Fast       | 🐌 Slow           |
| Storage Management | ✅ No worries | ❌ Careful layout |
| Hackathon-friendly | ✅ Yes        | ❌ Overkill       |

See [ARCHITECTURE_DECISION.md](docs/ARCHITECTURE_DECISION.md) for detailed analysis.

## Deployed Contracts

After deployment, contract addresses will be in:

- `contracts/ignition/deployments/chain-421614/deployed_addresses.json`
- `app/lib/contracts/addresses.ts` (auto-generated)

## Troubleshooting

**Problem**: Deployment state mismatch  
**Solution**: Clear and redeploy

```bash
rm -rf contracts/ignition/deployments/chain-421614
pnpm deploy:testnet
```

**Problem**: Frontend config not updated  
**Solution**: Manually run config generator

```bash
cd contracts
NETWORK=421614 pnpm generate-config
```

## Next Steps

1. ✅ Deploy contracts
2. Build frontend UI
3. Test on Arbitrum Sepolia
4. Prepare demo

---

**Total Setup Time**: ~5 minutes  
**Redeployment Time**: ~2 minutes
