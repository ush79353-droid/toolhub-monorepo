import type { CurrencyRatesSnapshot } from '@/tools/shared/currency-rates';
import type {
  CarLeaseFieldErrors,
  CarLeaseInput,
  CarLeaseResult,
} from './types';

export interface CarLeaseValidation {
  isValid: boolean;
  errors: CarLeaseFieldErrors;
  result: CarLeaseResult | null;
}

/**
 * UI scaffold placeholder — validation + FX normalization land in the engine commit.
 */
export function validateCarLeaseInput(
  _input: CarLeaseInput,
  _rates?: CurrencyRatesSnapshot | null
): CarLeaseValidation {
  return { isValid: false, errors: {}, result: null };
}
