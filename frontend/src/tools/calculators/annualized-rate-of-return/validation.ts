import { calculateAnnualizedRateOfReturn } from './calculation';
import type {
  AnnualizedRateOfReturnFieldErrors,
  AnnualizedRateOfReturnInput,
  AnnualizedRateOfReturnResult,
} from './types';

export function validateAnnualizedRateOfReturnInput(input: AnnualizedRateOfReturnInput): {
  isValid: boolean;
  errors: AnnualizedRateOfReturnFieldErrors;
  result: AnnualizedRateOfReturnResult | null;
} {
  const errors: AnnualizedRateOfReturnFieldErrors = {};
  const trimmed = input.periodRate.trim();

  if (!trimmed) {
    return { isValid: false, errors, result: null };
  }

  const periodRate = Number(trimmed);
  if (!Number.isFinite(periodRate)) {
    errors.periodRate = 'Enter a valid period rate';
    return { isValid: false, errors, result: null };
  }

  if (periodRate < -100) {
    errors.periodRate = 'Period rate cannot be below -100%';
    return { isValid: false, errors, result: null };
  }

  const result = calculateAnnualizedRateOfReturn(periodRate, input.period);
  if (!result) {
    errors.periodRate = 'Unable to calculate annualized return for this rate';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
