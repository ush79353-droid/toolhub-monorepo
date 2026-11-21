/**
 * MPS = 1 − MPC
 * k = 1 / (1 − MPC) = 1 / MPS
 * ΔY = k × ΔA
 * ΔA = ΔY / k
 * MPC = 1 − 1/k ; MPS = 1/k
 * Spending rounds: round n adds ΔA × MPC^n (finite visualization)
 * Currency/magnitude are denomination only — not FX conversion.
 */

import {
  MONEY_MAGNITUDE_OPTIONS,
  type MoneyMagnitude,
  type SpendingRound,
} from './types';

export function magnitudeFactor(magnitude: MoneyMagnitude): number {
  return MONEY_MAGNITUDE_OPTIONS.find((o) => o.id === magnitude)?.factor ?? 1;
}

export function magnitudeLabel(magnitude: MoneyMagnitude): string {
  return (
    MONEY_MAGNITUDE_OPTIONS.find((o) => o.id === magnitude)?.label ?? 'Units'
  );
}

export function toBaseUnits(amount: number, magnitude: MoneyMagnitude): number {
  return amount * magnitudeFactor(magnitude);
}

export function fromBaseUnits(
  baseUnits: number,
  magnitude: MoneyMagnitude
): number {
  return baseUnits / magnitudeFactor(magnitude);
}

export function calculateMPS(mpc: number): number | null {
  if (!Number.isFinite(mpc) || mpc < 0 || mpc > 1) return null;
  return 1 - mpc;
}

export function calculateMPC(mps: number): number | null {
  if (!Number.isFinite(mps) || mps < 0 || mps > 1) return null;
  return 1 - mps;
}

export function calculateSpendingMultiplierFromMPC(
  mpc: number
): number | null {
  if (!Number.isFinite(mpc) || mpc < 0 || mpc >= 1) return null;
  const result = 1 / (1 - mpc);
  return Number.isFinite(result) ? result : null;
}

export function calculateSpendingMultiplierFromMPS(
  mps: number
): number | null {
  if (!Number.isFinite(mps) || mps <= 0 || mps > 1) return null;
  const result = 1 / mps;
  return Number.isFinite(result) ? result : null;
}

export function calculateMpcFromMultiplier(k: number): number | null {
  if (!Number.isFinite(k) || k < 1) return null;
  if (!Number.isFinite(1 / k)) return null;
  const mpc = 1 - 1 / k;
  if (!Number.isFinite(mpc) || mpc < 0 || mpc >= 1) return null;
  return mpc;
}

export function calculateMpsFromMultiplier(k: number): number | null {
  if (!Number.isFinite(k) || k < 1) return null;
  const mps = 1 / k;
  return Number.isFinite(mps) && mps > 0 && mps <= 1 ? mps : null;
}

export function calculateOutputChange(
  autonomousSpendingChange: number,
  multiplier: number
): number | null {
  if (
    !Number.isFinite(autonomousSpendingChange) ||
    !Number.isFinite(multiplier) ||
    multiplier < 1
  ) {
    return null;
  }
  const result = autonomousSpendingChange * multiplier;
  return Number.isFinite(result) ? result : null;
}

export function calculateRequiredSpendingChange(
  targetOutputChange: number,
  multiplier: number
): number | null {
  if (
    !Number.isFinite(targetOutputChange) ||
    !Number.isFinite(multiplier) ||
    multiplier < 1
  ) {
    return null;
  }
  const result = targetOutputChange / multiplier;
  return Number.isFinite(result) ? result : null;
}

export function buildSpendingRounds(
  autonomousBase: number,
  mpc: number,
  rounds: number,
  formatMoney: (base: number) => string
): SpendingRound[] {
  if (
    !Number.isFinite(autonomousBase) ||
    !Number.isFinite(mpc) ||
    mpc < 0 ||
    mpc >= 1 ||
    !Number.isFinite(rounds) ||
    rounds < 0
  ) {
    return [];
  }
  const n = Math.min(Math.floor(rounds), 25);
  const out: SpendingRound[] = [];
  let cumulative = 0;
  for (let i = 0; i <= n; i++) {
    const additional = autonomousBase * Math.pow(mpc, i);
    if (!Number.isFinite(additional)) break;
    cumulative += additional;
    out.push({
      round: i,
      label: i === 0 ? 'Initial' : `Round ${i}`,
      additionalSpending: additional,
      cumulative,
      formattedAdditional: formatMoney(additional),
      formattedCumulative: formatMoney(cumulative),
    });
  }
  return out;
}

export function formatPropensity(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value);
}

export function formatMultiplier(value: number): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value)}×`;
}

export function formatDisplayAmount(amountInMagnitude: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(amountInMagnitude);
}

export function formatMoneyAmount(
  baseUnits: number,
  currencyCode: string,
  preferredMagnitude: MoneyMagnitude
): string {
  const display = fromBaseUnits(baseUnits, preferredMagnitude);
  return `${currencyCode} ${formatDisplayAmount(display)} ${magnitudeLabel(preferredMagnitude).toLowerCase()}`;
}

export function formatPercent(value: number): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
    signDisplay: 'exceptZero',
  }).format(value)}%`;
}
