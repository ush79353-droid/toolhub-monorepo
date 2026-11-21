/**
 * GDP Gap (%) = ((Actual − Potential) / Potential) × 100
 * Actual = Potential × (1 + Gap/100)
 * Potential = Actual / (1 + Gap/100)  (Gap > −100%)
 */
import {
  GDP_MAGNITUDE_OPTIONS,
  type GdpMagnitude,
} from './types';

export function magnitudeFactor(magnitude: GdpMagnitude): number {
  return GDP_MAGNITUDE_OPTIONS.find((o) => o.id === magnitude)?.factor ?? 1;
}

export function toBaseUnits(amount: number, magnitude: GdpMagnitude): number {
  return amount * magnitudeFactor(magnitude);
}

export function calculateGDPGap(
  actualGDP: number,
  potentialGDP: number
): number {
  if (!Number.isFinite(actualGDP) || !Number.isFinite(potentialGDP)) {
    throw new Error('Enter valid GDP values.');
  }
  if (actualGDP <= 0 || potentialGDP <= 0) {
    throw new Error(
      'Actual GDP and potential GDP must be greater than zero.'
    );
  }
  return ((actualGDP - potentialGDP) / potentialGDP) * 100;
}

export function calculateActualGDP(
  potentialGDP: number,
  gapPercent: number
): number {
  if (!Number.isFinite(potentialGDP) || !Number.isFinite(gapPercent)) {
    throw new Error('Enter valid values.');
  }
  if (potentialGDP <= 0) {
    throw new Error('Potential GDP must be greater than zero.');
  }
  if (gapPercent <= -100) {
    throw new Error(
      'GDP gap must be greater than −100% when calculating actual GDP.'
    );
  }
  const actual = potentialGDP * (1 + gapPercent / 100);
  if (!(actual > 0) || !Number.isFinite(actual)) {
    throw new Error('Calculated actual GDP must be greater than zero.');
  }
  return actual;
}

export function calculatePotentialGDP(
  actualGDP: number,
  gapPercent: number
): number {
  if (!Number.isFinite(actualGDP) || !Number.isFinite(gapPercent)) {
    throw new Error('Enter valid values.');
  }
  if (actualGDP <= 0) {
    throw new Error('Actual GDP must be greater than zero.');
  }
  if (gapPercent <= -100) {
    throw new Error(
      'GDP gap must be greater than −100% when calculating potential GDP.'
    );
  }
  const potential = actualGDP / (1 + gapPercent / 100);
  if (!(potential > 0) || !Number.isFinite(potential)) {
    throw new Error('Calculated potential GDP must be greater than zero.');
  }
  return potential;
}

export function absoluteOutputGap(
  actualGDP: number,
  potentialGDP: number
): number {
  return actualGDP - potentialGDP;
}

export function formatGapPercent(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value)}%`;
}

export function formatGdpAmount(
  baseUnits: number,
  currencyCode: string,
  preferredMagnitude: GdpMagnitude
): string {
  const factor = magnitudeFactor(preferredMagnitude);
  const n = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(baseUnits / factor);
  const mag =
    GDP_MAGNITUDE_OPTIONS.find((o) => o.id === preferredMagnitude)?.label ??
    'Units';
  return `${currencyCode} ${n} ${mag.toLowerCase()}`;
}

export function displayFromBase(
  base: number,
  mag: GdpMagnitude
): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(base / magnitudeFactor(mag));
}

export function gapStatus(gapPercent: number): {
  title: string;
  interpretation: string;
} {
  if (Math.abs(gapPercent) < 1e-9) {
    return {
      title: 'Output at Potential',
      interpretation:
        'Actual GDP equals estimated potential GDP. Potential GDP is an estimate and may be revised.',
    };
  }
  if (gapPercent > 0) {
    return {
      title: 'Positive Output Gap',
      interpretation:
        'Actual GDP is above estimated potential GDP. This may indicate that economic activity is running above a sustainable level, potentially increasing inflationary pressures. A positive gap does not guarantee inflation.',
    };
  }
  return {
    title: 'Negative Output Gap',
    interpretation:
      'Actual GDP is below estimated potential GDP. This suggests that some productive capacity may be underutilized. A negative gap is not by itself a formal recession definition.',
  };
}
