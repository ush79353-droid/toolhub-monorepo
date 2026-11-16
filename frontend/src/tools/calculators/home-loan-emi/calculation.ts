import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { TermUnit } from './types';

export function formatHomeLoanEmiMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Normalize loan term into monthly payment count n. */
export function termToPaymentCount(term: number, unit: TermUnit): number | null {
  if (!Number.isFinite(term) || term <= 0) return null;
  const months = unit === 'yrs' ? term * 12 : term;
  if (!Number.isFinite(months) || months <= 0) return null;
  return months;
}

/**
 * Standard EMI:
 * r = annualRate / 12 / 100
 * EMI = P × r × (1+r)^n / ((1+r)^n − 1) when r > 0
 * EMI = P / n when r = 0
 */
export function calculateEmi(input: {
  principal: number;
  annualRatePercent: number;
  paymentCount: number;
}): number | null {
  const { principal, annualRatePercent, paymentCount } = input;
  if (![principal, annualRatePercent, paymentCount].every(Number.isFinite)) {
    return null;
  }
  if (!(principal > 0) || !(paymentCount > 0) || annualRatePercent < 0) return null;

  const r = annualRatePercent / 12 / 100;
  let emi: number;
  if (r === 0) {
    emi = principal / paymentCount;
  } else {
    const growth = Math.pow(1 + r, paymentCount);
    if (!Number.isFinite(growth) || growth === 1) return null;
    emi = (principal * r * growth) / (growth - 1);
  }

  return Number.isFinite(emi) ? emi : null;
}

export function calculateHomeLoanEmiTotals(input: {
  principal: number;
  emi: number;
  paymentCount: number;
}): {
  totalPayable: number;
  totalInterest: number;
  principalSharePercent: number;
  interestSharePercent: number;
} | null {
  const { principal, emi, paymentCount } = input;
  if (![principal, emi, paymentCount].every(Number.isFinite)) return null;

  const totalPayable = emi * paymentCount;
  const totalInterest = totalPayable - principal;
  if (![totalPayable, totalInterest].every(Number.isFinite)) return null;

  const chartTotal = principal + Math.max(0, totalInterest);
  const principalSharePercent =
    chartTotal > 0 ? (principal / chartTotal) * 100 : 100;
  const interestSharePercent =
    chartTotal > 0 ? (Math.max(0, totalInterest) / chartTotal) * 100 : 0;

  return {
    totalPayable,
    totalInterest,
    principalSharePercent,
    interestSharePercent,
  };
}
