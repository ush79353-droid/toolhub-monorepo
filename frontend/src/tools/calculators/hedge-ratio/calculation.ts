import type { HedgeRatioResult } from './types';

/**
 * Hedge Ratio (%) = (Value of Hedge Position / Value of Total Exposure) × 100
 */
export function calculateHedgeRatio(
  totalExposure: number,
  hedgePosition: number
): HedgeRatioResult | null {
  if (!Number.isFinite(totalExposure) || !Number.isFinite(hedgePosition)) return null;
  if (totalExposure <= 0) return null;
  if (hedgePosition < 0) return null;

  const hedgeRatioPercent = (hedgePosition / totalExposure) * 100;
  if (!Number.isFinite(hedgeRatioPercent)) return null;

  const rounded = Number(hedgeRatioPercent.toFixed(4));
  const formattedHedgeRatio =
    Object.is(rounded, -0) || rounded === 0
      ? '0'
      : new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 4,
        }).format(rounded);

  return { hedgeRatioPercent, formattedHedgeRatio };
}
