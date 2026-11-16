import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { CompoundingFrequency, TermUnit } from './types';

const BIWEEKLY_PERIODS_PER_YEAR = 26;
const DAYS_PER_BIWEEK = 14;
const MEAN_GREGORIAN_YEAR_DAYS = 365.25;

export function formatBiweeklyMortgageMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatSignedBiweeklyMortgageMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const abs = formatBiweeklyMortgageMoney(Math.abs(amount), currency);
  if (amount < 0) return `-${abs}`;
  return abs;
}

export function formatTermYearsMonths(years: number, months: number): string {
  const y = Math.max(0, years);
  const m = Math.max(0, months);
  if (y === 0 && m === 0) return '0 mos';
  if (y === 0) return `${m} mos`;
  if (m === 0) return `${y} yrs`;
  return `${y} yrs ${m} mos`;
}

/** Convert entered term to whole months. */
export function termToMonths(term: number, unit: TermUnit): number | null {
  if (!(term > 0) || !Number.isFinite(term)) return null;
  const months = unit === 'yrs' ? term * 12 : term;
  if (!(months > 0) || !Number.isFinite(months)) return null;
  return Math.round(months);
}

function usUkMonthlyRate(annualRatePercent: number): number {
  return annualRatePercent / 1200;
}

/** Canadian semi-annual compounding → equivalent monthly rate. */
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
 * Monthly (UK & US): convert from monthly nominal via (1+r_m)^(12/26)−1.
 * Canada: convert from semi-annual via (1+r_s)^(2/26)−1.
 */
function biweeklyPeriodRate(
  annualRatePercent: number,
  compounding: CompoundingFrequency
): number {
  if (compounding === 'semi_annual_canada') {
    const semi = annualRatePercent / 200;
    return Math.pow(1 + semi, 2 / BIWEEKLY_PERIODS_PER_YEAR) - 1;
  }
  const monthly = usUkMonthlyRate(annualRatePercent);
  return Math.pow(1 + monthly, 12 / BIWEEKLY_PERIODS_PER_YEAR) - 1;
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
    const totalMonths = paymentCount;
    return { years: Math.floor(totalMonths / 12), months: totalMonths % 12 };
  }
  // Accelerated biweekly: calendar length from 14-day periods (matches reference term).
  const yearsExact =
    (paymentCount * DAYS_PER_BIWEEK) / MEAN_GREGORIAN_YEAR_DAYS;
  const totalMonths = Math.round(yearsExact * 12);
  return { years: Math.floor(totalMonths / 12), months: totalMonths % 12 };
}

/**
 * Run a fixed-payment amortization schedule with optional per-period extra principal.
 * Handles zero interest, final partial payment, and early payoff.
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
      // Payment does not cover interest — cannot amortize.
      return null;
    }

    const principalPart = payment - interest;
    balance -= principalPart;
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

export interface BiweeklyMortgageCanonicalInput {
  loanAmount: number;
  termMonths: number;
  annualRatePercent: number;
  compounding: CompoundingFrequency;
  mortgagePointsPercent: number;
  upfrontFee: number;
  extraPayment: number;
}

export interface BiweeklyMortgageCanonicalResult {
  closingCosts: number;
  withoutAcceleration: RawSchedule;
  biweekly: RawSchedule;
  paymentDifference: number;
  termSavedYears: number;
  termSavedMonths: number;
  interestDifference: number;
  totalPaymentDifference: number;
}

/**
 * Standard monthly vs accelerated biweekly mortgage comparison.
 * Accelerated biweekly pays half the monthly payment every 14 days (~26/yr),
 * which is not the same as ordinary twice-monthly / biweekly amortization.
 */
export function calculateBiweeklyMortgage(
  input: BiweeklyMortgageCanonicalInput
): BiweeklyMortgageCanonicalResult | null {
  const {
    loanAmount,
    termMonths,
    annualRatePercent,
    compounding,
    mortgagePointsPercent,
    upfrontFee,
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

  const monthlyRate = monthlyPeriodRate(annualRatePercent, compounding);
  const monthlyPayment = amortizingPayment(loanAmount, monthlyRate, termMonths);
  if (!Number.isFinite(monthlyPayment) || monthlyPayment < 0) return null;

  const pointsCost = (loanAmount * mortgagePointsPercent) / 100;
  const closingCosts = pointsCost + upfrontFee;

  const monthly = runSchedule({
    principal: loanAmount,
    periodicRate: monthlyRate,
    scheduledPayment: monthlyPayment,
    extraPerPeriod: extraPayment,
    periodsPerYear: 12,
    maxPeriods: Math.max(termMonths * 2, termMonths + 1),
  });
  if (!monthly) return null;

  const biweeklyRate = biweeklyPeriodRate(annualRatePercent, compounding);
  const biweeklyPayment = monthlyPayment / 2;
  const biweekly = runSchedule({
    principal: loanAmount,
    periodicRate: biweeklyRate,
    scheduledPayment: biweeklyPayment,
    extraPerPeriod: extraPayment,
    periodsPerYear: BIWEEKLY_PERIODS_PER_YEAR,
    // Upper bound: accelerated payoff finishes early; allow long runway.
    maxPeriods: Math.max(termMonths * 4, 1200),
  });
  if (!biweekly) return null;

  const paymentDifference =
    biweeklyPayment * (BIWEEKLY_PERIODS_PER_YEAR / 12) - monthlyPayment;

  const saved = subtractTerms(
    monthly.termYears,
    monthly.termMonths,
    biweekly.termYears,
    biweekly.termMonths
  );

  const monthlyTotal = monthly.totalOfPayments + closingCosts;
  const biweeklyTotal = biweekly.totalOfPayments + closingCosts;

  return {
    closingCosts,
    withoutAcceleration: monthly,
    biweekly,
    paymentDifference,
    termSavedYears: saved.years,
    termSavedMonths: saved.months,
    interestDifference: biweekly.totalInterest - monthly.totalInterest,
    totalPaymentDifference: biweeklyTotal - monthlyTotal,
  };
}
