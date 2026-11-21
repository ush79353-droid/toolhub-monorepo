import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export interface StockCalculationInput {
  /** Number of shares N (> 0). */
  numberOfShares: number;
  /** Buying price per share B (≥ 0). */
  buyingPrice: number;
  /** Buying commission rate b as percent (0–100). */
  buyingCommissionPercent: number;
  /** Selling price per share S (≥ 0). */
  sellingPrice: number;
  /** Selling commission rate s as percent (0–100). */
  sellingCommissionPercent: number;
}

export interface StockCalculationResult {
  grossPurchaseCost: number;
  buyingCommissionAmount: number;
  netBuyingCost: number;
  grossSaleProceeds: number;
  sellingCommissionAmount: number;
  netSellingProceeds: number;
  profit: number;
  roiPercent: number;
  /** Per-share break-even selling price. */
  breakEvenSellingPrice: number;
}

/**
 * Round-trip stock trade with percent commissions:
 *   Gross purchase = N × B
 *   Buy commission = Gross purchase × b/100
 *   Net buying cost = Gross purchase + Buy commission
 *   Gross sale = N × S
 *   Sell commission = Gross sale × s/100
 *   Net selling = Gross sale − Sell commission
 *   Profit = Net selling − Net buying
 *   ROI (%) = Profit / Net buying × 100
 *   Break-even/share = Net buying / [N × (1 − s/100)]
 *
 * Rejects non-finite inputs, non-positive shares, negative prices,
 * commissions outside 0–100, zero net buying cost (ROI), and
 * selling commission of 100% (undefined break-even).
 * Full precision — round only for display.
 */
export function calculateStockTrade(
  input: StockCalculationInput
): StockCalculationResult | null {
  const {
    numberOfShares: N,
    buyingPrice: B,
    buyingCommissionPercent: b,
    sellingPrice: S,
    sellingCommissionPercent: s,
  } = input;

  if (![N, B, b, S, s].every(Number.isFinite)) return null;
  if (!(N > 0)) return null;
  if (B < 0 || S < 0) return null;
  if (b < 0 || b > 100 || s < 0 || s > 100) return null;

  const grossPurchaseCost = N * B;
  const buyingCommissionAmount = (grossPurchaseCost * b) / 100;
  const netBuyingCost = grossPurchaseCost + buyingCommissionAmount;

  const grossSaleProceeds = N * S;
  const sellingCommissionAmount = (grossSaleProceeds * s) / 100;
  const netSellingProceeds = grossSaleProceeds - sellingCommissionAmount;

  const profit = netSellingProceeds - netBuyingCost;

  if (
    ![
      grossPurchaseCost,
      buyingCommissionAmount,
      netBuyingCost,
      grossSaleProceeds,
      sellingCommissionAmount,
      netSellingProceeds,
      profit,
    ].every(Number.isFinite)
  ) {
    return null;
  }

  // ROI undefined when nothing was invested after commissions.
  if (!(netBuyingCost > 0)) return null;

  const roiPercent = (profit / netBuyingCost) * 100;
  if (!Number.isFinite(roiPercent)) return null;

  // Break-even undefined when selling commission takes 100% of proceeds.
  const retention = 1 - s / 100;
  if (!(retention > 0)) return null;

  const breakEvenSellingPrice = netBuyingCost / (N * retention);
  if (!Number.isFinite(breakEvenSellingPrice)) return null;

  return {
    grossPurchaseCost,
    buyingCommissionAmount,
    netBuyingCost,
    grossSaleProceeds,
    sellingCommissionAmount,
    netSellingProceeds,
    profit,
    roiPercent,
    breakEvenSellingPrice,
  };
}

/** Display rounding only — never used inside the formulas. */
export function formatStockMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Display rounding for ROI percent. */
export function formatStockPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}
