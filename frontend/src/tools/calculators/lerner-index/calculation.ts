import type { SupportedCurrency } from '@/tools/shared/currency';
import type { LernerIndexResult } from './types';

/**
 * Lerner Index = (Price − Marginal Cost) / Price
 * Displayed as a decimal (not a percentage). Negative values are kept when MC > Price.
 */
export function calculateLernerIndex(
  price: number,
  marginalCost: number,
  currency: SupportedCurrency
): LernerIndexResult | null {
  if (!Number.isFinite(price) || !Number.isFinite(marginalCost)) return null;
  if (price <= 0 || marginalCost < 0) return null;

  const lernerIndex = (price - marginalCost) / price;
  if (!Number.isFinite(lernerIndex)) return null;

  const formattedIndex = Number(lernerIndex.toFixed(4)).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });

  return {
    price,
    marginalCost,
    lernerIndex,
    currency,
    formattedIndex,
  };
}
