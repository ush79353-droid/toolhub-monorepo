import { isSupportedCurrency } from '@/tools/shared/currency';
import { calculateARDays } from './calculation';
import {
  averageBalanceIsInput,
  BALANCE_METHODS,
  type ARDaysFieldErrors,
  type ARDaysInput,
} from './types';

function finite(value: number): boolean {
  return Number.isFinite(value);
}

function checkMoney(
  errors: ARDaysFieldErrors,
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

export function validateARDays(input: ARDaysInput): { isValid: boolean; errors: ARDaysFieldErrors } {
  const errors: ARDaysFieldErrors = {};

  if (!BALANCE_METHODS.includes(input.balanceMethod)) {
    errors.balanceMethod = 'Choose ending or average receivables';
  }
  if (!isSupportedCurrency(input.currency)) errors.currency = 'Choose a supported currency';

  if (averageBalanceIsInput(input)) {
    checkMoney(errors, 'beginningReceivable', input.beginningReceivable, 'beginning accounts receivable');
    checkMoney(errors, 'endingReceivable', input.endingReceivable, 'ending accounts receivable');
  } else {
    checkMoney(errors, 'accountsReceivable', input.accountsReceivable, 'accounts receivable');
  }

  checkMoney(errors, 'netCreditSales', input.netCreditSales, 'net credit sales');

  if (!finite(input.periodDays)) {
    errors.periodDays = 'Enter the number of days in the period';
  } else if (input.periodDays <= 0) {
    errors.periodDays = 'Days in the period must be greater than zero';
  } else if (input.periodDays > 3660) {
    errors.periodDays = 'Days in the period must be 3,660 or fewer';
  }

  if (Object.keys(errors).length > 0) return { isValid: false, errors };

  const result = calculateARDays(input);
  if (!result.defined) {
    errors.form = result.explanation ?? 'This calculation is undefined.';
    return { isValid: false, errors };
  }

  return { isValid: true, errors };
}
