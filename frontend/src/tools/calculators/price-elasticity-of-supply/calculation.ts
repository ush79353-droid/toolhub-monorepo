/**
 * PES = %ΔQs / %ΔP
 * Standard: bases on P₁, Q₁
 * Midpoint: bases on averages (arc elasticity; reverse-symmetric)
 * PES is dimensionless — never attach currency or % to the coefficient.
 */

import { formatElasticity } from '@/tools/calculators/optimal-price/calculation';
import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { PesClassification, PesMethod } from './types';
import { PES_METHOD_OPTIONS } from './types';

export { formatElasticity };

const EPS = 1e-9;

export function calculateStandardPriceChangePercent(
  p1: number,
  p2: number
): number | null {
  if (![p1, p2].every(Number.isFinite) || p1 <= 0) return null;
  const pct = ((p2 - p1) / p1) * 100;
  return Number.isFinite(pct) ? pct : null;
}

export function calculateStandardQuantityChangePercent(
  q1: number,
  q2: number
): number | null {
  if (![q1, q2].every(Number.isFinite) || q1 <= 0) return null;
  const pct = ((q2 - q1) / q1) * 100;
  return Number.isFinite(pct) ? pct : null;
}

export function calculateMidpointPriceChangePercent(
  p1: number,
  p2: number
): number | null {
  if (![p1, p2].every(Number.isFinite) || p1 <= 0 || p2 <= 0) return null;
  const avg = (p1 + p2) / 2;
  if (avg <= 0) return null;
  const pct = ((p2 - p1) / avg) * 100;
  return Number.isFinite(pct) ? pct : null;
}

export function calculateMidpointQuantityChangePercent(
  q1: number,
  q2: number
): number | null {
  if (![q1, q2].every(Number.isFinite) || q1 < 0 || q2 < 0) return null;
  const avg = (q1 + q2) / 2;
  if (avg <= 0) return null;
  const pct = ((q2 - q1) / avg) * 100;
  return Number.isFinite(pct) ? pct : null;
}

export function calculateStandardPES(
  p1: number,
  p2: number,
  q1: number,
  q2: number
): number | null {
  if (
    ![p1, p2, q1, q2].every(Number.isFinite) ||
    p1 <= 0 ||
    p2 <= 0 ||
    q1 <= 0 ||
    q2 < 0
  ) {
    return null;
  }
  const priceChange = (p2 - p1) / p1;
  const quantityChange = (q2 - q1) / q1;
  if (Math.abs(priceChange) <= EPS) return null;
  const result = quantityChange / priceChange;
  return Number.isFinite(result) ? (Object.is(result, -0) ? 0 : result) : null;
}

export function calculateMidpointPES(
  p1: number,
  p2: number,
  q1: number,
  q2: number
): number | null {
  if (
    ![p1, p2, q1, q2].every(Number.isFinite) ||
    p1 <= 0 ||
    p2 <= 0 ||
    q1 < 0 ||
    q2 < 0 ||
    q1 + q2 <= 0
  ) {
    return null;
  }
  const priceChange = (p2 - p1) / ((p1 + p2) / 2);
  const quantityChange = (q2 - q1) / ((q1 + q2) / 2);
  if (Math.abs(priceChange) <= EPS) return null;
  const result = quantityChange / priceChange;
  return Number.isFinite(result) ? (Object.is(result, -0) ? 0 : result) : null;
}

export function classifySupplyElasticity(value: number): PesClassification {
  if (!Number.isFinite(value)) return 'undefined';
  if (value < -EPS) return 'negative';
  if (Math.abs(value) <= EPS) return 'perfectlyInelastic';
  if (Math.abs(value - 1) <= EPS) return 'unitElastic';
  if (value < 1) return 'inelastic';
  return 'elastic';
}

export function classificationLabel(kind: PesClassification): string {
  switch (kind) {
    case 'perfectlyInelastic':
      return 'Perfectly inelastic supply';
    case 'inelastic':
      return 'Relatively inelastic supply';
    case 'unitElastic':
      return 'Unit elastic supply';
    case 'elastic':
      return 'Relatively elastic supply';
    case 'negative':
      return 'Negative observed supply response';
    case 'undefined':
      return 'Undefined elasticity';
    default:
      return '—';
  }
}

export function methodLabel(method: PesMethod): string {
  return PES_METHOD_OPTIONS.find((o) => o.id === method)?.label ?? method;
}

export function interpretPes(args: {
  pes: number | null;
  classification: PesClassification;
  percentPrice: number | null;
  percentQuantity: number | null;
  method: PesMethod;
  undefinedReason?: string | null;
}): string {
  if (args.undefinedReason) return args.undefinedReason;
  if (args.pes === null || args.classification === 'unavailable') {
    return 'Enter valid prices and quantities to calculate price elasticity of supply.';
  }

  const pesStr = formatElasticity(args.pes);
  const pctP =
    args.percentPrice != null ? formatPercent(args.percentPrice) : null;
  const pctQ =
    args.percentQuantity != null
      ? formatPercent(args.percentQuantity)
      : null;
  const methodNote =
    args.method === 'midpoint' ? ' (midpoint method)' : ' (standard method)';

  switch (args.classification) {
    case 'unitElastic':
      return `Price changed by ${pctP}% while quantity supplied changed by ${pctQ}%. PES = ${pesStr}${methodNote}; unit-elastic supply over the observed interval.`;
    case 'elastic':
      return `Quantity supplied changed by a larger percentage (${pctQ}%) than price (${pctP}%). PES = ${pesStr}${methodNote}; relatively elastic supply.`;
    case 'inelastic':
      return `Quantity supplied changed by a smaller percentage (${pctQ}%) than price (${pctP}%). PES = ${pesStr}${methodNote}; relatively inelastic supply.`;
    case 'perfectlyInelastic':
      return `Quantity supplied did not change while price changed (${pctP}%). PES = 0${methodNote}; perfectly inelastic over the observed interval.`;
    case 'negative':
      return `Price and quantity supplied moved in opposite directions (price ${pctP}%, quantity ${pctQ}%). Observed PES = ${pesStr}${methodNote}; not a conventional positive supply response.`;
    case 'undefined':
      return 'A finite elasticity coefficient cannot be calculated from these observations.';
    default:
      return `PES ≈ ${pesStr}${methodNote}.`;
  }
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
    signDisplay: 'exceptZero',
  }).format(value);
}

export function formatMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    currencyDisplay: 'code',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatQuantity(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(value);
}
