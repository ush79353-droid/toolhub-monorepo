import { calculateCommission } from './calculation';
import type {
  CommissionFieldErrors,
  CommissionInput,
  CommissionResult,
  CommissionSolveTarget,
} from './types';

export interface CommissionValidation {
  isValid: boolean;
  errors: CommissionFieldErrors;
  result: CommissionResult | null;
  solveFor: CommissionSolveTarget | null;
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
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

/**
 * Exactly one of sales price / commission rate / commission must be blank.
 * Entered zero is a filled value, not a missing value.
 */
export function validateCommissionInput(input: CommissionInput): CommissionValidation {
  const errors: CommissionFieldErrors = {};

  const sales = parseNumber(input.salesPrice);
  const rate = parseNumber(input.commissionRate);
  const commission = parseNumber(input.commission);

  const blanks: CommissionSolveTarget[] = [];
  if (sales.blank) blanks.push('salesPrice');
  if (rate.blank) blanks.push('commissionRate');
  if (commission.blank) blanks.push('commission');

  if (blanks.length === 0) {
    errors.form =
      'Leave exactly one of Sales Price, Commission Rate, or Commission blank to solve for that value.';
    return { isValid: false, errors, result: null, solveFor: null };
  }
  if (blanks.length > 1) {
    errors.form =
      'Leave only one field blank among Sales Price, Commission Rate, and Commission.';
    return { isValid: false, errors, result: null, solveFor: null };
  }

  const solveFor = blanks[0]!;

  if (!sales.blank) {
    if (sales.invalid || sales.value === null) {
      errors.salesPrice = 'Enter a valid sales price.';
    } else if (sales.value < 0) {
      errors.salesPrice = 'Sales price cannot be negative.';
    } else if (solveFor === 'commissionRate' && sales.value === 0) {
      errors.salesPrice = 'Sales price must be greater than zero to solve for commission rate.';
    }
  }

  if (!rate.blank) {
    if (rate.invalid || rate.value === null) {
      errors.commissionRate = 'Enter a valid commission rate.';
    } else if (rate.value < 0) {
      errors.commissionRate = 'Commission rate cannot be negative.';
    } else if (solveFor === 'salesPrice' && rate.value === 0) {
      errors.commissionRate =
        'Commission rate must be greater than zero to solve for sales price.';
    }
  }

  if (!commission.blank) {
    if (commission.invalid || commission.value === null) {
      errors.commission = 'Enter a valid commission.';
    } else if (commission.value < 0) {
      errors.commission = 'Commission cannot be negative.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null, solveFor };
  }

  const result = calculateCommission({
    solveFor,
    salesPrice: sales.blank ? null : sales.value,
    commissionRate: rate.blank ? null : rate.value,
    commission: commission.blank ? null : commission.value,
  });

  if (!result) {
    errors.form = 'Unable to solve with the given inputs.';
    return { isValid: false, errors, result: null, solveFor };
  }

  return { isValid: true, errors, result, solveFor };
}
