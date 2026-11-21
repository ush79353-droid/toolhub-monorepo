import {
  getCurrencyFractionDigits,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  DEFAULT_COMPOUNDING,
  type CompoundingMethod,
  type MinimumPaymentMethod,
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

export function formatIsoDateDisplay(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return iso;
  return `${m[2]}/${m[3]}/${m[1]}`;
}

/** Add whole calendar months to an ISO date (UTC civil date). */
export function addMonthsIso(iso: string, months: number): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(d)) {
    return null;
  }
  const utc = new Date(Date.UTC(y, mo - 1, d));
  if (
    utc.getUTCFullYear() !== y ||
    utc.getUTCMonth() !== mo - 1 ||
    utc.getUTCDate() !== d
  ) {
    return null;
  }
  utc.setUTCMonth(utc.getUTCMonth() + months);
  const yy = String(utc.getUTCFullYear()).padStart(4, '0');
  const mm = String(utc.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(utc.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
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
  // daily_360 — screenshot default when capitalization is unchanged
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

export interface CreditCardMinimumPaymentCalculationInput {
  balance: number;
  annualRate: number;
  dueDate: string;
  minPaymentFloor: number;
  minPaymentPercent: number;
  minPaymentMethod: MinimumPaymentMethod;
  /** Add-on fixed payment (not a replacement of the minimum). */
  monthlyFixPayment: number;
  compounding: CompoundingMethod;
  currency: SupportedCurrency;
}

export interface CreditCardMinimumPaymentCalculationOutput {
  months: number;
  years: number;
  remainingMonths: number;
  payoffDateIso: string;
  payoffDateDisplay: string;
  totalPaid: number;
  totalInterest: number;
  currency: SupportedCurrency;
  compounding: CompoundingMethod;
  formattedTotalPaid: string;
  formattedTotalInterest: string;
  summary: string;
  breakdown: string;
  neverPaysOff: boolean;
}

/**
 * Monthly minimum-payment amortization loop.
 * Interest first, then payment (capped at balance + interest).
 * Detects payments that never reduce principal.
 */
export function calculateCreditCardMinimumPayment(
  input: CreditCardMinimumPaymentCalculationInput
): CreditCardMinimumPaymentCalculationOutput | null {
  const {
    balance: startBalance,
    annualRate,
    dueDate,
    minPaymentFloor,
    minPaymentPercent,
    minPaymentMethod,
    monthlyFixPayment,
    compounding,
    currency,
  } = input;

  if (
    ![
      startBalance,
      annualRate,
      minPaymentFloor,
      minPaymentPercent,
      monthlyFixPayment,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(startBalance > 0) || annualRate < 0) return null;
  if (minPaymentFloor < 0 || minPaymentPercent < 0 || monthlyFixPayment < 0) {
    return null;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate.trim())) return null;

  const effectiveCompounding = compounding || DEFAULT_COMPOUNDING;

  let balance = startBalance;
  let months = 0;
  let totalPaid = 0;
  let totalInterest = 0;
  let neverPaysOff = false;
  let firstScheduled = 0;

  while (balance > 1e-9 && months < MAX_PAYOFF_MONTHS) {
    const interest = monthInterest(balance, annualRate, effectiveCompounding);
    if (!Number.isFinite(interest)) return null;

    const scheduled =
      minimumPaymentDue({
        balance,
        interest,
        floor: minPaymentFloor,
        percent: minPaymentPercent,
        method: minPaymentMethod,
      }) + monthlyFixPayment;

    if (!Number.isFinite(scheduled) || scheduled < 0) return null;
    if (months === 0) firstScheduled = scheduled;

    const due = balance + interest;
    // Payment too small to cover interest → balance never shrinks
    if (scheduled <= interest + 1e-12 && due > scheduled + 1e-9) {
      neverPaysOff = true;
      break;
    }

    const payment = Math.min(scheduled, due);
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

  let payoffDateIso = dueDate.trim();
  if (!neverPaysOff && months > 0) {
    const advanced = addMonthsIso(dueDate.trim(), months);
    if (!advanced) return null;
    payoffDateIso = advanced;
  }
  const payoffDateDisplay = formatIsoDateDisplay(payoffDateIso);

  let summary: string;
  let breakdown: string;

  if (neverPaysOff) {
    summary = `With these minimum-payment settings (about ${money(firstScheduled)} per month), the balance does not pay off.`;
    breakdown =
      'Raise the minimum percentage or floor, add a monthly fixed payment, or lower the APR so payments exceed interest.';
  } else {
    summary = `You will pay off the credit in ${years} year(s), and ${remainingMonths} month(s), on ${payoffDateDisplay}.`;
    breakdown = `The total payment amount is ${money(totalPaid)}, with an interest payment of ${money(totalInterest)}.`;
  }

  return {
    months,
    years,
    remainingMonths,
    payoffDateIso,
    payoffDateDisplay,
    totalPaid,
    totalInterest,
    currency,
    compounding: effectiveCompounding,
    formattedTotalPaid: formatCreditMoney(totalPaid, currency),
    formattedTotalInterest: formatCreditMoney(totalInterest, currency),
    summary,
    breakdown,
    neverPaysOff,
  };
}
