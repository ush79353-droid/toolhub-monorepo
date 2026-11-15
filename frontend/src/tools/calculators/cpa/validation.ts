import { isSupportedCurrency } from '@/tools/shared/currency';
import { calculateCpaResult } from './calculation';
import type { CpaFieldErrors, CpaInput, CpaResult } from './types';

function finite(value: number): boolean {
  return Number.isFinite(value);
}

export function validateCpa(input: CpaInput): {
  isValid: boolean;
  incomplete: boolean;
  errors: CpaFieldErrors;
  result: CpaResult | null;
} {
  const errors: CpaFieldErrors = {};
  let spendBlank = false;

  if (!isSupportedCurrency(input.currency)) errors.currency = 'Choose a supported currency';

  if (!finite(input.numberOfClicks)) spendBlank = true;
  else if (input.numberOfClicks < 0) {
    errors.numberOfClicks = 'Number of clicks cannot be negative';
  }

  if (!finite(input.averageCpc)) spendBlank = true;
  else if (input.averageCpc < 0) {
    errors.averageCpc = 'Average CPC cannot be negative';
  }

  if (finite(input.totalConversions) && input.totalConversions <= 0) {
    errors.totalConversions = 'Conversions must be greater than zero for CPA';
  }

  if (spendBlank || errors.numberOfClicks || errors.averageCpc || errors.currency) {
    return {
      isValid: false,
      incomplete: spendBlank && !errors.numberOfClicks && !errors.averageCpc && !errors.currency,
      errors,
      result: null,
    };
  }

  const result = calculateCpaResult({
    ...input,
    // Blank conversions → spend only; zero already errored above
    totalConversions: finite(input.totalConversions) ? input.totalConversions : Number.NaN,
  });

  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, incomplete: false, errors, result: null };
  }

  if (errors.totalConversions) {
    return {
      isValid: false,
      incomplete: false,
      errors,
      result: { ...result, cpa: null, cpaDisplay: '', shareCpa: '' },
    };
  }

  return { isValid: true, incomplete: false, errors: {}, result };
}
