#!/usr/bin/env tsx
/**
 * Interactive CLI tool for SubscriptionManager contract
 * Usage: npx tsx scripts/interact.ts <command> [args...]
 */

import { Address } from 'viem';
import {
  CHAIN,
  getWalletClient,
  serializeBigInt,
  ADDRESSES,
} from './interact-config.js';
import {
  getTokenBalance,
  getSubscriptionPlan,
  getUserSubscription,
  getActiveSubscriptions,
  getContractInfo,
} from './interact-functions.js';
import {
  mintTokens,
  approveTokens,
  createPlan,
  subscribeMonthly,
  subscribeYearly,
  cancelSubscription,
} from './interact-write.js';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  // Check if addresses are configured
  if (!ADDRESSES.subscriptionManager || !ADDRESSES.mockToken) {
    console.error('❌ Contract addresses not configured!');
    console.error('Please set environment variables:');
    console.error('  SUBSCRIPTION_MANAGER_ADDRESS');
    console.error('  MOCK_PYUSD_ADDRESS');
    console.error('  MOCK_VAULT_ADDRESS\n');
    process.exit(1);
  }

  const walletClient = getWalletClient();
  const userAddress = walletClient.account.address;

  console.log('🔗 Connected to:', CHAIN.name);
  console.log('📍 User Address:', userAddress);
  console.log('📄 SubscriptionManager:', ADDRESSES.subscriptionManager);
  console.log('');

  try {
    switch (command) {
      case 'info':
        const info = await getContractInfo();
        console.log('Contract Info:');
        console.log('  Backend:', info.backend);
        console.log('  Owner:', info.owner);
        console.log('  Paused:', info.paused);
        break;

      case 'balance':
        const address = (args[1] as Address) || userAddress;
        const balance = await getTokenBalance(address);
        console.log(`PYUSD Balance: ${balance}`);
        break;

      case 'mint':
        const mintAmount = args[1] || '1000';
        await mintTokens(userAddress, mintAmount);
        break;

      case 'approve':
        const approveAmount = args[1] || '1000';
        await approveTokens(approveAmount);
        break;

      case 'create-plan':
        const monthly = args[1] || '0.1';
        const yearly = args[2] || '1.0';
        const planName = args[3] || 'Basic Plan';
        await createPlan(monthly, yearly, planName);
        break;

      case 'get-plan':
        const planId = BigInt(args[1] || '1');
        const plan = await getSubscriptionPlan(planId);
        console.log('Plan Details:');
        console.log(JSON.stringify(serializeBigInt(plan), null, 2));
        break;

      case 'subscribe':
        const subPlanId = BigInt(args[1] || '1');
        const stake = args[2] !== 'false';
        await subscribeMonthly(subPlanId, stake);
        break;

      case 'subscribe-yearly':
        const yearlyPlanId = BigInt(args[1] || '1');
        await subscribeYearly(yearlyPlanId);
        break;

      case 'get-subscription':
        const user = (args[1] as Address) || userAddress;
        const subId = BigInt(args[2] || '1');
        const subscription = await getUserSubscription(user, subId);
        console.log('Subscription Details:');
        console.log(JSON.stringify(serializeBigInt(subscription), null, 2));
        break;

      case 'active':
        const activeUser = (args[1] as Address) || userAddress;
        const active = await getActiveSubscriptions(activeUser);
        console.log('Active Subscriptions:', active.map(String));
        break;

      case 'cancel':
        const cancelPlanId = BigInt(args[1] || '1');
        await cancelSubscription(cancelPlanId);
        break;

      default:
        console.log('📖 Available commands:');
        console.log('  info, balance, mint, approve, create-plan,');
        console.log('  get-plan, subscribe, subscribe-yearly,');
        console.log('  get-subscription, active, cancel');
        console.log('');
        console.log('See INTERACT_CLI.md for full documentation');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
