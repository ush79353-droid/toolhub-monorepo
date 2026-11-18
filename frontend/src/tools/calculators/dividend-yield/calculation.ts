import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  DIVIDEND_FREQUENCY_OPTIONS,
  type DividendFrequency,
  type DividendFrequencySelection,
} from './types';

export function paymentsPerYearForFrequency(
  frequency: DividendFrequencySelection
): number | null {
  if (frequency === '') return null;
  const match = DIVIDEND_FREQUENCY_OPTIONS.find((o) => o.value === frequency);
  return match ? match.paymentsPerYear : null;
}

export function isDividendFrequency(
  value: string
): value is DividendFrequency {
  return DIVIDEND_FREQUENCY_OPTIONS.some((o) => o.value === value);
}

export function formatDividendMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Display rounding for yield percent (not used in math). */
export function formatYieldPercent(yieldPercent: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(yieldPercent);
}

/**
 * Annual Dividends = Dividends per Period × Payments per Year
 * Dividend Yield (%) = Annual Dividends / Share Price × 100
 *
 * Inputs must already be in one common currency. Returns full-precision values.
 * Zero dividends → 0 annual and 0% yield when share price is positive.
 * Share price must be > 0 for yield; omit sharePrice to return annual only.
 */
export function calculateDividendYield(input: {
  dividendsPerPeriod: number;
  paymentsPerYear: number;
  sharePrice?: number | null;
}): {
  annualDividends: number;
  dividendYieldPercent: number | null;
} | null {
  const { dividendsPerPeriod, paymentsPerYear, sharePrice } = input;

  if (![dividendsPerPeriod, paymentsPerYear].every(Number.isFinite)) {
    return null;
  }
  if (!(paymentsPerYear > 0) || dividendsPerPeriod < 0) {
    return null;
  }

  const annualDividends = dividendsPerPeriod * paymentsPerYear;
  if (!Number.isFinite(annualDividends)) {
    return null;
  }

  if (sharePrice === undefined || sharePrice === null) {
    return { annualDividends, dividendYieldPercent: null };
  }

  if (!Number.isFinite(sharePrice) || !(sharePrice > 0)) {
    return null;
  }

  const dividendYieldPercent = (annualDividends / sharePrice) * 100;
  if (!Number.isFinite(dividendYieldPercent)) {
    return null;
  }

  return { annualDividends, dividendYieldPercent };
}
