import { buildLaborCostResult } from './calculation';
import type { LaborCostFieldErrors, LaborCostInput, LaborCostResult } from './types';

function isBlank(value: number): boolean {
  return !Number.isFinite(value);
}

export function validateLaborCost(
  input: LaborCostInput,
  options: { includeLaborCostPercent: boolean }
): {
  isValid: boolean;
  errors: LaborCostFieldErrors;
  result: LaborCostResult | null;
} {
  const errors: LaborCostFieldErrors = {};

  if (!isBlank(input.weeklyHours) && input.weeklyHours < 0) {
    errors.weeklyHours = 'Enter a valid non-negative number of hours';
  }

  if (!isBlank(input.payRate) && input.payRate < 0) {
    errors.payRate = 'Enter a valid non-negative pay rate';
  }

  if (!isBlank(input.absentDays) && input.absentDays < 0) {
    errors.absentDays = 'Enter a valid non-negative number of days';
  }

  for (const key of ['taxes', 'insurance', 'benefits', 'overtime', 'supplies'] as const) {
    if (!isBlank(input[key]) && input[key] < 0) {
      errors[key] = 'Enter a valid non-negative amount';
    }
  }

  if (!isBlank(input.revenue) && input.revenue < 0) {
    errors.revenue = 'Enter a valid non-negative revenue';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = buildLaborCostResult(input, options);
  const hasCore =
    result.grossHoursPerYear !== null &&
    Number.isFinite(input.weeklyHours) &&
    Number.isFinite(input.absentDays);

  return { isValid: hasCore, errors, result: hasCore ? result : null };
}
