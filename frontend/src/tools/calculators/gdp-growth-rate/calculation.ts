/**
 * GDP Growth (%) = ((Current − Previous) / Previous) × 100
 * Current = Previous × (1 + g/100)
 * Previous = Current / (1 + g/100)  (g > −100%)
 * Optional annualized QoQ: (Current/Previous)^4 − 1
 */
import {
  GDP_MAGNITUDE_OPTIONS,
  type GdpMagnitude,
  type GdpMeasureType,
  type GdpPeriod,
} from './types';

export function magnitudeFactor(magnitude: GdpMagnitude): number {
  return GDP_MAGNITUDE_OPTIONS.find((o) => o.id === magnitude)?.factor ?? 1;
}

export function toBaseUnits(amount: number, magnitude: GdpMagnitude): number {
  return amount * magnitudeFactor(magnitude);
}

export function calculateGDPGrowth(
  currentGDP: number,
  previousGDP: number
): number {
  if (!Number.isFinite(currentGDP) || !Number.isFinite(previousGDP)) {
    throw new Error('Please enter valid GDP values.');
  }
  if (currentGDP <= 0 || previousGDP <= 0) {
    throw new Error('Current and previous GDP must be greater than zero.');
  }
  return ((currentGDP - previousGDP) / previousGDP) * 100;
}

export function calculateCurrentGDP(
  previousGDP: number,
  growthPercent: number
): number {
  if (!Number.isFinite(previousGDP) || !Number.isFinite(growthPercent)) {
    throw new Error('Enter valid values.');
  }
  if (previousGDP <= 0) {
    throw new Error('Previous GDP must be greater than zero.');
  }
  if (growthPercent <= -100) {
    throw new Error(
      'GDP growth must be greater than −100% when calculating current GDP.'
    );
  }
  const current = previousGDP * (1 + growthPercent / 100);
  if (!(current > 0) || !Number.isFinite(current)) {
    throw new Error('Calculated current GDP must be greater than zero.');
  }
  return current;
}

export function calculatePreviousGDP(
  currentGDP: number,
  growthPercent: number
): number {
  if (!Number.isFinite(currentGDP) || !Number.isFinite(growthPercent)) {
    throw new Error('Enter valid values.');
  }
  if (currentGDP <= 0) {
    throw new Error('Current GDP must be greater than zero.');
  }
  if (growthPercent <= -100) {
    throw new Error(
      'GDP growth must be greater than −100% when calculating previous GDP.'
    );
  }
  const previous = currentGDP / (1 + growthPercent / 100);
  if (!(previous > 0) || !Number.isFinite(previous)) {
    throw new Error('Calculated previous GDP must be greater than zero.');
  }
  return previous;
}

/** Consecutive quarterly levels only — returns percent, not decimal. */
export function annualizeQuarterlyGrowth(
  currentGDP: number,
  previousGDP: number
): number {
  if (!(currentGDP > 0) || !(previousGDP > 0)) {
    throw new Error('GDP levels must be positive to annualize.');
  }
  return (Math.pow(currentGDP / previousGDP, 4) - 1) * 100;
}

export function formatGrowthPercent(value: number): string {
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
  const n = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(baseUnits / magnitudeFactor(preferredMagnitude));
  const mag =
    GDP_MAGNITUDE_OPTIONS.find((o) => o.id === preferredMagnitude)?.label ??
    'Units';
  return `${currencyCode} ${n} ${mag.toLowerCase()}`;
}

export function displayFromBase(base: number, mag: GdpMagnitude): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(base / magnitudeFactor(mag));
}

export function periodLabel(period: GdpPeriod): string {
  if (period === 'quarterly') return 'Quarterly comparison';
  if (period === 'custom') return 'Custom period comparison';
  return 'Annual comparison';
}

export function measureLabel(measure: GdpMeasureType): string {
  if (measure === 'real') return 'Real GDP (inflation-adjusted)';
  if (measure === 'nominal') return 'Nominal GDP (current prices)';
  return 'GDP measure not specified';
}

export function growthStatus(
  growthPercent: number,
  measure: GdpMeasureType
): { title: string; interpretation: string } {
  const measureHint =
    measure === 'real'
      ? ' If both figures are real GDP, this reflects a change in inflation-adjusted output.'
      : measure === 'nominal'
        ? ' Nominal growth includes both output and price changes — it is not the same as real growth.'
        : ' Confirm whether the figures are real or nominal before interpreting economic volume.';

  if (Math.abs(growthPercent) < 1e-9) {
    return {
      title: 'No GDP Change',
      interpretation: `GDP remained unchanged between the two periods.${measureHint}`,
    };
  }
  if (growthPercent > 0) {
    return {
      title: 'Economic Expansion',
      interpretation: `GDP increased by ${formatGrowthPercent(growthPercent).replace('+', '')} compared with the previous period.${measureHint} One strong period does not define a lasting expansion by itself.`,
    };
  }
  return {
    title: 'Economic Contraction',
    interpretation: `GDP decreased by ${formatGrowthPercent(Math.abs(growthPercent)).replace('+', '')} compared with the previous period.${measureHint} One negative growth period does not automatically establish a recession.`,
  };
}
