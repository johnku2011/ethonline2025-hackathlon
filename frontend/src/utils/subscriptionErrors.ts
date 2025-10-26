/**
 * Subscription Error Handler - Strategy Pattern
 * 
 * 這個模組使用 Strategy Pattern 來處理不同類型的訂閱錯誤，
 * 提供清晰、友好的錯誤訊息給用戶。
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
    '⚠️ 您已經訂閱了一個計劃！\n\n' +
    '每次只能有一個活躍的訂閱。\n\n' +
    '💡 如果您想切換計劃：\n' +
    '1. 先取消當前的訂閱\n' +
    '2. 然後再訂閱新的計劃'
};

// Strategy 2: User Rejected Transaction
const userRejectedStrategy: ErrorStrategy = {
  match: (error: string) => 
    error.includes('User rejected') || 
    error.includes('User denied'),
  getMessage: () => 
    '❌ 交易已拒絕\n\n' +
    '您在錢包中拒絕了這筆交易。'
};

// Strategy 3: Insufficient Funds
const insufficientFundsStrategy: ErrorStrategy = {
  match: (error: string) => 
    error.includes('insufficient funds') ||
    error.includes('Insufficient'),
  getMessage: () => 
    '❌ 資金不足\n\n' +
    '您沒有足夠的 ETH 來支付 gas 費用。\n\n' +
    '💡 請在您的錢包中添加一些 ETH 後再試。'
};

// Strategy 4: Network Mismatch
const networkMismatchStrategy: ErrorStrategy = {
  match: (error: string) => 
    error.includes('network') || 
    error.includes('chain'),
  getMessage: () => 
    '❌ 網絡不匹配\n\n' +
    '請確保您的錢包連接到正確的網絡。'
};

// Default Strategy: Generic Error
const defaultStrategy: ErrorStrategy = {
  match: () => true, // 總是匹配（作為 fallback）
  getMessage: (error: string) => 
    `❌ 交易失敗\n\n${error}\n\n` +
    '請檢查：\n' +
    '1. 您有足夠的 PyUSD 餘額\n' +
    '2. 您有足夠的 ETH 支付 gas 費用\n' +
    '3. 您沒有在錢包中拒絕交易'
};

// All strategies in order of priority
const strategies: ErrorStrategy[] = [
  alreadySubscribedStrategy,
  userRejectedStrategy,
  insufficientFundsStrategy,
  networkMismatchStrategy,
  defaultStrategy, // 必須最後
];

/**
 * 處理訂閱相關錯誤，返回友好的錯誤訊息
 * 
 * @param error - 錯誤對象或字符串
 * @returns 格式化的錯誤訊息
 */
export function handleSubscriptionError(error: any): string {
  const errorMessage = error?.message || error?.toString() || 'Unknown error';
  
  // 使用第一個匹配的 strategy
  const strategy = strategies.find(s => s.match(errorMessage));
  
  return strategy ? strategy.getMessage(errorMessage) : defaultStrategy.getMessage(errorMessage);
}

/**
 * 檢查是否為 "Already subscribed" 錯誤
 */
export function isAlreadySubscribedError(error: any): boolean {
  const errorMessage = error?.message || error?.toString() || '';
  return alreadySubscribedStrategy.match(errorMessage);
}

