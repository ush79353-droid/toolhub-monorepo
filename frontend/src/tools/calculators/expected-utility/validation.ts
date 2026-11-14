import { calculateExpectedUtility } from './calculation';
import type {
  ExpectedUtilityFieldErrors,
  ExpectedUtilityInput,
  ExpectedUtilityResult,
} from './types';

function parseNumber(val: string): number | null {
  const trimmed = val.trim().replace(/,/g, '');
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

export function validateExpectedUtilityInput(input: ExpectedUtilityInput): {
  isValid: boolean;
  errors: ExpectedUtilityFieldErrors;
  result: ExpectedUtilityResult | null;
} {
  const errors: ExpectedUtilityFieldErrors = {};

  const p1 = parseNumber(input.probability1);
  const v1 = parseNumber(input.value1);
  const p2 = parseNumber(input.probability2);
  const v2 = parseNumber(input.value2);

  if (p1 === null || v1 === null || p2 === null || v2 === null) {
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(p1) || p1 < 0 || p1 > 100) {
    errors.probability1 = 'Enter a probability between 0 and 100';
  }
  if (Number.isNaN(p2) || p2 < 0 || p2 > 100) {
    errors.probability2 = 'Enter a probability between 0 and 100';
  }
  if (Number.isNaN(v1)) {
    errors.value1 = 'Enter a valid monetary value';
  }
  if (Number.isNaN(v2)) {
    errors.value2 = 'Enter a valid monetary value';
  }

  if (
    !errors.probability1 &&
    !errors.probability2 &&
    Math.abs((p1 as number) + (p2 as number) - 100) > 1e-9
  ) {
    errors.form = 'Probabilities must total 100%';
  }

  const isValid = Object.keys(errors).length === 0;
  if (!isValid) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateExpectedUtility({
    probability1: p1 as number,
    value1: v1 as number,
    probability2: p2 as number,
    value2: v2 as number,
    currency: input.currency,
  });

  return { isValid: result !== null, errors, result };
}
