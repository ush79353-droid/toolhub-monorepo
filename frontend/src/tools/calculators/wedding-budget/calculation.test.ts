/**
 * Run: npx --yes tsx src/tools/calculators/wedding-budget/calculation.test.ts
 */
import assert from 'node:assert/strict';
import type { CurrencyRatesSnapshot } from '@/tools/shared/currency-rates';
import { calculateWeddingBudget, sectionTotal } from './calculation';
import { createDefaultInput } from './types';
import { validateWeddingBudgetInput } from './validation';

assert.equal(sectionTotal([10, 20, 30]), 60);
assert.equal(sectionTotal([-1]), null);

const balanced = calculateWeddingBudget({
  plannedBudget: 100_000,
  guestCount: 100,
  brideGroom: [10_000, 5_000, 5_000, 5_000, 5_000],
  subcontractors: [5_000, 10_000, 5_000, 5_000],
  venueFood: [20_000, 0, 15_000, 5_000, 5_000, 5_000],
  ceremony: [2_000, 3_000],
  transport: [5_000, 5_000],
  customExpenses: [],
});
assert.ok(balanced);
assert.equal(balanced.brideGroomTotal, 30_000);
assert.equal(balanced.subcontractorsTotal, 25_000);
assert.equal(balanced.venueFoodTotal, 50_000);
assert.equal(balanced.ceremonyTotal, 5_000);
assert.equal(balanced.transportTotal, 10_000);
assert.equal(balanced.customTotal, 0);
assert.equal(balanced.totalWeddingCost, 120_000);
assert.equal(balanced.costPerGuest, 1_200);
assert.equal(balanced.budgetBalance, -20_000);
assert.equal(balanced.balanceStatus, 'over');

const under = calculateWeddingBudget({
  plannedBudget: 200_000,
  guestCount: 50,
  brideGroom: [10_000, 0, 0, 0, 0],
  subcontractors: [0, 0, 0, 0],
  venueFood: [0, 0, 0, 0, 0, 0],
  ceremony: [0, 0],
  transport: [0, 0],
  customExpenses: [40_000],
});
assert.ok(under);
assert.equal(under.totalWeddingCost, 50_000);
assert.equal(under.costPerGuest, 1_000);
assert.equal(under.budgetBalance, 150_000);
assert.equal(under.balanceStatus, 'under');

const perfect = calculateWeddingBudget({
  plannedBudget: 0,
  guestCount: 10,
  brideGroom: [0, 0, 0, 0, 0],
  subcontractors: [0, 0, 0, 0],
  venueFood: [0, 0, 0, 0, 0, 0],
  ceremony: [0, 0],
  transport: [0, 0],
  customExpenses: [],
});
assert.ok(perfect);
assert.equal(perfect.budgetBalance, 0);
assert.equal(perfect.balanceStatus, 'balanced');
assert.equal(perfect.costPerGuest, 0);

assert.equal(
  calculateWeddingBudget({
    plannedBudget: 100,
    guestCount: 0,
    brideGroom: [0, 0, 0, 0, 0],
    subcontractors: [0, 0, 0, 0],
    venueFood: [0, 0, 0, 0, 0, 0],
    ceremony: [0, 0],
    transport: [0, 0],
    customExpenses: [],
  }),
  null
);

const ratesOk: CurrencyRatesSnapshot = {
  available: true,
  baseCurrency: 'USD',
  rates: { USD: 1, PKR: 280 },
  fetchedAt: new Date().toISOString(),
  isStale: false,
  staleThresholdHours: 48,
  supportedCurrencies: ['USD', 'PKR'],
};

const defaults = validateWeddingBudgetInput(createDefaultInput(), ratesOk);
assert.equal(defaults.isValid, true);
assert.ok(defaults.result);
assert.equal(defaults.result.totalWeddingCost, 0);
assert.equal(defaults.result.costPerGuest, 0);
assert.equal(defaults.result.budgetBalance, 0);
assert.equal(defaults.result.balanceStatus, 'balanced');

// Mixed currency: 100 USD expense + PKR budget with rates
const mixed = createDefaultInput();
mixed.plannedBudget = { amount: '100000', currency: 'PKR' };
mixed.bridesDress = { amount: '100', currency: 'USD' };
const mixedResult = validateWeddingBudgetInput(mixed, ratesOk);
assert.equal(mixedResult.isValid, true);
assert.ok(mixedResult.result);
assert.equal(mixedResult.result.calcCurrency, 'PKR');
assert.equal(mixedResult.result.brideGroomTotal, 28_000);
assert.equal(mixedResult.result.totalWeddingCost, 28_000);
assert.equal(mixedResult.result.budgetBalance, 72_000);

console.log('wedding-budget calculation.test.ts: all assertions passed');
