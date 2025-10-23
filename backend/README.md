# PyUSD Subscription Backend

Automated payment processing service for PyUSD subscription contracts.

## Features

- **Automated Payment Processing**: Monitors subscriptions and processes monthly payments automatically
- **Event Listening**: Watches for new subscriptions on-chain
- **Expiration Management**: Updates subscription statuses when they expire
- **Configurable Schedule**: Adjust check intervals via environment variables
- **Type-Safe**: Built with TypeScript and Viem

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Required variables:
- `SUBSCRIPTION_MANAGER_ADDRESS`: Deployed SubscriptionManager contract address
- `BACKEND_PRIVATE_KEY`: Private key for the backend wallet (authorized in contract)
- `RPC_URL`: Arbitrum Sepolia RPC endpoint
- `CHECK_INTERVAL_MS`: Payment check interval (default: 1 hour)

### 3. Run the Service

Development mode (with auto-reload):
```bash
pnpm dev
```

Production build:
```bash
pnpm build
pnpm start
```

## How It Works

1. **Service Initialization**: Connects to the blockchain via RPC
2. **Event Monitoring**: Listens for `SubscriptionCreated` events
3. **Subscription Tracking**: Maintains a list of active subscriptions
4. **Periodic Checks**: Every interval, checks all subscriptions:
   - Checks if payment is due (within 1 day of expiration)
   - Processes payment if auto-pay is enabled
   - Updates expiration status
5. **Payment Processing**: Calls `processMonthlyPayment` on the contract

## Architecture

```
src/
├── index.ts                     # Main entry point
├── services/
│   └── subscription-processor.ts # Contract interaction logic
└── cron/
    └── payment-scheduler.ts      # Scheduling and monitoring
```

## Security

- Private keys are loaded from environment variables only
- Uses Viem's secure account handling
- Implements error handling and retry logic
- Logs all payment processing attempts

## Deployment

For production deployment, consider:
- Running as a systemd service or in a containerized environment
- Setting up proper logging and monitoring
- Using a secure key management system (e.g., AWS KMS, HashiCorp Vault)
- Implementing alerting for failed payments
- Adding database persistence for subscription state

## Development

Watch mode with auto-reload:
```bash
pnpm dev
```

Type checking:
```bash
pnpm build
```

