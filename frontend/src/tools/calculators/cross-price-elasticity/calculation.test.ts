import assert from 'node:assert/strict';
import {
  calculateCrossPriceElasticity,
  calculateMidpointCrossPriceElasticity,
  calculatePercentageDemandChange,
  calculatePercentagePriceChange,
  classifyMagnitude,
  classifyRelationship,
} from './calculation';
import { createDefaultInput } from './types';
import { validateCrossPriceElasticityInput } from './validation';

function nearly(actual: number | null, expected: number, eps = 1e-9) {
  assert.ok(actual !== null);
  assert.ok(Math.abs(actual! - expected) < eps, `${actual} ≈ ${expected}`);
}

nearly(calculatePercentagePriceChange(10, 12), 20);
nearly(calculatePercentageDemandChange(1000, 1200), 20);
nearly(calculateCrossPriceElasticity(20, 20), 1);
nearly(calculateCrossPriceElasticity(-20, 20), -1);
assert.equal(calculateCrossPriceElasticity(0, 20), 0);
assert.equal(calculateCrossPriceElasticity(20, 0), null);

nearly(calculatePercentagePriceChange(20, 15), -25);
nearly(calculatePercentageDemandChange(100, 125), 25);
nearly(calculateCrossPriceElasticity(25, -25), -1);
nearly(calculatePercentageDemandChange(100, 75), -25);
nearly(calculateCrossPriceElasticity(-25, -25), 1);

assert.equal(calculatePercentagePriceChange(0, 10), null);
assert.equal(calculatePercentageDemandChange(0, 10), null);
assert.equal(calculatePercentagePriceChange(-1, 10), null);

nearly(
  calculateMidpointCrossPriceElasticity(10, 12, 1000, 1200),
  1
);
nearly(
  calculateMidpointCrossPriceElasticity(12, 10, 1200, 1000),
  1
);

assert.equal(classifyRelationship(1), 'substitutes');
assert.equal(classifyRelationship(-1), 'complements');
assert.equal(classifyRelationship(0), 'approximatelyUnrelated');
assert.equal(classifyMagnitude(0.5), 'inelastic');
assert.equal(classifyMagnitude(1), 'unitMagnitude');
assert.equal(classifyMagnitude(2), 'elastic');

const pos = validateCrossPriceElasticityInput({
  ...createDefaultInput(),
  currency: 'USD',
  initialPriceA: '10',
  finalPriceA: '12',
  initialDemandB: '1000',
  finalDemandB: '1200',
});
assert.equal(pos.isValid, true);
nearly(pos.result?.elasticity ?? null, 1);
assert.equal(pos.result?.relationship, 'substitutes');

const neg = validateCrossPriceElasticityInput({
  ...createDefaultInput(),
  initialPriceA: '10',
  finalPriceA: '12',
  initialDemandB: '1000',
  finalDemandB: '800',
});
nearly(neg.result?.elasticity ?? null, -1);
assert.equal(neg.result?.relationship, 'complements');

const zero = validateCrossPriceElasticityInput({
  ...createDefaultInput(),
  initialPriceA: '10',
  finalPriceA: '12',
  initialDemandB: '1000',
  finalDemandB: '1000',
});
assert.equal(zero.result?.elasticity, 0);

const noPriceChange = validateCrossPriceElasticityInput({
  ...createDefaultInput(),
  initialPriceA: '10',
  finalPriceA: '10',
  initialDemandB: '100',
  finalDemandB: '120',
});
assert.equal(noPriceChange.result, null);
assert.ok(noPriceChange.errors.form);

const zeroInitialPrice = validateCrossPriceElasticityInput({
  ...createDefaultInput(),
  initialPriceA: '0',
  finalPriceA: '10',
  initialDemandB: '100',
  finalDemandB: '120',
});
assert.ok(zeroInitialPrice.errors.initialPriceA);

const zeroInitialDemand = validateCrossPriceElasticityInput({
  ...createDefaultInput(),
  initialPriceA: '10',
  finalPriceA: '12',
  initialDemandB: '0',
  finalDemandB: '100',
});
assert.ok(zeroInitialDemand.errors.initialDemandB);

const midpoint = validateCrossPriceElasticityInput({
  ...createDefaultInput(),
  method: 'midpoint',
  initialPriceA: '10',
  finalPriceA: '12',
  initialDemandB: '1000',
  finalDemandB: '1200',
});
nearly(midpoint.result?.elasticity ?? null, 1);

const faq = validateCrossPriceElasticityInput({
  ...createDefaultInput(),
  // 10% price up, 20% demand up → E = 2
  initialPriceA: '100',
  finalPriceA: '110',
  initialDemandB: '100',
  finalDemandB: '120',
});
nearly(faq.result?.elasticity ?? null, 2);

const blank = validateCrossPriceElasticityInput(createDefaultInput());
assert.equal(blank.result, null);

console.log('cross-price-elasticity/calculation.test.ts: all assertions passed');
