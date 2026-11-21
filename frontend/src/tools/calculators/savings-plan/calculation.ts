import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { PeriodBalance, PlanFrequency, PlanMode } from './types';
import { periodUnits } from './types';

export const MAX_PERIODS = 10_000;

/**
 * Arithmetic savings series (principal only, no interest):
 *   deposit_k = A + (k − 1) × G
 *   Total = n × A + G × n × (n − 1) / 2
 *
 * Contribution timing: one deposit at the end of each of n periods.
 * Balance after period k equals the sum of the first k deposits.
 */
export function totalFromDepositSeries(
  periods: number,
  startingDeposit: number,
  increasePerPeriod: number
): number {
  const n = periods;
  const A = startingDeposit;
  const G = increasePerPeriod;
  return n * A + (G * n * (n - 1)) / 2;
}

/** Reverse-solve A given target T: A = (T − G × n × (n − 1) / 2) / n */
export function startingDepositFromTarget(
  periods: number,
  targetBalance: number,
  increasePerPeriod: number
): number {
  const n = periods;
  const G = increasePerPeriod;
  const growthPart = (G * n * (n - 1)) / 2;
  return (targetBalance - growthPart) / n;
}

/** Running balances after each period; final entry equals the closed-form total. */
export function buildPeriodBalances(
  periods: number,
  startingDeposit: number,
  increasePerPeriod: number
): PeriodBalance[] {
  const balances: PeriodBalance[] = [];
  let balance = 0;
  for (let k = 1; k <= periods; k += 1) {
    const deposit = startingDeposit + (k - 1) * increasePerPeriod;
    balance += deposit;
    balances.push({ period: k, deposit, balance });
  }
  return balances;
}

export interface SavingsPlanComputeInput {
  mode: PlanMode;
  frequency: PlanFrequency;
  periods: number;
  startingDeposit: number;
  increasePerPeriod: number;
  targetBalance: number;
  currency: SupportedCurrency;
}

export type SavingsPlanComputeResult =
  | {
      ok: true;
      mode: PlanMode;
      frequency: PlanFrequency;
      periods: number;
      startingDeposit: number;
      increasePerPeriod: number;
      finalBalance: number;
      totalDeposited: number;
      currency: SupportedCurrency;
      balances: PeriodBalance[];
      periodUnitSingular: string;
      periodUnitPlural: string;
      balancesLabel: string;
    }
  | { ok: false; reason: 'invalid-periods' | 'unreachable-target' | 'non-finite' };

export function computeSavingsPlan(
  input: SavingsPlanComputeInput
): SavingsPlanComputeResult {
  const { mode, frequency, periods, increasePerPeriod, currency } = input;

  if (
    !Number.isFinite(periods) ||
    !Number.isInteger(periods) ||
    periods < 1 ||
    periods > MAX_PERIODS
  ) {
    return { ok: false, reason: 'invalid-periods' };
  }
  if (!Number.isFinite(increasePerPeriod)) {
    return { ok: false, reason: 'non-finite' };
  }

  let startingDeposit: number;
  let finalBalance: number;

  if (mode === 'deposit') {
    startingDeposit = input.startingDeposit;
    if (!Number.isFinite(startingDeposit)) {
      return { ok: false, reason: 'non-finite' };
    }
    finalBalance = totalFromDepositSeries(periods, startingDeposit, increasePerPeriod);
  } else {
    if (!Number.isFinite(input.targetBalance)) {
      return { ok: false, reason: 'non-finite' };
    }
    startingDeposit = startingDepositFromTarget(
      periods,
      input.targetBalance,
      increasePerPeriod
    );
    if (!Number.isFinite(startingDeposit)) {
      return { ok: false, reason: 'non-finite' };
    }
    // Unreachable when required starting deposit is negative.
    if (startingDeposit < 0) {
      return { ok: false, reason: 'unreachable-target' };
    }
    finalBalance = totalFromDepositSeries(periods, startingDeposit, increasePerPeriod);
  }

  if (!Number.isFinite(finalBalance)) {
    return { ok: false, reason: 'non-finite' };
  }

  const balances = buildPeriodBalances(periods, startingDeposit, increasePerPeriod);
  const units = periodUnits(frequency);

  return {
    ok: true,
    mode,
    frequency,
    periods,
    startingDeposit,
    increasePerPeriod,
    finalBalance,
    totalDeposited: finalBalance,
    currency,
    balances,
    periodUnitSingular: units.singular,
    periodUnitPlural: units.plural,
    balancesLabel: units.balancesLabel,
  };
}

/** Display rounding only — never used inside the series math. */
export function formatSavingsPlanMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
