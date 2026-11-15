import type { SortinoAssetResult } from './types';

function formatRatio(value: number): string {
  const rounded = Number(value.toFixed(4));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(rounded);
}

/**
 * Sortino Ratio = (Ra − Rf) / Downside Deviation
 * Ra and Rf are percent; downside deviation is in percentage points (same scale).
 * Result is unitless.
 */
export function calculateSortinoRatio(
  averageReturnPercent: number,
  riskFreeRatePercent: number,
  downsideDeviation: number
): SortinoAssetResult | null {
  if (
    ![averageReturnPercent, riskFreeRatePercent, downsideDeviation].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(downsideDeviation > 0)) return null;

  const sortinoRatio = (averageReturnPercent - riskFreeRatePercent) / downsideDeviation;
  if (!Number.isFinite(sortinoRatio)) return null;

  return {
    sortinoRatio,
    formattedSortinoRatio: formatRatio(sortinoRatio),
  };
}
