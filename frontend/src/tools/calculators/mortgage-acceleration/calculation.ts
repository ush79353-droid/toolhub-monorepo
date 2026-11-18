import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  AccelerationType,
  CompoundingFrequency,
  TermUnit,
} from './types';

const BIWEEKLY_PPY = 26;
const DAYS_PER_BIWEEK = 14;
const MEAN_GREGORIAN_YEAR_DAYS = 365.25;

export function formatMortgageAccelerationMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatSignedMoney(amount: number, currency: SupportedCurrency): string {
  const abs = formatMortgageAccelerationMoney(Math.abs(amount), currency);
  if (Object.is(amount, -0) || amount === 0) return abs;
  return amount < 0 ? `-${abs}` : abs;
}

export function formatTermYearsMonths(years: number, months: number): string {
  const y = Math.max(0, years);
  const m = Math.max(0, months);
  if (y === 0 && m === 0) return '0 mos';
  if (y === 0) return `${m} mos`;
  if (m === 0) return `${y} yrs`;
  return `${y} yrs ${m} mos`;
}

export function formatDisplayDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return isoDate;
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = months[Number(match[2]) - 1] ?? match[2];
  return `${month} ${Number(match[3])}, ${match[1]}`;
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
 * Zero interest and final partial payments supported.
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

  for (let i = 0; i < maxPeriods && balance > 1e-9; i += 1) {
    const interest = periodicRate === 0 ? 0 : balance * periodicRate;
    const due = scheduledPayment + extraPerPeriod;
    let payment = due;

    if (payment >= balance + interest) {
      payment = balance + interest;
    } else if (periodicRate > 0 && payment <= interest + 1e-12) {
      return null;
    }

    balance -= payment - interest;
    if (balance < 0) balance = 0;

    totalInterest += interest;
    totalOfPayments += payment;
    paymentCount += 1;
  }

  if (paymentCount === 0 || balance > 1e-6) return null;

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

/** Add whole months to YYYY-MM-DD (UTC civil). */
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

function subtractTerms(
  aYears: number,
  aMonths: number,
  bYears: number,
  bMonths: number
): { years: number; months: number } {
  let total = aYears * 12 + aMonths - (bYears * 12 + bMonths);
  if (total < 0) total = 0;
  return { years: Math.floor(total / 12), months: total % 12 };
}

export interface MortgageAccelerationCanonicalInput {
  loanAmount: number;
  termMonths: number;
  annualRatePercent: number;
  accelerationType: AccelerationType;
  compounding: CompoundingFrequency;
  mortgagePointsPercent: number;
  upfrontFee: number;
  dueDate: string;
  extraPayment: number;
}

export interface MortgageAccelerationCanonicalResult {
  closingCosts: number;
  without: RawSchedule & { payoffDate: string; periodsPerYear: number };
  accelerated: RawSchedule & {
    payoffDate: string;
    periodsPerYear: number;
    paymentSuffix: '/mo' | ' bi-weekly';
  };
  paymentDifferenceMonthly: number;
  termSavedYears: number;
  termSavedMonths: number;
  interestDifference: number;
  totalPaymentDifference: number;
}

/**
 * Baseline monthly schedule vs accelerated / biweekly / monthly-overpayment schedule.
 * Accelerated biweekly = half the standard monthly installment every 14 days (26/yr).
 * Ordinary biweekly = (monthly × 12) / 26 — not the same as accelerated.
 */
export function calculateMortgageAcceleration(
  input: MortgageAccelerationCanonicalInput
): MortgageAccelerationCanonicalResult | null {
  const {
    loanAmount,
    termMonths,
    annualRatePercent,
    accelerationType,
    compounding,
    mortgagePointsPercent,
    upfrontFee,
    dueDate,
    extraPayment,
  } = input;

  if (
    ![
      loanAmount,
      termMonths,
      annualRatePercent,
      mortgagePointsPercent,
      upfrontFee,
      extraPayment,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(loanAmount > 0) || !(termMonths > 0)) return null;
  if (annualRatePercent < 0 || mortgagePointsPercent < 0) return null;
  if (upfrontFee < 0 || extraPayment < 0) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate.trim())) return null;

  const monthlyRate = monthlyPeriodRate(annualRatePercent, compounding);
  const monthlyPayment = amortizingPayment(loanAmount, monthlyRate, termMonths);
  if (!Number.isFinite(monthlyPayment) || monthlyPayment < 0) return null;

  const closingCosts =
    (loanAmount * mortgagePointsPercent) / 100 + upfrontFee;

  // Baseline: standard monthly, no extra (extra belongs on the accelerated path).
  const without = runSchedule({
    principal: loanAmount,
    periodicRate: monthlyRate,
    scheduledPayment: monthlyPayment,
    extraPerPeriod: 0,
    periodsPerYear: 12,
    maxPeriods: Math.max(termMonths * 2, termMonths + 1),
  });
  if (!without) return null;
  const withoutPayoff = addPeriodsIso(dueDate, without.paymentCount, 12);
  if (!withoutPayoff) return null;

  let accelerated: RawSchedule | null = null;
  let periodsPerYear = 12;
  let paymentSuffix: '/mo' | ' bi-weekly' = '/mo';

  if (accelerationType === 'monthly_overpayment') {
    periodsPerYear = 12;
    paymentSuffix = '/mo';
    accelerated = runSchedule({
      principal: loanAmount,
      periodicRate: monthlyRate,
      scheduledPayment: monthlyPayment,
      extraPerPeriod: extraPayment,
      periodsPerYear: 12,
      maxPeriods: Math.max(termMonths * 2, termMonths + 1),
    });
  } else if (accelerationType === 'accelerated_biweekly') {
    periodsPerYear = BIWEEKLY_PPY;
    paymentSuffix = ' bi-weekly';
    const biweeklyRate = biweeklyPeriodRate(annualRatePercent, compounding);
    accelerated = runSchedule({
      principal: loanAmount,
      periodicRate: biweeklyRate,
      scheduledPayment: monthlyPayment / 2,
      extraPerPeriod: extraPayment,
      periodsPerYear: BIWEEKLY_PPY,
      maxPeriods: Math.max(termMonths * 4, 1200),
    });
  } else {
    // Ordinary biweekly: same annual cash as monthly, split across 26 periods.
    periodsPerYear = BIWEEKLY_PPY;
    paymentSuffix = ' bi-weekly';
    const biweeklyRate = biweeklyPeriodRate(annualRatePercent, compounding);
    accelerated = runSchedule({
      principal: loanAmount,
      periodicRate: biweeklyRate,
      scheduledPayment: (monthlyPayment * 12) / BIWEEKLY_PPY,
      extraPerPeriod: extraPayment,
      periodsPerYear: BIWEEKLY_PPY,
      maxPeriods: Math.max(termMonths * 4, 1200),
    });
  }

  if (!accelerated) return null;
  const acceleratedPayoff = addPeriodsIso(
    dueDate,
    accelerated.paymentCount,
    periodsPerYear
  );
  if (!acceleratedPayoff) return null;

  const paymentDifferenceMonthly =
    accelerationType === 'monthly_overpayment'
      ? accelerated.periodicPayment + extraPayment - monthlyPayment
      : accelerated.periodicPayment * (BIWEEKLY_PPY / 12) - monthlyPayment;

  const saved = subtractTerms(
    without.termYears,
    without.termMonths,
    accelerated.termYears,
    accelerated.termMonths
  );

  return {
    closingCosts,
    without: { ...without, payoffDate: withoutPayoff, periodsPerYear: 12 },
    accelerated: {
      ...accelerated,
      payoffDate: acceleratedPayoff,
      periodsPerYear,
      paymentSuffix,
    },
    paymentDifferenceMonthly,
    termSavedYears: saved.years,
    termSavedMonths: saved.months,
    interestDifference: accelerated.totalInterest - without.totalInterest,
    totalPaymentDifference:
      accelerated.totalOfPayments +
      closingCosts -
      (without.totalOfPayments + closingCosts),
  };
}

/** Minimal self-check: 300k / 7.5% / 30y accelerated biweekly finishes early. */
export function mortgageAccelerationSelfCheck(): boolean {
  const result = calculateMortgageAcceleration({
    loanAmount: 300_000,
    termMonths: 360,
    annualRatePercent: 7.5,
    accelerationType: 'accelerated_biweekly',
    compounding: 'monthly_uk_us',
    mortgagePointsPercent: 0,
    upfrontFee: 0,
    dueDate: '2026-11-15',
    extraPayment: 0,
  });
  if (!result) return false;
  const monthlyApprox = Math.round(result.without.periodicPayment * 100) / 100;
  if (monthlyApprox !== 2097.64) return false;
  if (!(result.accelerated.paymentCount < result.without.paymentCount)) return false;
  if (!(result.accelerated.totalInterest < result.without.totalInterest)) return false;
  return true;
}
