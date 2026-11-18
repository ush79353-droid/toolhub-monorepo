import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { CompoundingFrequency, TermUnit } from './types';

export function formatMortgageRateMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Display APR with up to 3 decimals; trim trailing zeros (Omni: 5 / 5.089). */
export function formatAprPercent(apr: number): string {
  if (!Number.isFinite(apr)) return '—';
  const rounded = Math.round(apr * 1000) / 1000;
  const text = String(rounded);
  return text.replace(/\.?0+$/, '') || '0';
}

/** Convert entered term to whole months. */
export function termToMonths(term: number, unit: TermUnit): number | null {
  if (!(term > 0) || !Number.isFinite(term)) return null;
  const months = unit === 'yrs' ? term * 12 : term;
  if (!(months > 0) || !Number.isFinite(months)) return null;
  return Math.round(months);
}

/**
 * Equivalent monthly period rate from the selected compounding convention.
 * Monthly (UK & US): nominal / 12
 * Semi-annually (Canada): (1 + rate/200)^(1/6) − 1
 * Quarterly: (1 + rate/400)^(1/3) − 1
 * Yearly: (1 + rate/100)^(1/12) − 1
 */
export function monthlyPeriodRate(
  annualRatePercent: number,
  compounding: CompoundingFrequency
): number {
  if (!Number.isFinite(annualRatePercent) || annualRatePercent < 0) return NaN;
  switch (compounding) {
    case 'monthly_uk_us':
      return annualRatePercent / 1200;
    case 'semi_annual_canada':
      return Math.pow(1 + annualRatePercent / 200, 1 / 6) - 1;
    case 'quarterly':
      return Math.pow(1 + annualRatePercent / 400, 1 / 3) - 1;
    case 'yearly':
      return Math.pow(1 + annualRatePercent / 100, 1 / 12) - 1;
    default:
      return NaN;
  }
}

/**
 * Standard fixed-rate amortizing payment.
 * M = P × r / (1 − (1+r)^(-n)); zero interest → P / n.
 */
export function amortizingPayment(
  principal: number,
  monthlyRate: number,
  n: number
): number | null {
  if (!(principal > 0) || !(n > 0) || !Number.isFinite(n)) return null;
  if (!Number.isFinite(monthlyRate) || monthlyRate < 0) return null;
  if (monthlyRate === 0) return principal / n;
  const denom = 1 - Math.pow(1 + monthlyRate, -n);
  if (!(denom > 0)) return null;
  const payment = (principal * monthlyRate) / denom;
  return Number.isFinite(payment) ? payment : null;
}

/** Points cost = loan balance × points% / 100. */
export function pointsCostFromPercent(principal: number, points: number): number {
  return (principal * points) / 100;
}

/**
 * Fee-adjusted APR via cash-flow IRR (bisection on monthly rate).
 * netProceeds = loan − pointsCost − upfrontFee
 * monthlyCashflow = basePayment + annualFee / 12
 * Solve netProceeds = monthlyCashflow × annuity(i, n); APR = 12 × i × 100
 */
export function solveFeeAdjustedApr(input: {
  netProceeds: number;
  monthlyCashflow: number;
  paymentCount: number;
}): number | null {
  const { netProceeds, monthlyCashflow, paymentCount } = input;
  if (!(netProceeds > 0) || !(paymentCount > 0)) return null;
  if (!(monthlyCashflow > 0) || !Number.isFinite(monthlyCashflow)) return null;

  const totalPaid = monthlyCashflow * paymentCount;
  if (totalPaid <= netProceeds) return 0;

  const pv = (r: number): number => {
    if (Math.abs(r) < 1e-15) return monthlyCashflow * paymentCount;
    return (monthlyCashflow * (1 - Math.pow(1 + r, -paymentCount))) / r;
  };

  let low = 0;
  let high = 1;
  for (let i = 0; i < 24 && pv(high) > netProceeds; i += 1) {
    high *= 2;
  }

  for (let i = 0; i < 120; i += 1) {
    const mid = (low + high) / 2;
    if (pv(mid) > netProceeds) low = mid;
    else high = mid;
  }

  const monthlyRate = (low + high) / 2;
  if (!Number.isFinite(monthlyRate) || monthlyRate < 0) return null;
  const apr = monthlyRate * 12 * 100;
  return Number.isFinite(apr) ? apr : null;
}

export interface MortgageRateEngineInput {
  loanBalance: number;
  termMonths: number;
  mortgageRatePercent: number;
  compounding: CompoundingFrequency;
  mortgagePointsPercent: number;
  upfrontFee: number;
  annualFee: number;
}

export interface MortgageRateEngineResult {
  baseMonthlyPayment: number;
  monthlyPayment: number;
  aprPercent: number;
  paidInterest: number;
  totalPayments: number;
  pointsCost: number;
}

/**
 * Fixed-rate mortgage rate engine (loan-currency amounts, full precision).
 * Annual fee is spread monthly into the displayed payment and APR cash flows
 * without double-counting points/upfront against the note payment.
 */
export function calculateMortgageRate(
  input: MortgageRateEngineInput
): MortgageRateEngineResult | null {
  const {
    loanBalance,
    termMonths,
    mortgageRatePercent,
    compounding,
    mortgagePointsPercent,
    upfrontFee,
    annualFee,
  } = input;

  if (!(loanBalance > 0) || !(termMonths > 0)) return null;
  if (
    ![mortgageRatePercent, mortgagePointsPercent, upfrontFee, annualFee].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (mortgageRatePercent < 0 || mortgagePointsPercent < 0) return null;
  if (upfrontFee < 0 || annualFee < 0) return null;

  const r = monthlyPeriodRate(mortgageRatePercent, compounding);
  if (!Number.isFinite(r) || r < 0) return null;

  const baseMonthlyPayment = amortizingPayment(loanBalance, r, termMonths);
  if (baseMonthlyPayment === null) return null;

  const monthlyFee = annualFee / 12;
  const monthlyPayment = baseMonthlyPayment + monthlyFee;
  if (!Number.isFinite(monthlyPayment)) return null;

  const pointsCost = pointsCostFromPercent(loanBalance, mortgagePointsPercent);
  const prepaid = pointsCost + upfrontFee;
  const netProceeds = loanBalance - prepaid;
  if (!(netProceeds > 0)) return null;

  const aprPercent = solveFeeAdjustedApr({
    netProceeds,
    monthlyCashflow: monthlyPayment,
    paymentCount: termMonths,
  });
  if (aprPercent === null) return null;

  const paidInterest = baseMonthlyPayment * termMonths - loanBalance;
  const totalPayments =
    monthlyPayment * termMonths + pointsCost + upfrontFee;

  if (![paidInterest, totalPayments, pointsCost].every(Number.isFinite)) {
    return null;
  }

  return {
    baseMonthlyPayment,
    monthlyPayment,
    aprPercent,
    paidInterest,
    totalPayments,
    pointsCost,
  };
}
