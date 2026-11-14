import type { BounceRateResult } from './types';

/**
 * Bounce Rate (%) = (One-page Visits / Total Website Visits) × 100
 */
export function calculateBounceRate(
  websiteVisits: number,
  onePageVisits: number
): BounceRateResult | null {
  if (!Number.isFinite(websiteVisits) || !Number.isFinite(onePageVisits)) {
    return null;
  }
  if (websiteVisits <= 0 || onePageVisits < 0) {
    return null;
  }
  if (onePageVisits > websiteVisits) {
    return null;
  }

  const bounceRatePercent = (onePageVisits / websiteVisits) * 100;
  if (!Number.isFinite(bounceRatePercent)) {
    return null;
  }

  const formattedRate = Number(bounceRatePercent.toFixed(2)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return {
    bounceRatePercent,
    formattedRate,
  };
}
