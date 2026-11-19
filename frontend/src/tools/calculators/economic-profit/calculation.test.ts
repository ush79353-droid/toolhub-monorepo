/**
 * Run: npx --yes tsx src/tools/calculators/economic-profit/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  calculateEconomicProfit,
  formatEconomicProfitMoney,
} from './calculation';
import { validateEconomicProfitInput } from './validation';
import { createDefaultInput } from './types';

assert.equal(
  calculateEconomicProfit({
    totalRevenue: 100_000,
    explicitCosts: 40_000,
    implicitCosts: 25_000,
  }),
  35_000
);
assert.equal(
  calculateEconomicProfit({
    totalRevenue: 50_000,
    explicitCosts: 0,
    implicitCosts: 0,
  }),
  50_000
);
assert.equal(
  calculateEconomicProfit({
    totalRevenue: 10_000,
    explicitCosts: 12_000,
    implicitCosts: 1_000,
  }),
  -3_000
);
assert.equal(
  calculateEconomicProfit({
    totalRevenue: -1,
    explicitCosts: 0,
    implicitCosts: 0,
  }),
  null
);
assert.equal(
  calculateEconomicProfit({
    totalRevenue: 1,
    explicitCosts: -1,
    implicitCosts: 0,
  }),
  null
);
assert.equal(formatEconomicProfitMoney(35000, 'PKR'), '35,000.00');

const sameCurrency = validateEconomicProfitInput({
  ...createDefaultInput(),
  totalRevenue: '100000',
  explicitCosts: '40000',
  implicitCosts: '25000',
});
assert.equal(sameCurrency.isValid, true);
assert.ok(sameCurrency.result);
assert.equal(sameCurrency.result.economicProfitCanonical, 35_000);
assert.equal(sameCurrency.result.formattedEconomicProfit, '35,000.00');

const zeroCosts = validateEconomicProfitInput({
  ...createDefaultInput(),
  totalRevenue: '1000',
  explicitCosts: '0',
  implicitCosts: '0',
});
assert.equal(zeroCosts.isValid, true);
assert.equal(zeroCosts.result?.economicProfitCanonical, 1000);

const loss = validateEconomicProfitInput({
  ...createDefaultInput(),
  totalRevenue: '100',
  explicitCosts: '80',
  implicitCosts: '50',
});
assert.equal(loss.isValid, true);
assert.equal(loss.result?.economicProfitCanonical, -30);

const mixedNoRates = validateEconomicProfitInput(
  {
    ...createDefaultInput(),
    totalRevenue: '100',
    totalRevenueCurrency: 'USD',
    explicitCosts: '10',
    explicitCostsCurrency: 'PKR',
    implicitCosts: '5',
  },
  null
);
assert.equal(mixedNoRates.isValid, false);

const blank = validateEconomicProfitInput(createDefaultInput());
assert.equal(blank.isValid, false);

console.log('economic-profit calculation.test.ts: all assertions passed');
