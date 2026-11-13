import { isSupportedCurrency } from '@/tools/shared/currency';
import { calculateARDays } from './calculation';
import {
  averageBalanceIsInput,
  BALANCE_METHODS,
  SOLVE_TARGETS,
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
  label: string,
  allowZero: boolean
): void {
  if (!finite(value)) {
    errors[key] = `Enter ${label}`;
    return;
  }
  if (value < 0) {
    errors[key] = `${label} cannot be negative`;
    return;
  }
  if (!allowZero && value === 0) {
    errors[key] = `${label} must be greater than zero`;
  }
}

export function validateARDays(input: ARDaysInput): { isValid: boolean; errors: ARDaysFieldErrors } {
  const errors: ARDaysFieldErrors = {};

  if (!SOLVE_TARGETS.includes(input.solveFor)) errors.solveFor = 'Choose what to calculate';
  if (!BALANCE_METHODS.includes(input.balanceMethod)) errors.balanceMethod = 'Choose ending or average receivables';
  if (!isSupportedCurrency(input.currency)) errors.currency = 'Choose a supported currency';

  const needsReceivableField = input.solveFor !== 'receivables' && input.balanceMethod !== 'average';
  const needsSales = input.solveFor !== 'creditSales';
  const needsDays = input.solveFor !== 'periodDays';
  const needsArDays = input.solveFor !== 'arDays';

  if (needsReceivableField) {
    checkMoney(errors, 'accountsReceivable', input.accountsReceivable, 'accounts receivable', true);
  }
  if (needsSales) {
    checkMoney(errors, 'netCreditSales', input.netCreditSales, 'net credit sales', true);
  }
  if (needsDays) {
    if (!finite(input.periodDays)) errors.periodDays = 'Enter the number of days in the period';
    else if (input.periodDays <= 0) errors.periodDays = 'Days in the period must be greater than zero';
    else if (input.periodDays > 3660) errors.periodDays = 'Days in the period must be 3,660 or fewer';
  }
  if (needsArDays) {
    checkMoney(errors, 'arDays', input.arDays, 'A/R days', true);
  }
  if (averageBalanceIsInput(input)) {
    checkMoney(errors, 'beginningReceivable', input.beginningReceivable, 'beginning accounts receivable', true);
    checkMoney(errors, 'endingReceivable', input.endingReceivable, 'ending accounts receivable', true);
  }

  if (Object.keys(errors).length > 0) return { isValid: false, errors };

  const result = calculateARDays(input);
  if (!result.defined) {
    errors.form = result.explanation ?? 'This calculation is undefined.';
    return { isValid: false, errors };
  }

  return { isValid: true, errors };
}
