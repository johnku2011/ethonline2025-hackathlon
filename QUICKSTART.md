# 🚀 Quick Start Guide

This guide will help you get the project running in **under 10 minutes**.

## 📋 Prerequisites

- Node.js 18+ & pnpm 9+
- MetaMask browser extension

## 🎯 Choose Your Path

### Path A: Local Development (5 minutes)

Perfect for rapid development and testing.

**Step 1: Install & Setup (1 min)**

```bash
git clone <repo-url>
cd ETHGlobal-Online-2025-Hackathlon
pnpm install
```

**Step 2: Start Blockchain (30 sec)**

```bash
# Terminal 1
cd contracts
npx hardhat node
```

✅ Keep this running. You'll see 10 accounts with 10000 ETH each.

**Step 3: Deploy Contracts (1 min)**

```bash
# Terminal 2
cd contracts
npx hardhat run scripts/deploy-localhost.ts --network localhost
```

✅ Note the contract addresses from `deployments-localhost.json`.

**Step 4: Configure Frontend (1 min)**

Edit `frontend/src/lib/contracts/addresses.ts`:

```typescript
31337: {
  subscriptionManager: '0x...', // From deployments-localhost.json
  pyusd: '0x...',
  morphoVault: '0x...',
},
```

Create `frontend/.env.local`:

```bash
NEXT_PUBLIC_ENABLE_LOCALHOST=true
```

**Step 5: Start Frontend (30 sec)**

```bash
# Terminal 3
cd frontend
pnpm dev
```

✅ Open http://localhost:3000

**Step 6: Configure MetaMask (1 min)**

1. Add Network:
   - Network Name: Localhost
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency: ETH

2. Import a test account from Terminal 1

**Step 7: Start Backend (optional, 30 sec)**

```bash
# Terminal 4
cd backend
# Edit .env:
# NETWORK=localhost
# SUBSCRIPTION_MANAGER_ADDRESS=0x...
# BACKEND_PRIVATE_KEY=0x... (from Hardhat accounts)
pnpm dev
```

✅ **Done! You're ready to develop!**

---

### Path B: Arbitrum Sepolia Testnet (10 minutes)

For testing on a real network.

**Step 1: Get Testnet ETH**

1. Visit [Arbitrum Sepolia Faucet](https://faucet.quicknode.com/arbitrum/sepolia)
2. Get some testnet ETH

**Step 2: Setup Environment**

Create `contracts/.env`:

```bash
PRIVATE_KEY=your_private_key_here
```

**Step 3: Deploy**

```bash
cd contracts
npx hardhat run scripts/deploy-testnet.ts --network arbitrumSepolia
```

**Step 4: Configure**

Same as Path A, but:
- Use addresses from `deployments-testnet.json`
- Update chainId `421614` in `addresses.ts`
- Set `NEXT_PUBLIC_ENABLE_LOCALHOST=false`
- Set `NETWORK=arbitrumSepolia` in backend

✅ **Done! View contracts on [Arbiscan](https://sepolia.arbiscan.io)!**

---

## 🔧 Troubleshooting

**Problem**: "Cannot connect to localhost:8545"  
**Solution**: Make sure Hardhat node is running in Terminal 1

**Problem**: "Invalid nonce"  
**Solution**: Reset MetaMask: Settings → Advanced → Clear activity tab data

**Problem**: "Contract not found"  
**Solution**: Make sure you've deployed and updated addresses.ts

## 📚 Next Steps

- Read [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment info
- Check [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for architecture overview
- Review [REQUIREMENTS.md](REQUIREMENTS.md) for project requirements

## 🎉 Happy Hacking!

For questions or issues, check the [GitHub Issues](https://github.com/...).
