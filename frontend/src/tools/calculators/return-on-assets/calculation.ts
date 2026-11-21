import {
  getCurrencyFractionDigits,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Average Total Assets = (Beginning + Ending) / 2
 */
export function calculateAverageAssets(
  beginningAssets: number,
  endingAssets: number
): number | null {
  if (
    !Number.isFinite(beginningAssets) ||
    !Number.isFinite(endingAssets) ||
    beginningAssets <= 0 ||
    endingAssets <= 0
  ) {
    return null;
  }
  const avg = (beginningAssets + endingAssets) / 2;
  return Number.isFinite(avg) && avg > 0 ? avg : null;
}

/**
 * ROA = (Net Income / Total Assets) × 100
 */
export function calculateROA(
  netIncome: number,
  totalAssets: number
): { roaPercentage: number; profitPerAssetUnit: number } | null {
  if (!Number.isFinite(netIncome)) return null;
  if (!Number.isFinite(totalAssets) || totalAssets <= 0) return null;
  const profitPerAssetUnit = netIncome / totalAssets;
  if (!Number.isFinite(profitPerAssetUnit)) return null;
  const roaPercentage = profitPerAssetUnit * 100;
  if (!Number.isFinite(roaPercentage)) return null;
  return { roaPercentage, profitPerAssetUnit };
}

export function formatRoaMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatRoaPercent(value: number, digits = 2): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}%`;
}

export function explainProfitPerAsset(
  profitPerAssetUnit: number,
  currency: SupportedCurrency
): string {
  const symbol = getCurrencySymbol(currency);
  const perUnit = formatRoaMoney(profitPerAssetUnit, currency);
  if (profitPerAssetUnit < 0) {
    return `For every ${symbol}1 of assets, the company generated approximately ${symbol}${perUnit} in net income (a loss).`;
  }
  if (profitPerAssetUnit === 0) {
    return `For every ${symbol}1 of assets, the company generated no net income during the selected period.`;
  }
  return `For every ${symbol}1 of assets, the company generated approximately ${symbol}${perUnit} in net income.`;
}

export function interpretROA(roaPercentage: number): string {
  if (!Number.isFinite(roaPercentage)) {
    return 'Return on assets is unavailable.';
  }
  if (roaPercentage > 0 && roaPercentage < 25) {
    return 'Positive ROA: the company generated positive net income relative to its asset base. Compare with industry peers and multi-period trends.';
  }
  if (roaPercentage >= 25) {
    return 'The calculated ROA is relatively high. Compare it against companies in the same industry and review the underlying accounting figures; ROA varies widely by sector.';
  }
  if (roaPercentage === 0 || Math.abs(roaPercentage) < 1e-12) {
    return 'Zero ROA: the company reported no net profit relative to its assets during the selected period.';
  }
  return 'Negative ROA: the company reported a net loss relative to its asset base.';
}
