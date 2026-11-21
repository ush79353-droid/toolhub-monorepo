import assert from 'node:assert/strict';
import {
  calculateAccumulatedDepreciation,
  calculateActualCashValue,
  calculateAnnualDepreciation,
  calculateDepreciationPercentage,
  calculateMonthlyDepreciation,
  calculateRemainingUsefulLife,
  calculateRemainingValuePercentage,
  convertTimeUnitDisplay,
  toMonths,
} from './calculation';
import { createDefaultInput } from './types';
import { validateActualCashValueInput } from './validation';

assert.equal(calculateActualCashValue(25_000, 10, 3), 17_500);
assert.equal(calculateActualCashValue(10_000, 5, 0), 10_000);
assert.equal(calculateActualCashValue(20_000, 10, 5), 10_000);
assert.equal(calculateActualCashValue(10_000, 5, 5), 0);
assert.equal(calculateActualCashValue(10_000, 5, 8), 0);
assert.equal(calculateActualCashValue(0, 10, 3), 0);

assert.equal(calculateAccumulatedDepreciation(25_000, 17_500), 7_500);
assert.equal(calculateAnnualDepreciation(25_000, 10), 2_500);
assert.equal(calculateMonthlyDepreciation(24_000, 120), 200);
assert.equal(calculateDepreciationPercentage(3, 10), 30);
assert.equal(calculateRemainingValuePercentage(30), 70);
assert.equal(calculateRemainingUsefulLife(10, 3), 7);
assert.equal(calculateRemainingUsefulLife(10, 12), 0);

assert.equal(toMonths(10, 'years'), 120);
assert.equal(toMonths(36, 'months'), 36);
assert.equal(convertTimeUnitDisplay(10, 'years', 'months'), 120);
assert.equal(convertTimeUnitDisplay(36, 'months', 'years'), 3);

// Mixed units via months normalization
assert.equal(calculateActualCashValue(25_000, 120, 36), 17_500);

assert.equal(calculateActualCashValue(-1, 10, 3), null);
assert.equal(calculateActualCashValue(10_000, 0, 3), null);
assert.equal(calculateActualCashValue(10_000, 10, -1), null);

const v = validateActualCashValueInput({
  ...createDefaultInput(),
  currency: 'USD',
  purchasePrice: '25000',
  expectedLife: '10',
  expectedLifeUnit: 'years',
  currentAge: '3',
  currentAgeUnit: 'years',
});
assert.equal(v.isValid, true);
assert.equal(v.result?.actualCashValue, 17_500);
assert.equal(v.result?.accumulatedDepreciation, 7_500);
assert.equal(v.result?.depreciationPercentage, 30);

const mixed = validateActualCashValueInput({
  ...createDefaultInput(),
  currency: 'USD',
  purchasePrice: '25000',
  expectedLife: '10',
  expectedLifeUnit: 'years',
  currentAge: '36',
  currentAgeUnit: 'months',
});
assert.equal(mixed.result?.actualCashValue, 17_500);

const beyond = validateActualCashValueInput({
  ...createDefaultInput(),
  purchasePrice: '10000',
  expectedLife: '5',
  currentAge: '8',
});
assert.equal(beyond.result?.actualCashValue, 0);
assert.equal(beyond.result?.beyondUsefulLife, true);

const blank = validateActualCashValueInput(createDefaultInput());
assert.equal(blank.result, null);

const zeroLife = validateActualCashValueInput({
  ...createDefaultInput(),
  purchasePrice: '1000',
  expectedLife: '0',
  currentAge: '1',
});
assert.ok(zeroLife.errors.expectedLife);

console.log('actual-cash-value/calculation.test.ts: all assertions passed');
