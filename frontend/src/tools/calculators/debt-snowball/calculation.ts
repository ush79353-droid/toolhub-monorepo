import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { DebtSnowballMethod, MethodSummary } from './types';

export const MAX_SIMULATION_MONTHS = 1200;

export interface CanonicalDebt {
  balance: number;
  annualRatePercent: number;
  minPayment: number;
}

export interface DebtSnowballCanonicalInput {
  debts: CanonicalDebt[];
  /** Extra monthly budget beyond the sum of minimums (calc currency). */
  paymentIncrease: number;
}

export interface DebtSnowballCanonicalResult {
  totalDebt: number;
  totalCurrentMonthlyPayment: number;
  paymentIncrease: number;
  newMonthlyPayment: number;
  rows: MethodSummary[];
}

export function formatDebtSnowballMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatDebtSnowballApr(percent: number): string {
  return `${percent.toFixed(2)}%`;
}

export function formatPayoffMonths(months: number): string {
  return `${months} month${months === 1 ? '' : 's'}`;
}

export function methodLabel(method: DebtSnowballMethod): string {
  switch (method) {
    case 'min':
      return 'Minimum';
    case 'snowball':
      return 'Snowball';
    case 'avalanche':
      return 'Avalanche';
  }
}

/** Weighted-average APR for the minimum-payment estimate (balance weights). */
export function weightedAverageApr(debts: CanonicalDebt[]): number {
  const total = debts.reduce((s, d) => s + d.balance, 0);
  if (!(total > 0)) return NaN;
  return debts.reduce((s, d) => s + d.balance * d.annualRatePercent, 0) / total;
}

function monthlyIrr(cashFlows: number[]): number | null {
  if (cashFlows.length < 2) return null;
  let lo = -0.999;
  let hi = 10;
  let fLo = npv(lo, cashFlows);
  let fHi = npv(hi, cashFlows);
  if (!Number.isFinite(fLo) || !Number.isFinite(fHi) || fLo * fHi > 0) {
    hi = 50;
    fHi = npv(hi, cashFlows);
    if (!Number.isFinite(fHi) || fLo * fHi > 0) return null;
  }
  for (let i = 0; i < 80; i += 1) {
    const mid = (lo + hi) / 2;
    const fMid = npv(mid, cashFlows);
    if (!Number.isFinite(fMid)) return null;
    if (fLo * fMid <= 0) {
      hi = mid;
      fHi = fMid;
    } else {
      lo = mid;
      fLo = fMid;
    }
  }
  return (lo + hi) / 2;
}

function npv(rate: number, cashFlows: number[]): number {
  let total = 0;
  for (let t = 0; t < cashFlows.length; t += 1) {
    total += cashFlows[t]! / Math.pow(1 + rate, t);
  }
  return total;
}

function nominalAprFromMonthlyRate(monthly: number | null): number | null {
  if (monthly === null || !Number.isFinite(monthly)) return null;
  return monthly * 12 * 100;
}

type MutableDebt = {
  balance: number;
  rate: number;
  min: number;
};

/**
 * When remaining principal across active debts fits in this month's budget,
 * pay it off without accruing another month of interest (Omni parity).
 */
function openingFitsInBudget(debts: MutableDebt[], budget: number): boolean {
  const total = debts.reduce((s, d) => s + Math.max(d.balance, 0), 0);
  return total > 0 && total <= budget + 1e-9;
}

/** Independent minimum schedules — no reallocation across debts. */
function simulateMinimumOnly(seed: CanonicalDebt[]):
  | { ok: true; interest: number; months: number; payments: number[]; paidTotal: number }
  | { ok: false; message: string } {
  const debts: MutableDebt[] = seed.map((d) => ({
    balance: d.balance,
    rate: d.annualRatePercent,
    min: d.minPayment,
  }));

  if (!debts.every((d) => d.min > 0)) {
    return { ok: false, message: 'Monthly payments must be greater than zero.' };
  }

  let month = 0;
  let interest = 0;
  let paidTotal = 0;
  const payments: number[] = [];

  while (month < MAX_SIMULATION_MONTHS) {
    if (!debts.some((d) => d.balance > 1e-9)) break;
    month += 1;

    for (const d of debts) {
      if (d.balance <= 1e-9) continue;
      const i = d.balance * (d.rate / 100 / 12);
      if (d.min <= i + 1e-12) {
        return {
          ok: false,
          message: 'Payments are too low to amortize these debts.',
        };
      }
      interest += i;
      d.balance += i;
    }

    let paid = 0;
    for (const d of debts) {
      if (d.balance <= 1e-9) continue;
      const p = Math.min(d.min, d.balance);
      d.balance -= p;
      paid += p;
      if (d.balance < 1e-12) d.balance = 0;
    }
    payments.push(paid);
    paidTotal += paid;
  }

  if (debts.some((d) => d.balance > 1e-6)) {
    return {
      ok: false,
      message: 'These debts do not pay off within a reasonable term.',
    };
  }

  return { ok: true, interest, months: month, payments, paidTotal };
}

function simulateMultiDebt(
  seed: CanonicalDebt[],
  kind: 'snowball' | 'avalanche',
  budget: number
):
  | { ok: true; interest: number; months: number; payments: number[]; paidTotal: number }
  | { ok: false; message: string } {
  const debts: MutableDebt[] = seed.map((d) => ({
    balance: d.balance,
    rate: d.annualRatePercent,
    min: d.minPayment,
  }));

  if (!(budget > 0)) {
    return { ok: false, message: 'Monthly payments must be greater than zero.' };
  }

  let month = 0;
  let interest = 0;
  let paidTotal = 0;
  const payments: number[] = [];

  while (month < MAX_SIMULATION_MONTHS) {
    if (!debts.some((d) => d.balance > 1e-9)) break;

    if (openingFitsInBudget(debts, budget)) {
      month += 1;
      let paid = 0;
      for (const d of debts) {
        if (d.balance <= 1e-9) continue;
        paid += d.balance;
        d.balance = 0;
      }
      payments.push(paid);
      paidTotal += paid;
      break;
    }

    month += 1;

    for (const d of debts) {
      if (d.balance <= 1e-9) continue;
      const i = d.balance * (d.rate / 100 / 12);
      interest += i;
      d.balance += i;
    }

    let remaining = budget;
    let paid = 0;

    for (const d of debts) {
      if (d.balance <= 1e-9 || remaining <= 1e-12) continue;
      const p = Math.min(d.min, d.balance, remaining);
      d.balance -= p;
      remaining -= p;
      paid += p;
      if (d.balance < 1e-12) d.balance = 0;
    }

    while (remaining > 1e-12) {
      const alive = debts.filter((d) => d.balance > 1e-9);
      if (!alive.length) break;
      const target =
        kind === 'snowball'
          ? alive.slice().sort((a, b) => a.balance - b.balance || b.rate - a.rate)[0]!
          : alive.slice().sort((a, b) => b.rate - a.rate || a.balance - b.balance)[0]!;
      const p = Math.min(remaining, target.balance);
      target.balance -= p;
      remaining -= p;
      paid += p;
      if (target.balance < 1e-12) target.balance = 0;
    }

    payments.push(paid);
    paidTotal += paid;

    const totalBal = debts.reduce((s, d) => s + d.balance, 0);
    if (totalBal > seed.reduce((s, d) => s + d.balance, 0) * 50) {
      return {
        ok: false,
        message: 'Payments are too low to amortize these debts.',
      };
    }
  }

  if (debts.some((d) => d.balance > 1e-6)) {
    return {
      ok: false,
      message: 'These debts do not pay off within a reasonable term.',
    };
  }

  return { ok: true, interest, months: month, payments, paidTotal };
}

/**
 * Compare minimum-payment, snowball, and avalanche strategies under one shared
 * monthly budget (sum of minimums + optional increase). Interest accrues before
 * principal reduction; the final month skips interest when principal fits.
 */
export function calculateDebtSnowball(
  input: DebtSnowballCanonicalInput
): DebtSnowballCanonicalResult | null {
  const debts = input.debts.filter((d) => d.balance > 0);
  if (debts.length < 2) return null;
  if (
    !debts.every(
      (d) =>
        Number.isFinite(d.balance) &&
        d.balance > 0 &&
        Number.isFinite(d.annualRatePercent) &&
        d.annualRatePercent >= 0 &&
        Number.isFinite(d.minPayment) &&
        d.minPayment > 0
    )
  ) {
    return null;
  }
  if (!Number.isFinite(input.paymentIncrease) || input.paymentIncrease < 0) {
    return null;
  }

  const totalDebt = debts.reduce((s, d) => s + d.balance, 0);
  const totalCurrentMonthlyPayment = debts.reduce((s, d) => s + d.minPayment, 0);
  const newMonthlyPayment = totalCurrentMonthlyPayment + input.paymentIncrease;
  const weighted = weightedAverageApr(debts);
  const rows: MethodSummary[] = [];

  for (const kind of ['min', 'snowball', 'avalanche'] as const) {
    // Minimum: independent schedules (combined payment can fall as debts retire).
    // Snowball / avalanche: keep the full new monthly payment constant.
    const budget =
      kind === 'min' ? totalCurrentMonthlyPayment : newMonthlyPayment;
    const sim =
      kind === 'min'
        ? simulateMinimumOnly(debts)
        : simulateMultiDebt(debts, kind, budget);

    if (!sim.ok) {
      rows.push({
        method: kind,
        label: methodLabel(kind),
        aprPercent: kind === 'min' && Number.isFinite(weighted) ? weighted : null,
        aprIsWeightedEstimate: kind === 'min',
        monthlyPayment: budget,
        payoffMonths: null,
        totalPayable: 0,
        totalInterest: 0,
        ok: false,
        message: sim.message,
      });
      continue;
    }

    let apr: number | null;
    if (kind === 'min') {
      apr = Number.isFinite(weighted) ? weighted : null;
    } else {
      apr = nominalAprFromMonthlyRate(monthlyIrr([-totalDebt, ...sim.payments]));
    }

    rows.push({
      method: kind,
      label: methodLabel(kind),
      aprPercent: apr,
      aprIsWeightedEstimate: kind === 'min',
      monthlyPayment: budget,
      payoffMonths: sim.months,
      totalPayable: sim.paidTotal,
      totalInterest: sim.interest,
      ok: true,
    });
  }

  return {
    totalDebt,
    totalCurrentMonthlyPayment,
    paymentIncrease: input.paymentIncrease,
    newMonthlyPayment,
    rows,
  };
}
