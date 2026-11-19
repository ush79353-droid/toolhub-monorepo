import type { CurrencyRatesSnapshot } from '@/tools/shared/currency-rates';
import type {
  MarginalRevenueFieldErrors,
  MarginalRevenueInput,
  MarginalRevenueResult,
} from './types';

export interface MarginalRevenueValidation {
  isValid: boolean;
  errors: MarginalRevenueFieldErrors;
  result: MarginalRevenueResult | null;
}

/** UI-phase stub — replaced by full validation + FX in the engine commit. */
export function validateMarginalRevenueInput(
  _input: MarginalRevenueInput,
  _rates?: CurrencyRatesSnapshot | null
): MarginalRevenueValidation {
  return { isValid: false, errors: {}, result: null };
}
