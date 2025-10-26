/**
 * Subscription Error Handler - Strategy Pattern
 * 
 * This module uses Strategy Pattern to handle different types of subscription errors
 * and provides clear, user-friendly error messages.
 */

export interface ErrorStrategy {
  match: (error: string) => boolean;
  getMessage: (error: string) => string;
}

// Strategy 1: Already Subscribed Error
const alreadySubscribedStrategy: ErrorStrategy = {
  match: (error: string) => 
    error.includes('Already subscribed') || 
    error.includes('already subscribed'),
  getMessage: () => 
    '⚠️ You already have an active subscription!\n\n' +
    'You can only have one active subscription at a time.\n\n' +
    '💡 To switch plans:\n' +
    '1. Cancel your current subscription\n' +
    '2. Then subscribe to a new plan'
};

// Strategy 2: User Rejected Transaction
const userRejectedStrategy: ErrorStrategy = {
  match: (error: string) => 
    error.includes('User rejected') || 
    error.includes('User denied'),
  getMessage: () => 
    '❌ Transaction Rejected\n\n' +
    'You rejected the transaction in your wallet.'
};

// Strategy 3: Insufficient Funds
const insufficientFundsStrategy: ErrorStrategy = {
  match: (error: string) => 
    error.includes('insufficient funds') ||
    error.includes('Insufficient'),
  getMessage: () => 
    '❌ Insufficient Funds\n\n' +
    'You don\'t have enough ETH to pay for gas fees.\n\n' +
    '💡 Please add some ETH to your wallet and try again.'
};

// Strategy 4: Network Mismatch
const networkMismatchStrategy: ErrorStrategy = {
  match: (error: string) => 
    error.includes('network') || 
    error.includes('chain'),
  getMessage: () => 
    '❌ Network Mismatch\n\n' +
    'Please make sure your wallet is connected to the correct network.'
};

// Default Strategy: Generic Error
const defaultStrategy: ErrorStrategy = {
  match: () => true, // Always match (fallback)
  getMessage: (error: string) => 
    `❌ Transaction Failed\n\n${error}\n\n` +
    'Please check:\n' +
    '1. You have enough PyUSD balance\n' +
    '2. You have enough ETH to pay for gas fees\n' +
    '3. You didn\'t reject the transaction in your wallet'
};

// All strategies in order of priority
const strategies: ErrorStrategy[] = [
  alreadySubscribedStrategy,
  userRejectedStrategy,
  insufficientFundsStrategy,
  networkMismatchStrategy,
  defaultStrategy, // Must be last
];

/**
 * Handle subscription-related errors and return user-friendly error messages
 * 
 * @param error - Error object or string
 * @returns Formatted error message
 */
export function handleSubscriptionError(error: any): string {
  const errorMessage = error?.message || error?.toString() || 'Unknown error';
  
  // Use the first matching strategy
  const strategy = strategies.find(s => s.match(errorMessage));
  
  return strategy ? strategy.getMessage(errorMessage) : defaultStrategy.getMessage(errorMessage);
}

/**
 * Check if the error is an "Already subscribed" error
 */
export function isAlreadySubscribedError(error: any): boolean {
  const errorMessage = error?.message || error?.toString() || '';
  return alreadySubscribedStrategy.match(errorMessage);
}

