import type { OptimalHedgeRatioResult } from './types';

function formatHedgeRatio(value: number): string {
  const rounded = Number(value.toFixed(6));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  }).format(rounded);
}

/**
 * Minimum-variance optimal hedge ratio:
 * h* = ρ × (σs / σf)
 */
export function calculateOptimalHedgeRatio(input: {
  spotStdDev: number;
  futuresStdDev: number;
  correlation: number;
}): OptimalHedgeRatioResult | null {
  const { spotStdDev, futuresStdDev, correlation } = input;

  if (![spotStdDev, futuresStdDev, correlation].every(Number.isFinite)) return null;
  if (spotStdDev < 0) return null;
  if (!(futuresStdDev > 0)) return null;
  if (correlation < -1 || correlation > 1) return null;

  const hedgeRatio = correlation * (spotStdDev / futuresStdDev);
  if (!Number.isFinite(hedgeRatio)) return null;

  return {
    hedgeRatio,
    formattedHedgeRatio: formatHedgeRatio(hedgeRatio),
  };
}
