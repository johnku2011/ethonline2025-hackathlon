# PyUSD Subscription Platform - Requirements Document

## Project Overview

**Project Name:** PyUSD Subscription Platform  
**Hackathon:** ETHGlobal Hackathon  
**Blockchain:** Arbitrum  
**Primary Token:** PyUSD (PayPal USD)

### Concept
A decentralized subscription platform where users pay yearly subscriptions in PyUSD. Users who complete the full year receive their principal back plus accrued interest rewards. Early cancellations forfeit the interest, which goes to the service provider.

---

## Core Value Proposition

1. **For Users:** Get rewarded for commitment - complete 1 year, earn 4.5% APY on your subscription payment
2. **For Providers:** Reduce churn with financial incentives, earn forfeited interest from early cancellations
3. **For Ecosystem:** Innovative subscription model leveraging PyUSD's interest-bearing properties

---

## Technical Stack

### Frontend
- **Framework:** Next.js (React)
- **Language:** TypeScript + JavaScript
- **Styling:** TailwindCSS, HTML, CSS
- **Package Manager:** pnpm
- **Web3 Integration:** RainbowKit + Wagmi
- **Code Quality:** Husky, Prettier, ESLint

### Smart Contracts
- **Framework:** Hardhat
- **Language:** Solidity
- **Network:** Arbitrum
- **Testing:** Hardhat + Chai

### Blockchain Integration
- **Chain:** Arbitrum (mainnet/testnet)
- **Token:** PyUSD (ERC-20)
- **Wallet Connection:** RainbowKit

---

## Functional Requirements

### 1. Multi-Provider Platform

#### 1.1 Provider Registration
- Any wallet address can register as a service provider
- Providers must set:
  - Business name
  - Description
  - Subscription price (in PyUSD)
  - Service category (optional)
- On-chain storage of provider metadata (or IPFS hash)

#### 1.2 Provider Dashboard
- View total subscribers
- View total PyUSD locked
- View active vs cancelled subscriptions
- Calculate projected vs actual interest earnings
- Withdraw accumulated interest from cancelled subscriptions

### 2. Subscription Management

#### 2.1 User Subscription Flow
1. Browse available service providers
2. Select a provider and view their offering
3. Approve PyUSD spending (if not already approved)
4. Subscribe by paying yearly subscription amount
5. View subscription status and time remaining
6. Option to cancel subscription at any time

#### 2.2 Subscription States
- **Active:** User has paid, time remaining < 365 days
- **Completed:** User held subscription for full 365 days
- **Cancelled:** User cancelled before 365 days

#### 2.3 Subscription Completion
- After 365 days, user can claim:
  - Original principal (subscription payment)
  - Interest rewards (4.5% APY calculated)
- Smart contract releases funds to user

#### 2.4 Early Cancellation
- User can cancel anytime
- Receives original principal back
- Forfeits all interest rewards
- Forfeited interest goes to service provider

### 3. Interest Model

#### 3.1 Fixed APY Assumption
- **Rate:** 4.5% APY (configurable constant)
- **Calculation:** `interest = principal × 0.045`
- **Distribution:**
  - Full year completion: User gets 100% of interest
  - Early cancellation: Provider gets 100% of forfeited interest

#### 3.2 Interest Tracking
- Track per-subscription interest allocation
- Calculate interest at subscription start
- Lock interest amount in contract
- Release to user (if completed) or provider (if cancelled)

### 4. User Interface Requirements

#### 4.1 Landing Page
- Hero section explaining the concept
- "How It Works" section (3-step visual)
- Provider showcase (grid of available providers)
- Connect wallet button (RainbowKit)
- Statistics: Total TVL, Active subscriptions, Total providers

#### 4.2 Provider Marketplace
- Grid/list view of all registered providers
- Filter by category
- Search by provider name
- Each provider card shows:
  - Provider name
  - Description
  - Subscription price
  - Number of subscribers
  - "Subscribe" button

#### 4.3 Provider Creation Page
- Form to register as a provider:
  - Business name (text input)
  - Description (textarea)
  - Subscription price in PyUSD (number input)
  - Category (dropdown)
- Submit button (triggers smart contract transaction)

#### 4.4 User Dashboard
- **My Subscriptions** section:
  - List of active subscriptions
  - For each subscription show:
    - Provider name
    - Amount paid
    - Start date
    - Days remaining (countdown)
    - Projected interest reward
    - "Cancel Subscription" button
    - "Claim Rewards" button (if eligible)
- **My Provider Profile** section (if user is a provider):
  - Business details
  - Total subscribers
  - Total revenue
  - Interest earned from cancellations
  - "Withdraw Interest" button

#### 4.5 Responsive Design
- Mobile-first approach
- Works on desktop, tablet, mobile
- Clean, modern UI with good UX

### 5. Wallet Integration

#### 5.1 Connection
- RainbowKit for wallet connection
- Support major wallets: MetaMask, Rainbow, Coinbase Wallet, WalletConnect
- Auto-detect Arbitrum network
- Prompt network switch if on wrong chain

#### 5.2 Transaction Handling
- Clear transaction status feedback
- Loading states during blockchain transactions
- Success/error notifications
- Transaction hash links to Arbitrum block explorer

---

## Smart Contract Requirements

### Contract Architecture

#### Main Contracts

**1. SubscriptionFactory.sol**
- Manages provider registration
- Creates subscription offerings
- Tracks all providers and subscriptions

**2. SubscriptionVault.sol**
- Holds PyUSD from subscribers
- Manages subscription lifecycle
- Calculates and distributes interest
- Handles claims and cancellations

#### Key Functions

##### Provider Functions
```solidity
function registerProvider(
    string memory name,
    string memory description,
    uint256 subscriptionPrice
) external returns (uint256 providerId)

function withdrawProviderInterest() external returns (uint256 amount)
```

##### User/Subscriber Functions
```solidity
function subscribe(uint256 providerId) external

function cancelSubscription(uint256 subscriptionId) external

function claimRewards(uint256 subscriptionId) external

function getSubscriptionStatus(uint256 subscriptionId) 
    external view returns (
        address subscriber,
        uint256 providerId,
        uint256 startTime,
        uint256 principal,
        uint256 interest,
        SubscriptionState state
    )
```

##### View Functions
```solidity
function getProvider(uint256 providerId) external view returns (Provider memory)

function getUserSubscriptions(address user) external view returns (uint256[] memory)

function getProviderSubscriptions(uint256 providerId) external view returns (uint256[] memory)

function calculateInterest(uint256 principal) public pure returns (uint256)
```

#### Security Requirements
- ReentrancyGuard on all fund-moving functions
- Access control (only subscriber can cancel their subscription)
- Proper state management (can't claim twice, etc.)
- SafeERC20 for token transfers
- Pausable functionality (emergency stop)
- Input validation on all functions

#### Events
```solidity
event ProviderRegistered(uint256 indexed providerId, address indexed provider, string name)
event Subscribed(uint256 indexed subscriptionId, address indexed subscriber, uint256 indexed providerId, uint256 amount)
event SubscriptionCancelled(uint256 indexed subscriptionId, address indexed subscriber, uint256 refund)
event RewardsClaimed(uint256 indexed subscriptionId, address indexed subscriber, uint256 principal, uint256 interest)
event InterestWithdrawn(uint256 indexed providerId, address indexed provider, uint256 amount)
```

---

## Non-Functional Requirements

### Performance
- Fast page load times (<3 seconds)
- Smooth UI interactions
- Efficient blockchain queries (use multicall where possible)

### Usability
- Intuitive user interface
- Clear error messages
- Helpful tooltips and explanations
- Transaction confirmation dialogs

### Security
- Smart contract audited patterns (OpenZeppelin libraries)
- No private key storage
- Secure RPC endpoints
- Input sanitization

### Testability
- Unit tests for all smart contract functions
- Integration tests for contract interactions
- Frontend component tests (optional for hackathon)
- Test coverage >80% for contracts

---

## MVP Scope (Hackathon Priority)

### Must Have (P0)
1. ✅ Smart contracts deployed on Arbitrum testnet
2. ✅ Provider registration functionality
3. ✅ User subscription flow (approve + subscribe)
4. ✅ Subscription cancellation
5. ✅ Reward claiming (after 1 year)
6. ✅ Provider marketplace UI
7. ✅ User dashboard
8. ✅ Wallet connection (RainbowKit)
9. ✅ Basic responsive design

### Should Have (P1)
1. Provider dashboard with analytics
2. Search and filter in marketplace
3. Real-time countdown timers
4. Transaction notifications/toasts
5. Statistics on landing page

### Nice to Have (P2)
1. Provider categories
2. Subscription history/logs
3. Email notifications (via Web3 service)
4. Social sharing
5. Advanced analytics charts

---

## Development Phases

### Phase 1: Setup & Infrastructure
- Initialize project structure
- Set up pnpm workspace
- Configure Hardhat for Arbitrum
- Set up Next.js with TypeScript
- Configure TailwindCSS
- Set up Husky, Prettier, ESLint
- Install and configure RainbowKit + Wagmi

### Phase 2: Smart Contract Development
- Write SubscriptionFactory contract
- Write SubscriptionVault contract
- Write comprehensive tests
- Deploy to Arbitrum testnet
- Verify contracts on Arbiscan

### Phase 3: Frontend Core
- Create layout and navigation
- Implement wallet connection
- Build provider registration page
- Build marketplace page
- Build user dashboard

### Phase 4: Integration
- Connect frontend to smart contracts
- Implement PyUSD approval flow
- Implement subscription flow
- Implement cancellation flow
- Implement claim flow

### Phase 5: Polish & Testing
- Responsive design refinement
- Error handling and edge cases
- User testing
- Demo preparation
- Documentation

---

## External Dependencies

### Required Contracts/Tokens
- **PyUSD on Arbitrum:** Contract address needed
- **Arbitrum RPC:** Alchemy or Infura endpoint

### APIs/Services
- **RPC Provider:** Alchemy/Infura for Arbitrum
- **IPFS (optional):** For storing provider metadata
- **Block Explorer:** Arbiscan for contract verification

---

## Configuration Constants

```typescript
// Smart Contract Constants
const INTEREST_RATE_BPS = 450; // 4.5% in basis points
const SUBSCRIPTION_DURATION = 365 days; // in seconds
const PYUSD_ADDRESS_ARBITRUM = "0x..."; // To be filled

// Frontend Constants
const ARBITRUM_CHAIN_ID = 42161; // or 421614 for testnet
const DEFAULT_CHAIN = arbitrum; // from wagmi/chains
```

---

## Success Metrics (for Demo)

1. Successfully deployed contracts on Arbitrum testnet
2. At least 3 demo providers registered
3. Complete user flow working end-to-end
4. Clean, professional UI
5. Working demo for judges (2-3 minute flow)

---

## Demo Script

1. **Introduction** (30s)
   - Show landing page
   - Explain the concept
   - Show statistics

2. **Provider Registration** (30s)
   - Connect wallet as provider
   - Register new service
   - Show in marketplace

3. **User Subscription** (45s)
   - Connect different wallet
   - Browse marketplace
   - Subscribe to service
   - Show dashboard

4. **Subscription Management** (45s)
   - Show countdown timer
   - Demonstrate cancellation (refund)
   - Show provider receiving forfeited interest
   - Demonstrate completed subscription claim (may need to mock time)

5. **Closing** (30s)
   - Recap innovation
   - Show potential impact
   - Q&A

---

## Risk & Mitigation

### Technical Risks
1. **PyUSD not available on Arbitrum testnet**
   - Mitigation: Deploy mock PyUSD token for demo

2. **Gas costs too high**
   - Mitigation: Optimize contract code, use efficient data structures

3. **RainbowKit integration issues**
   - Mitigation: Follow official docs, use latest stable version

### Product Risks
1. **Concept too complex to explain**
   - Mitigation: Simple UI with clear explanations, good demo script

2. **Not enough time for full features**
   - Mitigation: Focus on MVP scope, cut P2 features

---

## Repository Structure

```
ethonline2025-hackathlon/
├── contracts/                 # Smart contracts
│   ├── SubscriptionFactory.sol
│   ├── SubscriptionVault.sol
│   └── mocks/
│       └── MockPyUSD.sol
├── scripts/                   # Deployment scripts
│   ├── deploy.ts
│   └── verify.ts
├── test/                      # Contract tests
│   ├── SubscriptionFactory.test.ts
│   └── SubscriptionVault.test.ts
├── frontend/                  # Next.js app
│   ├── src/
│   │   ├── app/              # App router
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilities
│   │   └── config/           # Configuration
│   ├── public/               # Static assets
│   └── package.json
├── hardhat.config.ts
├── package.json
├── pnpm-workspace.yaml
├── .prettierrc
├── .eslintrc.json
└── README.md
```

---

## Getting Started Commands

```bash
# Install dependencies
pnpm install

# Compile contracts
pnpm hardhat compile

# Run tests
pnpm hardhat test

# Deploy to testnet
pnpm hardhat run scripts/deploy.ts --network arbitrumSepolia

# Start frontend
cd frontend
pnpm dev

# Lint and format
pnpm lint
pnpm format
```

---

## Additional Notes

- Use OpenZeppelin contracts for security
- Keep gas optimization in mind
- Write clean, commented code for judges
- Prepare good README with setup instructions
- Consider adding a simple landing page video/gif
- Make sure all transactions have proper error handling
- Test on actual testnet before demo day

---

**Document Version:** 1.0  
**Last Updated:** October 21, 2025  
**Author:** ETHGlobal Hackathon Team

