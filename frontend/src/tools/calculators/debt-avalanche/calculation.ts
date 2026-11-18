import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { DebtAvalancheResult, ScenarioSummary } from './types';

const MAX_MONTHS = 1200;

export function formatDebtAvalancheMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export interface NormalizedDebt {
  id: number;
  principal: number;
  annualRatePercent: number;
  monthlyPayment: number;
}

export interface ScheduleOutcome {
  months: number;
  totalInterest: number;
  totalPaid: number;
  /** Sum of opening balances across months (for average-balance APR). */
  openingBalanceSum: number;
  stuck: boolean;
}

function monthlyRate(annualRatePercent: number): number {
  return annualRatePercent / 100 / 12;
}

/** Independent minimum-payment schedules; payoff = max term; no reallocation. */
export function runBaselineSchedule(debts: NormalizedDebt[]): ScheduleOutcome {
  let totalInterest = 0;
  let totalPaid = 0;
  let months = 0;
  let openingBalanceSum = 0;

  for (const debt of debts) {
    const r = monthlyRate(debt.annualRatePercent);
    let bal = debt.principal;
    let interest = 0;
    let paid = 0;
    let m = 0;

    while (bal > 1e-8 && m < MAX_MONTHS) {
      m += 1;
      openingBalanceSum += bal;
      const int = bal * r;
      if (debt.monthlyPayment <= int + 1e-12) {
        return {
          months: Number.POSITIVE_INFINITY,
          totalInterest: Number.POSITIVE_INFINITY,
          totalPaid: Number.POSITIVE_INFINITY,
          openingBalanceSum: 0,
          stuck: true,
        };
      }
      const pay = Math.min(debt.monthlyPayment, bal + int);
      interest += int;
      paid += pay;
      bal = bal + int - pay;
      if (bal < 1e-8) bal = 0;
    }

    if (bal > 1e-8) {
      return {
        months: Number.POSITIVE_INFINITY,
        totalInterest: Number.POSITIVE_INFINITY,
        totalPaid: Number.POSITIVE_INFINITY,
        openingBalanceSum: 0,
        stuck: true,
      };
    }

    totalInterest += interest;
    totalPaid += paid;
    months = Math.max(months, m);
  }

  return {
    months,
    totalInterest,
    totalPaid,
    openingBalanceSum,
    stuck: false,
  };
}

/**
 * Avalanche: each month pay original minimums on active debts, then dump any
 * remaining budget on the highest-rate debt. After a debt is paid off, its
 * former minimum stays in the shared budget (constant total payment).
 */
export function runAvalancheSchedule(debts: NormalizedDebt[]): ScheduleOutcome {
  const state = debts.map((d) => ({
    id: d.id,
    bal: d.principal,
    apr: d.annualRatePercent,
    min: d.monthlyPayment,
  }));
  const budget = debts.reduce((s, d) => s + d.monthlyPayment, 0);
  let totalInterest = 0;
  let totalPaid = 0;
  let months = 0;
  let openingBalanceSum = 0;

  while (state.some((d) => d.bal > 1e-8) && months < MAX_MONTHS) {
    months += 1;
    openingBalanceSum += state.reduce((s, d) => s + Math.max(0, d.bal), 0);

    for (const d of state) {
      if (d.bal <= 1e-8) continue;
      const int = d.bal * monthlyRate(d.apr);
      d.bal += int;
      totalInterest += int;
    }

    let remaining = budget;
    let paidThisMonth = 0;
    const active = state
      .filter((d) => d.bal > 1e-8)
      .sort((a, b) => b.apr - a.apr || a.id - b.id);

    for (const d of active) {
      const minPay = Math.min(d.min, d.bal, remaining);
      d.bal -= minPay;
      remaining -= minPay;
      paidThisMonth += minPay;
      if (d.bal < 1e-8) d.bal = 0;
    }

    const focusOrder = state
      .filter((d) => d.bal > 1e-8)
      .sort((a, b) => b.apr - a.apr || a.id - b.id);
    for (const d of focusOrder) {
      if (remaining <= 1e-12) break;
      const pay = Math.min(remaining, d.bal);
      d.bal -= pay;
      remaining -= pay;
      paidThisMonth += pay;
      if (d.bal < 1e-8) d.bal = 0;
    }

    totalPaid += paidThisMonth;

    if (state.some((d) => d.bal > 1e-8) && paidThisMonth <= 1e-12) {
      return {
        months: Number.POSITIVE_INFINITY,
        totalInterest: Number.POSITIVE_INFINITY,
        totalPaid: Number.POSITIVE_INFINITY,
        openingBalanceSum: 0,
        stuck: true,
      };
    }
  }

  if (state.some((d) => d.bal > 1e-8)) {
    return {
      months: Number.POSITIVE_INFINITY,
      totalInterest: Number.POSITIVE_INFINITY,
      totalPaid: Number.POSITIVE_INFINITY,
      openingBalanceSum: 0,
      stuck: true,
    };
  }

  return {
    months,
    totalInterest,
    totalPaid,
    openingBalanceSum,
    stuck: false,
  };
}

/** Balance-weighted average of nominal APRs (baseline footnote). */
export function weightedAverageApr(debts: NormalizedDebt[]): number {
  const total = debts.reduce((s, d) => s + d.principal, 0);
  if (!(total > 0)) return 0;
  return debts.reduce((s, d) => s + d.principal * d.annualRatePercent, 0) / total;
}

/**
 * Avalanche APR from average opening balance:
 * APR = totalInterest / (avgOpeningBalance × years) × 100
 */
export function averageBalanceApr(outcome: ScheduleOutcome): number {
  if (!(outcome.months > 0) || !(outcome.openingBalanceSum > 0)) return 0;
  const avgBal = outcome.openingBalanceSum / outcome.months;
  const years = outcome.months / 12;
  if (!(avgBal > 0) || !(years > 0)) return 0;
  return (outcome.totalInterest / (avgBal * years)) * 100;
}

function formatApr(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatMonths(months: number): string {
  return `${months} month${months === 1 ? '' : 's'}`;
}

function toScenario(
  outcome: ScheduleOutcome,
  aprPercent: number,
  monthlyPayment: number | null,
  currency: SupportedCurrency,
  baselineAprNote: boolean
): ScenarioSummary {
  return {
    aprPercent,
    formattedApr: `${formatApr(aprPercent)}${baselineAprNote ? '*' : ''}`,
    monthlyPayment,
    formattedMonthlyPayment:
      monthlyPayment === null
        ? 'varied'
        : `${formatDebtAvalancheMoney(monthlyPayment, currency)}`,
    payoffMonths: outcome.months,
    formattedPayoffTerm: formatMonths(outcome.months),
    totalPayable: outcome.totalPaid,
    formattedTotalPayable: formatDebtAvalancheMoney(outcome.totalPaid, currency),
    totalInterest: outcome.totalInterest,
    formattedTotalInterest: formatDebtAvalancheMoney(
      outcome.totalInterest,
      currency
    ),
  };
}

export function calculateDebtAvalanche(input: {
  debts: NormalizedDebt[];
  currency: SupportedCurrency;
}): DebtAvalancheResult | null {
  const debts = input.debts.filter((d) => d.principal > 0);
  if (debts.length === 0) return null;

  for (const d of debts) {
    if (!(d.monthlyPayment > 0)) return null;
    if (d.annualRatePercent < 0) return null;
  }

  const baseline = runBaselineSchedule(debts);
  const avalanche = runAvalancheSchedule(debts);
  if (baseline.stuck || avalanche.stuck) return null;
  if (
    !Number.isFinite(baseline.months) ||
    !Number.isFinite(avalanche.months) ||
    !Number.isFinite(baseline.totalInterest) ||
    !Number.isFinite(avalanche.totalInterest)
  ) {
    return null;
  }

  const totalDebt = debts.reduce((s, d) => s + d.principal, 0);
  const budget = debts.reduce((s, d) => s + d.monthlyPayment, 0);
  const interestSavings = Math.max(0, baseline.totalInterest - avalanche.totalInterest);
  const monthsSaved = Math.max(0, baseline.months - avalanche.months);

  return {
    currency: input.currency,
    totalDebt,
    formattedTotalDebt: formatDebtAvalancheMoney(totalDebt, input.currency),
    interestSavings,
    formattedInterestSavings: formatDebtAvalancheMoney(
      interestSavings,
      input.currency
    ),
    monthsSaved,
    baseline: toScenario(
      baseline,
      weightedAverageApr(debts),
      null,
      input.currency,
      true
    ),
    avalanche: toScenario(
      avalanche,
      averageBalanceApr(avalanche),
      budget,
      input.currency,
      false
    ),
  };
}
