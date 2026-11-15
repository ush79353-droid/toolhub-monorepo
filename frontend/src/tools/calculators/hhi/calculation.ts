import type { HhiResult } from './types';

/**
 * HHI = Σ (market share %)² for each listed firm.
 * Shares are percentages (0–100), not decimals.
 */
export function calculateHhi(shares: readonly number[]): HhiResult | null {
  if (shares.length === 0) return null;
  if (!shares.every((s) => Number.isFinite(s) && s >= 0)) return null;

  const shareTotal = shares.reduce((sum, s) => sum + s, 0);
  if (!Number.isFinite(shareTotal) || shareTotal > 100) return null;

  const hhi = shares.reduce((sum, s) => sum + s * s, 0);
  if (!Number.isFinite(hhi)) return null;

  const formattedHhi = Number(hhi.toFixed(4)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });
  const formattedShareTotal = Number(shareTotal.toFixed(4)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });

  return {
    shares: [...shares],
    shareTotal,
    hhi,
    firmCount: shares.length,
    coversPartialMarket: shareTotal < 100,
    formattedHhi,
    formattedShareTotal,
  };
}
