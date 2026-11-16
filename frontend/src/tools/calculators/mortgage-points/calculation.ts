import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  AnnualChartPoint,
  CompoundingFrequency,
  PointsPaymentType,
  TermUnit,
} from './types';

export function formatMortgagePointsMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatBreakEvenMonths(months: number | null): string {
  if (months === null || !Number.isFinite(months)) return '—';
  if (months <= 0) return '0 mos';
  return `${months} mos`;
}

export function formatRatePercent(rate: number): string {
  if (!Number.isFinite(rate)) return '—';
  const rounded = Math.round(rate * 1e6) / 1e6;
  const text = String(rounded);
  return `${text.replace(/\.?0+$/, '') || '0'}%`;
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

export function monthlyPeriodRate(
  annualRatePercent: number,
  compounding: CompoundingFrequency
): number {
  return compounding === 'semi_annual_canada'
    ? canadianMonthlyRate(annualRatePercent)
    : usUkMonthlyRate(annualRatePercent);
}

/**
 * Standard amortizing payment.
 * Payment = P × r / (1 − (1+r)^(-n)); zero interest → P / n.
 */
export function amortizingPayment(
  principal: number,
  monthlyRate: number,
  n: number
): number | null {
  if (!(principal > 0) || !(n > 0) || !Number.isFinite(n)) return null;
  if (!Number.isFinite(monthlyRate) || monthlyRate < 0) return null;
  if (monthlyRate === 0) return principal / n;
  const growth = Math.pow(1 + monthlyRate, n);
  const denom = growth - 1;
  if (!(denom > 0) || !Number.isFinite(growth)) return null;
  return (principal * monthlyRate * growth) / denom;
}

/** Points cost = principal × points / 100 (1 point = 1% of principal). */
export function pointsCostFromPercent(
  principal: number,
  points: number
): number {
  return (principal * points) / 100;
}

export function pointsFromCost(principal: number, cost: number): number | null {
  if (!(principal > 0) || !Number.isFinite(cost)) return null;
  return (cost / principal) * 100;
}

export function discountedRatePercent(
  initialRatePercent: number,
  points: number,
  discountPercentPerPoint: number
): number {
  return initialRatePercent - points * discountPercentPerPoint;
}

export interface ScheduleTotals {
  monthlyPayment: number;
  totalInterest: number;
  totalOfPayments: number;
  /** End-of-year remaining balance and cumulative interest for chart. */
  annual: AnnualSeriesPoint[];
}

export interface AnnualSeriesPoint {
  yearIndex: number;
  balance: number;
  cumulativeInterest: number;
}

/**
 * Full-precision monthly amortization. Avoids NaN/Infinity; final payment
 * clears residual balance.
 */
export function runMonthlySchedule(params: {
  principal: number;
  annualRatePercent: number;
  compounding: CompoundingFrequency;
  termMonths: number;
}): ScheduleTotals | null {
  const { principal, annualRatePercent, compounding, termMonths } = params;
  if (!(principal > 0) || !(termMonths > 0)) return null;
  if (!Number.isFinite(annualRatePercent) || annualRatePercent < 0) return null;

  const r = monthlyPeriodRate(annualRatePercent, compounding);
  const payment = amortizingPayment(principal, r, termMonths);
  if (payment === null || !Number.isFinite(payment) || payment < 0) return null;

  let balance = principal;
  let totalInterest = 0;
  let totalOfPayments = 0;
  const annual: AnnualSeriesPoint[] = [
    { yearIndex: 0, balance: principal, cumulativeInterest: 0 },
  ];

  for (let m = 1; m <= termMonths; m += 1) {
    const interest = r === 0 ? 0 : balance * r;
    let pay = payment;
    if (m === termMonths || pay >= balance + interest) {
      pay = balance + interest;
    }
    if (!Number.isFinite(pay) || pay < 0) return null;

    balance -= pay - interest;
    if (balance < 1e-9) balance = 0;

    totalInterest += interest;
    totalOfPayments += pay;

    if (m % 12 === 0 || m === termMonths) {
      const yearIndex = Math.ceil(m / 12);
      const last = annual[annual.length - 1];
      if (last && last.yearIndex === yearIndex) {
        last.balance = balance;
        last.cumulativeInterest = totalInterest;
      } else {
        annual.push({
          yearIndex,
          balance,
          cumulativeInterest: totalInterest,
        });
      }
    }
  }

  if (!Number.isFinite(totalInterest) || !Number.isFinite(totalOfPayments)) {
    return null;
  }

  return {
    monthlyPayment: payment,
    totalInterest,
    totalOfPayments,
    annual,
  };
}

export interface OptionComputeInput {
  label: 'Option I' | 'Option II';
  originalPrincipal: number;
  points: number;
  pointsCost: number;
  ratePercent: number;
  paymentType: PointsPaymentType;
  compounding: CompoundingFrequency;
  termMonths: number;
  baselineMonthlyPayment: number;
}

export interface OptionComputeResult {
  principal: number;
  monthlyPayment: number;
  monthlySavings: number;
  mortgageRatePercent: number;
  breakEvenMonths: number | null;
  totalInterest: number;
  totalPayments: number;
  pointsCost: number;
  points: number;
  annual: AnnualSeriesPoint[];
}

export function computeOption(
  input: OptionComputeInput
): OptionComputeResult | null {
  const rolled = input.paymentType === 'rolled';
  const principal = rolled
    ? input.originalPrincipal + input.pointsCost
    : input.originalPrincipal;
  if (!(principal > 0)) return null;

  const schedule = runMonthlySchedule({
    principal,
    annualRatePercent: input.ratePercent,
    compounding: input.compounding,
    termMonths: input.termMonths,
  });
  if (!schedule) return null;

  const monthlySavings = input.baselineMonthlyPayment - schedule.monthlyPayment;
  // Break-even = points cost ÷ monthly payment savings vs no-points baseline.
  let breakEvenMonths: number | null = null;
  if (monthlySavings > 1e-9 && input.pointsCost >= 0) {
    breakEvenMonths = Math.ceil(input.pointsCost / monthlySavings);
  } else if (input.pointsCost <= 1e-9) {
    breakEvenMonths = 0;
  }

  // Upfront points are added once to total payments; rolled points are already
  // inside principal / schedule totals — do not double-count.
  const totalPayments = rolled
    ? schedule.totalOfPayments
    : schedule.totalOfPayments + input.pointsCost;

  return {
    principal,
    monthlyPayment: schedule.monthlyPayment,
    monthlySavings,
    mortgageRatePercent: input.ratePercent,
    breakEvenMonths,
    totalInterest: schedule.totalInterest,
    totalPayments,
    pointsCost: input.pointsCost,
    points: input.points,
    annual: schedule.annual,
  };
}

export function buildComparisonChart(
  dueDateIso: string,
  optionI: OptionComputeResult,
  optionII: OptionComputeResult
): AnnualChartPoint[] {
  const start = parseIsoDate(dueDateIso);
  const startYear = start ? start.getUTCFullYear() : new Date().getFullYear();

  const maxYear = Math.max(
    optionI.annual[optionI.annual.length - 1]?.yearIndex ?? 0,
    optionII.annual[optionII.annual.length - 1]?.yearIndex ?? 0
  );

  const mapI = new Map(optionI.annual.map((p) => [p.yearIndex, p]));
  const mapII = new Map(optionII.annual.map((p) => [p.yearIndex, p]));

  const points: AnnualChartPoint[] = [];
  for (let y = 0; y <= maxYear; y += 1) {
    const a = mapI.get(y);
    const b = mapII.get(y);
    points.push({
      year: startYear + y,
      optIBalance: a?.balance ?? 0,
      optIIBalance: b?.balance ?? 0,
      optIInterest: a?.cumulativeInterest ?? 0,
      optIIInterest: b?.cumulativeInterest ?? 0,
    });
  }
  return points;
}

function parseIsoDate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(d)) {
    return null;
  }
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== mo - 1 ||
    dt.getUTCDate() !== d
  ) {
    return null;
  }
  return dt;
}

export function isValidIsoDate(iso: string): boolean {
  return parseIsoDate(iso) !== null;
}

export interface MortgagePointsCanonicalInput {
  loanAmount: number;
  termMonths: number;
  initialRatePercent: number;
  compounding: CompoundingFrequency;
  dueDate: string;
  paymentType: PointsPaymentType;
  optionIPoints: number;
  optionICost: number;
  optionIRatePercent: number;
  optionIIPoints: number;
  optionIICost: number;
  optionIIRatePercent: number;
}

export function calculateMortgagePoints(
  input: MortgagePointsCanonicalInput
): {
  baselineMonthlyPayment: number;
  optionI: OptionComputeResult;
  optionII: OptionComputeResult;
  chart: AnnualChartPoint[];
} | null {
  const baselineRate = monthlyPeriodRate(
    input.initialRatePercent,
    input.compounding
  );
  const baselinePayment = amortizingPayment(
    input.loanAmount,
    baselineRate,
    input.termMonths
  );
  if (baselinePayment === null) return null;

  const optionI = computeOption({
    label: 'Option I',
    originalPrincipal: input.loanAmount,
    points: input.optionIPoints,
    pointsCost: input.optionICost,
    ratePercent: input.optionIRatePercent,
    paymentType: input.paymentType,
    compounding: input.compounding,
    termMonths: input.termMonths,
    baselineMonthlyPayment: baselinePayment,
  });
  const optionII = computeOption({
    label: 'Option II',
    originalPrincipal: input.loanAmount,
    points: input.optionIIPoints,
    pointsCost: input.optionIICost,
    ratePercent: input.optionIIRatePercent,
    paymentType: input.paymentType,
    compounding: input.compounding,
    termMonths: input.termMonths,
    baselineMonthlyPayment: baselinePayment,
  });
  if (!optionI || !optionII) return null;

  return {
    baselineMonthlyPayment: baselinePayment,
    optionI,
    optionII,
    chart: buildComparisonChart(input.dueDate, optionI, optionII),
  };
}
