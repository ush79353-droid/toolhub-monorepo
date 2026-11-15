import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { SimpleInterestResult } from './types';

function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/**
 * Normalize whole years + months into non-negative whole years and months in [0, 11].
 */
export function normalizeTerm(
  years: number,
  months: number
): { years: number; months: number; yearsExact: number } | null {
  if (![years, months].every(Number.isFinite)) return null;
  if (!Number.isInteger(years) || !Number.isInteger(months)) return null;
  if (years < 0 || months < 0) return null;

  const totalMonths = years * 12 + months;
  const normalizedYears = Math.floor(totalMonths / 12);
  const normalizedMonths = totalMonths % 12;
  const yearsExact = totalMonths / 12;

  return {
    years: normalizedYears,
    months: normalizedMonths,
    yearsExact,
  };
}

/**
 * Simple interest (not compound):
 * I = P × (r / 100) × t
 * A = P + I
 * t = years + months / 12
 */
export function calculateSimpleInterest(input: {
  principal: number;
  interestRatePercent: number;
  termYears: number;
  termMonths: number;
  currency: SupportedCurrency;
}): SimpleInterestResult | null {
  const { principal, interestRatePercent, termYears, termMonths, currency } = input;

  if (![principal, interestRatePercent, termYears, termMonths].every(Number.isFinite)) {
    return null;
  }
  if (principal < 0 || interestRatePercent < 0) return null;

  const term = normalizeTerm(termYears, termMonths);
  if (!term) return null;

  const totalInterest = principal * (interestRatePercent / 100) * term.yearsExact;
  if (!Number.isFinite(totalInterest)) return null;

  const finalBalance = principal + totalInterest;
  if (!Number.isFinite(finalBalance)) return null;

  return {
    principal,
    interestRatePercent,
    termYears: term.years,
    termMonths: term.months,
    termYearsExact: term.yearsExact,
    totalInterest,
    finalBalance,
    formattedTotalInterest: formatMoney(totalInterest, currency),
    formattedFinalBalance: formatMoney(finalBalance, currency),
  };
}
