/**
 * Salary Inflation validation scaffold — engine commit fills formulas and FX.
 */
import type { CurrencyRatesSnapshot } from '@/tools/shared/currency-rates';
import type {
  SalaryInflationFieldErrors,
  SalaryInflationInput,
  SalaryInflationResult,
} from './types';

export interface SalaryInflationValidation {
  isValid: boolean;
  errors: SalaryInflationFieldErrors;
  result: SalaryInflationResult | null;
}

export function validateSalaryInflationInput(
  _input: SalaryInflationInput,
  _rates?: CurrencyRatesSnapshot | null
): SalaryInflationValidation {
  return { isValid: false, errors: {}, result: null };
}
