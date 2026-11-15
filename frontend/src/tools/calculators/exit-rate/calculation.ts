import type { ExitRateResult } from './types';

/**
 * Exit Rate (%) = (Number of Exits / Number of Pageviews) × 100
 */
export function calculateExitRate(pageviews: number, exits: number): ExitRateResult | null {
  if (!Number.isFinite(pageviews) || !Number.isFinite(exits)) return null;
  if (pageviews <= 0 || exits < 0) return null;
  if (exits > pageviews) return null;

  const exitRatePercent = (exits / pageviews) * 100;
  if (!Number.isFinite(exitRatePercent)) return null;

  const formattedRate = Number(exitRatePercent.toFixed(4)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });

  return { exitRatePercent, formattedRate };
}
