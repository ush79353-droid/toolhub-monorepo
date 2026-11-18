import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { DebtMethod, MethodRow } from './types';

export const MAX_SIMULATION_MONTHS = 1200;

export interface CanonicalDebt {
  balance: number;
  annualRatePercent: number;
  minPayment: number;
}

export interface DebtCanonicalInput {
  debts: CanonicalDebt[];
  consolidationRatePercent: number;
  prepaidFee: number;
}

export interface DebtCanonicalResult {
  totalDebt: number;
  monthlyPayment: number;
  rows: MethodRow[];
}

export function formatDebtMoney(amount: number, currency: SupportedCurrency): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatDebtApr(percent: number): string {
  return `${percent.toFixed(2)}%`;
}

export function formatPayoffMonths(months: number): string {
  return `${months} month${months === 1 ? '' : 's'}`;
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
    // Expand upper bound once for high APRs.
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
 * pay it off without accruing another month of interest (Omni / screenshot parity).
 */
function openingFitsInBudget(debts: MutableDebt[], budget: number): boolean {
  const total = debts.reduce((s, d) => s + Math.max(d.balance, 0), 0);
  return total > 0 && total <= budget + 1e-9;
}

function simulateMultiDebt(
  seed: CanonicalDebt[],
  kind: 'min' | 'snowball' | 'avalanche'
): { ok: true; interest: number; months: number; payments: number[] } | { ok: false; message: string } {
  const debts: MutableDebt[] = seed.map((d) => ({
    balance: d.balance,
    rate: d.annualRatePercent,
    min: d.minPayment,
  }));
  const budget = seed.reduce((s, d) => s + d.minPayment, 0);
  if (!(budget > 0)) {
    return { ok: false, message: 'Monthly payments must be greater than zero.' };
  }

  let month = 0;
  let interest = 0;
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

    // Scheduled minimums first (capped by remaining balance).
    for (const d of debts) {
      if (d.balance <= 1e-9 || remaining <= 1e-12) continue;
      const p = Math.min(d.min, d.balance, remaining);
      d.balance -= p;
      remaining -= p;
      paid += p;
      if (d.balance < 1e-12) d.balance = 0;
    }

    if (kind !== 'min') {
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
    }

    payments.push(paid);

    // Detect runaway balances (payments never cover interest).
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

  return { ok: true, interest, months: month, payments };
}

function simulateConsolidation(
  principal: number,
  annualRatePercent: number,
  monthlyPayment: number,
  prepaidFee: number
): { ok: true; interest: number; months: number; payments: number[]; apr: number | null } | { ok: false; message: string } {
  if (!(principal > 0) || !(monthlyPayment > 0)) {
    return { ok: false, message: 'Consolidation needs a positive balance and payment.' };
  }
  if (annualRatePercent < 0 || prepaidFee < 0) {
    return { ok: false, message: 'Consolidation rate and fee cannot be negative.' };
  }

  const r = annualRatePercent / 100 / 12;
  let bal = principal;
  let interest = 0;
  let month = 0;
  const payments: number[] = [];

  while (month < MAX_SIMULATION_MONTHS) {
    if (bal <= 1e-9) break;

    if (bal <= monthlyPayment + 1e-9) {
      month += 1;
      payments.push(bal);
      bal = 0;
      break;
    }

    month += 1;
    const i = bal * r;
    if (monthlyPayment <= i + 1e-12) {
      return {
        ok: false,
        message: 'Consolidation payment is too low to cover interest.',
      };
    }
    interest += i;
    const pmt = Math.min(monthlyPayment, bal + i);
    bal = bal + i - pmt;
    payments.push(pmt);
    if (bal < 1e-12) bal = 0;
  }

  if (bal > 1e-6) {
    return {
      ok: false,
      message: 'Consolidation does not pay off within a reasonable term.',
    };
  }

  const netAdvance = principal - prepaidFee;
  if (!(netAdvance > 0)) {
    return {
      ok: false,
      message: 'Prepaid fee cannot equal or exceed total debt.',
    };
  }

  // Cash-flow APR: net funds advanced after prepaid fee, then schedule payments.
  const monthly = monthlyIrr([-netAdvance, ...payments]);
  return {
    ok: true,
    interest,
    months: month,
    payments,
    apr: nominalAprFromMonthlyRate(monthly),
  };
}

function methodLabel(method: DebtMethod): string {
  switch (method) {
    case 'min':
      return 'Min. payment';
    case 'snowball':
      return 'Snowball';
    case 'avalanche':
      return 'Avalanche';
    case 'consolidation':
      return 'Consolidation';
  }
}

/**
 * Compare minimum-payment, snowball, avalanche, and consolidation strategies.
 * Amortization uses full precision; final month skips interest when principal fits in budget.
 */
export function calculateDebt(input: DebtCanonicalInput): DebtCanonicalResult | null {
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
  if (
    !Number.isFinite(input.consolidationRatePercent) ||
    input.consolidationRatePercent < 0 ||
    !Number.isFinite(input.prepaidFee) ||
    input.prepaidFee < 0
  ) {
    return null;
  }

  const totalDebt = debts.reduce((s, d) => s + d.balance, 0);
  const monthlyPayment = debts.reduce((s, d) => s + d.minPayment, 0);
  const rows: MethodRow[] = [];

  const weighted = weightedAverageApr(debts);

  for (const kind of ['min', 'snowball', 'avalanche'] as const) {
    const sim = simulateMultiDebt(debts, kind);
    if (!sim.ok) {
      rows.push({
        method: kind,
        label: methodLabel(kind),
        aprPercent: kind === 'min' && Number.isFinite(weighted) ? weighted : null,
        aprIsWeightedEstimate: kind === 'min',
        interest: 0,
        payoffMonths: null,
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
      interest: sim.interest,
      payoffMonths: sim.months,
      ok: true,
    });
  }

  const consol = simulateConsolidation(
    totalDebt,
    input.consolidationRatePercent,
    monthlyPayment,
    input.prepaidFee
  );
  if (!consol.ok) {
    rows.push({
      method: 'consolidation',
      label: methodLabel('consolidation'),
      aprPercent: null,
      aprIsWeightedEstimate: false,
      interest: 0,
      payoffMonths: null,
      ok: false,
      message: consol.message,
    });
  } else {
    rows.push({
      method: 'consolidation',
      label: methodLabel('consolidation'),
      aprPercent: consol.apr,
      aprIsWeightedEstimate: false,
      interest: consol.interest,
      payoffMonths: consol.months,
      ok: true,
    });
  }

  return { totalDebt, monthlyPayment, rows };
}
