import { calculateAPC } from './calculation';
import type { ApcFieldErrors, ApcInput, ApcResult } from './types';

function parseNumber(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

export function validateApcInput(input: ApcInput): {
  isValid: boolean;
  errors: ApcFieldErrors;
  result: ApcResult | null;
} {
  const errors: ApcFieldErrors = {};
  const consumption = parseNumber(input.totalConsumption);
  const income = parseNumber(input.totalDisposableIncome);

  if (consumption === null || income === null) {
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(consumption) || consumption < 0) {
    errors.totalConsumption = 'Enter a nonnegative total consumption';
  }
  if (Number.isNaN(income) || !(income > 0)) {
    errors.totalDisposableIncome = 'Enter a disposable income greater than zero';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateAPC(
    consumption as number,
    income as number,
    input.currency,
  );
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate APC with the current inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors, result };
}
