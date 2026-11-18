'use client';

import * as React from 'react';
import {
  CURRENCY_CONVERSION_STALE_NOTE,
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  UNAVAILABLE_CURRENCY_RATES,
  type CurrencyRatesSnapshot,
} from './currency-rates';

const CurrencyRatesContext = React.createContext<CurrencyRatesSnapshot>(
  UNAVAILABLE_CURRENCY_RATES
);

/**
 * Pass a Phase 1 snapshot from a Server Component into client calculators.
 * Does not fetch rates in the browser.
 */
export function CurrencyRatesProvider({
  rates,
  children,
}: {
  rates: CurrencyRatesSnapshot | null | undefined;
  children: React.ReactNode;
}) {
  const value = rates ?? UNAVAILABLE_CURRENCY_RATES;
  return (
    <CurrencyRatesContext.Provider value={value}>{children}</CurrencyRatesContext.Provider>
  );
}

export function useCurrencyRates(): CurrencyRatesSnapshot {
  return React.useContext(CurrencyRatesContext);
}

export function useCurrencyRatesStatus(): {
  available: boolean;
  isStale: boolean;
  fetchedAt: string | null;
  warning: string | null;
} {
  const rates = useCurrencyRates();
  if (!rates.available) {
    return {
      available: false,
      isStale: true,
      fetchedAt: null,
      warning: CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
    };
  }
  return {
    available: true,
    isStale: rates.isStale,
    fetchedAt: rates.fetchedAt,
    warning: rates.isStale ? CURRENCY_CONVERSION_STALE_NOTE : null,
  };
}
