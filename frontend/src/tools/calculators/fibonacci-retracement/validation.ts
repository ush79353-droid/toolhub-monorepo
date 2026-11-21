import {
  calculateFibonacci,
  formatFibPercent,
  formatFibPrice,
  interpretFibonacci,
} from './calculation';
import type {
  FibonacciFieldErrors,
  FibonacciInput,
  FibonacciResult,
} from './types';

export interface FibonacciValidation {
  isValid: boolean;
  errors: FibonacciFieldErrors;
  result: FibonacciResult | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export function validateFibonacciInput(
  input: FibonacciInput
): FibonacciValidation {
  const errors: FibonacciFieldErrors = {};
  let hasFieldError = false;

  const low = parseNumber(input.lowPrice);
  if (low.blank) {
    errors.lowPrice = 'Enter the low price.';
    hasFieldError = true;
  } else if (low.invalid || low.value === null) {
    errors.lowPrice = 'Enter a valid low price.';
    hasFieldError = true;
  } else if (low.value < 0) {
    errors.lowPrice = 'Low price cannot be negative.';
    hasFieldError = true;
  }

  const high = parseNumber(input.highPrice);
  if (high.blank) {
    errors.highPrice = 'Enter the high price.';
    hasFieldError = true;
  } else if (high.invalid || high.value === null) {
    errors.highPrice = 'Enter a valid high price.';
    hasFieldError = true;
  } else if (high.value < 0) {
    errors.highPrice = 'High price cannot be negative.';
    hasFieldError = true;
  }

  if (
    !hasFieldError &&
    low.value != null &&
    high.value != null &&
    !(high.value > low.value)
  ) {
    errors.highPrice =
      'High price must be greater than low price to define a price range.';
    hasFieldError = true;
  }

  if (hasFieldError) {
    return { isValid: false, errors, result: null };
  }

  if (low.value === null || high.value === null) {
    return { isValid: false, errors, result: null };
  }

  const math = calculateFibonacci({
    lowPrice: low.value,
    highPrice: high.value,
    trend: input.trend,
    levelType: input.levelType,
  });

  if (math === null) {
    errors.form = 'Unable to calculate Fibonacci levels with these inputs.';
    return { isValid: false, errors, result: null };
  }

  const hasNegativeLevel = math.levels.some((l) => l.price < 0);
  const notes: string[] = [];
  if (hasNegativeLevel) {
    notes.push(
      'One or more extension levels are negative — not valid prices for ordinary stocks, but shown for the math.'
    );
  }
  notes.push(
    'Fibonacci levels are analytical reference points, not price predictions. Platforms may use different ratio sets.'
  );

  const result: FibonacciResult = {
    priceDifference: math.priceDifference,
    formattedDifference: formatFibPrice(math.priceDifference),
    levels: math.levels.map((l) => ({
      ratio: l.ratio,
      percentageLabel: `${formatFibPercent(l.ratio)}%`,
      price: l.price,
      formattedPrice: formatFibPrice(l.price),
    })),
    hasNegativeLevel,
    interpretation: interpretFibonacci(
      input.trend,
      input.levelType,
      math.priceDifference
    ),
    warningMessage: notes.join(' '),
  };

  return { isValid: true, errors, result };
}
