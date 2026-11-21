/**
 * Vertical options spreads at expiration (equity multiplier 100).
 *
 * Call payoff per share: max(0, S − K)
 * Put payoff per share:  max(0, K − S)
 * Long leg contributes +payoff; short leg contributes −payoff.
 * Net premium: long premium paid − short premium received (debit if &gt; 0).
 *
 * Amounts must already share one currency. Round only for display helpers.
 */

import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import {
  EQUITY_OPTION_CONTRACT_MULTIPLIER,
  strategyNote,
  type OptionsSpreadNetKind,
  type OptionsSpreadStrategy,
} from './types';

export function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

export function formatSpreadMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  return formatCurrencyValue(amount, currency);
}

function callPayoff(s: number, k: number): number {
  return Math.max(0, s - k);
}

function putPayoff(s: number, k: number): number {
  return Math.max(0, k - s);
}

export interface OptionsSpreadComputation {
  strategy: OptionsSpreadStrategy;
  contracts: number;
  contractMultiplier: number;
  targetPrice: number;
  longStrike: number;
  shortStrike: number;
  longPremium: number;
  shortPremium: number;
  netPerShare: number;
  netKind: OptionsSpreadNetKind;
  netSpreadTotal: number;
  maxLoss: number;
  maxProfit: number;
  breakevenPrice: number;
  potentialProfit: number;
  strikeWidth: number;
  strategyNote: string;
  netSpreadLabel: string;
}

/**
 * Strike ordering:
 * - Bull call / bull put: long strike &lt; short strike
 * - Bear call / bear put: short strike &lt; long strike
 */
export function isStrikeOrderValid(
  strategy: OptionsSpreadStrategy,
  longStrike: number,
  shortStrike: number
): boolean {
  if (!(longStrike >= 0 && shortStrike >= 0)) return false;
  if (longStrike === shortStrike) return false;
  switch (strategy) {
    case 'bull-call':
    case 'bull-put':
      return longStrike < shortStrike;
    case 'bear-call':
    case 'bear-put':
      return shortStrike < longStrike;
  }
}

export function calculateOptionsSpread(input: {
  strategy: OptionsSpreadStrategy;
  targetPrice: number;
  contracts: number;
  longStrike: number;
  longPremium: number;
  shortStrike: number;
  shortPremium: number;
}): OptionsSpreadComputation | null {
  const {
    strategy,
    targetPrice,
    contracts,
    longStrike,
    longPremium,
    shortStrike,
    shortPremium,
  } = input;

  if (
    ![
      targetPrice,
      contracts,
      longStrike,
      longPremium,
      shortStrike,
      shortPremium,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (
    targetPrice < 0 ||
    longStrike < 0 ||
    shortStrike < 0 ||
    longPremium < 0 ||
    shortPremium < 0
  ) {
    return null;
  }
  if (!Number.isInteger(contracts) || contracts <= 0) return null;
  if (!isStrikeOrderValid(strategy, longStrike, shortStrike)) return null;

  const mult = EQUITY_OPTION_CONTRACT_MULTIPLIER;
  const scale = mult * contracts;
  const strikeWidth = Math.abs(shortStrike - longStrike);
  const netPerShare = longPremium - shortPremium;
  const netKind: OptionsSpreadNetKind = netPerShare >= 0 ? 'debit' : 'credit';
  const absNet = Math.abs(netPerShare);

  let maxLossPerShare: number;
  let maxProfitPerShare: number;
  let breakevenPrice: number;

  switch (strategy) {
    case 'bull-call': {
      // Debit: buy lower call, sell higher call
      maxLossPerShare = absNet;
      maxProfitPerShare = strikeWidth - absNet;
      if (maxProfitPerShare < 0) return null;
      breakevenPrice = longStrike + absNet;
      break;
    }
    case 'bull-put': {
      // Credit: sell higher put, buy lower put — net should be credit (netPerShare ≤ 0)
      maxProfitPerShare = absNet;
      maxLossPerShare = strikeWidth - absNet;
      if (maxLossPerShare < 0) return null;
      breakevenPrice = shortStrike - absNet;
      break;
    }
    case 'bear-call': {
      // Credit: sell lower call, buy higher call
      maxProfitPerShare = absNet;
      maxLossPerShare = strikeWidth - absNet;
      if (maxLossPerShare < 0) return null;
      breakevenPrice = shortStrike + absNet;
      break;
    }
    case 'bear-put': {
      // Debit: buy higher put, sell lower put
      maxLossPerShare = absNet;
      maxProfitPerShare = strikeWidth - absNet;
      if (maxProfitPerShare < 0) return null;
      breakevenPrice = longStrike - absNet;
      break;
    }
  }

  const isCall =
    strategy === 'bull-call' || strategy === 'bear-call';
  const longPay =
    isCall
      ? callPayoff(targetPrice, longStrike)
      : putPayoff(targetPrice, longStrike);
  const shortPay =
    isCall
      ? callPayoff(targetPrice, shortStrike)
      : putPayoff(targetPrice, shortStrike);
  const potentialPerShare = longPay - shortPay - netPerShare;

  const netSpreadTotal = roundMoney(netPerShare * scale);
  const maxLoss = roundMoney(maxLossPerShare * scale);
  const maxProfit = roundMoney(maxProfitPerShare * scale);
  const potentialProfit = roundMoney(potentialPerShare * scale);

  return {
    strategy,
    contracts,
    contractMultiplier: mult,
    targetPrice,
    longStrike,
    shortStrike,
    longPremium,
    shortPremium,
    netPerShare,
    netKind,
    netSpreadTotal,
    maxLoss,
    maxProfit,
    breakevenPrice: roundMoney(breakevenPrice),
    potentialProfit,
    strikeWidth,
    strategyNote: strategyNote(strategy),
    netSpreadLabel:
      netKind === 'debit' ? 'Net debit spread' : 'Net credit spread',
  };
}
