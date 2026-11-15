import { env } from '../../config/env';
import { logger } from '../../utils/logger';
import { BASE_CURRENCIES, CURRENCY_METADATA } from './currency-metadata';
import { CurrencyRate } from './currency-rate.model';
import { CurrencyRateHistory } from './currency-rate-history.model';

interface ExchangeRatePayload {
  result?: string;
  conversion_rates?: Record<string, number>;
  'error-type'?: string;
}

/** One USD quote contains every pair. Each stored base is that quote divided by the base's USD price. */
export function ratesForBase(usdRates: Record<string, number>, base: string): Record<string, number> | null {
  const basePerUsd = usdRates[base];
  if (!basePerUsd) return null;
  const rates: Record<string, number> = {};
  for (const [code, perUsd] of Object.entries(usdRates)) {
    if (typeof perUsd !== 'number' || !Number.isFinite(perUsd)) continue;
    rates[code] = perUsd / basePerUsd;
  }
  rates[base] = 1;
  return rates;
}

export async function fetchAndSaveCurrencyRates(): Promise<number> {
  const apiKey = env.CURRENCY_EXCHANGE_API_KEY;
  if (!apiKey) {
    logger.warn('CURRENCY_EXCHANGE_API_KEY is empty. Currency rates were not fetched.');
    return 0;
  }

  const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
  if (!response.ok) {
    logger.error('Currency rate request failed', undefined, { status: response.status });
    return 0;
  }

  const data = (await response.json()) as ExchangeRatePayload;
  if (data.result !== 'success' || !data.conversion_rates) {
    logger.warn('Currency rate provider rejected the request', { result: data.result ?? 'missing' });
    return 0;
  }

  const fetchedAt = new Date();
  let saved = 0;
  for (const baseCurrency of BASE_CURRENCIES) {
    const conversionRates = ratesForBase(data.conversion_rates, baseCurrency);
    const metadata = CURRENCY_METADATA[baseCurrency];
    if (!conversionRates || !metadata) {
      logger.warn('Currency missing from the provider response', { baseCurrency });
      continue;
    }

    await CurrencyRate.updateOne(
      { baseCurrency },
      {
        $set: {
          conversionRates,
          fetchedAt,
          fullName: metadata.fullName,
          symbol: metadata.symbol,
          isActive: true,
        },
      },
      { upsert: true }
    );
    await CurrencyRateHistory.create({ baseCurrency, conversionRates, fetchedAt });
    saved += 1;
  }

  logger.info('Currency rates updated', { saved });
  return saved;
}
