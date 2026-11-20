import type { CurrencyRatesSnapshot } from '@/tools/shared/currency-rates';
import type {
  BillRateFieldErrors,
  BillRateInput,
  BillRateResult,
} from './types';

export interface BillRateValidation {
  isValid: boolean;
  errors: BillRateFieldErrors;
  result: BillRateResult | null;
}

/** UI-shell stub — replaced by full validation in the engine commit. */
export function validateBillRateInput(
  _input: BillRateInput,
  _rates?: CurrencyRatesSnapshot | null
): BillRateValidation {
  return { isValid: false, errors: {}, result: null };
}
