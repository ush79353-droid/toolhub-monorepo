import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  AnnualChartPoint,
  CompoundingFrequency,
  ScheduleRow,
  TermUnit,
} from './types';

export function formatMortgageInterestMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Display APR with up to 3 decimals; trim trailing zeros. */
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

/** Points cost = principal × points% / 100. */
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

function parseIsoDate(iso: string): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (![y, m, d].every(Number.isFinite)) return null;
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  return { y, m, d };
}

/** Add whole months to an ISO civil date without DST shifts. */
export function addMonthsIso(iso: string, monthsToAdd: number): string | null {
  const parsed = parseIsoDate(iso);
  if (!parsed || !Number.isFinite(monthsToAdd)) return null;
  const total = parsed.y * 12 + (parsed.m - 1) + monthsToAdd;
  const y = Math.floor(total / 12);
  const m = (total % 12) + 1;
  const dim = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const d = Math.min(parsed.d, dim);
  return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export interface AmortizationBuild {
  schedule: ScheduleRow[];
  chartPoints: AnnualChartPoint[];
  totalInterest: number;
}

/**
 * Full-precision monthly schedule. Chart and amortization table share this ledger.
 * Annual fee is not part of the note amortization — only base payment + interest.
 */
export function buildAmortization(input: {
  principal: number;
  baseMonthlyPayment: number;
  monthlyRate: number;
  annualRatePercent: number;
  termMonths: number;
  scheduleFrom: string;
}): AmortizationBuild | null {
  const {
    principal,
    baseMonthlyPayment,
    monthlyRate,
    annualRatePercent,
    termMonths,
    scheduleFrom,
  } = input;

  if (!(principal > 0) || !(termMonths > 0) || !(baseMonthlyPayment > 0)) {
    return null;
  }
  if (!Number.isFinite(monthlyRate) || monthlyRate < 0) return null;
  if (!parseIsoDate(scheduleFrom)) return null;

  const startYear = parseIsoDate(scheduleFrom)!.y;
  const schedule: ScheduleRow[] = [];
  const chartPoints: AnnualChartPoint[] = [
    {
      calendarYear: startYear,
      year: 0,
      loanBalance: principal,
      principalPaid: 0,
      interestPaid: 0,
    },
  ];

  let balance = principal;
  let cumPrincipal = 0;
  let cumInterest = 0;

  for (let m = 1; m <= termMonths; m += 1) {
    const interest = monthlyRate === 0 ? 0 : balance * monthlyRate;
    if (!Number.isFinite(interest)) return null;

    let pay = baseMonthlyPayment;
    if (m === termMonths || pay >= balance + interest) {
      pay = balance + interest;
    }
    let principalPaid = pay - interest;
    if (principalPaid < 0) principalPaid = 0;
    if (principalPaid > balance) principalPaid = balance;

    balance -= principalPaid;
    if (balance < 1e-10) balance = 0;

    cumPrincipal += principalPaid;
    cumInterest += interest;

    const date = addMonthsIso(scheduleFrom, m - 1);
    if (!date) return null;

    schedule.push({
      paymentNumber: m,
      date,
      payment: pay,
      principal: principalPaid,
      interest,
      balance,
      annualRatePercent,
    });

    if (m % 12 === 0 || m === termMonths) {
      const yearIndex = m / 12;
      const calendarYear =
        m % 12 === 0
          ? startYear + Math.round(yearIndex)
          : startYear + Math.ceil(yearIndex);
      chartPoints.push({
        calendarYear,
        year: yearIndex,
        loanBalance: balance,
        principalPaid: cumPrincipal,
        interestPaid: cumInterest,
      });
    }
  }

  if (!Number.isFinite(cumInterest)) return null;

  return {
    schedule,
    chartPoints,
    totalInterest: cumInterest,
  };
}

export interface MortgageInterestEngineInput {
  principal: number;
  termMonths: number;
  interestRatePercent: number;
  compounding: CompoundingFrequency;
  mortgagePointsPercent: number;
  upfrontFee: number;
  annualFee: number;
  scheduleFrom: string;
}

export interface MortgageInterestEngineResult {
  baseMonthlyPayment: number;
  monthlyPayment: number;
  aprPercent: number;
  mortgageInterest: number;
  totalPayments: number;
  pointsCost: number;
  chartPoints: AnnualChartPoint[];
  schedule: ScheduleRow[];
}

/**
 * Fixed-rate mortgage interest engine (loan-currency amounts, full precision).
 * Annual fee spreads into the displayed payment and APR cash flows only —
 * note interest and the amortization ledger use the base payment.
 */
export function calculateMortgageInterest(
  input: MortgageInterestEngineInput
): MortgageInterestEngineResult | null {
  const {
    principal,
    termMonths,
    interestRatePercent,
    compounding,
    mortgagePointsPercent,
    upfrontFee,
    annualFee,
    scheduleFrom,
  } = input;

  if (!(principal > 0) || !(termMonths > 0)) return null;
  if (
    ![interestRatePercent, mortgagePointsPercent, upfrontFee, annualFee].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (interestRatePercent < 0 || mortgagePointsPercent < 0) return null;
  if (upfrontFee < 0 || annualFee < 0) return null;

  const r = monthlyPeriodRate(interestRatePercent, compounding);
  if (!Number.isFinite(r) || r < 0) return null;

  const baseMonthlyPayment = amortizingPayment(principal, r, termMonths);
  if (baseMonthlyPayment === null) return null;

  const monthlyFee = annualFee / 12;
  const monthlyPayment = baseMonthlyPayment + monthlyFee;
  if (!Number.isFinite(monthlyPayment)) return null;

  const pointsCost = pointsCostFromPercent(principal, mortgagePointsPercent);
  const prepaid = pointsCost + upfrontFee;
  const netProceeds = principal - prepaid;
  if (!(netProceeds > 0)) return null;

  const aprPercent = solveFeeAdjustedApr({
    netProceeds,
    monthlyCashflow: monthlyPayment,
    paymentCount: termMonths,
  });
  if (aprPercent === null) return null;

  const amort = buildAmortization({
    principal,
    baseMonthlyPayment,
    monthlyRate: r,
    annualRatePercent: interestRatePercent,
    termMonths,
    scheduleFrom,
  });
  if (amort === null) return null;

  const totalPayments =
    monthlyPayment * termMonths + pointsCost + upfrontFee;
  if (!Number.isFinite(totalPayments)) return null;

  return {
    baseMonthlyPayment,
    monthlyPayment,
    aprPercent,
    mortgageInterest: amort.totalInterest,
    totalPayments,
    pointsCost,
    chartPoints: amort.chartPoints,
    schedule: amort.schedule,
  };
}
