import type { CurrencyRatesSnapshot } from '@/tools/shared/currency-rates';
import type { SipFieldErrors, SipInput, SipResult } from './types';

export interface SipValidation {
  isValid: boolean;
  errors: SipFieldErrors;
  result: SipResult | null;
}

/** UI/formula phase stub — FX wiring lands in commit 2. */
export function validateSipInput(
  _input: SipInput,
  _rates?: CurrencyRatesSnapshot | null
): SipValidation {
  return { isValid: false, errors: {}, result: null };
}
