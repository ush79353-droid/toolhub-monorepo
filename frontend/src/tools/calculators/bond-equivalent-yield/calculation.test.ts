/**
 * Lightweight formula self-check for Bond Equivalent Yield Calculator.
 * Not run by the delivery prompt (no automated test suite requested).
 */
import assert from 'node:assert/strict';
import {
  BEY_DAYS_PER_YEAR,
  calculateBondEquivalentYield,
  formatBeyPercent,
} from './calculation';
import { validateBondEquivalentYieldInput } from './validation';
import { createDefaultInput } from './types';
import type { CurrencyRatesSnapshot } from '@/tools/shared/currency-rates';

assert.equal(BEY_DAYS_PER_YEAR, 365);

const expected =
  ((1000 - 980) / 980) * (365 / 180) * 100;

const defaultCase = calculateBondEquivalentYield({
  bondPrice: 980,
  faceValue: 1000,
  daysToMaturity: 180,
});
assert.ok(defaultCase !== null);
assert.ok(Math.abs(defaultCase! - expected) < 1e-12);
assert.equal(formatBeyPercent(defaultCase!), formatBeyPercent(expected));

assert.equal(
  calculateBondEquivalentYield({
    bondPrice: 1000,
    faceValue: 1000,
    daysToMaturity: 90,
  }),
  0
);

assert.equal(
  calculateBondEquivalentYield({
    bondPrice: 0,
    faceValue: 1000,
    daysToMaturity: 90,
  }),
  null
);

assert.equal(
  calculateBondEquivalentYield({
    bondPrice: 1010,
    faceValue: 1000,
    daysToMaturity: 90,
  }),
  null
);

assert.equal(
  calculateBondEquivalentYield({
    bondPrice: 980,
    faceValue: 1000,
    daysToMaturity: 0,
  }),
  null
);

assert.equal(
  calculateBondEquivalentYield({
    bondPrice: Number.NaN,
    faceValue: 1000,
    daysToMaturity: 90,
  }),
  null
);

const rates: CurrencyRatesSnapshot = {
  available: true,
  baseCurrency: 'USD',
  rates: { PKR: 280, USD: 1 },
  fetchedAt: new Date().toISOString(),
  isStale: false,
  staleThresholdHours: 48,
  supportedCurrencies: ['PKR', 'USD'],
};

const validated = validateBondEquivalentYieldInput(createDefaultInput(), rates);
assert.equal(validated.isValid, true);
assert.ok(validated.result);
assert.ok(Math.abs(validated.result!.beyPercent - expected) < 1e-12);

const premium = validateBondEquivalentYieldInput(
  {
    ...createDefaultInput(),
    bondPrice: '1100',
    faceValue: '1000',
  },
  null
);
assert.equal(premium.isValid, false);
assert.ok(premium.errors.bondPrice);

console.log('bond-equivalent-yield calculation.self-check: ok');
