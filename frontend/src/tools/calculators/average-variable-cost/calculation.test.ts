import assert from 'node:assert/strict';
import {
  calculateAverageVariableCost,
  calculateTotalOutput,
  calculateVariableCosts,
} from './calculation';
import { createDefaultInput } from './types';
import { validateAverageVariableCostInput } from './validation';

assert.equal(calculateAverageVariableCost(60_000, 240), 250);
assert.equal(calculateAverageVariableCost(15_000, 500), 30);
assert.equal(calculateAverageVariableCost(0, 100), 0);
assert.equal(calculateAverageVariableCost(10_000, 0), null);
assert.equal(calculateAverageVariableCost(-1, 10), null);
assert.equal(calculateAverageVariableCost(10_000, -1), null);

assert.equal(calculateVariableCosts(25, 400), 10_000);
assert.equal(calculateTotalOutput(12_000, 30), 400);
assert.equal(calculateTotalOutput(12_000, 0), null);

const basic = validateAverageVariableCostInput({
  ...createDefaultInput(),
  currency: 'USD',
  variableCosts: '60000',
  totalOutput: '240',
});
assert.equal(basic.isValid, true);
assert.equal(basic.result?.averageVariableCost, 250);

const zeroVc = validateAverageVariableCostInput({
  ...createDefaultInput(),
  variableCosts: '0',
  totalOutput: '100',
});
assert.equal(zeroVc.result?.averageVariableCost, 0);

const zeroQ = validateAverageVariableCostInput({
  ...createDefaultInput(),
  variableCosts: '10000',
  totalOutput: '0',
});
assert.ok(zeroQ.errors.totalOutput);
assert.equal(zeroQ.result, null);

const reverseVc = validateAverageVariableCostInput({
  ...createDefaultInput(),
  mode: 'variableCosts',
  averageVariableCost: '25',
  totalOutput: '400',
});
assert.equal(reverseVc.result?.variableCosts, 10_000);

const reverseQ = validateAverageVariableCostInput({
  ...createDefaultInput(),
  mode: 'totalOutput',
  variableCosts: '12000',
  averageVariableCost: '30',
});
assert.equal(reverseQ.result?.totalOutput, 400);

const zeroAvc = validateAverageVariableCostInput({
  ...createDefaultInput(),
  mode: 'totalOutput',
  variableCosts: '1000',
  averageVariableCost: '0',
});
assert.equal(zeroAvc.result, null);
assert.ok(zeroAvc.errors.averageVariableCost);

const nonUnique = validateAverageVariableCostInput({
  ...createDefaultInput(),
  mode: 'totalOutput',
  variableCosts: '0',
  averageVariableCost: '0',
});
assert.equal(nonUnique.result, null);
assert.ok(nonUnique.errors.form);

const blank = validateAverageVariableCostInput(createDefaultInput());
assert.equal(blank.result, null);

const faq = validateAverageVariableCostInput({
  ...createDefaultInput(),
  variableCosts: '12000',
  totalOutput: '400',
});
assert.equal(faq.result?.averageVariableCost, 30);

console.log('average-variable-cost/calculation.test.ts: all assertions passed');
