import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

const UNIT_TOLERANCE = 1e-9;

/** CR = CA / CL. CL must be > 0. CA ≥ 0. */
export function calculateCurrentRatio(
  currentAssets: number,
  currentLiabilities: number
): number | null {
  if (
    !Number.isFinite(currentAssets) ||
    currentAssets < 0 ||
    !Number.isFinite(currentLiabilities) ||
    currentLiabilities <= 0
  ) {
    return null;
  }
  const ratio = currentAssets / currentLiabilities;
  return Number.isFinite(ratio) ? ratio : null;
}

/** CA = CR × CL */
export function calculateCurrentAssets(
  currentRatio: number,
  currentLiabilities: number
): number | null {
  if (
    !Number.isFinite(currentRatio) ||
    currentRatio < 0 ||
    !Number.isFinite(currentLiabilities) ||
    currentLiabilities < 0
  ) {
    return null;
  }
  const assets = currentRatio * currentLiabilities;
  return Number.isFinite(assets) ? assets : null;
}

/**
 * CL = CA / CR.
 * Returns null when CR ≤ 0. Caller handles CA=0 & CR=0 as nonUnique.
 */
export function calculateCurrentLiabilities(
  currentAssets: number,
  currentRatio: number
): number | null {
  if (
    !Number.isFinite(currentAssets) ||
    currentAssets < 0 ||
    !Number.isFinite(currentRatio) ||
    currentRatio <= 0
  ) {
    return null;
  }
  const liabilities = currentAssets / currentRatio;
  return Number.isFinite(liabilities) ? liabilities : null;
}

/** WC = CA − CL. Negative results preserved. */
export function calculateWorkingCapital(
  currentAssets: number,
  currentLiabilities: number
): number | null {
  if (
    !Number.isFinite(currentAssets) ||
    currentAssets < 0 ||
    !Number.isFinite(currentLiabilities) ||
    currentLiabilities < 0
  ) {
    return null;
  }
  const wc = currentAssets - currentLiabilities;
  return Number.isFinite(wc) ? wc : null;
}

export function interpretCurrentRatio(ratio: number): string {
  if (!Number.isFinite(ratio) || ratio < 0) {
    return 'Current ratio could not be interpreted from the inputs.';
  }
  if (ratio < 1 - UNIT_TOLERANCE) {
    return 'Reported current assets are lower than current liabilities. That may warrant closer short-term liquidity review — it does not automatically mean the company cannot meet its obligations.';
  }
  if (Math.abs(ratio - 1) < UNIT_TOLERANCE) {
    return 'The company reports approximately one unit of current assets for each unit of current liabilities.';
  }
  if (ratio < 2 - UNIT_TOLERANCE) {
    return 'Current assets exceed current liabilities. Suitability still depends on industry, operating cycle, asset liquidity, and cash-flow stability — there is no universal ideal ratio.';
  }
  return 'Current assets are at least twice current liabilities. A high ratio can indicate coverage capacity, but may also reflect slow inventory, excess working capital, or other factors needing further analysis.';
}

export function formatCrMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatCurrentRatio(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}
