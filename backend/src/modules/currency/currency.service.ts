import { AppError } from '../../middleware/error.middleware';
import { BASE_CURRENCIES } from './currency-metadata';
import { CurrencyRate } from './currency-rate.model';

/** ADR-021: snapshots older than 48 hours are stale but still usable. */
export const CURRENCY_RATE_STALE_HOURS = 48;

export interface CurrencyRatesPayload {
  available: boolean;
  baseCurrency: string | null;
  rates: Record<string, number>;
  fetchedAt: string | null;
  isStale: boolean;
  staleThresholdHours: number;
  supportedCurrencies: string[];
}

function mapToRecord(
  value: Map<string, number> | Record<string, number> | undefined | null
): Record<string, number> {
  if (!value) return {};
  if (value instanceof Map) {
    const out: Record<string, number> = {};
    for (const [code, rate] of value.entries()) {
      if (typeof rate === 'number' && Number.isFinite(rate)) out[code] = rate;
    }
    return out;
  }
  const out: Record<string, number> = {};
  for (const [code, rate] of Object.entries(value)) {
    if (typeof rate === 'number' && Number.isFinite(rate)) out[code] = rate;
  }
  return out;
}

function isStale(fetchedAt: Date): boolean {
  return Date.now() - fetchedAt.getTime() > CURRENCY_RATE_STALE_HOURS * 60 * 60 * 1000;
}

function unavailable(): CurrencyRatesPayload {
  return {
    available: false,
    baseCurrency: null,
    rates: {},
    fetchedAt: null,
    isStale: true,
    staleThresholdHours: CURRENCY_RATE_STALE_HOURS,
    supportedCurrencies: [...BASE_CURRENCIES].sort(),
  };
}

/**
 * Latest stored conversion table for one base currency.
 * Rates are units of each code per 1 unit of `baseCurrency` (base rate = 1).
 */
export async function getCurrencyRatesSnapshot(
  baseCurrency = 'USD'
): Promise<CurrencyRatesPayload> {
  const base = baseCurrency.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(base)) {
    throw new AppError('Use a 3-letter ISO currency code.', 400, 'VALIDATION_ERROR');
  }

  const doc = await CurrencyRate.findOne({ baseCurrency: base, isActive: true }).lean();
  if (!doc) {
    const anyActive = await CurrencyRate.exists({ isActive: true });
    if (!anyActive) return unavailable();
    throw new AppError(`No active rates for base ${base}.`, 404, 'NOT_FOUND');
  }

  const rates = mapToRecord(doc.conversionRates as Map<string, number> | Record<string, number>);
  if (Object.keys(rates).length === 0) return unavailable();

  const fetchedAt = doc.fetchedAt instanceof Date ? doc.fetchedAt : new Date(doc.fetchedAt);
  const supportedCurrencies = [...BASE_CURRENCIES].sort();

  return {
    available: true,
    baseCurrency: doc.baseCurrency,
    rates,
    fetchedAt: fetchedAt.toISOString(),
    isStale: isStale(fetchedAt),
    staleThresholdHours: CURRENCY_RATE_STALE_HOURS,
    supportedCurrencies,
  };
}
