import { calculateRevenuePerEmployee } from './calculation';
import type {
  RevenuePerEmployeeFieldErrors,
  RevenuePerEmployeeInput,
  RevenuePerEmployeeResult,
} from './types';

export function validateRevenuePerEmployeeInput(input: RevenuePerEmployeeInput): {
  isValid: boolean;
  errors: RevenuePerEmployeeFieldErrors;
  result: RevenuePerEmployeeResult | null;
} {
  const errors: RevenuePerEmployeeFieldErrors = {};

  const parseField = (val: string): number | null => {
    const trimmed = val.trim();
    if (!trimmed) return null;
    const num = Number(trimmed);
    return Number.isFinite(num) ? num : Number.NaN;
  };

  const revenue = parseField(input.revenue);
  const employeeCount = parseField(input.employeeCount);

  if (revenue === null || employeeCount === null) {
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(revenue) || revenue < 0) {
    errors.revenue = 'Enter a valid non-negative revenue';
  }

  if (Number.isNaN(employeeCount) || employeeCount < 0 || !Number.isInteger(employeeCount)) {
    errors.employeeCount = 'Enter a whole number of employees (1 or more)';
  } else if (employeeCount === 0) {
    errors.employeeCount = 'Number of employees must be greater than zero';
  }

  const isValid = Object.keys(errors).length === 0;
  if (!isValid) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateRevenuePerEmployee(revenue, employeeCount, input.currency);
  return { isValid: result !== null, errors, result };
}
