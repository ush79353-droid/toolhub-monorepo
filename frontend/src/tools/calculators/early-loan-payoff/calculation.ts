import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  ChartPoint,
  CompoundingFrequency,
  EarlyLoanPayoffResult,
  ScheduleRow,
  YearlyRow,
} from './types';
import { COMPOUNDING_FREQUENCY_OPTIONS } from './types';

export function formatEarlyLoanMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function compoundingPeriodsPerYear(freq: CompoundingFrequency): number {
  const found = COMPOUNDING_FREQUENCY_OPTIONS.find((o) => o.value === freq);
  return found?.periodsPerYear ?? 12;
}

/** Effective monthly rate: i = (1 + j/m)^(m/12) − 1; for monthly compounding i = j/12. */
export function effectiveMonthlyRate(
  annualRatePercent: number,
  compounding: CompoundingFrequency
): number {
  if (annualRatePercent <= 0) return 0;
  const j = annualRatePercent / 100;
  const m = compoundingPeriodsPerYear(compounding);
  if (m === 12) return j / 12;
  return Math.expm1((m / 12) * Math.log1p(j / m));
}

export function termToMonths(years: number, months: number): number | null {
  if (![years, months].every(Number.isFinite)) return null;
  if (years < 0 || months < 0) return null;
  const n = Math.round(years * 12 + months);
  return n > 0 ? n : null;
}

/** Level payment: M = P × i / (1 − (1+i)^(-n)); when i = 0, M = P/n. */
export function levelMonthlyPayment(
  principal: number,
  monthlyRate: number,
  n: number
): number | null {
  if (!(principal > 0) || !(n > 0)) return null;
  if (monthlyRate <= 0) return principal / n;
  const denom = -Math.expm1(-n * Math.log1p(monthlyRate));
  if (!(denom > 0)) return null;
  const m = (principal * monthlyRate) / denom;
  return Number.isFinite(m) ? m : null;
}

function buildYearlyRows(schedule: ScheduleRow[]): YearlyRow[] {
  if (schedule.length === 0) return [];
  const rows: YearlyRow[] = [];
  let year = 1;
  let bucket: ScheduleRow[] = [];

  for (let i = 0; i < schedule.length; i += 1) {
    bucket.push(schedule[i]!);
    const yearEnd = bucket.length === 12 || i === schedule.length - 1;
    if (yearEnd) {
      rows.push({
        year,
        yearlyPayment: bucket.reduce((s, r) => s + r.totalPayment, 0),
        yearlyPrincipal: bucket.reduce(
          (s, r) => s + r.principalPaid + r.extraPayment,
          0
        ),
        yearlyInterest: bucket.reduce((s, r) => s + r.interestPaid, 0),
      });
      year += 1;
      bucket = [];
    }
  }
  return rows;
}

function buildChartPoints(schedule: ScheduleRow[]): ChartPoint[] {
  const points: ChartPoint[] = [
    {
      year: 0,
      period: 0,
      principalBalance: schedule[0]?.openingBalance ?? 0,
      principalPaid: 0,
      interestPaid: 0,
    },
  ];
  for (const row of schedule) {
    points.push({
      year: row.period / 12,
      period: row.period,
      principalBalance: row.closingBalance,
      principalPaid: row.cumulativePrincipal,
      interestPaid: row.cumulativeInterest,
    });
  }
  return points;
}

function formatTimeSaved(monthsSaved: number): string {
  if (monthsSaved <= 0) return '';
  const y = Math.floor(monthsSaved / 12);
  const m = monthsSaved % 12;
  const parts: string[] = [];
  if (y > 0) parts.push(`${y} yr${y === 1 ? '' : 's'}`);
  if (m > 0) parts.push(`${m} mo${m === 1 ? '' : 's'}`);
  return parts.join(' ');
}

export interface RunScheduleInput {
  principal: number;
  monthlyRate: number;
  scheduledPayments: number;
  extraMonthly: number;
  useDecreasingPayments: boolean;
}

/**
 * Full-precision monthly amortization.
 * Level mode: fixed M from original P/n/i.
 * Decreasing mode: equal principal = P/n, payment = principal share + interest on balance.
 * Extra payments apply to principal after scheduled principal; final payment capped.
 */
export function runSchedule(input: RunScheduleInput): {
  rows: ScheduleRow[];
  totalPayment: number;
  totalInterest: number;
  totalExtra: number;
  firstScheduledPayment: number;
  actualPayments: number;
} | null {
  const { principal, monthlyRate, scheduledPayments, extraMonthly, useDecreasingPayments } =
    input;
  if (!(principal > 0) || !(scheduledPayments > 0)) return null;
  if (!(extraMonthly >= 0) || !Number.isFinite(extraMonthly)) return null;

  const equalPrincipal = principal / scheduledPayments;
  const levelPayment = useDecreasingPayments
    ? null
    : levelMonthlyPayment(principal, monthlyRate, scheduledPayments);
  if (!useDecreasingPayments && (levelPayment === null || !Number.isFinite(levelPayment))) {
    return null;
  }

  const rows: ScheduleRow[] = [];
  let balance = principal;
  let cumPrincipal = 0;
  let cumInterest = 0;
  let totalPayment = 0;
  let totalInterest = 0;
  let totalExtra = 0;
  let firstScheduledPayment = 0;

  for (let period = 1; period <= scheduledPayments; period += 1) {
    if (!(balance > 1e-10)) break;

    const opening = balance;
    const interest = opening * monthlyRate;
    if (!Number.isFinite(interest)) return null;

    let scheduledPrincipal: number;
    let scheduledPayment: number;

    if (useDecreasingPayments) {
      scheduledPrincipal = Math.min(equalPrincipal, opening);
      scheduledPayment = scheduledPrincipal + interest;
    } else {
      scheduledPayment = levelPayment!;
      scheduledPrincipal = scheduledPayment - interest;
      if (scheduledPrincipal < 0) {
        // Interest exceeds payment — still apply payment to interest then principal.
        scheduledPrincipal = 0;
      }
      scheduledPrincipal = Math.min(scheduledPrincipal, opening);
      scheduledPayment = scheduledPrincipal + interest;
    }

    if (period === 1) firstScheduledPayment = scheduledPayment;

    let remainingAfterPrincipal = opening - scheduledPrincipal;
    let extra = 0;
    if (extraMonthly > 0 && remainingAfterPrincipal > 1e-10) {
      extra = Math.min(extraMonthly, remainingAfterPrincipal);
      remainingAfterPrincipal -= extra;
    }

    // Cap final / overpayment
    if (remainingAfterPrincipal < 1e-8) {
      remainingAfterPrincipal = 0;
    }

    // If scheduled + interest would overpay (level last period), already capped via min.

    const principalPaid = scheduledPrincipal;
    const closing = remainingAfterPrincipal;
    const payment = scheduledPayment + extra;

    balance = closing;
    cumPrincipal += principalPaid + extra;
    cumInterest += interest;
    totalPayment += payment;
    totalInterest += interest;
    totalExtra += extra;

    rows.push({
      period,
      openingBalance: opening,
      scheduledPayment,
      principalPaid,
      interestPaid: interest,
      extraPayment: extra,
      totalPayment: payment,
      closingBalance: closing,
      cumulativePrincipal: cumPrincipal,
      cumulativeInterest: cumInterest,
    });

    if (closing <= 1e-8) break;
  }

  if (rows.length === 0) return null;

  return {
    rows,
    totalPayment,
    totalInterest,
    totalExtra,
    firstScheduledPayment,
    actualPayments: rows.length,
  };
}

export function calculateEarlyLoanPayoff(input: {
  principal: number;
  annualRatePercent: number;
  compounding: CompoundingFrequency;
  termYears: number;
  termMonths: number;
  extraMonthly: number;
  useDecreasingPayments: boolean;
  currency: SupportedCurrency;
}): EarlyLoanPayoffResult | null {
  const n = termToMonths(input.termYears, input.termMonths);
  if (n === null) return null;
  const i = effectiveMonthlyRate(input.annualRatePercent, input.compounding);

  const baseline = runSchedule({
    principal: input.principal,
    monthlyRate: i,
    scheduledPayments: n,
    extraMonthly: 0,
    useDecreasingPayments: input.useDecreasingPayments,
  });
  if (!baseline) return null;

  const hasExtra = input.extraMonthly > 0;
  const accelerated = hasExtra
    ? runSchedule({
        principal: input.principal,
        monthlyRate: i,
        scheduledPayments: n,
        extraMonthly: input.extraMonthly,
        useDecreasingPayments: input.useDecreasingPayments,
      })
    : baseline;
  if (!accelerated) return null;

  const monthsSaved = Math.max(0, baseline.actualPayments - accelerated.actualPayments);
  const interestSavings = Math.max(
    0,
    baseline.totalInterest - accelerated.totalInterest
  );

  return {
    currency: input.currency,
    hasExtraPayments: hasExtra,
    useDecreasingPayments: input.useDecreasingPayments,
    monthlyRepayment: accelerated.firstScheduledPayment,
    formattedMonthlyRepayment: formatEarlyLoanMoney(
      accelerated.firstScheduledPayment,
      input.currency
    ),
    totalRepayment: accelerated.totalPayment,
    formattedTotalRepayment: formatEarlyLoanMoney(
      accelerated.totalPayment,
      input.currency
    ),
    totalInterest: accelerated.totalInterest,
    formattedTotalInterest: formatEarlyLoanMoney(
      accelerated.totalInterest,
      input.currency
    ),
    scheduledPayments: n,
    actualPayments: accelerated.actualPayments,
    monthsSaved,
    interestSavings,
    formattedInterestSavings: formatEarlyLoanMoney(interestSavings, input.currency),
    baselineTotalInterest: baseline.totalInterest,
    baselineTotalRepayment: baseline.totalPayment,
    baselineMonthlyRepayment: baseline.firstScheduledPayment,
    formattedBaselineMonthlyRepayment: formatEarlyLoanMoney(
      baseline.firstScheduledPayment,
      input.currency
    ),
    timeSavedLabel: formatTimeSaved(monthsSaved),
    schedule: accelerated.rows,
    yearlyRows: buildYearlyRows(accelerated.rows),
    chartPoints: buildChartPoints(accelerated.rows),
  };
}
