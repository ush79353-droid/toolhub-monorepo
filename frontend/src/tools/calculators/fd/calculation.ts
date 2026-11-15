import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import {
  FD_COMPOUNDING_OPTIONS,
  type FdCompounding,
  type FdResult,
  type FdType,
} from './types';

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function periodsPerYear(compounding: FdCompounding): number {
  return FD_COMPOUNDING_OPTIONS.find((o) => o.value === compounding)?.periodsPerYear ?? 12;
}

/**
 * Cumulative: Maturity = P × (1 + r/n)^(n×t); interest reinvested; total payout = maturity.
 * Simple: Total interest = P × r × t; payout/period = P × r/n; maturity = P; total payout = P + interest.
 */
export function calculateFd(params: {
  depositType: FdType;
  principal: number;
  interestRatePercent: number;
  termYears: number;
  compounding: FdCompounding;
  currency: SupportedCurrency;
}): FdResult | null {
  const {
    depositType,
    principal,
    interestRatePercent,
    termYears,
    compounding,
    currency,
  } = params;

  if (
    ![principal, interestRatePercent, termYears].every(Number.isFinite) ||
    principal < 0 ||
    interestRatePercent < 0 ||
    termYears <= 0
  ) {
    return null;
  }

  const n = periodsPerYear(compounding);
  if (!Number.isFinite(n) || n <= 0) return null;

  const r = interestRatePercent / 100;
  if (!Number.isFinite(r)) return null;

  let maturityAmount: number;
  let totalInterest: number;
  let payoutPerPeriod: number;
  let totalPayout: number;

  if (depositType === 'cumulative') {
    const base = 1 + r / n;
    if (!Number.isFinite(base) || base <= 0) return null;
    const factor = base ** (n * termYears);
    if (!Number.isFinite(factor)) return null;
    maturityAmount = roundMoney(principal * factor);
    totalInterest = roundMoney(maturityAmount - principal);
    payoutPerPeriod = 0;
    totalPayout = maturityAmount;
  } else {
    totalInterest = roundMoney(principal * r * termYears);
    payoutPerPeriod = roundMoney(principal * (r / n));
    maturityAmount = roundMoney(principal);
    totalPayout = roundMoney(principal + totalInterest);
  }

  if (
    ![maturityAmount, totalInterest, payoutPerPeriod, totalPayout].every(Number.isFinite)
  ) {
    return null;
  }

  return {
    depositType,
    principal,
    interestRatePercent,
    termYears,
    compounding,
    periodsPerYear: n,
    maturityAmount,
    totalInterest,
    payoutPerPeriod,
    totalPayout,
    currency,
    formattedMaturityAmount: formatCurrencyValue(maturityAmount, currency),
    formattedTotalInterest: formatCurrencyValue(totalInterest, currency),
    formattedPayoutPerPeriod: formatCurrencyValue(payoutPerPeriod, currency),
    formattedTotalPayout: formatCurrencyValue(totalPayout, currency),
  };
}

export function describeResult(result: FdResult): string {
  return [
    `Maturity amount: ${result.formattedMaturityAmount}`,
    `Total interest: ${result.formattedTotalInterest}`,
    `Payout per interest period: ${result.formattedPayoutPerPeriod}`,
    `Total payout: ${result.formattedTotalPayout}`,
  ].join('\n');
}
