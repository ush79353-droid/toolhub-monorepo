import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { QuantityUnit } from './types';
import { QUANTITY_UNITS } from './types';

/**
 * Discrete / incremental marginal cost: MC = ΔTC / ΔQ.
 * Returns null when quantity change is zero (undefined / indeterminate).
 */
export function calculateMarginalCost(
  costChange: number,
  quantityChange: number
): number | null {
  if (
    !Number.isFinite(costChange) ||
    !Number.isFinite(quantityChange) ||
    quantityChange === 0
  ) {
    return null;
  }
  const mc = costChange / quantityChange;
  return Number.isFinite(mc) ? mc : null;
}

export function unitShortLabel(unit: QuantityUnit): string {
  return QUANTITY_UNITS.find((u) => u.value === unit)?.short ?? 'unit';
}

export function unitPluralLabel(unit: QuantityUnit): string {
  return QUANTITY_UNITS.find((u) => u.value === unit)?.label ?? 'units';
}

export function interpretMarginalCost(
  costChange: number,
  quantityChange: number,
  marginalCost: number | null,
  unitShort: string
): string {
  if (quantityChange === 0) {
    if (costChange === 0) {
      return 'Indeterminate — both cost and quantity changes are zero (0 ÷ 0).';
    }
    return 'Marginal cost cannot be calculated because the change in quantity is zero.';
  }

  if (marginalCost === null) {
    return 'Marginal cost is unavailable for these inputs.';
  }

  const mcText = formatMcMoneyPlain(marginalCost);

  if (marginalCost === 0) {
    return `Marginal cost is 0 per ${unitShort} — total cost did not change while output changed by ${formatMcQuantity(quantityChange)} ${unitPluralFromShort(unitShort)}.`;
  }

  if (costChange > 0 && quantityChange > 0) {
    return `Over this interval, each additional ${unitShort} raised total cost by about ${mcText} on average (discrete / incremental MC).`;
  }
  if (costChange < 0 && quantityChange < 0) {
    return `Both total cost and quantity decreased. The ratio is ${mcText} per ${unitShort} — not the cost of expanding output.`;
  }
  if (costChange < 0 && quantityChange > 0) {
    return `Total cost fell while output rose — calculated MC is ${mcText} per ${unitShort}. Possible efficiency or noncomparable observations; not proof of profitability.`;
  }
  return `Total cost rose while quantity fell — calculated MC is ${mcText} per ${unitShort}. Review whether the two observations are comparable.`;
}

function unitPluralFromShort(short: string): string {
  if (short === 'kg' || short === 'g' || short === 'L') return short;
  return `${short}s`;
}

export function formatMcMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    signDisplay: 'auto',
  }).format(amount);
}

function formatMcMoneyPlain(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
    signDisplay: 'exceptZero',
  }).format(amount);
}

export function formatMcQuantity(value: number): string {
  if (Number.isInteger(value)) {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
      signDisplay: 'exceptZero',
    }).format(value);
  }
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
    signDisplay: 'exceptZero',
  }).format(value);
}
