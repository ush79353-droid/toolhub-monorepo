import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export type AreaUnit = 'ft2' | 'm2';
export type RentalPeriod = 'monthly' | 'annually';
export type PricingContext = 'purchase' | 'rent';
export type PricePerAreaMode = 'pricePerArea' | 'totalPrice' | 'area';

/** Exact factor: 1 m² = 10.7639104167 ft². */
export const SQ_FT_PER_M2 = 10.7639104167;

/** Exact factor: 1 ft² = 0.09290304 m². */
export const M2_PER_SQ_FT = 0.09290304;

export function areaUnitLabel(unit: AreaUnit): string {
  return unit === 'ft2' ? 'ft²' : 'm²';
}

export function convertArea(
  value: number,
  from: AreaUnit,
  to: AreaUnit
): number {
  if (!Number.isFinite(value) || from === to) return value;
  // Use SQ_FT_PER_M2 for both directions so conversions stay exact inverses.
  if (from === 'ft2' && to === 'm2') return value / SQ_FT_PER_M2;
  return value * SQ_FT_PER_M2;
}

/** Keep price × area constant when switching area units. */
export function convertPricePerArea(
  value: number,
  from: AreaUnit,
  to: AreaUnit
): number {
  if (!Number.isFinite(value) || from === to) return value;
  if (from === 'ft2' && to === 'm2') return value * SQ_FT_PER_M2;
  return value / SQ_FT_PER_M2;
}

export function convertRentalPeriodDisplay(
  amount: number,
  from: RentalPeriod,
  to: RentalPeriod
): number {
  if (!Number.isFinite(amount) || from === to) return amount;
  const annual = from === 'monthly' ? amount * 12 : amount;
  return to === 'monthly' ? annual / 12 : annual;
}

export function calculatePricePerArea(
  price: number,
  area: number
): number | null {
  if (
    !Number.isFinite(price) ||
    !Number.isFinite(area) ||
    price < 0 ||
    area <= 0
  ) {
    return null;
  }
  const unit = price / area;
  return Number.isFinite(unit) ? unit : null;
}

export function calculateTotalPrice(
  pricePerArea: number,
  area: number
): number | null {
  if (
    !Number.isFinite(pricePerArea) ||
    !Number.isFinite(area) ||
    pricePerArea < 0 ||
    area <= 0
  ) {
    return null;
  }
  const total = pricePerArea * area;
  return Number.isFinite(total) ? total : null;
}

export function calculateAreaFromPrice(
  price: number,
  pricePerArea: number
): number | null {
  if (
    !Number.isFinite(price) ||
    !Number.isFinite(pricePerArea) ||
    price < 0 ||
    pricePerArea <= 0
  ) {
    return null;
  }
  const area = price / pricePerArea;
  return Number.isFinite(area) ? area : null;
}

export function calculateAbsolutePriceDifference(
  propertyB: number,
  propertyA: number
): number | null {
  if (!Number.isFinite(propertyB) || !Number.isFinite(propertyA)) return null;
  const diff = propertyB - propertyA;
  return Number.isFinite(diff) ? diff : null;
}

/**
 * Percentage difference vs property A: ((B / A) − 1) × 100.
 * Unavailable when A is zero.
 */
export function calculatePercentagePriceDifference(
  propertyB: number,
  propertyA: number
): number | null {
  if (
    !Number.isFinite(propertyB) ||
    !Number.isFinite(propertyA) ||
    propertyA === 0
  ) {
    return null;
  }
  const pct = (propertyB / propertyA - 1) * 100;
  return Number.isFinite(pct) ? pct : null;
}

export function formatPricePerAreaMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatPricePerAreaValue(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(value);
}

export function formatPricePerAreaRate(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function pricePerAreaUnitLabel(
  currencySymbol: string,
  areaUnit: AreaUnit,
  pricingContext: PricingContext,
  rentalPeriod: RentalPeriod | null
): string {
  const area = areaUnitLabel(areaUnit);
  if (pricingContext === 'rent' && rentalPeriod) {
    const period = rentalPeriod === 'monthly' ? 'month' : 'year';
    return `${currencySymbol}/${area}/${period}`;
  }
  return `${currencySymbol}/${area}`;
}
