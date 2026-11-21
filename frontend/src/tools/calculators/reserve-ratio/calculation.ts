/**
 * Reserve Ratio RR = (R / D) × 100
 * Required Reserves = D × (r / 100)
 * Excess / shortfall = Actual Reserves − Required Reserves
 * Unreserved funds L = D − R (only when R ≤ D)
 * Simple money multiplier m = 100 / RR (undefined at RR = 0)
 * Currency/magnitude are denomination only — not FX conversion.
 */

import {
  MONEY_MAGNITUDE_OPTIONS,
  type MoneyMagnitude,
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

export function calculateReserveRatio(
  reserves: number,
  deposits: number
): number | null {
  if (
    !Number.isFinite(reserves) ||
    !Number.isFinite(deposits) ||
    reserves < 0 ||
    deposits <= 0
  ) {
    return null;
  }
  const result = (reserves / deposits) * 100;
  return Number.isFinite(result) ? result : null;
}

export function calculateRequiredReserves(
  deposits: number,
  requiredRatio: number
): number | null {
  if (
    !Number.isFinite(deposits) ||
    !Number.isFinite(requiredRatio) ||
    deposits < 0 ||
    requiredRatio < 0 ||
    requiredRatio > 100
  ) {
    return null;
  }
  const result = deposits * (requiredRatio / 100);
  return Number.isFinite(result) ? result : null;
}

export function calculateExcessReserves(
  actualReserves: number,
  requiredReserves: number
): number | null {
  if (
    !Number.isFinite(actualReserves) ||
    !Number.isFinite(requiredReserves) ||
    actualReserves < 0 ||
    requiredReserves < 0
  ) {
    return null;
  }
  const result = actualReserves - requiredReserves;
  return Number.isFinite(result) ? result : null;
}

export function calculateSimplifiedUnreservedFunds(
  deposits: number,
  reserves: number
): number | null {
  if (
    !Number.isFinite(deposits) ||
    !Number.isFinite(reserves) ||
    deposits < 0 ||
    reserves < 0 ||
    reserves > deposits
  ) {
    return null;
  }
  const result = deposits - reserves;
  return Number.isFinite(result) ? result : null;
}

export function calculateDepositsFromReserves(
  reserves: number,
  reserveRatioPercent: number
): number | null {
  if (
    !Number.isFinite(reserves) ||
    !Number.isFinite(reserveRatioPercent) ||
    reserves < 0 ||
    reserveRatioPercent <= 0
  ) {
    return null;
  }
  const result = reserves / (reserveRatioPercent / 100);
  return Number.isFinite(result) ? result : null;
}

export function calculateReservesFromDeposits(
  deposits: number,
  reserveRatioPercent: number
): number | null {
  return calculateRequiredReserves(deposits, reserveRatioPercent);
}

export function calculateSimpleMoneyMultiplier(
  reserveRatioPercent: number
): number | null {
  // Undefined at 0% (no Infinity). Ratios above 100% still yield a finite m = 100/RR.
  if (!Number.isFinite(reserveRatioPercent) || reserveRatioPercent <= 0) {
    return null;
  }
  const result = 100 / reserveRatioPercent;
  return Number.isFinite(result) ? result : null;
}

export function formatPercent(value: number): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value)}%`;
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

export function formatMultiplier(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value);
}
