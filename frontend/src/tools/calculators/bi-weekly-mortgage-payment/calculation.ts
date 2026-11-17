import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { CompoundingFrequency, TermUnit } from './types';

const BIWEEKLY_PPY = 26;
const DAYS_PER_BIWEEK = 14;
const MEAN_GREGORIAN_YEAR_DAYS = 365.25;

export function formatBiWeeklyMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatTermYearsMonths(years: number, months: number): string {
  const y = Math.max(0, years);
  const m = Math.max(0, months);
  if (y === 0 && m === 0) return '0 mos';
  if (y === 0) return `${m} mos`;
  if (m === 0) return `${y} yrs`;
  return `${y} yrs ${m} mos`;
}

/** Screenshot-style MM/DD/YYYY. */
export function formatPayoffDateMdY(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return isoDate;
  return `${Number(match[2])}/${Number(match[3])}/${match[1]}`;
}

export function termToMonths(term: number, unit: TermUnit): number | null {
  if (!(term > 0) || !Number.isFinite(term)) return null;
  const months = unit === 'yrs' ? term * 12 : term;
  if (!(months > 0) || !Number.isFinite(months)) return null;
  return Math.round(months);
}

function usUkMonthlyRate(annualRatePercent: number): number {
  return annualRatePercent / 1200;
}

function canadianMonthlyRate(annualRatePercent: number): number {
  const semi = annualRatePercent / 200;
  return Math.pow(1 + semi, 1 / 6) - 1;
}

function monthlyPeriodRate(
  annualRatePercent: number,
  compounding: CompoundingFrequency
): number {
  return compounding === 'semi_annual_canada'
    ? canadianMonthlyRate(annualRatePercent)
    : usUkMonthlyRate(annualRatePercent);
}

/**
 * Equivalent biweekly rate under the selected compounding convention.
 * Not ordinary twice-monthly (24/yr) payments.
 */
function biweeklyPeriodRate(
  annualRatePercent: number,
  compounding: CompoundingFrequency
): number {
  if (compounding === 'semi_annual_canada') {
    const semi = annualRatePercent / 200;
    return Math.pow(1 + semi, 2 / BIWEEKLY_PPY) - 1;
  }
  const monthly = usUkMonthlyRate(annualRatePercent);
  return Math.pow(1 + monthly, 12 / BIWEEKLY_PPY) - 1;
}

function amortizingPayment(principal: number, r: number, n: number): number {
  if (!(principal > 0) || !(n > 0)) return 0;
  if (r === 0) return principal / n;
  const growth = Math.pow(1 + r, n);
  const denom = growth - 1;
  if (!(denom > 0) || !Number.isFinite(growth)) return NaN;
  return (principal * r * growth) / denom;
}

export interface RawSchedule {
  periodicPayment: number;
  paymentCount: number;
  totalInterest: number;
  totalOfPayments: number;
  termYears: number;
  termMonths: number;
}

function monthsFromPaymentCount(
  paymentCount: number,
  periodsPerYear: number
): { years: number; months: number } {
  if (periodsPerYear === 12) {
    return {
      years: Math.floor(paymentCount / 12),
      months: paymentCount % 12,
    };
  }
  const yearsExact = (paymentCount * DAYS_PER_BIWEEK) / MEAN_GREGORIAN_YEAR_DAYS;
  const totalMonths = Math.round(yearsExact * 12);
  return { years: Math.floor(totalMonths / 12), months: totalMonths % 12 };
}

/**
 * Fixed-payment amortization with optional per-period extra principal.
 * Zero interest, final partial payments, and early payoff supported.
 */
function runSchedule(params: {
  principal: number;
  periodicRate: number;
  scheduledPayment: number;
  extraPerPeriod: number;
  periodsPerYear: number;
  maxPeriods: number;
}): RawSchedule | null {
  const {
    principal,
    periodicRate,
    scheduledPayment,
    extraPerPeriod,
    periodsPerYear,
    maxPeriods,
  } = params;

  if (!(principal > 0) || !(maxPeriods > 0)) return null;
  if (!(scheduledPayment >= 0) || !(extraPerPeriod >= 0)) return null;
  if (!Number.isFinite(periodicRate) || periodicRate < 0) return null;

  let balance = principal;
  let totalInterest = 0;
  let totalOfPayments = 0;
  let paymentCount = 0;

  // ponytail: float residual ceiling ~1¢ of principal; upgrade to cents ledger if needed
  const BALANCE_EPS = Math.max(0.01, principal * 1e-10);

  for (let i = 0; i < maxPeriods && balance > BALANCE_EPS; i += 1) {
    const interest = periodicRate === 0 ? 0 : balance * periodicRate;
    const due = scheduledPayment + extraPerPeriod;
    let payment = due;

    if (payment + BALANCE_EPS >= balance + interest) {
      payment = balance + interest;
    } else if (periodicRate > 0 && payment <= interest + 1e-12) {
      return null;
    }

    balance -= payment - interest;
    if (Math.abs(balance) <= BALANCE_EPS) balance = 0;

    totalInterest += interest;
    totalOfPayments += payment;
    paymentCount += 1;
  }

  if (paymentCount === 0 || balance > BALANCE_EPS) return null;

  const { years, months } = monthsFromPaymentCount(paymentCount, periodsPerYear);
  return {
    periodicPayment: scheduledPayment,
    paymentCount,
    totalInterest,
    totalOfPayments,
    termYears: years,
    termMonths: months,
  };
}

function todayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addMonthsIso(isoDate: string, months: number): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const utc = new Date(Date.UTC(y, m - 1, d));
  if (
    utc.getUTCFullYear() !== y ||
    utc.getUTCMonth() !== m - 1 ||
    utc.getUTCDate() !== d
  ) {
    return null;
  }
  utc.setUTCMonth(utc.getUTCMonth() + months);
  const yy = utc.getUTCFullYear();
  const mm = String(utc.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(utc.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

export function addPeriodsIso(
  isoDate: string,
  periods: number,
  periodsPerYear: number
): string | null {
  if (periodsPerYear === 12) return addMonthsIso(isoDate, periods);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const utc = new Date(Date.UTC(y, m - 1, d));
  utc.setUTCDate(utc.getUTCDate() + periods * DAYS_PER_BIWEEK);
  const yy = utc.getUTCFullYear();
  const mm = String(utc.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(utc.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

export interface BiWeeklyMortgagePaymentCanonicalInput {
  mortgageAmount: number;
  termMonths: number;
  annualRatePercent: number;
  compounding: CompoundingFrequency;
  mortgagePointsPercent: number;
  upfrontFee: number;
  extraPayment: number;
  /** Optional start date; defaults to today (UTC civil). */
  startDate?: string;
}

export interface BiWeeklyMortgagePaymentCanonicalResult {
  closingCosts: number;
  monthly: RawSchedule & { payoffDate: string };
  biweekly: RawSchedule & { payoffDate: string };
}

/**
 * Monthly amortizing schedule vs accelerated biweekly (half monthly every 14 days, 26/yr).
 * Extra principal applies each period on both schedules.
 * Closing costs (points + fee) are added once to each column's total payments.
 */
export function calculateBiWeeklyMortgagePayment(
  input: BiWeeklyMortgagePaymentCanonicalInput
): BiWeeklyMortgagePaymentCanonicalResult | null {
  const {
    mortgageAmount,
    termMonths,
    annualRatePercent,
    compounding,
    mortgagePointsPercent,
    upfrontFee,
    extraPayment,
  } = input;

  if (
    ![
      mortgageAmount,
      termMonths,
      annualRatePercent,
      mortgagePointsPercent,
      upfrontFee,
      extraPayment,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(mortgageAmount > 0) || !(termMonths > 0)) return null;
  if (annualRatePercent < 0 || mortgagePointsPercent < 0) return null;
  if (upfrontFee < 0 || extraPayment < 0) return null;

  const startDate = (input.startDate ?? todayIsoDate()).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) return null;

  const monthlyRate = monthlyPeriodRate(annualRatePercent, compounding);
  const rawMonthly = amortizingPayment(mortgageAmount, monthlyRate, termMonths);
  if (!Number.isFinite(rawMonthly) || rawMonthly < 0) return null;
  // Keep full-precision installment for amortization; display rounds to cents.
  const monthlyPayment = rawMonthly;
  const biweeklyPayment = rawMonthly / 2;

  const closingCosts =
    (mortgageAmount * mortgagePointsPercent) / 100 + upfrontFee;

  const monthly = runSchedule({
    principal: mortgageAmount,
    periodicRate: monthlyRate,
    scheduledPayment: monthlyPayment,
    extraPerPeriod: extraPayment,
    periodsPerYear: 12,
    maxPeriods: Math.max(termMonths * 2, termMonths + 1),
  });
  if (!monthly) return null;
  const monthlyPayoff = addPeriodsIso(startDate, monthly.paymentCount, 12);
  if (!monthlyPayoff) return null;

  const biweeklyRate = biweeklyPeriodRate(annualRatePercent, compounding);
  const biweekly = runSchedule({
    principal: mortgageAmount,
    periodicRate: biweeklyRate,
    scheduledPayment: biweeklyPayment,
    extraPerPeriod: extraPayment,
    periodsPerYear: BIWEEKLY_PPY,
    maxPeriods: Math.max(termMonths * 4, 1200),
  });
  if (!biweekly) return null;
  const biweeklyPayoff = addPeriodsIso(
    startDate,
    biweekly.paymentCount,
    BIWEEKLY_PPY
  );
  if (!biweeklyPayoff) return null;

  return {
    closingCosts,
    monthly: { ...monthly, payoffDate: monthlyPayoff },
    biweekly: { ...biweekly, payoffDate: biweeklyPayoff },
  };
}

/** Minimal self-check: 300k / 7.5% / 30y → monthly ≈ 2,097.64; biweekly finishes early. */
export function biWeeklyMortgagePaymentSelfCheck(): boolean {
  const result = calculateBiWeeklyMortgagePayment({
    mortgageAmount: 300_000,
    termMonths: 360,
    annualRatePercent: 7.5,
    compounding: 'monthly_uk_us',
    mortgagePointsPercent: 0,
    upfrontFee: 0,
    extraPayment: 0,
    startDate: '2026-10-17',
  });
  if (!result) return false;
  const monthlyApprox = Math.round(result.monthly.periodicPayment * 100) / 100;
  if (monthlyApprox !== 2097.64) return false;
  const biweeklyApprox = Math.round(result.biweekly.periodicPayment * 100) / 100;
  if (biweeklyApprox !== 1048.82) return false;
  if (result.monthly.paymentCount !== 360) return false;
  if (result.monthly.payoffDate !== '2056-10-17') return false;
  // More biweekly installments, but earlier calendar payoff and less interest.
  if (!(result.biweekly.payoffDate < result.monthly.payoffDate)) return false;
  if (!(result.biweekly.totalInterest < result.monthly.totalInterest)) return false;
  return true;
}
