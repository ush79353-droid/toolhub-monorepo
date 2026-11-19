import type { CurrencyRatesSnapshot } from '@/tools/shared/currency-rates';
import type {
  YearlyWageFieldErrors,
  YearlyWageInput,
  YearlyWageResult,
} from './types';

export interface YearlyWageValidation {
  isValid: boolean;
  errors: YearlyWageFieldErrors;
  result: YearlyWageResult | null;
}

/** UI scaffold placeholder — validation + FX land in the engine commit. */
export function validateYearlyWageInput(
  _input: YearlyWageInput,
  _rates?: CurrencyRatesSnapshot | null
): YearlyWageValidation {
  return { isValid: false, errors: {}, result: null };
}
