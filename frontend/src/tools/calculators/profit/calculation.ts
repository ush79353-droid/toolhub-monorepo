import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Display rounding only — never used inside the formulas. */
export function formatProfitMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/**
 * Unit Cost = C / Cq
 * Unit Selling Price = P / Pq
 * Total Cost = Unit Cost × Q
 * Revenue = Unit Selling Price × Q × (1 − D/100)
 * Total Profit = Revenue − Total Cost
 *
 * Requires Cq > 0, Pq > 0; C,P,Q ≥ 0; D in [0, 100].
 * Full precision — round only for display.
 */
export function calculateProfit(input: {
  cost: number;
  costPer: number;
  price: number;
  pricePer: number;
  quantity: number;
  discountPercent: number;
}): {
  unitCost: number;
  unitPrice: number;
  totalCost: number;
  revenue: number;
  totalProfit: number;
} | null {
  const { cost, costPer, price, pricePer, quantity, discountPercent } = input;
  if (
    ![cost, costPer, price, pricePer, quantity, discountPercent].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (cost < 0 || price < 0 || quantity < 0) return null;
  if (!(costPer > 0) || !(pricePer > 0)) return null;
  if (discountPercent < 0 || discountPercent > 100) return null;

  const unitCost = cost / costPer;
  const unitPrice = price / pricePer;
  if (![unitCost, unitPrice].every(Number.isFinite)) return null;

  const totalCost = unitCost * quantity;
  const revenue = unitPrice * quantity * (1 - discountPercent / 100);
  const totalProfit = revenue - totalCost;

  if (![totalCost, revenue, totalProfit].every(Number.isFinite)) return null;

  return { unitCost, unitPrice, totalCost, revenue, totalProfit };
}
