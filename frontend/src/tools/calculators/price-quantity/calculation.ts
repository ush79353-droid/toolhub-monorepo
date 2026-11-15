import type { PriceQuantityInput, PriceQuantityResult } from './types';

export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round(value * 100) / 100;
}

/** Extra precision for unit prices so small per-unit values stay accurate. */
export function roundUnitPrice(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round(value * 1_000_000) / 1_000_000;
}

/**
 * Smaller PPU = Smaller Price / Smaller Quantity
 * Larger PPU = Larger Price / Larger Quantity
 * Would Have Cost = Larger Quantity × Smaller PPU
 * You Save = Would Have Cost − Larger Price
 */
export function calculatePriceQuantity(
  input: PriceQuantityInput,
): PriceQuantityResult | null {
  const {
    smallerQuantity: sq,
    smallerPrice: sp,
    largerQuantity: lq,
    largerPrice: lp,
  } = input;

  if (sq === null || sp === null || lq === null || lp === null) return null;
  if (
    !Number.isFinite(sq) ||
    !Number.isFinite(sp) ||
    !Number.isFinite(lq) ||
    !Number.isFinite(lp)
  ) {
    return null;
  }
  if (sq <= 0 || lq <= 0) return null;

  const smallerPricePerUnit = roundUnitPrice(sp / sq);
  const largerPricePerUnit = roundUnitPrice(lp / lq);
  if (!Number.isFinite(smallerPricePerUnit) || !Number.isFinite(largerPricePerUnit)) {
    return null;
  }

  const wouldHaveCost = roundMoney(lq * smallerPricePerUnit);
  if (!Number.isFinite(wouldHaveCost)) return null;

  const youSave = roundMoney(wouldHaveCost - lp);
  if (!Number.isFinite(youSave)) return null;

  return {
    smallerQuantity: sq,
    smallerPrice: sp,
    largerQuantity: lq,
    largerPrice: lp,
    smallerPricePerUnit,
    largerPricePerUnit,
    wouldHaveCost,
    youSave,
    currency: input.currency,
  };
}
