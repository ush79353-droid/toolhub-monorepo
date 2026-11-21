/**
 * GDP Deflator = (Nominal GDP / Real GDP) × 100
 * N = D × R / 100
 * R = N × 100 / D
 * Inflation = (D_t − D_{t−1}) / D_{t−1} × 100
 */
import {
  GDP_MAGNITUDE_OPTIONS,
  type GdpMagnitude,
} from './types';

export function magnitudeFactor(magnitude: GdpMagnitude): number {
  const row = GDP_MAGNITUDE_OPTIONS.find((o) => o.id === magnitude);
  return row?.factor ?? 1;
}

export function toBaseUnits(amount: number, magnitude: GdpMagnitude): number {
  return amount * magnitudeFactor(magnitude);
}

export function calculateGDPDeflator(
  nominalGDP: number,
  realGDP: number
): number {
  if (!Number.isFinite(nominalGDP) || !Number.isFinite(realGDP)) {
    throw new Error('GDP values must be finite numbers.');
  }
  if (nominalGDP < 0 || realGDP <= 0) {
    throw new Error(
      'Nominal GDP must be non-negative and real GDP must be greater than zero.'
    );
  }
  return (nominalGDP / realGDP) * 100;
}

export function calculateNominalGDP(
  realGDP: number,
  deflator: number
): number {
  if (!Number.isFinite(realGDP) || !Number.isFinite(deflator)) {
    throw new Error('Values must be finite numbers.');
  }
  if (realGDP < 0 || deflator <= 0) {
    throw new Error(
      'Real GDP must be non-negative and GDP deflator must be greater than zero.'
    );
  }
  return (realGDP * deflator) / 100;
}

export function calculateRealGDP(
  nominalGDP: number,
  deflator: number
): number {
  if (!Number.isFinite(nominalGDP) || !Number.isFinite(deflator)) {
    throw new Error('Values must be finite numbers.');
  }
  if (nominalGDP < 0 || deflator <= 0) {
    throw new Error(
      'Nominal GDP must be non-negative and GDP deflator must be greater than zero.'
    );
  }
  return (nominalGDP * 100) / deflator;
}

export function calculateDeflatorInflation(
  previousDeflator: number,
  currentDeflator: number
): number {
  if (
    !Number.isFinite(previousDeflator) ||
    !Number.isFinite(currentDeflator)
  ) {
    throw new Error('Deflator values must be finite numbers.');
  }
  if (previousDeflator <= 0) {
    throw new Error('Previous-period GDP deflator must be greater than zero.');
  }
  return ((currentDeflator - previousDeflator) / previousDeflator) * 100;
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
  }).format(value)}%`;
}

export function formatGdpAmount(
  baseUnits: number,
  currencyCode: string,
  preferredMagnitude: GdpMagnitude
): string {
  const factor = magnitudeFactor(preferredMagnitude);
  const display = baseUnits / factor;
  const n = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(display);
  const mag =
    GDP_MAGNITUDE_OPTIONS.find((o) => o.id === preferredMagnitude)?.label ??
    'Units';
  return `${currencyCode} ${n} ${mag.toLowerCase()}`;
}

export function priceLevelInterpretation(deflator: number): string {
  if (!Number.isFinite(deflator)) {
    return 'Unable to interpret this index.';
  }
  if (Math.abs(deflator - 100) < 1e-9) {
    return 'The GDP deflator is at the index reference level of 100.';
  }
  if (deflator > 100) {
    const pct = formatPercent(deflator - 100);
    return `The GDP deflator is ${pct} above the index reference level of 100. This is a price-level index, not a one-year inflation rate.`;
  }
  const pct = formatPercent(100 - deflator);
  return `The GDP deflator is ${pct} below the index reference level of 100. This is a price-level index, not a one-year inflation rate.`;
}

export function magnitudeLabel(magnitude: GdpMagnitude): string {
  return (
    GDP_MAGNITUDE_OPTIONS.find((o) => o.id === magnitude)?.label ?? 'Units'
  );
}
