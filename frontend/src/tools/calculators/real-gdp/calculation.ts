/**
 * Real GDP = (Nominal GDP / GDP Deflator) × 100
 * Nominal = (Real × Deflator) / 100
 * Deflator = (Nominal / Real) × 100
 * Growth g = (R_t − R_{t−1}) / R_{t−1} × 100
 * Currency/magnitude are denomination only — not FX conversion.
 */

import {
  GDP_MAGNITUDE_OPTIONS,
  type GdpMagnitude,
} from './types';

export function magnitudeFactor(magnitude: GdpMagnitude): number {
  return GDP_MAGNITUDE_OPTIONS.find((o) => o.id === magnitude)?.factor ?? 1;
}

export function magnitudeLabel(magnitude: GdpMagnitude): string {
  return GDP_MAGNITUDE_OPTIONS.find((o) => o.id === magnitude)?.label ?? 'Units';
}

export function toBaseUnits(amount: number, magnitude: GdpMagnitude): number {
  return amount * magnitudeFactor(magnitude);
}

export function fromBaseUnits(
  baseUnits: number,
  magnitude: GdpMagnitude
): number {
  return baseUnits / magnitudeFactor(magnitude);
}

export function calculateRealGDP(
  nominalGDP: number,
  gdpDeflator: number
): number | null {
  if (
    !Number.isFinite(nominalGDP) ||
    !Number.isFinite(gdpDeflator) ||
    nominalGDP < 0 ||
    gdpDeflator <= 0
  ) {
    return null;
  }
  const result = (nominalGDP / gdpDeflator) * 100;
  return Number.isFinite(result) ? result : null;
}

export function calculateNominalGDP(
  realGDP: number,
  gdpDeflator: number
): number | null {
  if (
    !Number.isFinite(realGDP) ||
    !Number.isFinite(gdpDeflator) ||
    realGDP < 0 ||
    gdpDeflator <= 0
  ) {
    return null;
  }
  const result = (realGDP * gdpDeflator) / 100;
  return Number.isFinite(result) ? result : null;
}

export function calculateGDPDeflator(
  nominalGDP: number,
  realGDP: number
): number | null {
  if (
    !Number.isFinite(nominalGDP) ||
    !Number.isFinite(realGDP) ||
    nominalGDP < 0 ||
    realGDP <= 0
  ) {
    return null;
  }
  const result = (nominalGDP / realGDP) * 100;
  return Number.isFinite(result) && result > 0 ? result : null;
}

export function calculateRealGDPGrowth(
  previousRealGDP: number,
  currentRealGDP: number
): number | null {
  if (
    !Number.isFinite(previousRealGDP) ||
    !Number.isFinite(currentRealGDP) ||
    previousRealGDP <= 0 ||
    currentRealGDP < 0
  ) {
    return null;
  }
  const result =
    ((currentRealGDP - previousRealGDP) / previousRealGDP) * 100;
  return Number.isFinite(result) ? result : null;
}

export function formatIndex(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
    signDisplay: 'exceptZero',
  }).format(value)}%`;
}

export function formatDisplayAmount(amountInMagnitude: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(amountInMagnitude);
}

export function formatGdpAmount(
  baseUnits: number,
  currencyCode: string,
  preferredMagnitude: GdpMagnitude
): string {
  const display = fromBaseUnits(baseUnits, preferredMagnitude);
  return `${currencyCode} ${formatDisplayAmount(display)} ${magnitudeLabel(preferredMagnitude).toLowerCase()}`;
}

export function priceLevelInterpretation(deflator: number): string {
  if (!Number.isFinite(deflator)) return 'Unable to interpret this index.';
  if (Math.abs(deflator - 100) < 1e-9) {
    return 'Aggregate price level equals the base-year level (deflator = 100). This is not an annual inflation rate.';
  }
  if (deflator > 100) {
    return `Aggregate price level is ${formatPercent(deflator - 100)} above the base-year level. Not an annual inflation rate.`;
  }
  return `Aggregate price level is ${formatPercent(100 - deflator)} below the base-year level. Not an annual inflation rate.`;
}
