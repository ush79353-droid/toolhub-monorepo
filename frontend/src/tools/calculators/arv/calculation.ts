import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { AreaUnit, ValuationMethod } from './types';

/** Exact factor from the ARV spec: 1 m² = 10.7639104167 ft². */
export const SQ_FT_PER_M2 = 10.7639104167;

/**
 * Convert a physical area between square feet and square meters.
 * Preserves the underlying area; does not round.
 */
export function convertArea(
  value: number,
  from: AreaUnit,
  to: AreaUnit
): number {
  if (!Number.isFinite(value)) return value;
  if (from === to) return value;
  if (from === 'ft2' && to === 'm2') return value / SQ_FT_PER_M2;
  return value * SQ_FT_PER_M2;
}

/**
 * Convert a price-per-area so that price × area stays constant when the area
 * unit changes. $/ft² → $/m² multiplies by SQ_FT_PER_M2.
 */
export function convertPricePerArea(
  value: number,
  from: AreaUnit,
  to: AreaUnit
): number {
  if (!Number.isFinite(value)) return value;
  if (from === to) return value;
  if (from === 'ft2' && to === 'm2') return value * SQ_FT_PER_M2;
  return value / SQ_FT_PER_M2;
}

/**
 * Current property value (PV).
 * Direct: PV = entered value.
 * Average: PV = average price per area × property area (same area unit).
 */
export function calculateCurrentPropertyValue(input: {
  method: ValuationMethod;
  propertyValue: number;
  averagePrice: number;
  propertyArea: number;
}): number | null {
  const { method, propertyValue, averagePrice, propertyArea } = input;
  if (method === 'property-value') {
    if (!Number.isFinite(propertyValue) || propertyValue < 0) return null;
    return propertyValue;
  }
  if (
    !Number.isFinite(averagePrice) ||
    !Number.isFinite(propertyArea) ||
    averagePrice < 0 ||
    propertyArea <= 0
  ) {
    return null;
  }
  const pv = averagePrice * propertyArea;
  return Number.isFinite(pv) ? pv : null;
}

/** ARV = PV + VR (value added by renovations). */
export function calculateArv(
  propertyValue: number,
  renovationValue: number
): number | null {
  if (
    !Number.isFinite(propertyValue) ||
    !Number.isFinite(renovationValue) ||
    propertyValue < 0 ||
    renovationValue < 0
  ) {
    return null;
  }
  const arv = propertyValue + renovationValue;
  return Number.isFinite(arv) ? arv : null;
}

/**
 * Maximum bid under the investor purchase rule:
 * MBP = (ARV × P / 100) − RC
 * Negative results are returned as-is (caller may warn).
 */
export function calculateMaximumBid(
  arv: number,
  purchaseRulePercent: number,
  renovationCost: number
): number | null {
  if (
    !Number.isFinite(arv) ||
    !Number.isFinite(purchaseRulePercent) ||
    !Number.isFinite(renovationCost) ||
    arv < 0 ||
    renovationCost < 0 ||
    purchaseRulePercent < 0 ||
    purchaseRulePercent > 100
  ) {
    return null;
  }
  const mbp = (arv * purchaseRulePercent) / 100 - renovationCost;
  return Number.isFinite(mbp) ? mbp : null;
}

/**
 * Simplified gross ROI (%):
 * ROI = (ARV − PP − RC) / (PP + RC) × 100
 * Returns null when total investment is zero (undefined, not Infinity).
 */
export function calculateRoi(
  arv: number,
  purchasePrice: number,
  renovationCost: number
): {
  roiPercent: number;
  totalInvestment: number;
  estimatedGrossProfit: number;
} | null {
  if (
    !Number.isFinite(arv) ||
    !Number.isFinite(purchasePrice) ||
    !Number.isFinite(renovationCost) ||
    purchasePrice < 0 ||
    renovationCost < 0
  ) {
    return null;
  }
  const totalInvestment = purchasePrice + renovationCost;
  if (totalInvestment === 0) return null;
  const estimatedGrossProfit = arv - totalInvestment;
  const roiPercent = (estimatedGrossProfit / totalInvestment) * 100;
  if (!Number.isFinite(roiPercent)) return null;
  return { roiPercent, totalInvestment, estimatedGrossProfit };
}

/**
 * Reverse: purchase price that yields target ROI T%:
 * PP = ARV / (1 + T/100) − RC
 */
export function calculateTargetPurchasePrice(
  arv: number,
  targetRoiPercent: number,
  renovationCost: number
): number | null {
  if (
    !Number.isFinite(arv) ||
    !Number.isFinite(targetRoiPercent) ||
    !Number.isFinite(renovationCost) ||
    arv < 0 ||
    renovationCost < 0 ||
    targetRoiPercent <= -100
  ) {
    return null;
  }
  const divisor = 1 + targetRoiPercent / 100;
  if (divisor === 0 || !Number.isFinite(divisor)) return null;
  const pp = arv / divisor - renovationCost;
  return Number.isFinite(pp) ? pp : null;
}

/** Display rounding only — never used inside formulas. */
export function formatArvMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatArvPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function areaUnitLabel(unit: AreaUnit): string {
  return unit === 'ft2' ? 'ft²' : 'm²';
}
