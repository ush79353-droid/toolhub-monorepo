import { buildMovingAverageResult } from './calculation';
import {
  INITIAL_PRICES,
  MAX_PRICES,
  MIN_LENGTH,
  emptyPrice,
  type MovingAverageFieldErrors,
  type MovingAverageInput,
  type MovingAverageResult,
} from './types';

function parsePrice(raw: string): number | null | typeof Number.NaN {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return null;
  if (/infinity|nan/i.test(trimmed)) return Number.NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : Number.NaN;
}

function isBlankPrice(raw: string): boolean {
  return raw.trim() === '';
}

/** Keep at least 3 rows; append a blank when the last price is filled; trim extra blanks. */
export function ensureTrailingPrices(input: MovingAverageInput): MovingAverageInput {
  const prices = [...input.prices];
  if (prices.length === 0) {
    return {
      ...input,
      prices: Array.from({ length: INITIAL_PRICES }, () => emptyPrice()),
    };
  }

  const last = prices[prices.length - 1]!;
  if (!isBlankPrice(last) && prices.length < MAX_PRICES) {
    prices.push(emptyPrice());
  }

  while (
    prices.length > INITIAL_PRICES &&
    isBlankPrice(prices[prices.length - 1]!) &&
    isBlankPrice(prices[prices.length - 2]!)
  ) {
    prices.pop();
  }

  return { ...input, prices };
}

export function validateMovingAverage(input: MovingAverageInput): {
  isValid: boolean;
  errors: MovingAverageFieldErrors;
  result: MovingAverageResult | null;
  incomplete: boolean;
} {
  const errors: MovingAverageFieldErrors = {};

  if (Number.isFinite(input.length)) {
    if (!Number.isInteger(input.length) || input.length < MIN_LENGTH) {
      errors.length = `Enter a whole number of at least ${MIN_LENGTH}`;
    }
  }

  const parsedPrices: number[] = [];
  input.prices.forEach((raw, index) => {
    if (isBlankPrice(raw)) return;
    const value = parsePrice(raw);
    if (value === null || Number.isNaN(value)) {
      errors[`price${index + 1}`] = 'Enter a valid price';
      return;
    }
    if (value < 0) {
      errors[`price${index + 1}`] = 'Price cannot be negative';
      return;
    }
    parsedPrices.push(value);
  });

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null, incomplete: false };
  }

  const lengthReady = Number.isFinite(input.length) && !errors.length;
  const length = input.length;
  const need =
    lengthReady && Number.isInteger(length) && length >= MIN_LENGTH ? length : MIN_LENGTH;

  if (!lengthReady || parsedPrices.length < need) {
    return { isValid: false, errors, result: null, incomplete: true };
  }

  const result = buildMovingAverageResult(parsedPrices, length, input.currency);
  if (!result) {
    return { isValid: false, errors, result: null, incomplete: true };
  }

  return { isValid: true, errors, result, incomplete: false };
}
