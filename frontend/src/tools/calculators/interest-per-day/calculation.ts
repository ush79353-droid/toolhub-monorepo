import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Simple daily interest uses a 365-day year. */
export const INTEREST_PER_DAY_YEAR_DAYS = 365;

export function formatInterestMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Display rounding for the daily percent rate (not used in math). */
export function formatDailyRatePercent(ratePercent: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(ratePercent);
}

/**
 * Daily Interest Rate (%) = Annual Interest Rate (%) / 365
 * Interest Per Day = Loan Balance × (Annual Interest Rate / 100) / 365
 *
 * Returns full-precision values in the loan-balance currency. FX belongs in validation.
 */
export function calculateInterestPerDay(input: {
  loanBalance: number;
  annualInterestRatePercent: number;
}): { interestPerDay: number; interestRatePerDayPercent: number } | null {
  const { loanBalance, annualInterestRatePercent } = input;

  if (![loanBalance, annualInterestRatePercent].every(Number.isFinite)) {
    return null;
  }
  if (loanBalance < 0 || annualInterestRatePercent < 0) {
    return null;
  }

  const interestRatePerDayPercent =
    annualInterestRatePercent / INTEREST_PER_DAY_YEAR_DAYS;
  const interestPerDay =
    (loanBalance * (annualInterestRatePercent / 100)) / INTEREST_PER_DAY_YEAR_DAYS;

  if (![interestPerDay, interestRatePerDayPercent].every(Number.isFinite)) {
    return null;
  }

  return { interestPerDay, interestRatePerDayPercent };
}
