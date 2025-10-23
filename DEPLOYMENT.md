# 🚀 Deployment Guide

## Environment Options

This project supports three deployment environments:

1. **Localhost** (Hardhat Node) - Fast local development
2. **Arbitrum Sepolia** - Testnet deployment
3. **Arbitrum One** - Production (future)

## Option 1: Localhost Deployment (Recommended for Development)

### 1. Start Hardhat Node

```bash
cd contracts
npx hardhat node
```

Keep this terminal running. You'll see 10 test accounts with 10000 ETH each.

### 2. Deploy to Localhost (New Terminal)

```bash
cd contracts
npx hardhat run scripts/deploy-localhost.ts --network localhost
```

Deployment addresses will be saved to `deployments-localhost.json`.

### 3. Update Frontend

Copy addresses from `deployments-localhost.json` to `frontend/src/lib/contracts/addresses.ts` (chainId: 31337).

Set environment variable in `frontend/.env.local`:

```bash
NEXT_PUBLIC_ENABLE_LOCALHOST=true
```

### 4. Update Backend

Copy SubscriptionManager address to `backend/.env`:

```bash
NETWORK=localhost
SUBSCRIPTION_MANAGER_ADDRESS=0x...
BACKEND_PRIVATE_KEY=0x... # One of the Hardhat test accounts
```

## Option 2: Arbitrum Sepolia Testnet

### 1. Environment Setup

Create `.env` file in `contracts/` directory:

```bash
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
PRIVATE_KEY=your_private_key_here
```

### 2. Deploy to Testnet

```bash
cd contracts
npx hardhat run scripts/deploy-testnet.ts --network arbitrumSepolia
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
