# 🚀 Quick Start Guide

Get the PyUSD Subscription Platform running in 5 minutes!

## Prerequisites

- Node.js 22+ (for Hardhat 3.0)
- pnpm installed (`npm i -g pnpm`)
- Wallet with Arbitrum Sepolia ETH for deployment

## 1. Install Dependencies

```bash
# Install all workspace dependencies
pnpm install
```

## 2. Deploy Smart Contracts

```bash
cd contracts

# Compile contracts
pnpm hardhat compile

# Deploy to Arbitrum Sepolia
pnpm hardhat ignition deploy ignition/modules/PyUSDSubscription.ts \
  --network arbitrum-sepolia \
  --parameters ignition/parameters.json

# Note the deployed addresses:
# - MockPyUSD
# - MockMorphoVault  
# - SubscriptionManager
```

### Create parameters file

```json
// contracts/ignition/parameters.json
{
  "PyUSDSubscriptionModule": {
    "backend": "0xYourBackendWalletAddress",
    "owner": "0xYourOwnerAddress"
  }
}
```

## 3. Configure Frontend

```bash
cd ../frontend

# Create environment file
echo "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here" > .env.local

# Update contract addresses in src/lib/contracts/addresses.ts
# Replace the addresses with your deployed contract addresses
```

Edit `frontend/src/lib/contracts/addresses.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  421614: { // Arbitrum Sepolia
    subscriptionManager: '0xYOUR_DEPLOYED_ADDRESS',
    pyusd: '0xYOUR_PYUSD_ADDRESS',
    morphoVault: '0xYOUR_VAULT_ADDRESS',
  },
}
```

## 4. Start Frontend

```bash
# From frontend directory
pnpm dev

# Open http://localhost:3000
```

## 5. Setup Backend Service

```bash
cd ../backend

# Create environment file
cp .env.example .env

# Edit .env with your values
nano .env
```

Required environment variables:

```bash
SUBSCRIPTION_MANAGER_ADDRESS=0xYourDeployedAddress
BACKEND_PRIVATE_KEY=0xYourBackendPrivateKey
RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
CHECK_INTERVAL_MS=3600000
```

Start the backend:

```bash
pnpm dev
```

## 6. Test the Platform

### Create a Subscription Plan

```bash
cd contracts

# Create a test plan (owner only)
pnpm hardhat console --network arbitrum-sepolia

# In console:
const SubscriptionManager = await ethers.getContractFactory("SubscriptionManager");
const sm = await SubscriptionManager.attach("YOUR_ADDRESS");
await sm.createSubscriptionPlan(
  ethers.parseUnits("9.99", 6),  // monthly rate
  ethers.parseUnits("99", 6),    // yearly rate  
  "Basic Plan"
);
```

### Mint Test PyUSD

```bash
# In Hardhat console:
const PyUSD = await ethers.getContractFactory("MockPyUSD");
const pyusd = await PyUSD.attach("YOUR_PYUSD_ADDRESS");
await pyusd.mint(
  "YOUR_WALLET_ADDRESS",
  ethers.parseUnits("1000", 6)  // 1000 PYUSD
);
```

### Subscribe via Frontend

1. Connect wallet on http://localhost:3000
2. Navigate to `/subscriptions`
3. Click "Subscribe" on a plan
4. Approve PyUSD spending
5. Confirm subscription transaction

## 🎯 What's Next?

- **Monitor Backend**: Check backend logs for payment processing
- **Test Cancellation**: Cancel a subscription and verify refunds
- **Check Yield**: Stake yearly and withdraw yield after some time
- **Create More Plans**: Add different subscription tiers

## 🐛 Troubleshooting

### Contract Compilation Errors

If you see Node.js version errors:
```bash
# Use Node.js 22+
nvm use 22
```

### Frontend Not Connecting

1. Check MetaMask is on Arbitrum Sepolia
2. Verify contract addresses in `addresses.ts`
3. Ensure WalletConnect project ID is set

### Backend Not Processing Payments

1. Check backend wallet has ETH for gas
2. Verify backend address is authorized in contract
3. Check RPC URL is correct
4. Look for error logs in console

## 📚 Next Steps

- Read [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for architecture details
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Review contract tests in `contracts/test/`
- Explore frontend components in `frontend/src/components/`

## 🆘 Need Help?

- Check the detailed documentation in each directory's README
- Review contract events for debugging
- Use Hardhat console for direct contract interaction
- Check Arbitrum Sepolia block explorer for transaction details

Happy Hacking! 🚀

