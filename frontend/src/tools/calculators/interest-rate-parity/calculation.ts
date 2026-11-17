import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { IrpVersion } from './types';

/** Omni / money-market day-count for IRP period rates. */
export const IRP_DAY_BASIS = 360;

export function formatIrpRate(amount: number, maxFractionDigits = 8): string {
  if (!Number.isFinite(amount)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFractionDigits,
  }).format(amount);
}

export function formatIrpQuote(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(4, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: Math.min(4, digits),
    maximumFractionDigits: Math.max(digits, 6),
  }).format(amount);
}

/**
 * Periodic rate % = annualised rate % × (days / 360).
 * Rates stay in percent space; convert to decimals only inside forward formulas.
 */
export function annualisedToPeriodicPercent(
  annualisedPercent: number,
  days: number
): number | null {
  if (![annualisedPercent, days].every(Number.isFinite)) return null;
  if (!(days > 0)) return null;
  const periodic = annualisedPercent * (days / IRP_DAY_BASIS);
  return Number.isFinite(periodic) ? periodic : null;
}

export function periodicToAnnualisedPercent(
  periodicPercent: number,
  days: number
): number | null {
  if (![periodicPercent, days].every(Number.isFinite)) return null;
  if (!(days > 0)) return null;
  const annualised = periodicPercent * (IRP_DAY_BASIS / days);
  return Number.isFinite(annualised) ? annualised : null;
}

/**
 * Spot quote convention: price-currency units per one base-currency unit.
 * Rates are periodic percents (e.g. 0.2 means 0.2%).
 *
 * Covered:   F = S × (1 + r_price) / (1 + r_base)
 * Uncovered: F = S × (1 + (r_price − r_base))  — expected future spot, not a locked forward
 */
export function calculateForwardQuote(input: {
  spot: number;
  priceRatePercent: number;
  baseRatePercent: number;
  version: IrpVersion;
}): number | null {
  const { spot, priceRatePercent, baseRatePercent, version } = input;
  if (![spot, priceRatePercent, baseRatePercent].every(Number.isFinite)) {
    return null;
  }
  if (!(spot > 0)) return null;

  const rPrice = priceRatePercent / 100;
  const rBase = baseRatePercent / 100;

  let forward: number;
  if (version === 'covered') {
    const denom = 1 + rBase;
    if (denom === 0 || !Number.isFinite(denom)) return null;
    forward = (spot * (1 + rPrice)) / denom;
  } else {
    forward = spot * (1 + (rPrice - rBase));
  }

  return Number.isFinite(forward) ? forward : null;
}
