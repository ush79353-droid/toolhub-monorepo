import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { PivotMethod } from './types';

export interface PivotMathInput {
  method: PivotMethod;
  high: number;
  low: number;
  close: number;
  open: number | null;
}

export interface PivotMathResult {
  pivot: number | null;
  r1: number | null;
  r2: number | null;
  r3: number | null;
  r4: number | null;
  s1: number | null;
  s2: number | null;
  s3: number | null;
  s4: number | null;
}

function emptyLevels(): PivotMathResult {
  return {
    pivot: null,
    r1: null,
    r2: null,
    r3: null,
    r4: null,
    s1: null,
    s2: null,
    s3: null,
    s4: null,
  };
}

function classicOrWoodieLevels(
  p: number,
  h: number,
  l: number
): PivotMathResult {
  const range = h - l;
  return {
    pivot: p,
    r1: 2 * p - l,
    r2: p + range,
    r3: h + 2 * (p - l),
    r4: null,
    s1: 2 * p - h,
    s2: p - range,
    s3: l - 2 * (h - p),
    s4: null,
  };
}

function calculateClassic(h: number, l: number, c: number): PivotMathResult {
  const p = (h + l + c) / 3;
  return classicOrWoodieLevels(p, h, l);
}

function calculateWoodie(h: number, l: number, c: number): PivotMathResult {
  const p = (h + l + 2 * c) / 4;
  return classicOrWoodieLevels(p, h, l);
}

function calculateCamarilla(h: number, l: number, c: number): PivotMathResult {
  const d = h - l;
  const p = (h + l + c) / 3;
  return {
    pivot: p,
    r1: c + (1.1 * d) / 12,
    r2: c + (1.1 * d) / 6,
    r3: c + (1.1 * d) / 4,
    r4: c + (1.1 * d) / 2,
    s1: c - (1.1 * d) / 12,
    s2: c - (1.1 * d) / 6,
    s3: c - (1.1 * d) / 4,
    s4: c - (1.1 * d) / 2,
  };
}

function calculateFibonacci(h: number, l: number, c: number): PivotMathResult {
  const p = (h + l + c) / 3;
  const d = h - l;
  return {
    pivot: p,
    r1: p + 0.382 * d,
    r2: p + 0.618 * d,
    r3: p + 1 * d,
    r4: null,
    s1: p - 0.382 * d,
    s2: p - 0.618 * d,
    s3: p - 1 * d,
    s4: null,
  };
}

function calculateDemark(
  h: number,
  l: number,
  c: number,
  o: number
): PivotMathResult {
  let x: number;
  if (c < o) {
    x = h + 2 * l + c;
  } else if (c > o) {
    x = 2 * h + l + c;
  } else {
    x = h + l + 2 * c;
  }
  const p = x / 4;
  return {
    pivot: p,
    r1: x / 2 - l,
    r2: null,
    r3: null,
    r4: null,
    s1: x / 2 - h,
    s2: null,
    s3: null,
    s4: null,
  };
}

/**
 * Method-specific pivot / support / resistance levels.
 * Unsupported levels for a method are null.
 */
export function calculatePivotPoints(
  input: PivotMathInput
): PivotMathResult | null {
  const { method, high, low, close, open } = input;

  if (![high, low, close].every(Number.isFinite)) return null;
  if (high < 0 || low < 0 || close < 0) return null;
  if (high < low) return null;
  if (close < low || close > high) return null;

  let result: PivotMathResult;

  switch (method) {
    case 'classic':
      result = calculateClassic(high, low, close);
      break;
    case 'woodie':
      result = calculateWoodie(high, low, close);
      break;
    case 'camarilla':
      result = calculateCamarilla(high, low, close);
      break;
    case 'fibonacci':
      result = calculateFibonacci(high, low, close);
      break;
    case 'demark': {
      if (open === null || !Number.isFinite(open) || open < 0) return null;
      if (open < low || open > high) return null;
      result = calculateDemark(high, low, close, open);
      break;
    }
    default:
      return null;
  }

  const values = Object.values(result).filter((v) => v !== null) as number[];
  if (values.some((v) => !Number.isFinite(v))) return null;

  return result;
}

export function formatPivotPrice(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function emptyPivotResult(): PivotMathResult {
  return emptyLevels();
}
