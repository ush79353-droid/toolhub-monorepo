import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  CompoundingFrequency,
  InterestTreatment,
  RepaymentType,
  ScenarioSummary,
} from './types';

export function formatDeferredMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatCurrencyLabel(
  amount: number,
  currency: SupportedCurrency
): string {
  return `${currency}${formatDeferredMoney(amount, currency)}`;
}

/** YYYY-MM-DD → {y,m,d} or null. */
export function parseIsoDate(
  raw: string
): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (![y, m, d].every(Number.isFinite)) return null;
  if (y < 1 || y > 9999 || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== m - 1 ||
    dt.getUTCDate() !== d
  ) {
    return null;
  }
  return { y, m, d };
}

/** Last calendar day of month (1–12). */
export function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** End-of-month civil date for year/month (1–12). */
export function endOfMonth(y: number, m: number): { y: number; m: number; d: number } {
  return { y, m, d: daysInMonth(y, m) };
}

/** Add `delta` months to a year/month, returning end-of-month. */
export function addMonthsEnd(
  y: number,
  m: number,
  delta: number
): { y: number; m: number; d: number } {
  const idx = y * 12 + (m - 1) + delta;
  const ny = Math.floor(idx / 12);
  const nm = (idx % 12) + 1;
  return endOfMonth(ny, nm);
}

export function formatPayoffDate(date: { y: number; m: number; d: number }): string {
  const utc = new Date(Date.UTC(date.y, date.m - 1, date.d));
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(utc);
}

/**
 * Months from first end-of-month due (balance month) until deferment month,
 * counting scheduled payments that fall strictly before deferment start.
 * Deferment on/before balance month → 0 payments before deferment.
 */
export function paymentsBeforeDeferment(
  balance: { y: number; m: number; d: number },
  deferment: { y: number; m: number; d: number }
): number {
  const balIdx = balance.y * 12 + (balance.m - 1);
  const defIdx = deferment.y * 12 + (deferment.m - 1);
  if (defIdx <= balIdx) return 0;
  // First due is EOM of balance month; payments occur at EOM of each month.
  // A payment in month M is deferred if deferment starts on/before that EOM.
  // Count EOMs strictly before the deferment month.
  return defIdx - balIdx;
}

export function durationToMonths(years: number, months: number): number | null {
  if (![years, months].every(Number.isFinite)) return null;
  if (years < 0 || months < 0) return null;
  if (months > 11 && years === 0) {
    // allow pure month entry via months field only when years provided separately
  }
  if (months > 11) return null;
  const total = Math.round(years * 12 + months);
  return total > 0 ? total : null;
}

export function monthsToYearsMonths(total: number): { years: number; months: number } {
  const years = Math.floor(total / 12);
  const months = total - years * 12;
  return { years, months };
}

export function formatTermLabel(totalMonths: number): string {
  const { years, months } = monthsToYearsMonths(Math.max(0, Math.round(totalMonths)));
  return `${years} y(s) ${months} mo(s)`;
}

/**
 * Equivalent monthly rate from nominal annual percent + compounding convention.
 * Monthly payments use this period rate.
 */
export function equivalentMonthlyRate(
  annualPercent: number,
  compounding: CompoundingFrequency
): number | null {
  if (!Number.isFinite(annualPercent) || annualPercent < 0) return null;
  const R = annualPercent / 100;
  if (R === 0) return 0;

  switch (compounding) {
    case 'monthly':
      return R / 12;
    case 'quarterly':
      return Math.pow(1 + R / 4, 4 / 12) - 1;
    case 'semiannually':
      return Math.pow(1 + R / 2, 2 / 12) - 1;
    case 'annually':
      return Math.pow(1 + R, 1 / 12) - 1;
    case 'daily':
      return Math.pow(1 + R / 365, 365 / 12) - 1;
    case 'continuous':
      return Math.exp(R / 12) - 1;
    default:
      return null;
  }
}

/** Fixed-rate amortizing monthly payment. */
export function amortizingPayment(
  principal: number,
  monthlyRate: number,
  n: number
): number | null {
  if (![principal, monthlyRate, n].every(Number.isFinite)) return null;
  if (!(principal > 0) || !(n > 0) || monthlyRate < 0) return null;
  if (monthlyRate === 0) {
    const p = principal / n;
    return Number.isFinite(p) ? p : null;
  }
  const growth = Math.pow(1 + monthlyRate, n);
  if (!Number.isFinite(growth) || growth === 0) return null;
  const pmt = (principal * monthlyRate * growth) / (growth - 1);
  return Number.isFinite(pmt) ? pmt : null;
}

/** Solve periods from payment; returns fractional n (caller may ceil). */
export function periodsFromPayment(
  principal: number,
  monthlyRate: number,
  payment: number
): number | null {
  if (![principal, monthlyRate, payment].every(Number.isFinite)) return null;
  if (!(principal > 0) || !(payment > 0) || monthlyRate < 0) return null;
  if (monthlyRate === 0) {
    const n = principal / payment;
    return Number.isFinite(n) && n > 0 ? n : null;
  }
  if (payment <= principal * monthlyRate) return null;
  const n =
    Math.log(payment / (payment - principal * monthlyRate)) /
    Math.log(1 + monthlyRate);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Remaining balance after k payments on an n-payment amortizing loan. */
export function remainingBalance(
  principal: number,
  monthlyRate: number,
  payment: number,
  k: number
): number | null {
  if (![principal, monthlyRate, payment, k].every(Number.isFinite)) return null;
  if (k < 0) return null;
  if (k === 0) return principal;
  if (monthlyRate === 0) {
    const bal = principal - payment * k;
    return Number.isFinite(bal) ? Math.max(0, bal) : null;
  }
  const growth = Math.pow(1 + monthlyRate, k);
  if (!Number.isFinite(growth)) return null;
  const bal = principal * growth - payment * ((growth - 1) / monthlyRate);
  if (!Number.isFinite(bal)) return null;
  return Math.abs(bal) < 1e-9 ? 0 : Math.max(0, bal);
}

export interface DefermentEngineInput {
  principal: number;
  annualRatePercent: number;
  compounding: CompoundingFrequency;
  termMonths: number;
  originalPayment: number;
  estimationUsesPayment: boolean;
  interestTreatment: InterestTreatment;
  repaymentType: RepaymentType;
  deferredMonths: number;
  paymentsBefore: number;
  balanceDate: { y: number; m: number; d: number };
}

export interface DefermentEngineResult {
  originalMonthlyPayment: number;
  originalTermMonths: number;
  balanceAtDefermentStart: number;
  balanceAfterDeferment: number;
  deferredInterest: number;
  cashDuringDeferment: number;
  without: ScenarioSummary;
  withDefer: ScenarioSummary;
}

/**
 * Pure deferment comparison in a single currency (loan currency).
 * Cash totals are economically correct (no double-count of capitalized interest).
 */
export function calculateDeferredPaymentLoan(
  input: DefermentEngineInput
): DefermentEngineResult | null {
  const {
    principal,
    annualRatePercent,
    compounding,
    interestTreatment,
    repaymentType,
    deferredMonths,
    paymentsBefore,
    balanceDate,
  } = input;

  if (!(principal > 0) || annualRatePercent < 0) return null;
  if (!(deferredMonths >= 0) || !Number.isInteger(deferredMonths)) return null;
  if (!(paymentsBefore >= 0) || !Number.isInteger(paymentsBefore)) return null;

  const r = equivalentMonthlyRate(annualRatePercent, compounding);
  if (r === null) return null;

  let termMonths = input.termMonths;
  let originalPayment = input.originalPayment;

  if (input.estimationUsesPayment) {
    if (!(originalPayment > 0)) return null;
    const nFrac = periodsFromPayment(principal, r, originalPayment);
    if (nFrac === null) return null;
    termMonths = Math.max(1, Math.ceil(nFrac - 1e-12));
  } else {
    if (!(termMonths > 0) || !Number.isInteger(termMonths)) return null;
    const pmt = amortizingPayment(principal, r, termMonths);
    if (pmt === null) return null;
    originalPayment = pmt;
  }

  if (paymentsBefore >= termMonths) return null;
  if (deferredMonths >= termMonths - paymentsBefore && repaymentType === 'increased_original_term') {
    // Need at least one post-deferment payment when keeping original payoff date.
    if (termMonths - paymentsBefore - deferredMonths < 1) return null;
  }

  const firstDue = endOfMonth(balanceDate.y, balanceDate.m);
  const withoutPayoff = addMonthsEnd(firstDue.y, firstDue.m, termMonths - 1);
  const withoutTotal = originalPayment * termMonths;
  const withoutInterest = withoutTotal - principal;
  const without: ScenarioSummary = {
    monthlyPayment: originalPayment,
    interest: withoutInterest,
    totalPaid: withoutTotal,
    termMonths,
    paymentCount: termMonths,
    payoffDate: formatPayoffDate(withoutPayoff),
  };

  const balStart = remainingBalance(
    principal,
    r,
    originalPayment,
    paymentsBefore
  );
  if (balStart === null) return null;

  let balanceAfter = balStart;
  let deferredInterest = 0;
  let cashDuring = 0;

  if (deferredMonths === 0) {
    deferredInterest = 0;
    balanceAfter = balStart;
  } else if (interestTreatment === 'interest_free') {
    deferredInterest = 0;
    balanceAfter = balStart;
  } else if (interestTreatment === 'paid_monthly') {
    deferredInterest = balStart * r * deferredMonths;
    cashDuring = deferredInterest;
    balanceAfter = balStart;
  } else if (interestTreatment === 'paid_equal_parts') {
    // Accrue separately with same compound growth; principal unchanged.
    const grown = balStart * Math.pow(1 + r, deferredMonths);
    if (!Number.isFinite(grown)) return null;
    deferredInterest = grown - balStart;
    balanceAfter = balStart;
  } else {
    // capitalized
    const grown = balStart * Math.pow(1 + r, deferredMonths);
    if (!Number.isFinite(grown)) return null;
    deferredInterest = grown - balStart;
    balanceAfter = grown;
  }

  const remainingAtDeferStart = termMonths - paymentsBefore;
  let postMonths: number;
  let postPayment: number;

  if (repaymentType === 'increased_original_term') {
    postMonths = remainingAtDeferStart - deferredMonths;
    if (postMonths < 1) return null;
    const pmt = amortizingPayment(balanceAfter, r, postMonths);
    if (pmt === null) return null;
    postPayment = pmt;
  } else if (repaymentType === 'increased_extended_term') {
    postMonths = remainingAtDeferStart;
    if (postMonths < 1) return null;
    const pmt = amortizingPayment(balanceAfter, r, postMonths);
    if (pmt === null) return null;
    postPayment = pmt;
  } else {
    // original payment — extended term
    postPayment = originalPayment;
    if (interestTreatment === 'paid_equal_parts') {
      // Principal amortizes at original payment; equal parts added on top for display.
      const nFrac = periodsFromPayment(balanceAfter, r, originalPayment);
      if (nFrac === null) return null;
      postMonths = Math.max(1, Math.ceil(nFrac - 1e-12));
    } else {
      const nFrac = periodsFromPayment(balanceAfter, r, originalPayment);
      if (nFrac === null) return null;
      postMonths = Math.max(1, Math.ceil(nFrac - 1e-12));
    }
  }

  let equalPart = 0;
  if (interestTreatment === 'paid_equal_parts' && postMonths > 0) {
    equalPart = deferredInterest / postMonths;
  }

  const displayedMonthly =
    interestTreatment === 'paid_equal_parts' ? postPayment + equalPart : postPayment;

  const cashAfter =
    interestTreatment === 'paid_equal_parts'
      ? postPayment * postMonths + deferredInterest
      : postPayment * postMonths;

  const totalPaid = cashDuring + cashAfter;
  const interest = totalPaid - principal;

  // Payoff date: last post-deferment payment.
  // Timeline: paymentsBefore dues, then deferredMonths skipped, then postMonths dues.
  const payoffOffset =
    paymentsBefore + deferredMonths + postMonths - 1;
  const withPayoff = addMonthsEnd(firstDue.y, firstDue.m, Math.max(0, payoffOffset));

  // Table "Term" for deferment column refers to post-deferment repayment length.
  const withDefer: ScenarioSummary = {
    monthlyPayment: displayedMonthly,
    interest,
    totalPaid,
    termMonths: postMonths,
    paymentCount: postMonths,
    payoffDate: formatPayoffDate(withPayoff),
  };

  if (
    ![
      originalPayment,
      balStart,
      balanceAfter,
      deferredInterest,
      without.monthlyPayment,
      withDefer.monthlyPayment,
    ].every(Number.isFinite)
  ) {
    return null;
  }

  return {
    originalMonthlyPayment: originalPayment,
    originalTermMonths: termMonths,
    balanceAtDefermentStart: balStart,
    balanceAfterDeferment: balanceAfter,
    deferredInterest,
    cashDuringDeferment: cashDuring,
    without,
    withDefer,
  };
}
