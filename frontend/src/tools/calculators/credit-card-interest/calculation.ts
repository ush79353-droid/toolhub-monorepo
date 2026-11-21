import {
  getCurrencyFractionDigits,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  CompoundingMethod,
  MinimumPaymentMethod,
  RepaymentMode,
} from './types';

/** Hard cap to prevent infinite loops (100 years). */
export const MAX_PAYOFF_MONTHS = 1200;

export function formatCreditMoney(
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
  return `${getCurrencySymbol(currency)}${formatCreditMoney(amount, currency)}`;
}

/**
 * Interest accrued for one payment month.
 * Monthly: Balance × APR / 12
 * Daily: Balance × ((1 + APR/d)^days − 1)
 */
export function monthInterest(
  balance: number,
  annualRate: number,
  compounding: CompoundingMethod
): number {
  if (!(balance > 0) || annualRate === 0) return 0;
  if (compounding === 'monthly') {
    return balance * (annualRate / 12);
  }
  if (compounding === 'daily_365') {
    const daily = annualRate / 365;
    const days = 365 / 12;
    return balance * (Math.pow(1 + daily, days) - 1);
  }
  // daily_360
  const daily = annualRate / 360;
  return balance * (Math.pow(1 + daily, 30) - 1);
}

export function minimumPaymentDue(input: {
  balance: number;
  interest: number;
  floor: number;
  percent: number;
  method: MinimumPaymentMethod;
}): number {
  const { balance, interest, floor, percent, method } = input;
  const pctPart = balance * (percent / 100);
  const formula =
    method === 'percent_plus_interest' ? pctPart + interest : pctPart;
  return Math.max(floor, formula);
}

export interface CreditCardInterestCalculationInput {
  balance: number;
  annualRate: number;
  repaymentMode: RepaymentMode;
  fixedPayment: number;
  additionalPayment: number;
  minPaymentFloor: number;
  minPaymentPercent: number;
  minPaymentMethod: MinimumPaymentMethod;
  compounding: CompoundingMethod;
  currency: SupportedCurrency;
}

export interface CreditCardInterestCalculationOutput {
  months: number;
  years: number;
  remainingMonths: number;
  totalPaid: number;
  totalInterest: number;
  firstPayment: number;
  currency: SupportedCurrency;
  repaymentMode: RepaymentMode;
  compounding: CompoundingMethod;
  formattedFirstPayment: string;
  formattedTotalPaid: string;
  formattedTotalInterest: string;
  summary: string;
  breakdown: string;
  neverPaysOff: boolean;
}

/**
 * Monthly amortization loop.
 * Interest first, then payment (capped at balance + interest).
 * Detects payments that never reduce principal.
 */
export function calculateCreditCardInterestPayoff(
  input: CreditCardInterestCalculationInput
): CreditCardInterestCalculationOutput | null {
  const {
    balance: startBalance,
    annualRate,
    repaymentMode,
    fixedPayment,
    additionalPayment,
    minPaymentFloor,
    minPaymentPercent,
    minPaymentMethod,
    compounding,
    currency,
  } = input;

  if (
    ![
      startBalance,
      annualRate,
      fixedPayment,
      additionalPayment,
      minPaymentFloor,
      minPaymentPercent,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(startBalance > 0) || annualRate < 0) return null;
  if (additionalPayment < 0 || minPaymentFloor < 0 || minPaymentPercent < 0) {
    return null;
  }
  if (repaymentMode === 'fixed' && !(fixedPayment > 0) && !(additionalPayment > 0)) {
    return null;
  }

  let balance = startBalance;
  let months = 0;
  let totalPaid = 0;
  let totalInterest = 0;
  let firstPayment = 0;
  let neverPaysOff = false;

  while (balance > 1e-9 && months < MAX_PAYOFF_MONTHS) {
    const interest = monthInterest(balance, annualRate, compounding);
    if (!Number.isFinite(interest)) return null;

    let scheduled: number;
    if (repaymentMode === 'fixed') {
      scheduled = fixedPayment + additionalPayment;
    } else {
      scheduled =
        minimumPaymentDue({
          balance,
          interest,
          floor: minPaymentFloor,
          percent: minPaymentPercent,
          method: minPaymentMethod,
        }) + additionalPayment;
    }

    if (!Number.isFinite(scheduled) || scheduled < 0) return null;

    const due = balance + interest;
    // Payment too small to cover interest → balance never shrinks
    if (scheduled <= interest + 1e-12 && due > scheduled + 1e-9) {
      neverPaysOff = true;
      firstPayment = months === 0 ? scheduled : firstPayment;
      break;
    }

    const payment = Math.min(scheduled, due);
    if (months === 0) firstPayment = payment;

    balance = due - payment;
    totalPaid += payment;
    totalInterest += interest;
    months += 1;

    if (balance < 1e-9) {
      balance = 0;
      break;
    }
  }

  if (!neverPaysOff && months >= MAX_PAYOFF_MONTHS && balance > 1e-9) {
    neverPaysOff = true;
  }

  if (!Number.isFinite(totalPaid) || !Number.isFinite(totalInterest)) {
    return null;
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const money = (n: number) => formatMoneyWithCode(n, currency);

  let summary: string;
  let breakdown: string;

  if (neverPaysOff) {
    summary = `With a monthly payment of ${money(firstPayment)}, the balance does not pay off under these settings.`;
    breakdown =
      'Increase the payment, lower the APR, or raise the minimum percentage so payments exceed monthly interest.';
  } else {
    summary = `With a monthly payment of ${money(firstPayment)}, you would pay off the credit card in ${years} year(s) and ${remainingMonths} month(s).`;
    breakdown = `The total amount paid is ${money(totalPaid)}, including interest of ${money(totalInterest)}.`;
  }

  return {
    months,
    years,
    remainingMonths,
    totalPaid,
    totalInterest,
    firstPayment,
    currency,
    repaymentMode,
    compounding,
    formattedFirstPayment: formatCreditMoney(firstPayment, currency),
    formattedTotalPaid: formatCreditMoney(totalPaid, currency),
    formattedTotalInterest: formatCreditMoney(totalInterest, currency),
    summary,
    breakdown,
    neverPaysOff,
  };
}
