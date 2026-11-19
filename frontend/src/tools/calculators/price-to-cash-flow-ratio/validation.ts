import type { CurrencyRatesSnapshot } from '@/tools/shared/currency-rates';
import type {
  PriceToCashFlowFieldErrors,
  PriceToCashFlowInput,
  PriceToCashFlowResult,
} from './types';

export interface PriceToCashFlowValidation {
  isValid: boolean;
  errors: PriceToCashFlowFieldErrors;
  result: PriceToCashFlowResult | null;
}

/** UI shell stub — replaced by real valuation validation in the engine commit. */
export function validatePriceToCashFlowInput(
  _input: PriceToCashFlowInput,
  _rates?: CurrencyRatesSnapshot | null
): PriceToCashFlowValidation {
  return { isValid: false, errors: {}, result: null };
}
