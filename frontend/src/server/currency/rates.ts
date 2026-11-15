import 'server-only';
import { cache } from 'react';
import { ApiClientError, serverApi } from '@/server/api/client';

/** ADR-021: older than 48 hours is stale but may still be used. */
export const CURRENCY_RATE_STALE_HOURS = 48;

export interface CurrencyRatesSnapshot {
  available: boolean;
  baseCurrency: string | null;
  rates: Record<string, number>;
  fetchedAt: string | null;
  isStale: boolean;
  staleThresholdHours: number;
  supportedCurrencies: string[];
}

const UNAVAILABLE: CurrencyRatesSnapshot = {
  available: false,
  baseCurrency: null,
  rates: {},
  fetchedAt: null,
  isStale: true,
  staleThresholdHours: CURRENCY_RATE_STALE_HOURS,
  supportedCurrencies: [],
};

/**
 * Load the latest stored FX snapshot via Next.js → Express → MongoDB.
 * Never call from browser components. Conversion helpers are Phase 2.
 */
export const getCurrencyRates = cache(
  async (baseCurrency = 'USD'): Promise<CurrencyRatesSnapshot> => {
    try {
      const response = await serverApi.get<CurrencyRatesSnapshot>('/currency/rates', {
        params: { base: baseCurrency },
        cache: 'no-store',
      });
      const data = response.data;
      if (!data || typeof data !== 'object') return UNAVAILABLE;
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
        return UNAVAILABLE;
      }
      return UNAVAILABLE;
    }
  }
);
