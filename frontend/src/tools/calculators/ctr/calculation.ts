import type { CtrResult } from './types';

/**
 * CTR (%) = (Clicks / Ad Impressions) × 100
 */
export function calculateCtr(impressions: number, clicks: number): CtrResult | null {
  if (!Number.isFinite(impressions) || !Number.isFinite(clicks)) return null;
  if (impressions <= 0 || clicks < 0) return null;
  if (clicks > impressions) return null;

  const ctrPercent = (clicks / impressions) * 100;
  if (!Number.isFinite(ctrPercent)) return null;

  const formattedRate = Number(ctrPercent.toFixed(4)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });

  return { ctrPercent, formattedRate };
}
