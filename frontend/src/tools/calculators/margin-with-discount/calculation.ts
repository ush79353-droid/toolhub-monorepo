import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { MarginDiscountDriver } from './types';

/** Display rounding only — never used inside the formulas. */
export function formatMoneyAmount(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Display rounding for percents (never FX-converted). */
export function formatPercentValue(value: number): string {
  if (!Number.isFinite(value)) return '—';
  const rounded = Math.round(value * 1e8) / 1e8;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(rounded);
}

/** markup% from margin%: markup = 1/(1 − m) − 1 */
export function markupFromMarginPercent(marginPercent: number): number | null {
  if (!Number.isFinite(marginPercent)) return null;
  const m = marginPercent / 100;
  if (!(1 - m > 0)) return null;
  const markup = (1 / (1 - m) - 1) * 100;
  return Number.isFinite(markup) ? markup : null;
}

/** margin% from markup%: margin = mu / (1 + mu) */
export function marginFromMarkupPercent(markupPercent: number): number | null {
  if (!Number.isFinite(markupPercent)) return null;
  const mu = markupPercent / 100;
  if (!(1 + mu > 0)) return null;
  const margin = (mu / (1 + mu)) * 100;
  return Number.isFinite(margin) ? margin : null;
}

export interface MarginWithDiscountSolveInput {
  cost: number;
  baseMarginPercent: number | null;
  baseMarkupPercent: number | null;
  baseRevenue: number | null;
  /** Authoritative when margin and markup both present. */
  driver: MarginDiscountDriver;
  discountPercent: number;
}

export interface MarginWithDiscountSolveResult {
  baseRevenue: number;
  baseMarginPercent: number;
  baseMarkupPercent: number;
  priceAfterDiscount: number;
  profit: number;
  trueMarginPercent: number;
  trueMarkupPercent: number;
}

function markupFromProfitCost(profit: number, cost: number): number | null {
  if (cost === 0) return profit === 0 ? 0 : null;
  const markup = (profit / cost) * 100;
  return Number.isFinite(markup) ? markup : null;
}

/**
 * Base Revenue = Cost / (1 − Margin/100)  OR  Cost × (1 + Markup/100)
 *   (or from entered revenue when driver === 'revenue')
 * Price After Discount = Base Revenue × (1 − Discount/100)
 * Profit = Price After Discount − Cost
 * True Margin = Profit / Price After Discount × 100
 * True Markup = Profit / Cost × 100
 *
 * Authority: `driver` is last-edited among margin | markup | revenue.
 * Rejects cost < 0, discount outside 0–100, margin ≥ 100 when deriving revenue,
 * and any non-finite / division-by-zero path.
 */
export function calculateMarginWithDiscount(
  input: MarginWithDiscountSolveInput
): MarginWithDiscountSolveResult | null {
  const { cost, driver, discountPercent } = input;
  if (![cost, discountPercent].every(Number.isFinite)) return null;
  if (cost < 0) return null;
  if (discountPercent < 0 || discountPercent > 100) return null;

  let baseRevenue: number;
  let baseMarginPercent: number;
  let baseMarkupPercent: number;

  if (driver === 'margin') {
    if (
      input.baseMarginPercent === null ||
      !Number.isFinite(input.baseMarginPercent)
    ) {
      return null;
    }
    if (!(input.baseMarginPercent < 100)) return null;
    const denom = 1 - input.baseMarginPercent / 100;
    if (!(denom > 0)) return null;
    baseRevenue = cost / denom;
    if (!Number.isFinite(baseRevenue)) return null;
    const markup = markupFromMarginPercent(input.baseMarginPercent);
    if (markup === null) return null;
    baseMarginPercent = input.baseMarginPercent;
    baseMarkupPercent = markup;
  } else if (driver === 'markup') {
    if (
      input.baseMarkupPercent === null ||
      !Number.isFinite(input.baseMarkupPercent)
    ) {
      return null;
    }
    baseRevenue = cost * (1 + input.baseMarkupPercent / 100);
    if (!Number.isFinite(baseRevenue)) return null;
    const profitBase = baseRevenue - cost;
    if (baseRevenue === 0) {
      if (profitBase !== 0) return null;
      baseMarginPercent = 0;
    } else {
      const margin = (profitBase / baseRevenue) * 100;
      if (!Number.isFinite(margin)) return null;
      baseMarginPercent = margin;
    }
    baseMarkupPercent = input.baseMarkupPercent;
  } else {
    // driver === 'revenue' — derive margin/markup from cost + revenue
    if (input.baseRevenue === null || !Number.isFinite(input.baseRevenue)) {
      return null;
    }
    baseRevenue = input.baseRevenue;
    const profitBase = baseRevenue - cost;
    if (baseRevenue === 0) {
      if (profitBase !== 0) return null;
      baseMarginPercent = 0;
    } else {
      baseMarginPercent = (profitBase / baseRevenue) * 100;
    }
    const markup = markupFromProfitCost(profitBase, cost);
    if (markup === null || !Number.isFinite(baseMarginPercent)) return null;
    baseMarkupPercent = markup;
  }

  const priceAfterDiscount = baseRevenue * (1 - discountPercent / 100);
  if (!Number.isFinite(priceAfterDiscount)) return null;

  const profit = priceAfterDiscount - cost;
  if (!Number.isFinite(profit)) return null;

  // True margin needs a non-zero discounted price
  if (!(priceAfterDiscount !== 0)) {
    if (profit !== 0) return null;
  }
  const trueMarginPercent =
    priceAfterDiscount === 0 ? 0 : (profit / priceAfterDiscount) * 100;

  const trueMarkup = markupFromProfitCost(profit, cost);
  if (trueMarkup === null) return null;

  if (
    ![
      baseRevenue,
      baseMarginPercent,
      baseMarkupPercent,
      priceAfterDiscount,
      profit,
      trueMarginPercent,
      trueMarkup,
    ].every(Number.isFinite)
  ) {
    return null;
  }

  return {
    baseRevenue,
    baseMarginPercent,
    baseMarkupPercent,
    priceAfterDiscount,
    profit,
    trueMarginPercent,
    trueMarkupPercent: trueMarkup,
  };
}
