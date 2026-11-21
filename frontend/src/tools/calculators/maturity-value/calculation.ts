import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { DurationUnit } from './types';

export interface MaturityValueMathInput {
  principal: number;
  annualInterestRatePercent: number;
  duration: number;
  durationUnit: DurationUnit;
}

export interface MaturityValueMathResult {
  maturityValue: number;
  interestEarned: number;
  durationYears: number;
}

/**
 * Annual compound interest maturity value:
 * MV = P × (1 + r)^t
 * where r = annual rate as decimal, t = years.
 */
export function calculateMaturityValue(
  input: MaturityValueMathInput
): MaturityValueMathResult | null {
  const { principal, annualInterestRatePercent, duration, durationUnit } =
    input;

  if (!Number.isFinite(principal) || principal < 0) return null;
  if (
    !Number.isFinite(annualInterestRatePercent) ||
    annualInterestRatePercent < 0
  ) {
    return null;
  }
  if (!Number.isFinite(duration) || duration < 0) return null;

  const durationYears =
    durationUnit === 'months' ? duration / 12 : duration;
  if (!Number.isFinite(durationYears) || durationYears < 0) return null;

  const rate = annualInterestRatePercent / 100;
  const maturityValue = principal * Math.pow(1 + rate, durationYears);

  if (!Number.isFinite(maturityValue)) return null;

  return {
    maturityValue,
    interestEarned: maturityValue - principal,
    durationYears,
  };
}

export function roundMoneyAmount(
  amount: number,
  currency: SupportedCurrency
): number {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function formatMaturityMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
