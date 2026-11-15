import {
  getCurrencyFractionDigits,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { AmountSnapshot, ConversionField, ConversionSnapshot } from './types';

/** Format a finite number with up to `maxFrac` fraction digits, trimming trailing zeros. */
export function formatNumber(value: number, maxFrac = 8): string {
  if (!Number.isFinite(value)) return '';
  const fixed = Number(value.toFixed(maxFrac));
  return fixed.toLocaleString('en-US', {
    useGrouping: false,
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFrac,
  });
}

/**
 * Canonical: 1 bps = 0.0001 decimal = 0.01% = 0.1‰
 * Basis Points = Decimal × 10,000
 */
export function conversionFromField(
  field: ConversionField,
  raw: number
): ConversionSnapshot | null {
  if (!Number.isFinite(raw)) return null;

  let basisPoints: number;
  switch (field) {
    case 'decimal':
      basisPoints = raw * 10_000;
      break;
    case 'percent':
      basisPoints = raw * 100;
      break;
    case 'permille':
      basisPoints = raw * 10;
      break;
    case 'basisPoints':
      basisPoints = raw;
      break;
  }

  if (!Number.isFinite(basisPoints)) return null;

  const decimal = basisPoints / 10_000;
  const percent = basisPoints / 100;
  const permille = basisPoints / 10;

  if (![decimal, percent, permille, basisPoints].every(Number.isFinite)) return null;

  return {
    decimal,
    percent,
    permille,
    basisPoints,
    formattedDecimal: formatNumber(decimal),
    formattedPercent: formatNumber(percent),
    formattedPermille: formatNumber(permille),
    formattedBasisPoints: formatNumber(basisPoints),
  };
}

/**
 * Amount = (Basis Points / 10,000) × Monetary Value
 */
export function calculateBpsOfAmount(
  xBps: number,
  ofAmount: number,
  currency: SupportedCurrency
): AmountSnapshot | null {
  if (!Number.isFinite(xBps) || !Number.isFinite(ofAmount)) return null;

  const equals = (xBps / 10_000) * ofAmount;
  if (!Number.isFinite(equals)) return null;

  const digits = getCurrencyFractionDigits(currency);
  const formattedEquals = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(equals);

  const symbol = getCurrencySymbol(currency);
  const ofFormatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(ofAmount);
  const xFormatted = formatNumber(xBps, 8);

  const explanation = `${xFormatted} bps of ${symbol}${ofFormatted} equals ${symbol}${formattedEquals}`;

  return {
    xBps,
    ofAmount,
    equals,
    formattedEquals,
    explanation,
  };
}
