# PyUSD Subscription Platform - Smart Contracts

Smart contracts for the PyUSD Subscription Platform on Arbitrum.

## 🏗️ Architecture

### Contracts

- **SubscriptionFactory.sol** - Manages provider registration and subscription creation (Factory Pattern)
- **SubscriptionVault.sol** - Manages funds, interest calculation, and claims (Vault Pattern)
- **PyUSDFaucet.sol** - Testnet faucet for demo purposes
- **MockPyUSD.sol** - Mock ERC20 for testing

### Design Patterns

- ✅ Factory Pattern
- ✅ Vault Pattern
- ✅ Access Control (OpenZeppelin Ownable)
- ✅ Reentrancy Guard
- ✅ Pausable
- ✅ Safe ERC20

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- pnpm

### Installation

```bash
# Install dependencies (from root)
pnpm install
```

### Compile Contracts

```bash
pnpm compile
```

### Run Tests

```bash
pnpm test
```

### Deploy

```bash
# Deploy to testnet
pnpm deploy:testnet

# Verify contracts
pnpm verify <CONTRACT_ADDRESS> --network arbitrumSepolia
```

## 🔐 Security

All contracts use OpenZeppelin security standards:

- ReentrancyGuard on fund-moving functions
- Access control with Ownable
- Pausable for emergency stops
- SafeERC20 for token transfers

## 📝 License

MIT
