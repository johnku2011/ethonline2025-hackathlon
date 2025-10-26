export const SUBSCRIPTION_MANAGER_ABI = [
  {
    type: 'constructor',
    inputs: [
      { name: '_paymentToken', type: 'address' },
      { name: '_morphoVault', type: 'address' },
      { name: '_backend', type: 'address' },
      { name: '_owner', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'createSubscriptionPlan',
    inputs: [
      { name: '_monthlyRate', type: 'uint256' },
      { name: '_yearlyRate', type: 'uint256' },
      { name: '_name', type: 'string' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'subscribeMonthly',
    inputs: [
      { name: 'planId', type: 'uint256' },
      { name: 'stakeYearlyAmount', type: 'bool' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'subscribeYearly',
    inputs: [{ name: 'planId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'cancelSubscription',
    inputs: [{ name: 'planId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  // Note: withdrawYield removed in Lab version - yield returned on cancellation
  {
    type: 'function',
    name: 'getSubscription',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'planId', type: 'uint256' },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'subType', type: 'uint8' },
          { name: 'status', type: 'uint8' },
          { name: 'monthlyRate', type: 'uint256' },
          { name: 'yearlyRate', type: 'uint256' },
          { name: 'startTime', type: 'uint256' },
          { name: 'lastPayment', type: 'uint256' },
          { name: 'expirationTime', type: 'uint256' },
          { name: 'autoPayEnabled', type: 'bool' },
          { name: 'stakedAmount', type: 'uint256' },
          { name: 'morphoShares', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getUserActiveSubscriptions',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'subscriptionPlans',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [
      { name: 'monthlyRate', type: 'uint256' },
      { name: 'yearlyRate', type: 'uint256' },
      { name: 'isActive', type: 'bool' },
      { name: 'name', type: 'string' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'SubscriptionCreated',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'planId', type: 'uint256', indexed: true },
      { name: 'subType', type: 'uint8', indexed: false },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'autoPayEnabled', type: 'bool', indexed: false },
    ],
  },
] as const;
