# Pay2Earn - Decentralized Subscription Platform

> **Subscribe with PyUSD, earn 4%+ APY via Morpho. Providers slash churn, earn interest! 💸 #DeFi**

[![Built for ETHGlobal](https://img.shields.io/badge/Built%20for-ETHGlobal-blue)](https://ethglobal.com)
[![Arbitrum](https://img.shields.io/badge/Deployed%20on-Arbitrum-blue)](https://arbitrum.io)
[![PyUSD](https://img.shields.io/badge/Powered%20by-PyUSD-green)](https://www.paypal.com/pyusd)
[![Morpho](https://img.shields.io/badge/Yield%20via-Morpho-purple)](https://morpho.org)

---

## 📝 Quick Overview

**Short Description:**  
Pay2Earn: Subscribe with PyUSD, earn 4%+ APY via Morpho. Providers slash churn, earn interest! 💸 #DeFi

**What It Does:**  
Pay2Earn is a decentralized subscription platform on Arbitrum that uses PayPal's PyUSD stablecoin to make subscriptions rewarding for users and profitable for service providers. Built for the ETHGlobal Hackathon, it reimagines subscriptions for services like streaming, software, or gyms by combining DeFi rewards with business-friendly tools.

---

## 🎯 What is Pay2Earn?

Pay2Earn is a decentralized subscription platform built on Arbitrum, utilizing PayPal's PyUSD stablecoin to revolutionize subscription payments in DeFi. Users pay yearly subscriptions to service providers (e.g., streaming, software, or gym memberships) using PyUSD and **earn at least 4% APY** (from PyUSD's inherent holding reward) if they complete the full year, receiving their principal plus interest.

### 💡 The Innovation

To boost returns, subscription funds are deposited into **Morpho vaults**, which leverage decentralized lending markets to achieve higher APYs, maximizing user rewards. If users cancel early, they receive their principal back but **forfeit the interest to the provider**, incentivizing loyalty and reducing churn for businesses.

### 🎯 Value Proposition

**For Users:**
- 💰 Pay yearly subscriptions and earn 4%+ APY from PyUSD rewards
- 📈 Additional yield from Morpho vault optimization
- ✅ Complete the year → Get principal + interest back
- 🔄 Cancel early → Get principal back (provider keeps yield)

**For Providers:**
- 🤝 Reduce customer churn with built-in loyalty incentives
- 💵 Earn forfeited interest when users cancel early
- 📊 Manage subscriptions via dedicated dashboard
- 🏢 Register with business name, description, and pricing

**For the DeFi Ecosystem:**
- 🪙 Showcases PyUSD's stability and utility
- 🧠 Demonstrates Morpho's yield optimization
- ⚡ Leverages Arbitrum's scalability and low fees

---

## 🌟 Detailed Description

### For Users:
Subscribe to your favorite services with PyUSD and **earn a 4% APY** (PyUSD's holding reward) plus extra yield from Morpho vaults if you stay subscribed for a full year. You'll get your payment back plus interest, making subscriptions a smart financial choice. 

**Cancel early?** You get your payment refunded, but the interest goes to the provider, encouraging you to stick around. Browse providers, subscribe, and track your rewards on an easy-to-use dashboard.

**User Experience:**
- 🎯 Browse the marketplace for your favorite services
- 💳 Subscribe with PyUSD (stablecoin - no volatility risk)
- 📊 Track rewards accumulation in real-time
- 🎉 Complete the year → Receive principal + 4-6% APY
- 🔄 Cancel anytime → Get full refund of principal

### For Providers:
Pay2Earn helps businesses **keep subscribers longer and earn extra revenue**. Users are motivated to stay for the full year to earn 4%+ APY, reducing churn. If they cancel early, you keep the forfeited interest as a bonus income stream.

**Getting started is simple:**
1. Register with your business name, description, and PyUSD price in minutes
2. No blockchain expertise needed—Pay2Earn handles the DeFi complexity
3. Access your provider dashboard to view:
   - Active subscribers count
   - Total locked funds (TVL)
   - Interest earned from cancellations
   - One-click "Withdraw Interest" button

**Provider Benefits:**
- 💰 Upfront cash flow from yearly subscriptions
- 📉 Reduced churn (users incentivized to complete year)
- 💸 Earn forfeited interest when users cancel early
- 📊 Real-time analytics and transparent on-chain data
- ⚡ Low-cost transactions on Arbitrum (~$0.01 per tx)

### Why It's Unique:
Pay2Earn uses **PyUSD's stability**, **Morpho's yield-boosting vaults**, and **Arbitrum's low-cost transactions** to create a win-win model:

- **Providers** adopt the protocol easily, gaining loyal subscribers and revenue
- **Users** turn subscriptions into investments
- **DeFi Ecosystem** gains real-world utility and adoption

**For the Hackathon:**  
We built a **sandbox demo on Arbitrum Sepolia**, letting judges test the platform with:
- Pre-funded wallet (no faucet needed)
- Sample providers: "Netflix Clone" ($120/year), "Spotify Premium" ($100/year), "Gym Membership" ($300/year)
- Fast-forward feature to simulate a full year in minutes
- Transparent transactions viewable on Arbiscan

**Impact:**  
Pay2Earn empowers providers to grow their business and users to earn rewards, driving DeFi adoption with a simple, scalable subscription platform that works for everyone.

---

## 🏗️ How It's Built

### 1. Smart Contracts Layer

**Technology:**
- **Language**: Solidity 0.8.28
- **Framework**: Hardhat 3.0 with Viem integration
- **Deployment**: Hardhat Ignition for reproducible deployments
- **Network**: Arbitrum One (42161) & Arbitrum Sepolia (421614)

**Core Contracts:**
- `SubscriptionManager.sol` (543 lines) - Main subscription logic
  - Manages monthly & yearly subscription models
  - Integrates with Morpho vaults for yield generation
  - Handles pro-rata refunds and automated payments
- `MockPyUSD.sol` - ERC20 token (6 decimals) for testing
- `MockMorphoVault.sol` - Morpho vault simulator for development

**Key Features:**
- ✅ Two subscription models (Monthly with optional staking, Yearly)
- ✅ Morpho vault integration for yield optimization
- ✅ Automated monthly payment processing
- ✅ Pro-rata refund calculations
- ✅ OpenZeppelin security patterns (ReentrancyGuard, Pausable, Ownable)

**Dependencies:**
```json
{
  "hardhat": "^3.0.8",
  "@nomicfoundation/hardhat-toolbox-viem": "^5.0.0",
  "@openzeppelin/contracts": "^5.1.0"
}
```

---

### 2. Frontend Application

**Technology:**
- **Framework**: Next.js 15.5.6 (App Router with React 19)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: TanStack React Query v5

**Web3 Integration:**
- **Wagmi v2.18.1** - React hooks for Ethereum
- **Viem v2.38.3** - Modern TypeScript Ethereum library
- **RainbowKit v2.2.9** - Beautiful wallet connection UI

**Key Pages:**
- `/` - Landing page with value proposition
- `/marketplace` - Browse registered providers
- `/subscriptions` - Subscribe to plans
- `/dashboard` - User dashboard for active subscriptions
- `/provider` - Provider registration and management
- `/demo` - Sandbox demo mode for hackathon judges

**Components Structure:**
```
src/
├── app/                      # Next.js App Router pages
├── components/
│   ├── landing/             # Hero, Features, How It Works
│   ├── subscription/        # Subscription cards & management
│   ├── wallet/              # ConnectButton (RainbowKit)
│   └── ui/                  # Reusable UI components
├── hooks/
│   └── useSubscriptionManager.ts  # Contract interaction hooks
└── config/
    ├── wagmi.ts             # Wagmi/Viem configuration
    └── chains.ts            # Chain definitions (Arbitrum)
```

---

### 3. Backend Service (Automation)

**Technology:**
- **Runtime**: Node.js with TypeScript
- **Execution**: tsx (TypeScript execution without build step)
- **Library**: Viem v2.38.3 (consistent with frontend)

**Architecture:**
```
backend/
├── src/
│   ├── index.ts                    # Service entry point
│   ├── services/
│   │   └── subscription-processor.ts  # Contract interactions
│   ├── cron/
│   │   └── payment-scheduler.ts      # Automated checking
│   └── config/
│       └── networks.ts               # Network configurations
```

**Functionality:**
- 📡 **Event Listening**: Watches `SubscriptionCreated` events
- ⚙️ **Payment Processing**: Calls `processMonthlyPayment()` when due
- ⏰ **Cron Scheduling**: Checks subscriptions hourly (configurable)
- 🔄 **Graceful Shutdown**: Handles SIGINT/SIGTERM properly

---

### 4. Integration Points

#### 🪙 PyUSD Integration
- **Token**: PayPal USD (PYUSD) - ERC20 with 6 decimals
- **Network**: Arbitrum for low gas fees
- **APY**: 4% inherent holding reward built into PyUSD
- **Usage**: Primary payment token for subscriptions

#### 🧠 Morpho Protocol Integration
- **Interface**: `IMetaMorpho` from Morpho SDK
- **Functions**:
  - `deposit()` - Deposit PyUSD to earn yield
  - `withdraw()` - Withdraw specific amount
  - `redeem()` - Redeem shares for assets
  - `convertToAssets()` - Check current value with yield
- **Purpose**: Amplify yields beyond PyUSD's 4% APY via decentralized lending

#### ⚡ Arbitrum Network
- **Chain IDs**: 42161 (Mainnet), 421614 (Sepolia testnet)
- **Benefits**: 
  - Low gas fees (~$0.01 per transaction)
  - Fast finality (1-2 seconds)
  - Full EVM compatibility
- **RPC**: `https://arb1.arbitrum.io/rpc`

---

### 5. Architecture Pattern

```
┌─────────────────────────────────────┐
│   Frontend (Next.js + RainbowKit)   │
│   - User interface                   │
│   - Wallet connection                │
│   - Contract reads/writes            │
└──────────────┬──────────────────────┘
               │ Wagmi/Viem
               ↓
┌─────────────────────────────────────┐
│  Smart Contracts (Arbitrum)         │
│  - SubscriptionManager.sol           │
│  - PyUSD ERC20 token                 │
│  - Morpho vaults                     │
└──────────────┬──────────────────────┘
               │ Events
               ↓
┌─────────────────────────────────────┐
│   Backend Service (Node.js)         │
│   - Event listener                   │
│   - Payment automation               │
│   - Cron scheduling                  │
└─────────────────────────────────────┘
```

---

### 6. Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| **Viem over ethers.js** | Better TypeScript support, 2x faster, smaller bundle |
| **Hardhat 3.0** | Latest tooling with Ignition deployment system |
| **Next.js 15 App Router** | Modern React with Server Components, better SEO |
| **RainbowKit v2** | Best-in-class wallet UX with WalletConnect v2 |
| **Morpho Integration** | Maximize yields without custody risk |
| **Arbitrum L2** | Low fees essential for subscription use case |
| **Solidity 0.8.28** | Latest version with built-in overflow checks |

---

### 7. Security Patterns

**Smart Contract Security:**
- ✅ OpenZeppelin ReentrancyGuard on all state-changing functions
- ✅ Pausable for emergency stops
- ✅ Ownable for admin functions
- ✅ SafeERC20 for token transfers
- ✅ Access control (onlyOwner, onlyBackend modifiers)

**Testing:**
- Unit tests with Hardhat + Viem
- Test fixtures for reproducible deployments
- Gas optimization (200 runs)
- Integration tests with mock contracts

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+

### Quick Start

**Option A: Local Development (Recommended)**

```bash
# 1. Install dependencies
pnpm install

# 2. Start Hardhat node (Terminal 1)
cd contracts
npx hardhat node

# 3. Deploy contracts (Terminal 2)
cd contracts
npx hardhat run scripts/deploy-localhost.ts --network localhost

# 4. Configure frontend (copy addresses from deployments-localhost.json)
# Edit frontend/src/lib/contracts/addresses.ts

# 5. Start frontend (Terminal 3)
cd frontend
echo "NEXT_PUBLIC_ENABLE_LOCALHOST=true" > .env.local
pnpm dev

# 6. Start backend (Terminal 4)
cd backend
# Configure .env with localhost settings
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

**Option B: Arbitrum Sepolia Testnet**

See [DEPLOYMENT.md](DEPLOYMENT.md) for testnet deployment instructions.

### Environment Variables

Copy `frontend/env.example` to `frontend/.env.local` and fill in:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
# Get from: https://cloud.walletconnect.com/
```

## 📁 Project Structure

```
ethonline2025-hackathlon/
├── frontend/                  # Next.js application
│   ├── src/
│   │   ├── app/              # App router pages
│   │   ├── components/       # React components
│   │   │   ├── landing/     # Landing page sections
│   │   │   ├── wallet/      # Wallet components
│   │   │   └── ui/          # Reusable UI components
│   │   ├── config/           # Configuration
│   │   └── hooks/            # Custom React hooks
│   └── public/               # Static assets
├── contracts/                 # Smart contracts (coming soon)
├── scripts/                   # Deployment scripts (coming soon)
└── test/                      # Contract tests (coming soon)
```

## ✨ Features

### User Features
- ✅ Browse multi-provider marketplace
- ✅ Subscribe to yearly plans with PyUSD
- ✅ Earn 4%+ APY from PyUSD + Morpho yields
- ✅ View active subscriptions in dashboard
- ✅ Cancel anytime (get principal back, provider keeps yield)
- ✅ Track earnings and subscription status
- ✅ Seamless wallet connection via RainbowKit

### Provider Features
- ✅ Register with business profile
- ✅ Set subscription pricing
- ✅ Manage plans via dashboard
- ✅ Earn loyalty bonuses from early cancellations
- ✅ Withdraw earnings on-demand
- ✅ Track subscriber metrics

### Platform Features
- ✅ Smart contract automation for monthly payments
- ✅ Pro-rata refund calculations
- ✅ Morpho vault yield optimization
- ✅ Event-driven backend processing
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Type-safe contract interactions

## 🎮 Sandbox Demo (ETHGlobal Hackathon)

For hackathon judges, Pay2Earn includes a **guided sandbox demo mode** on Arbitrum Sepolia:

### Demo Features:
- 👛 **Auto-Provisioned Wallet** - Instant testnet wallet with pre-loaded PyUSD (no faucet needed)
- 🎬 **Pre-Set Providers** - Subscribe to demo services:
  - "Netflix Clone" ($120/year)
  - "Spotify Premium" ($100/year)
  - "Gym Membership" ($300/year)
- ⏩ **Time-Warp Controls** - Fast-forward through subscription lifecycles to see:
  - Yield accumulation over months
  - Automated monthly payments (for monthly plans)
  - Cancellation and refund flows
  - Year completion rewards

### Demo Flow:
1. Visit `/demo` page
2. Connect auto-provisioned wallet
3. Subscribe to a pre-set provider
4. Use time controls to simulate months passing
5. View yield accumulation in real-time
6. Test cancellation or complete the year
7. See rewards distribution

**Why This Matters:**
- Demonstrates the full subscription lifecycle in minutes
- Shows PyUSD + Morpho yield optimization in action
- Proves automated payment processing works
- Validates loyalty incentive mechanism

## 💡 How PyUSD & Morpho Work Together

### Payment Flow:

```
User Subscribes
    ↓
100 PyUSD paid
    ↓
Deposited to Morpho Vault
    ↓
Earns 4% (PyUSD) + 2% (Morpho lending) = 6% APY
    ↓
After 1 year: 106 PyUSD
    ↓
Complete: User gets 106 PyUSD
Cancel Early: User gets principal (100), Provider keeps yield (6)
```

### Real Example:

**Scenario: Netflix Clone Subscription ($120/year)**

| Month | Action | User PyUSD | Yield Earned | Provider Benefit |
|-------|--------|-----------|--------------|------------------|
| 0 | Subscribe | -$120 | $0 | Upfront cash flow |
| 6 | Still active | $0 | $3.60 | Lock-in incentive |
| 12 | Complete | +$127.20 | $7.20 | Loyal customer |
| 6 | Cancel early | +$120 | $0 | Gets $3.60 yield |

**Traditional Model:** User pays $120, gets nothing back = -$120 cost  
**Pay2Earn Model:** User pays $120, gets $127.20 back = **+$7.20 profit** 🎉

## 📊 Smart Contract Logic

### When PyUSD is Used:
- ✅ Initial subscription payment (user → contract)
- ✅ Monthly payment from wallet (if no staking)
- ✅ Refunds to users on cancellation
- ✅ Provider withdrawals

### When Morpho is Used:
- ✅ Yearly subscription deposits (all funds)
- ✅ Monthly subscription with staking (year upfront)
- ✅ Yield generation (4%+ APY)
- ✅ Monthly deductions from staked amount
- ✅ Cancellation redemptions (with accumulated yield)

### Subscription Types:

**1. Monthly (No Staking)**
- Pay each month from wallet
- No Morpho involvement
- Backend auto-processes payments

**2. Monthly (With Staking)**
- Pay full year upfront
- Funds go to Morpho
- Monthly payments deducted from Morpho
- User earns yield on remaining balance

**3. Yearly**
- Pay full year upfront
- All funds to Morpho
- Provider can withdraw anytime
- Provider earns yield

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- pnpm 9+
- MetaMask or compatible wallet

### Local Development

```bash
# 1. Install dependencies
pnpm install

# 2. Start local blockchain (Terminal 1)
cd contracts
npx hardhat node

# 3. Deploy contracts (Terminal 2)
cd contracts
npx hardhat run scripts/deploy-localhost.ts --network localhost

# 4. Start frontend (Terminal 3)
cd frontend
cp env.local.example .env.local
# Edit .env.local with contract addresses
pnpm dev

# 5. Start backend automation (Terminal 4)
cd backend
cp .env.example .env
# Edit .env with contract address and backend private key
pnpm dev
```

### Testing Smart Contracts

```bash
cd contracts
pnpm test                    # Run all tests
pnpm test:verbose           # Run with detailed output
```

## 🌐 Deployment

### Arbitrum Sepolia Testnet

```bash
cd contracts
# Set PRIVATE_KEY in .env
npx hardhat run scripts/deploy-testnet.ts --network arbitrumSepolia
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📚 Documentation

- [Architecture Decisions](docs/ARCHITECTURE_DECISION.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Quick Start Guide](QUICKSTART.md)
- [Requirements](REQUIREMENTS.md)

## 🏆 ETHGlobal Hackathon Submission

### What We Built:
✅ Full-stack DeFi subscription platform  
✅ Smart contracts with Morpho integration  
✅ Modern Next.js frontend with RainbowKit  
✅ Automated backend payment processor  
✅ Sandbox demo for judges  

### Technologies Showcased:
- 🪙 **PyUSD**: Stablecoin payments with inherent yield
- 🧠 **Morpho**: Yield optimization via lending markets
- ⚡ **Arbitrum**: Low-cost L2 for subscription use case
- 🌈 **RainbowKit**: Seamless wallet UX
- ⚛️ **Next.js 15**: Modern React with App Router

### Innovation Highlights:
1. **First DeFi subscription model** with built-in yield rewards
2. **Loyalty mechanism** via forfeited interest on early cancellation
3. **Multi-provider marketplace** for service discovery
4. **Automated payments** via event-driven backend
5. **Risk-free demo** with time-warp controls

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

## 👥 Team

Built with ❤️ for **ETHGlobal Online Hackathon 2025**

**Contact:**
- GitHub: [Your GitHub]
- Twitter: [Your Twitter]
- Website: [Your Website]

---

**Star ⭐ this repo if you find it useful!**
