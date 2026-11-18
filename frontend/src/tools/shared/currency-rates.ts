/**
 * Client-safe currency rate snapshot types (ADR-017 / ADR-021).
 * Loaded via Next.js `getCurrencyRates` — never from the browser to Express.
 */

/** ADR-021: snapshots older than 48 hours are stale but still usable. */
export const CURRENCY_RATE_STALE_HOURS = 48;

export const CURRENCY_CONVERSION_STALE_NOTE =
  'Exchange rates are older than 48 hours. Conversions still use the last stored rates.';

export const CURRENCY_CONVERSION_UNAVAILABLE_NOTE =
  'Currency conversion is unavailable for the selected currencies.';

export interface CurrencyRatesSnapshot {
  available: boolean;
  baseCurrency: string | null;
  /** Units of each code per 1 unit of `baseCurrency` (base rate = 1). */
  rates: Record<string, number>;
  fetchedAt: string | null;
  isStale: boolean;
  staleThresholdHours: number;
  supportedCurrencies: string[];
}

export const UNAVAILABLE_CURRENCY_RATES: CurrencyRatesSnapshot = {
  available: false,
  baseCurrency: null,
  rates: {},
  fetchedAt: null,
  isStale: true,
  staleThresholdHours: CURRENCY_RATE_STALE_HOURS,
  supportedCurrencies: [],
};

export function isCurrencyRateUsable(
  rates: Record<string, number> | null | undefined,
  code: string
): boolean {
  if (!rates) return false;
  const rate = rates[code];
  return typeof rate === 'number' && Number.isFinite(rate) && rate > 0;
}
