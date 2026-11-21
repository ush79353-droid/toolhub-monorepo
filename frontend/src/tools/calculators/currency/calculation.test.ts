/**
 * Run: npx --yes tsx src/tools/calculators/currency/calculation.test.ts
 */
import assert from 'node:assert/strict';
import { convertAmountWithRates, formatFxRate } from './calculation';
import { createDefaultInput } from './types';
import { validateCurrencyCalculatorInput } from './validation';
import type { CurrencyRatesSnapshot } from '@/tools/shared/currency-rates';

const rates: CurrencyRatesSnapshot = {
  available: true,
  baseCurrency: 'USD',
  rates: { USD: 1, EUR: 0.85, JPY: 150, GBP: 0.75 },
  fetchedAt: '2026-11-21T12:00:00.000Z',
  isStale: false,
  staleThresholdHours: 48,
  supportedCurrencies: ['USD', 'EUR', 'JPY', 'GBP'],
};

const usdEur = convertAmountWithRates(100, 'USD', 'EUR', rates);
assert.ok(usdEur);
assert.equal(usdEur.convertedAmount, 85);
assert.equal(usdEur.rateFromTo, 0.85);
assert.ok(Math.abs(usdEur.rateToFrom - 1 / 0.85) < 1e-12);

const same = convertAmountWithRates(50, 'USD', 'USD', {
  ...rates,
  available: false,
  rates: {},
});
assert.ok(same);
assert.equal(same.convertedAmount, 50);
assert.equal(same.sameCurrency, true);

assert.equal(convertAmountWithRates(-1, 'USD', 'EUR', rates), null);
assert.equal(
  convertAmountWithRates(100, 'USD', 'EUR', {
    ...rates,
    available: false,
    rates: {},
  }),
  null
);
assert.equal(
  convertAmountWithRates(100, 'USD', 'CHF', rates),
  null,
  'missing rate must not fall back to 1:1'
);

const validated = validateCurrencyCalculatorInput(
  { ...createDefaultInput(), amount: '100', fromCurrency: 'USD', toCurrency: 'EUR' },
  rates
);
assert.equal(validated.isValid, true);
assert.equal(validated.result?.convertedAmount, 85);
assert.equal(validated.result?.fetchedAt, rates.fetchedAt);

const blank = validateCurrencyCalculatorInput(createDefaultInput(), rates);
assert.equal(blank.isValid, true); // default amount 100
assert.ok(blank.result);

const empty = validateCurrencyCalculatorInput(
  { ...createDefaultInput(), amount: '' },
  rates
);
assert.equal(empty.isValid, false);

const jpy = convertAmountWithRates(1, 'USD', 'JPY', rates);
assert.ok(jpy);
assert.equal(jpy.convertedAmount, 150);
assert.ok(formatFxRate(0.85).includes('0.85'));

console.log('currency calculation.test.ts: all assertions passed');
