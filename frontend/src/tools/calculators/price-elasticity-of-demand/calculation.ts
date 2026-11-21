import {
  calculateMidpointElasticity,
  formatElasticity,
} from '@/tools/calculators/optimal-price/calculation';
import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { PedClassification } from './types';

export { calculateMidpointElasticity, formatElasticity };

const UNIT_TOLERANCE = 1e-9;

/** Revenue = P × Q (P > 0, Q ≥ 0). */
export function calculateRevenue(
  price: number,
  quantity: number
): number | null {
  if (
    !Number.isFinite(price) ||
    !Number.isFinite(quantity) ||
    price <= 0 ||
    quantity < 0
  ) {
    return null;
  }
  const revenue = price * quantity;
  return Number.isFinite(revenue) ? revenue : null;
}

/**
 * % change in revenue relative to initial revenue.
 * Undefined when initial revenue ≤ 0.
 */
export function calculateRevenueIncreasePercent(
  initialRevenue: number,
  finalRevenue: number
): number | null {
  if (
    !Number.isFinite(initialRevenue) ||
    !Number.isFinite(finalRevenue) ||
    initialRevenue <= 0
  ) {
    return null;
  }
  const pct = ((finalRevenue - initialRevenue) / initialRevenue) * 100;
  return Number.isFinite(pct) ? pct : null;
}

export function classifyPed(elasticity: number): PedClassification {
  if (!Number.isFinite(elasticity)) return 'unavailable';
  const abs = Math.abs(elasticity);

  if (abs <= UNIT_TOLERANCE) return 'perfectlyInelastic';

  if (Math.abs(abs - 1) <= UNIT_TOLERANCE) {
    return elasticity > 0 ? 'positiveUnit' : 'unitElastic';
  }

  if (elasticity > 0) return 'positiveRelationship';

  if (abs > 1) return 'elastic';
  return 'inelastic';
}

export function classificationLabel(kind: PedClassification): string {
  switch (kind) {
    case 'elastic':
      return 'Elastic demand';
    case 'unitElastic':
      return 'Unit elastic demand';
    case 'inelastic':
      return 'Inelastic demand';
    case 'perfectlyInelastic':
      return 'Perfectly inelastic over the observed interval';
    case 'positiveUnit':
      return 'Positive price–quantity relationship, magnitude unit elastic';
    case 'positiveRelationship':
      return 'Positive price–quantity relationship';
    default:
      return '—';
  }
}

export function interpretPed(
  elasticity: number | null,
  classification: PedClassification,
  revenueIncreasePercent: number | null
): string {
  if (elasticity === null || classification === 'unavailable') {
    return 'Midpoint PED is unavailable for these observations. Revenue figures still use P × Q when prices and quantities are valid.';
  }

  const ped = formatElasticity(elasticity);
  let base: string;
  switch (classification) {
    case 'elastic':
      base = `PED of ${ped} has absolute value greater than 1; demand is elastic over this interval.`;
      break;
    case 'unitElastic':
      base = `PED of ${ped} ≈ −1; unit elastic demand over this interval.`;
      break;
    case 'inelastic':
      base = `PED of ${ped} has absolute value between 0 and 1; demand is inelastic over this interval.`;
      break;
    case 'perfectlyInelastic':
      base =
        'PED of 0; quantity did not change while price changed (perfectly inelastic over the observed interval).';
      break;
    case 'positiveUnit':
      base = `PED of ${ped} is positive with magnitude ≈ 1; not ordinary downward-sloping unit-elastic demand.`;
      break;
    case 'positiveRelationship':
      base = `PED of ${ped} is positive; price and quantity moved in the same direction. Other market factors may dominate.`;
      break;
    default:
      base = `PED ≈ ${ped}.`;
  }

  if (revenueIncreasePercent !== null) {
    const rev = formatPercent(revenueIncreasePercent);
    base += ` Observed revenue changed by ${rev}% between the two points (not the same as profit).`;
  }

  return base;
}

export function midpointBreakdown(
  initialPrice: number,
  initialQuantity: number,
  finalPrice: number,
  finalQuantity: number
): {
  priceChange: number;
  averagePrice: number;
  percentPriceChange: number;
  quantityChange: number;
  averageQuantity: number;
  percentQuantityChange: number;
} | null {
  if (
    ![initialPrice, initialQuantity, finalPrice, finalQuantity].every(
      Number.isFinite
    ) ||
    initialPrice <= 0 ||
    finalPrice <= 0 ||
    initialQuantity < 0 ||
    finalQuantity < 0
  ) {
    return null;
  }
  const averagePrice = (initialPrice + finalPrice) / 2;
  const averageQuantity = (initialQuantity + finalQuantity) / 2;
  if (averagePrice <= 0 || averageQuantity <= 0) return null;
  if (initialPrice === finalPrice) return null;

  const priceChange = finalPrice - initialPrice;
  const quantityChange = finalQuantity - initialQuantity;
  const percentPriceChange = (priceChange / averagePrice) * 100;
  const percentQuantityChange = (quantityChange / averageQuantity) * 100;

  if (
    !Number.isFinite(percentPriceChange) ||
    !Number.isFinite(percentQuantityChange)
  ) {
    return null;
  }

  return {
    priceChange,
    averagePrice,
    percentPriceChange,
    quantityChange,
    averageQuantity,
    percentQuantityChange,
  };
}

export function formatPedMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
    signDisplay: 'exceptZero',
  }).format(value);
}

export function formatPlainQuantity(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(value);
}
