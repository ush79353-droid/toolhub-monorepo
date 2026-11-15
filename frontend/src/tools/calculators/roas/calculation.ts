import type { SupportedCurrency } from '@/tools/shared/currency';
import type { RoasResult } from './types';

function formatPercent(value: number): string {
  return Number(value.toFixed(4)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });
}

function formatRatio(value: number): string {
  return `${Number(value.toFixed(4)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  })}×`;
}

/**
 * ROAS (%) = (Ad Revenue / Ad Spend) × 100
 * Ad-only ROI (%) = ((Ad Revenue − Ad Spend) / Ad Spend) × 100
 * Requires positive ad spend. Zero revenue is allowed (ROAS 0%, ROI −100%).
 */
export function calculateRoas(
  adSpend: number,
  adRevenue: number,
  currency: SupportedCurrency
): RoasResult | null {
  if (!Number.isFinite(adSpend) || !Number.isFinite(adRevenue)) return null;
  if (!(adSpend > 0) || adRevenue < 0) return null;

  const roasRatio = adRevenue / adSpend;
  const roasPercent = roasRatio * 100;
  const adOnlyRoiPercent = ((adRevenue - adSpend) / adSpend) * 100;
  if (![roasRatio, roasPercent, adOnlyRoiPercent].every(Number.isFinite)) return null;

  return {
    adSpend,
    adRevenue,
    roasPercent,
    roasRatio,
    adOnlyRoiPercent,
    currency,
    formattedRoasPercent: formatPercent(roasPercent),
    formattedRoasRatio: formatRatio(roasRatio),
    formattedAdOnlyRoiPercent: formatPercent(adOnlyRoiPercent),
  };
}
