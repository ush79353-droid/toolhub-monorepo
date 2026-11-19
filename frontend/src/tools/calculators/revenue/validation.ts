import type { CurrencyRatesSnapshot } from '@/tools/shared/currency-rates';
import type { RevenueDraft, RevenueFieldErrors, RevenueResult } from './types';

/** UI-commit stub — replaced by full validation in the engine commit. */
export function validateRevenueDraft(
  _draft: RevenueDraft,
  _rates?: CurrencyRatesSnapshot | null
): { isValid: boolean; errors: RevenueFieldErrors; result: RevenueResult | null } {
  return { isValid: false, errors: {}, result: null };
}
