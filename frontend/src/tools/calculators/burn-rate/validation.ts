import { isSupportedCurrency } from '@/tools/shared/currency';
import { calculateBurnRate } from './calculation';
import {
  DURATION_UNITS,
  RUNWAY_UNITS,
  type BurnRateFieldErrors,
  type BurnRateInput,
  type BurnRateResult,
} from './types';

function finite(value: number): boolean {
  return Number.isFinite(value);
}

export function validateBurnRate(input: BurnRateInput): {
  isValid: boolean;
  incomplete: boolean;
  errors: BurnRateFieldErrors;
  result: BurnRateResult | null;
} {
  const errors: BurnRateFieldErrors = {};

  if (!isSupportedCurrency(input.currency)) errors.currency = 'Choose a supported currency';
  if (!DURATION_UNITS.includes(input.durationUnit)) {
    errors.durationUnit = 'Choose a duration unit';
  }
  if (!RUNWAY_UNITS.includes(input.runwayUnit)) {
    errors.runwayUnit = 'Choose a runway unit';
  }

  let anyBlank = false;

  if (!finite(input.initialBalance)) anyBlank = true;
  else if (input.initialBalance < 0) errors.initialBalance = 'Initial balance cannot be negative';

  if (!finite(input.finalBalance)) anyBlank = true;
  else if (input.finalBalance < 0) errors.finalBalance = 'Final balance cannot be negative';

  if (!finite(input.duration)) anyBlank = true;
  else if (input.duration <= 0) errors.duration = 'Duration must be greater than zero';

  if (anyBlank || Object.keys(errors).length > 0) {
    return {
      isValid: false,
      incomplete: anyBlank && Object.keys(errors).length === 0,
      errors,
      result: null,
    };
  }

  const result = calculateBurnRate(input);
  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, incomplete: false, errors, result: null };
  }

  return { isValid: true, incomplete: false, errors: {}, result };
}
