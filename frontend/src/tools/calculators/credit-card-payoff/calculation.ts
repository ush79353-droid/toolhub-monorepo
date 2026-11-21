import {
  getCurrencyFractionDigits,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Hard cap to prevent infinite loops (100 years). */
export const MAX_PAYOFF_MONTHS = 1200;

/** Assumed days in a calendar month for partial-month proration. */
export const DAYS_PER_MONTH = 30;

export function formatPayoffMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatMoneyWithCode(
  amount: number,
  currency: SupportedCurrency
): string {
  return `${getCurrencySymbol(currency)}${formatPayoffMoney(amount, currency)}`;
}

export interface CreditCardPayoffCalculationInput {
  balance: number;
  aprPercent: number;
  monthlyPayment: number;
  currency: SupportedCurrency;
}

export interface CreditCardPayoffCalculationOutput {
  years: number;
  months: number;
  days: number;
  totalPaid: number;
  currency: SupportedCurrency;
  neverPaysOff: boolean;
  summary: string;
  breakdown: string;
}

function normalizeDuration(
  fullMonths: number,
  days: number
): { years: number; months: number; days: number } {
  let totalMonths = fullMonths;
  let d = days;
  if (d >= DAYS_PER_MONTH) {
    totalMonths += Math.floor(d / DAYS_PER_MONTH);
    d = d % DAYS_PER_MONTH;
  }
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return { years, months, days: d };
}

/**
 * Fixed-payment credit-card payoff.
 * monthlyRate = APR/100/12; iterate until balance clears.
 * Final partial month → days ≈ round((finalPayment / monthlyPayment) × 30).
 * APR = 0 → months = balance / payment with the same day proration.
 */
export function calculateCreditCardPayoff(
  input: CreditCardPayoffCalculationInput
): CreditCardPayoffCalculationOutput | null {
  const { balance: startBalance, aprPercent, monthlyPayment, currency } = input;

  if (
    ![startBalance, aprPercent, monthlyPayment].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(startBalance > 0) || aprPercent < 0 || !(monthlyPayment > 0)) {
    return null;
  }

  const money = (n: number) => formatMoneyWithCode(n, currency);

  // Zero APR: exact months = balance / payment
  if (aprPercent === 0) {
    const exactMonths = startBalance / monthlyPayment;
    if (!Number.isFinite(exactMonths) || exactMonths > MAX_PAYOFF_MONTHS) {
      return {
        years: 0,
        months: 0,
        days: 0,
        totalPaid: startBalance,
        currency,
        neverPaysOff: true,
        summary: `With a monthly payment of ${money(monthlyPayment)}, the balance does not pay off within ${MAX_PAYOFF_MONTHS / 12} years.`,
        breakdown: 'Increase the monthly payment so the card can be cleared.',
      };
    }
    const fullMonths = Math.floor(exactMonths);
    const fraction = exactMonths - fullMonths;
    let days =
      fraction < 1e-12
        ? 0
        : Math.max(1, Math.round(fraction * DAYS_PER_MONTH));
    const duration = normalizeDuration(fullMonths, days);
    days = duration.days;

    return {
      years: duration.years,
      months: duration.months,
      days,
      totalPaid: startBalance,
      currency,
      neverPaysOff: false,
      summary: `With a monthly payment of ${money(monthlyPayment)}, you would pay off the credit card in ${duration.years} year(s), ${duration.months} month(s), and ${days} day(s).`,
      breakdown: `The total amount paid is ${money(startBalance)} (0% APR; no interest).`,
    };
  }

  const monthlyRate = aprPercent / 100 / 12;
  let remaining = startBalance;
  let totalPaid = 0;
  let fullMonths = 0;
  let days = 0;
  let neverPaysOff = false;

  while (remaining > 1e-9 && fullMonths < MAX_PAYOFF_MONTHS) {
    const interest = remaining * monthlyRate;
    if (!Number.isFinite(interest)) return null;

    // Payment cannot cover interest → never pays off
    if (monthlyPayment <= interest + 1e-12) {
      neverPaysOff = true;
      break;
    }

    const due = remaining + interest;
    if (due <= monthlyPayment + 1e-9) {
      totalPaid += due;
      const fraction = due / monthlyPayment;
      if (fraction >= 1 - 1e-9) {
        fullMonths += 1;
        days = 0;
      } else {
        days = Math.max(1, Math.round(fraction * DAYS_PER_MONTH));
      }
      remaining = 0;
      break;
    }

    remaining = due - monthlyPayment;
    totalPaid += monthlyPayment;
    fullMonths += 1;

    if (remaining < 1e-9) {
      remaining = 0;
      days = 0;
      break;
    }
  }

  if (!neverPaysOff && fullMonths >= MAX_PAYOFF_MONTHS && remaining > 1e-9) {
    neverPaysOff = true;
  }

  if (!Number.isFinite(totalPaid)) return null;

  if (neverPaysOff) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalPaid: 0,
      currency,
      neverPaysOff: true,
      summary: `With a monthly payment of ${money(monthlyPayment)}, the balance does not pay off under these settings.`,
      breakdown:
        'Increase the payment or lower the APR so each payment exceeds monthly interest.',
    };
  }

  const duration = normalizeDuration(fullMonths, days);

  return {
    years: duration.years,
    months: duration.months,
    days: duration.days,
    totalPaid,
    currency,
    neverPaysOff: false,
    summary: `With a monthly payment of ${money(monthlyPayment)}, you would pay off the credit card in ${duration.years} year(s), ${duration.months} month(s), and ${duration.days} day(s).`,
    breakdown: `The total amount paid is ${money(totalPaid)}.`,
  };
}
