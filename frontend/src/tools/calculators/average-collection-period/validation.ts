import { isSupportedCurrency } from '@/tools/shared/currency';
import { calculateAverageCollectionPeriod } from './calculation';
import {
  CALCULATION_METHODS,
  isAverageArMethod,
  type AverageCollectionPeriodFieldErrors,
  type AverageCollectionPeriodInput,
} from './types';

function finite(value: number): boolean {
  return Number.isFinite(value);
}

function checkMoney(
  errors: AverageCollectionPeriodFieldErrors,
  key: string,
  value: number,
  label: string
): void {
  if (!finite(value)) {
    errors[key] = `Enter ${label}`;
    return;
  }
  if (value < 0) {
    errors[key] = `${label} cannot be negative`;
  }
}

export function validateAverageCollectionPeriod(input: AverageCollectionPeriodInput): {
  isValid: boolean;
  errors: AverageCollectionPeriodFieldErrors;
} {
  const errors: AverageCollectionPeriodFieldErrors = {};

  if (!CALCULATION_METHODS.includes(input.method)) {
    errors.method = 'Choose a calculation method';
  }
  if (!isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a supported currency';
  }

  if (!finite(input.durationDays)) {
    errors.durationDays = 'Enter the duration';
  } else if (input.durationDays <= 0) {
    errors.durationDays = 'Duration must be greater than zero';
  } else if (input.durationDays > 3660) {
    errors.durationDays = 'Duration must be 3,660 days or fewer';
  }

  if (isAverageArMethod(input)) {
    checkMoney(errors, 'averageReceivable', input.averageReceivable, 'average accounts receivable');
    checkMoney(errors, 'totalCreditSales', input.totalCreditSales, 'total credit sales');
  } else {
    if (!finite(input.receivablesTurnoverRatio)) {
      errors.receivablesTurnoverRatio = 'Enter the receivables turnover ratio';
    } else if (input.receivablesTurnoverRatio < 0) {
      errors.receivablesTurnoverRatio = 'Receivables turnover ratio cannot be negative';
    } else if (input.receivablesTurnoverRatio === 0) {
      errors.receivablesTurnoverRatio = 'Receivables turnover ratio must be greater than zero';
    }
  }

  if (finite(input.termsOfCreditDays)) {
    if (input.termsOfCreditDays < 0) {
      errors.termsOfCreditDays = 'Terms of credit cannot be negative';
    } else if (input.termsOfCreditDays > 3660) {
      errors.termsOfCreditDays = 'Terms of credit must be 3,660 days or fewer';
    }
  }

  if (Object.keys(errors).length > 0) return { isValid: false, errors };

  const result = calculateAverageCollectionPeriod(input);
  if (!result.defined) {
    errors.form = result.explanation ?? 'This calculation is undefined.';
    return { isValid: false, errors };
  }

  return { isValid: true, errors };
}
