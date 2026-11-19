import type { CurrencyRatesSnapshot } from '@/tools/shared/currency-rates';
import type {
  MarginAndSalesTaxFieldErrors,
  MarginAndSalesTaxInput,
  MarginAndSalesTaxResult,
} from './types';

export interface MarginAndSalesTaxValidation {
  isValid: boolean;
  errors: MarginAndSalesTaxFieldErrors;
  result: MarginAndSalesTaxResult | null;
}

/** UI stub — real validation lands in the engine commit. */
export function validateMarginAndSalesTaxInput(
  _input: MarginAndSalesTaxInput,
  _rates?: CurrencyRatesSnapshot | null
): MarginAndSalesTaxValidation {
  return { isValid: false, errors: {}, result: null };
}
