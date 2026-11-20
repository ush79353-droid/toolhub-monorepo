import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { BlendedRateContribution } from './types';

export interface BlendedLoanNumeric {
  id: string;
  balance: number;
  rate: number;
}

export interface BlendedRateMathResult {
  totalBalance: number;
  blendedRate: number;
  totalAnnualInterest: number;
  estimatedMonthlyInterest: number;
  includedLoans: number;
  minimumRate: number;
  maximumRate: number;
  contributions: BlendedRateContribution[];
}

/**
 * Balance-weighted average interest rate.
 * R = Σ(Bᵢ × Rᵢ) / Σ(Bᵢ)  — rates in percent units.
 */
export function calculateBlendedRate(
  entries: BlendedLoanNumeric[]
): BlendedRateMathResult | null {
  if (!Array.isArray(entries) || entries.length === 0) return null;

  let totalBalance = 0;
  let weightedRateSum = 0;
  let totalAnnualInterest = 0;
  let minRate = Infinity;
  let maxRate = -Infinity;

  for (const entry of entries) {
    if (
      !Number.isFinite(entry.balance) ||
      entry.balance <= 0 ||
      !Number.isFinite(entry.rate) ||
      entry.rate < 0
    ) {
      return null;
    }
    totalBalance += entry.balance;
    weightedRateSum += entry.balance * entry.rate;
    totalAnnualInterest += entry.balance * (entry.rate / 100);
    if (entry.rate < minRate) minRate = entry.rate;
    if (entry.rate > maxRate) maxRate = entry.rate;
  }

  if (!(totalBalance > 0)) return null;

  const blendedRate = weightedRateSum / totalBalance;
  if (!Number.isFinite(blendedRate)) return null;

  const contributions: BlendedRateContribution[] = entries.map(
    (entry, index) => {
      const weight = entry.balance / totalBalance;
      return {
        id: entry.id,
        index: index + 1,
        balance: entry.balance,
        rate: entry.rate,
        weight,
        rateContribution: weight * entry.rate,
        annualInterest: entry.balance * (entry.rate / 100),
      };
    }
  );

  return {
    totalBalance,
    blendedRate,
    totalAnnualInterest,
    estimatedMonthlyInterest: totalAnnualInterest / 12,
    includedLoans: entries.length,
    minimumRate: minRate,
    maximumRate: maxRate,
    contributions,
  };
}

export function formatBrMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatBrPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function interpretBlendedRate(
  blendedRate: number,
  includedLoans: number,
  totalBalance: number,
  currency: SupportedCurrency
): string {
  return `Your blended interest rate is ${formatBrPercent(blendedRate)}% across ${includedLoans} loan${includedLoans === 1 ? '' : 's'} totaling ${formatBrMoney(totalBalance, currency)}. It is the balance-weighted average of the rates you entered — larger balances influence the result more. This is not a refinancing quote or amortized payment.`;
}
