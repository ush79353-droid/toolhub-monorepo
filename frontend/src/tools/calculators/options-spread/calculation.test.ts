/**
 * Run: npx --yes tsx src/tools/calculators/options-spread/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  calculateOptionsSpread,
  isStrikeOrderValid,
} from './calculation';
import { createDefaultInput } from './types';
import { validateOptionsSpreadInput } from './validation';
import type { CurrencyRatesSnapshot } from '@/tools/shared/currency-rates';

const rates: CurrencyRatesSnapshot = {
  available: true,
  baseCurrency: 'USD',
  rates: { USD: 1, PKR: 280, EUR: 0.85 },
  fetchedAt: '2026-11-21T12:00:00.000Z',
  isStale: false,
  staleThresholdHours: 48,
  supportedCurrencies: ['USD', 'PKR', 'EUR'],
};

// Bull call: buy 100 @ 5, sell 110 @ 2, S=108, 1 contract
const bullCall = calculateOptionsSpread({
  strategy: 'bull-call',
  targetPrice: 108,
  contracts: 1,
  longStrike: 100,
  longPremium: 5,
  shortStrike: 110,
  shortPremium: 2,
});
assert.ok(bullCall);
assert.equal(bullCall.netKind, 'debit');
assert.equal(bullCall.netPerShare, 3);
assert.equal(bullCall.maxLoss, 300);
assert.equal(bullCall.maxProfit, 700);
assert.equal(bullCall.breakevenPrice, 103);
assert.equal(bullCall.potentialProfit, 500); // (8-0-3)*100

assert.equal(isStrikeOrderValid('bull-call', 110, 100), false);
assert.equal(isStrikeOrderValid('bear-call', 110, 100), true);

// Bull put credit: buy 90 put @ 2, sell 100 put @ 5
const bullPut = calculateOptionsSpread({
  strategy: 'bull-put',
  targetPrice: 95,
  contracts: 1,
  longStrike: 90,
  longPremium: 2,
  shortStrike: 100,
  shortPremium: 5,
});
assert.ok(bullPut);
assert.equal(bullPut.netKind, 'credit');
assert.equal(bullPut.netPerShare, -3);
assert.equal(bullPut.maxProfit, 300);
assert.equal(bullPut.maxLoss, 700);
assert.equal(bullPut.breakevenPrice, 97);

// Bear call credit: sell 100 @ 5, buy 110 @ 2
const bearCall = calculateOptionsSpread({
  strategy: 'bear-call',
  targetPrice: 105,
  contracts: 1,
  longStrike: 110,
  longPremium: 2,
  shortStrike: 100,
  shortPremium: 5,
});
assert.ok(bearCall);
assert.equal(bearCall.netKind, 'credit');
assert.equal(bearCall.maxProfit, 300);
assert.equal(bearCall.breakevenPrice, 103);

// Bear put debit: buy 110 @ 5, sell 100 @ 2
const bearPut = calculateOptionsSpread({
  strategy: 'bear-put',
  targetPrice: 105,
  contracts: 1,
  longStrike: 110,
  longPremium: 5,
  shortStrike: 100,
  shortPremium: 2,
});
assert.ok(bearPut);
assert.equal(bearPut.netKind, 'debit');
assert.equal(bearPut.maxLoss, 300);
assert.equal(bearPut.maxProfit, 700);
assert.equal(bearPut.breakevenPrice, 107);

assert.equal(
  calculateOptionsSpread({
    strategy: 'bull-call',
    targetPrice: 100,
    contracts: 1.5,
    longStrike: 100,
    longPremium: 5,
    shortStrike: 110,
    shortPremium: 2,
  }),
  null
);

const validated = validateOptionsSpreadInput(
  {
    ...createDefaultInput(),
    targetPrice: '108',
    longStrike: '100',
    longPremium: '5',
    shortStrike: '110',
    shortPremium: '2',
  },
  rates
);
assert.equal(validated.isValid, true);
assert.equal(validated.result?.potentialProfit, 500);

const blank = validateOptionsSpreadInput(createDefaultInput(), rates);
assert.equal(blank.isValid, false);

console.log('options-spread calculation.test.ts: all assertions passed');
