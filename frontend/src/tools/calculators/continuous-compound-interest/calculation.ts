import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import {
  DEPOSIT_FREQUENCY_OPTIONS,
  type ContinuousCompoundInterestResult,
  type DepositFrequency,
  type DepositTiming,
} from './types';

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function depositPeriodsPerYear(freq: DepositFrequency): number {
  return DEPOSIT_FREQUENCY_OPTIONS.find((o) => o.value === freq)?.periodsPerYear ?? 0;
}

/**
 * Continuous compound: A = P × e^(r × t)
 * Recurring deposits: each deposit D contributed at time τ grows as D × e^(r × (t − τ)).
 * Compound interest = final balance − total cash deposited (initial + deposits).
 */
export function calculateContinuousCompoundInterest(params: {
  initialBalance: number;
  interestRatePercent: number;
  termYears: number;
  termMonths: number;
  depositFrequency: DepositFrequency;
  depositAmount: number;
  depositTiming: DepositTiming;
  currency: SupportedCurrency;
}): ContinuousCompoundInterestResult | null {
  const {
    initialBalance,
    interestRatePercent,
    termYears,
    termMonths,
    depositFrequency,
    depositAmount,
    depositTiming,
    currency,
  } = params;

  if (
    ![initialBalance, interestRatePercent, termYears, termMonths, depositAmount].every(
      Number.isFinite,
    )
  ) {
    return null;
  }
  if (initialBalance < 0 || depositAmount < 0) return null;

  const t = termYears + termMonths / 12;
  if (!Number.isFinite(t) || t <= 0) return null;

  const r = interestRatePercent / 100;
  if (!Number.isFinite(r)) return null;

  const growth = Math.exp(r * t);
  if (!Number.isFinite(growth)) return null;

  let finalBalance = initialBalance * growth;
  if (!Number.isFinite(finalBalance)) return null;

  let totalDeposits = initialBalance;
  let depositCount = 0;

  const n = depositPeriodsPerYear(depositFrequency);
  if (n > 0 && depositAmount > 0) {
    const count = Math.floor(n * t);
    if (!Number.isFinite(count) || count < 0) return null;

    for (let k = 1; k <= count; k++) {
      const tau =
        depositTiming === 'beginning' ? (k - 1) / n : k / n;
      if (tau > t) continue;
      const remaining = t - tau;
      const fv = depositAmount * Math.exp(r * remaining);
      if (!Number.isFinite(fv)) return null;
      finalBalance += fv;
      totalDeposits += depositAmount;
      depositCount += 1;
    }
  }

  if (!Number.isFinite(finalBalance) || !Number.isFinite(totalDeposits)) return null;

  finalBalance = roundMoney(finalBalance);
  totalDeposits = roundMoney(totalDeposits);
  const compoundInterest = roundMoney(finalBalance - totalDeposits);
  if (!Number.isFinite(compoundInterest)) return null;

  return {
    initialBalance,
    interestRatePercent,
    termYears,
    termMonths,
    years: t,
    depositFrequency,
    depositAmount,
    depositCount,
    totalDeposits,
    finalBalance,
    compoundInterest,
    currency,
    formattedFinalBalance: formatCurrencyValue(finalBalance, currency),
    formattedCompoundInterest: formatCurrencyValue(compoundInterest, currency),
  };
}

export function describeResult(result: ContinuousCompoundInterestResult): string {
  return [
    `Final balance: ${result.formattedFinalBalance}`,
    `Compound interest: ${result.formattedCompoundInterest}`,
  ].join('\n');
}
