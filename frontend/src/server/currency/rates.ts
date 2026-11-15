import 'server-only';
import { cache } from 'react';
import { ApiClientError, serverApi } from '@/server/api/client';
import {
  CURRENCY_RATE_STALE_HOURS,
  UNAVAILABLE_CURRENCY_RATES,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';

export type { CurrencyRatesSnapshot };
export { CURRENCY_RATE_STALE_HOURS };

/**
 * Load the latest stored FX snapshot via Next.js → Express → MongoDB.
 * Pass the result into `CurrencyRatesProvider` from a Server Component.
 * Never call from browser components.
 */
export const getCurrencyRates = cache(
  async (baseCurrency = 'USD'): Promise<CurrencyRatesSnapshot> => {
    try {
      const response = await serverApi.get<CurrencyRatesSnapshot>('/currency/rates', {
        params: { base: baseCurrency },
        cache: 'no-store',
      });
      const data = response.data;
      if (!data || typeof data !== 'object') return UNAVAILABLE_CURRENCY_RATES;
      return {
        available: Boolean(data.available),
        baseCurrency: data.baseCurrency ?? null,
        rates: data.rates && typeof data.rates === 'object' ? data.rates : {},
        fetchedAt: data.fetchedAt ?? null,
        isStale: Boolean(data.isStale),
        staleThresholdHours: data.staleThresholdHours ?? CURRENCY_RATE_STALE_HOURS,
        supportedCurrencies: Array.isArray(data.supportedCurrencies)
          ? data.supportedCurrencies
          : [],
      };
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 404) {
        return UNAVAILABLE_CURRENCY_RATES;
      }
      return UNAVAILABLE_CURRENCY_RATES;
    }
  }
);
