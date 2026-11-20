import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Average Fixed Assets = (Starting + Final) / 2.
 * Both balances must be finite and ≥ 0.
 */
export function calculateAverageFixedAssets(
  startingFixedAssets: number,
  finalFixedAssets: number
): number | null {
  if (
    !Number.isFinite(startingFixedAssets) ||
    startingFixedAssets < 0 ||
    !Number.isFinite(finalFixedAssets) ||
    finalFixedAssets < 0
  ) {
    return null;
  }
  const average = (startingFixedAssets + finalFixedAssets) / 2;
  return Number.isFinite(average) ? average : null;
}

/**
 * Fixed Asset Turnover = Revenue / Average Fixed Assets.
 * Returns null when average fixed assets are zero (undefined).
 * Allows negative revenue (signed ratio).
 */
export function calculateFixedAssetTurnover(
  revenue: number,
  averageFixedAssets: number
): number | null {
  if (
    !Number.isFinite(revenue) ||
    !Number.isFinite(averageFixedAssets) ||
    averageFixedAssets === 0
  ) {
    return null;
  }
  const fat = revenue / averageFixedAssets;
  return Number.isFinite(fat) ? fat : null;
}

/**
 * Fixed Asset Intensity = Average Fixed Assets / Revenue.
 * Undefined when revenue is zero.
 */
export function calculateFixedAssetIntensity(
  averageFixedAssets: number,
  revenue: number
): number | null {
  if (
    !Number.isFinite(averageFixedAssets) ||
    averageFixedAssets < 0 ||
    !Number.isFinite(revenue) ||
    revenue === 0
  ) {
    return null;
  }
  const intensity = averageFixedAssets / revenue;
  return Number.isFinite(intensity) ? intensity : null;
}

export function interpretFixedAssetTurnover(
  fat: number | null,
  averageFixedAssets: number,
  revenue: number,
  status: string
): string {
  if (status === 'zeroAverageFixedAssets' || averageFixedAssets === 0) {
    return 'Fixed asset turnover cannot be calculated because average fixed assets are zero.';
  }
  if (fat === null || !Number.isFinite(fat)) {
    return 'Fixed asset turnover could not be determined from the inputs.';
  }
  if (revenue < 0) {
    return `Negative revenue produces a signed FAT of ${formatFat(fat)}×. Conventional asset-efficiency interpretation does not apply — review returns, corrections, or period restatements.`;
  }
  if (fat === 0) {
    return 'Fixed asset turnover of 0.00× means no revenue was generated against a positive average net fixed asset base during the period.';
  }
  if (fat < 1) {
    return `FAT of ${formatFat(fat)}× means about ${formatFat(fat)} dollars of revenue per dollar of average net fixed assets — often seen in capital-intensive businesses or after large asset investments. Compare with industry peers and asset age.`;
  }
  return `FAT of ${formatFat(fat)}× means about ${formatFat(fat)} dollars of revenue per dollar of average net fixed assets. Higher values can reflect strong utilization or a heavily depreciated asset base — evaluate with profitability and CapEx plans.`;
}

export function formatFatMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatFat(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}
