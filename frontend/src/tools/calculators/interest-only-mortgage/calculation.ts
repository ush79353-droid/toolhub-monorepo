import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  PAYMENT_FREQUENCY_OPTIONS,
  type PaymentFrequency,
} from './types';

export function formatInterestOnlyMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function periodsPerYear(frequency: PaymentFrequency): number {
  const option = PAYMENT_FREQUENCY_OPTIONS.find((item) => item.value === frequency);
  return option?.periodsPerYear ?? 12;
}

export function paymentLabelFor(frequency: PaymentFrequency): string {
  const option = PAYMENT_FREQUENCY_OPTIONS.find((item) => item.value === frequency);
  return option?.paymentLabel ?? 'Monthly payment';
}

/**
 * Periodic interest-only payment in the loan currency (full precision).
 * Periodic Interest = Loan × (Annual Rate / 100) / periodsPerYear
 *
 * Daily uses /365, monthly /12, quarterly /4, yearly /1 (nominal annual rate).
 */
export function calculatePeriodicInterestOnlyPayment(input: {
  loanAmount: number;
  annualInterestRatePercent: number;
  paymentFrequency: PaymentFrequency;
}): number | null {
  const { loanAmount, annualInterestRatePercent, paymentFrequency } = input;
  if (![loanAmount, annualInterestRatePercent].every(Number.isFinite)) return null;
  if (loanAmount < 0 || annualInterestRatePercent < 0) return null;

  const n = periodsPerYear(paymentFrequency);
  if (!Number.isFinite(n) || n <= 0) return null;

  const payment = loanAmount * (annualInterestRatePercent / 100) / n;
  return Number.isFinite(payment) ? payment : null;
}

/**
 * Total years from Omni-style yrs + mos inputs. Blank parts count as 0.
 * Returns null when the combined duration is not positive or inputs are invalid.
 */
export function parseInterestOnlyPeriodYears(
  yearsRaw: string,
  monthsRaw: string
): number | null {
  const yearsText = yearsRaw.trim();
  const monthsText = monthsRaw.trim();
  if (!yearsText && !monthsText) return null;

  const years = yearsText === '' ? 0 : Number(yearsText.replace(/,/g, ''));
  const months = monthsText === '' ? 0 : Number(monthsText.replace(/,/g, ''));
  if (!Number.isFinite(years) || !Number.isFinite(months)) return null;
  if (years < 0 || months < 0) return null;

  const totalYears = years + months / 12;
  if (!Number.isFinite(totalYears) || totalYears <= 0) return null;
  return totalYears;
}

/**
 * Total interest over the IO period (loan currency, full precision).
 * Total = Loan × (Annual Rate / 100) × years
 * Equivalent to periodic payment × number of periods for the same duration.
 */
export function calculateTotalInterestOnlyPaid(input: {
  loanAmount: number;
  annualInterestRatePercent: number;
  periodYears: number;
}): number | null {
  const { loanAmount, annualInterestRatePercent, periodYears } = input;
  if (![loanAmount, annualInterestRatePercent, periodYears].every(Number.isFinite)) {
    return null;
  }
  if (loanAmount < 0 || annualInterestRatePercent < 0 || periodYears <= 0) return null;

  const total = loanAmount * (annualInterestRatePercent / 100) * periodYears;
  return Number.isFinite(total) ? total : null;
}
