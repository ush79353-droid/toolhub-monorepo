import type { LiquidNetWorthInput, LiquidNetWorthResult } from './types';

export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round(value * 100) / 100;
}

/**
 * Liquid Net Worth = Total Liquid Assets − Total Liabilities
 * Negative results are kept (do not clamp to zero).
 */
export function calculateLiquidNetWorth(
  input: LiquidNetWorthInput,
): LiquidNetWorthResult | null {
  const { totalLiquidAssets: assets, totalLiabilities: liabilities } = input;

  if (assets === null || liabilities === null) return null;
  if (!Number.isFinite(assets) || !Number.isFinite(liabilities)) return null;

  const liquidNetWorth = roundMoney(assets - liabilities);
  if (!Number.isFinite(liquidNetWorth)) return null;

  return {
    totalLiquidAssets: assets,
    totalLiabilities: liabilities,
    liquidNetWorth,
    currency: input.currency,
  };
}
