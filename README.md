# PyUSD Subscription Platform

> A decentralized subscription platform where users earn 4.5% APY rewards on yearly subscriptions. Built for ETHGlobal Hackathon.

## 🎯 Concept

Subscribe yearly with PyUSD and earn interest rewards. Complete the full year to receive your principal back plus 4.5% APY. Cancel early? Get your money back, but forfeit the interest rewards.

## 🛠 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first styling
- **RainbowKit** - Wallet connection
- **Wagmi** - Ethereum hooks
- **Viem** - Ethereum interactions

### Smart Contracts (Coming Soon)

- **Hardhat** - Development environment
- **Solidity** - Smart contract language
- **OpenZeppelin** - Security standards

### Blockchain

- **Arbitrum Sepolia** - Testnet for demo
- **PyUSD** - Stablecoin for payments

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

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

## ✨ Features Implemented

- ✅ Landing page with hero section
- ✅ "How It Works" explanation
- ✅ Features showcase
- ✅ Live statistics section
- ✅ Call-to-action sections
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ RainbowKit wallet integration
- ✅ Wagmi configuration for Arbitrum
- ✅ Dark mode support

## 🎨 Landing Page Sections

1. **Hero** - Main value proposition with CTAs
2. **How It Works** - 3-step explanation with example
3. **Features** - Key benefits for users and providers
4. **Statistics** - Live platform metrics (placeholder)
5. **CTA** - Call-to-action for demo and providers
6. **Footer** - Links and information

## 🔜 Coming Next

- [ ] Smart contracts (SubscriptionFactory, SubscriptionVault)
- [ ] Sandbox demo mode
- [ ] Provider marketplace
- [ ] User dashboard
- [ ] Provider dashboard
- [ ] PyUSD faucet contract
- [ ] Fast-forward time feature (testnet only)

## 📝 Development Notes

### Commit Strategy

We follow regular commits during hackathon development:

- Each feature/component gets its own commit
- Clear commit messages with conventional commits format
- Regular pushes to maintain progress

### Code Quality

- Prettier for code formatting
- ESLint for linting
- TypeScript for type safety
- Husky for git hooks

## 🤝 Contributing

This is a hackathon project. Feel free to:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🏆 Built for ETHGlobal Hackathon

This project showcases:

- Innovative subscription model with DeFi integration
- PyUSD utility and adoption
- Arbitrum Layer 2 benefits
- Smart contract security best practices
- Modern Web3 UX

---

**Team:** ETHGlobal Hackathon Participants  
**Event:** ETHGlobal Hackathon 2025  
**Date:** October 2025
