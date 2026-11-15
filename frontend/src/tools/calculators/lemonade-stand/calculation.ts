import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export function calculateCupsCost(
  servings: number,
  costPerCup: number,
  modifyCupCosts: boolean,
  cupsTotalOverride: number
): number {
  if (modifyCupCosts) {
    return Number.isFinite(cupsTotalOverride) ? cupsTotalOverride : Number.NaN;
  }
  if (!Number.isFinite(servings) || !Number.isFinite(costPerCup)) return Number.NaN;
  const value = servings * costPerCup;
  return Number.isFinite(value) ? value : Number.NaN;
}

export function calculateIngredientsCost(
  mode: 'known' | 'recipe',
  knownTotal: number,
  lemons: number,
  sugar: number,
  water: number
): number {
  if (mode === 'known') {
    return Number.isFinite(knownTotal) ? knownTotal : Number.NaN;
  }
  if (!Number.isFinite(lemons) || !Number.isFinite(sugar) || !Number.isFinite(water)) {
    return Number.NaN;
  }
  const value = lemons + sugar + water;
  return Number.isFinite(value) ? value : Number.NaN;
}

export function calculateTotalCost(
  cupsCost: number,
  ingredientsCost: number,
  permitCost: number,
  otherCosts: number
): number {
  if (
    !Number.isFinite(cupsCost) ||
    !Number.isFinite(ingredientsCost) ||
    !Number.isFinite(permitCost) ||
    !Number.isFinite(otherCosts)
  ) {
    return Number.NaN;
  }
  const value = cupsCost + ingredientsCost + permitCost + otherCosts;
  return Number.isFinite(value) ? value : Number.NaN;
}

export function calculateCostPerServing(totalCost: number, servings: number): number {
  if (!Number.isFinite(totalCost) || !Number.isFinite(servings) || servings <= 0) {
    return Number.NaN;
  }
  const value = totalCost / servings;
  return Number.isFinite(value) ? value : Number.NaN;
}

export function calculateTotalProfit(
  sellingPrice: number,
  servings: number,
  totalCost: number
): number {
  if (
    !Number.isFinite(sellingPrice) ||
    !Number.isFinite(servings) ||
    !Number.isFinite(totalCost)
  ) {
    return Number.NaN;
  }
  const revenue = sellingPrice * servings;
  if (!Number.isFinite(revenue)) return Number.NaN;
  const profit = revenue - totalCost;
  return Number.isFinite(profit) ? profit : Number.NaN;
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  if (!Number.isFinite(amount)) return '';
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function buildExplanation(input: {
  totalProfit: number;
  totalCost: number;
  servings: number;
  sellingPrice: number;
  breakEvenPrice: number;
  targetProfit: number | null;
  currency: SupportedCurrency;
}): string {
  const money = (n: number) => formatCurrencyValue(n, input.currency);
  if (input.totalProfit > 0) {
    const targetNote =
      input.targetProfit !== null && Number.isFinite(input.targetProfit)
        ? input.totalProfit >= input.targetProfit
          ? ` You met your target profit of ${money(input.targetProfit)}.`
          : ` You are ${money(input.targetProfit - input.totalProfit)} short of your ${money(input.targetProfit)} target.`
        : '';
    return `You earn ${money(input.totalProfit)} at ${money(input.sellingPrice)} per serving.${targetNote}`;
  }
  if (input.totalProfit === 0) {
    return `You break even at ${money(input.sellingPrice)} per serving.`;
  }
  const shortfall = Math.abs(input.totalProfit);
  return `So close! You’ll be just ${money(shortfall)} away from breaking even. Try selling more or price each serving near ${money(input.breakEvenPrice)} to cover costs.`;
}
