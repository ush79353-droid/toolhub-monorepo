import assert from 'node:assert/strict';
import { buildAverageFixedCostResult, calculateAverageFixedCost } from './calculation';
import { validateAverageFixedCostInput } from './validation';
import { createDefaultInput } from './types';

// Reference: 10,000 / 200 → 50.00
{
  const average = calculateAverageFixedCost(10_000, 200);
  assert.equal(average, 50);
  const result = buildAverageFixedCostResult(10_000, 200, 'PKR');
  assert.ok(result);
  assert.equal(result!.averageFixedCost, 50);
  assert.equal(result!.formattedAverage, '50.00');
  assert.match(result!.shareAverage, /50/);
}

// Zero cost → 0 average
{
  assert.equal(calculateAverageFixedCost(0, 100), 0);
}

// Zero / negative units → NaN
{
  assert.ok(Number.isNaN(calculateAverageFixedCost(100, 0)));
  assert.ok(Number.isNaN(calculateAverageFixedCost(100, -5)));
  assert.equal(buildAverageFixedCostResult(100, 0, 'PKR'), null);
}

// Non-finite inputs → NaN
{
  assert.ok(Number.isNaN(calculateAverageFixedCost(Number.NaN, 10)));
  assert.ok(Number.isNaN(calculateAverageFixedCost(10, Number.POSITIVE_INFINITY)));
}

// Defaults are blank
{
  const defaults = createDefaultInput();
  assert.equal(defaults.totalFixedCost, '');
  assert.equal(defaults.numberOfUnits, '');
  assert.equal(defaults.currency, 'PKR');
}

// Incomplete draft is invalid without field errors
{
  const v = validateAverageFixedCostInput({
    totalFixedCost: '',
    numberOfUnits: '',
    currency: 'PKR',
  });
  assert.equal(v.isValid, false);
  assert.deepEqual(v.errors, {});
}

// Negative cost rejected
{
  const v = validateAverageFixedCostInput({
    totalFixedCost: '-1',
    numberOfUnits: '10',
    currency: 'PKR',
  });
  assert.equal(v.isValid, false);
  assert.ok(v.errors.totalFixedCost);
}

// Zero units rejected
{
  const v = validateAverageFixedCostInput({
    totalFixedCost: '100',
    numberOfUnits: '0',
    currency: 'PKR',
  });
  assert.equal(v.isValid, false);
  assert.ok(v.errors.numberOfUnits);
}

// Invalid tokens rejected
{
  const v = validateAverageFixedCostInput({
    totalFixedCost: 'NaN',
    numberOfUnits: 'Infinity',
    currency: 'PKR',
  });
  assert.equal(v.isValid, false);
  assert.ok(v.errors.totalFixedCost);
  assert.ok(v.errors.numberOfUnits);
}

// Valid draft
{
  const v = validateAverageFixedCostInput({
    totalFixedCost: '10000',
    numberOfUnits: '200',
    currency: 'PKR',
  });
  assert.equal(v.isValid, true);
  assert.deepEqual(v.parsed, {
    totalFixedCost: 10_000,
    numberOfUnits: 200,
    currency: 'PKR',
  });
}

console.log('average-fixed-cost calculation.test.ts: ok');
