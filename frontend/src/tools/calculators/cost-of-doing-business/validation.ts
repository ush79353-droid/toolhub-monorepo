import { isSupportedCurrency } from '@/tools/shared/currency';
import { calculateCostOfDoingBusiness } from './calculation';
import type {
  CostOfDoingBusinessFieldErrors,
  CostOfDoingBusinessInput,
  CostOfDoingBusinessResult,
} from './types';

function finite(value: number): boolean {
  return Number.isFinite(value);
}

export function validateCostOfDoingBusiness(input: CostOfDoingBusinessInput): {
  isValid: boolean;
  incomplete: boolean;
  errors: CostOfDoingBusinessFieldErrors;
  result: CostOfDoingBusinessResult | null;
} {
  const errors: CostOfDoingBusinessFieldErrors = {};
  let anyBlank = false;

  if (!isSupportedCurrency(input.currency)) errors.currency = 'Choose a supported currency';

  if (!finite(input.totalAnnualCost)) anyBlank = true;
  else if (input.totalAnnualCost < 0) {
    errors.totalAnnualCost = 'Total annual cost cannot be negative';
  }

  if (!finite(input.billableDays)) anyBlank = true;
  else if (input.billableDays <= 0) {
    errors.billableDays = 'Billable days must be greater than zero';
  } else if (input.billableDays > 366) {
    errors.billableDays = 'Billable days must be 366 or fewer';
  }

  if (anyBlank || Object.keys(errors).length > 0) {
    return {
      isValid: false,
      incomplete: anyBlank && Object.keys(errors).length === 0,
      errors,
      result: null,
    };
  }

  const result = calculateCostOfDoingBusiness(input);
  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, incomplete: false, errors, result: null };
  }

  return { isValid: true, incomplete: false, errors: {}, result };
}
