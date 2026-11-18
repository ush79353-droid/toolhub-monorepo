/**
 * Salary validation scaffold — engine commit fills formulas and FX.
 */
import type { CurrencyRatesSnapshot } from '@/tools/shared/currency-rates';
import type {
  SalaryFieldErrors,
  SalaryInput,
  SalaryResult,
} from './types';

export interface SalaryValidation {
  isValid: boolean;
  errors: SalaryFieldErrors;
  result: SalaryResult | null;
}

export function validateSalaryInput(
  _input: SalaryInput,
  _rates?: CurrencyRatesSnapshot | null
): SalaryValidation {
  return { isValid: false, errors: {}, result: null };
}
