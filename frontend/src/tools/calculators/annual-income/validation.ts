import type { CurrencyRatesSnapshot } from '@/tools/shared/currency-rates';
import type {
  AnnualIncomeFieldErrors,
  AnnualIncomeInput,
  AnnualIncomeResult,
} from './types';

export interface AnnualIncomeValidation {
  isValid: boolean;
  errors: AnnualIncomeFieldErrors;
  result: AnnualIncomeResult | null;
}

/** UI-phase stub — replaced by full validation + FX in the engine commit. */
export function validateAnnualIncomeInput(
  _input: AnnualIncomeInput,
  _rates?: CurrencyRatesSnapshot | null
): AnnualIncomeValidation {
  return { isValid: false, errors: {}, result: null };
}
