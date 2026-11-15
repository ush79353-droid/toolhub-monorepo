import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { MarginInterestResult } from './types';

/** Brokerage-style simple interest uses a 360-day year. */
export const MARGIN_INTEREST_DAY_BASIS = 360;

function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/**
 * Margin Interest = Amount Borrowed × (Annual Rate / 100) × (Days / 360)
 */
export function calculateMarginInterest(input: {
  amountBorrowed: number;
  interestRatePercent: number;
  numberOfDays: number;
  currency: SupportedCurrency;
}): MarginInterestResult | null {
  const { amountBorrowed, interestRatePercent, numberOfDays, currency } = input;

  if (![amountBorrowed, interestRatePercent, numberOfDays].every(Number.isFinite)) {
    return null;
  }
  if (amountBorrowed < 0 || interestRatePercent < 0 || numberOfDays < 0) {
    return null;
  }

  const marginInterest =
    amountBorrowed * (interestRatePercent / 100) * (numberOfDays / MARGIN_INTEREST_DAY_BASIS);

  if (!Number.isFinite(marginInterest)) return null;

  return {
    marginInterest,
    currency,
    formattedMarginInterest: formatMoney(marginInterest, currency),
  };
}
