import assert from 'node:assert/strict';
import {
  calculateHighLowMethod,
  calculateTotalCost,
  calculateTotalFixedCost,
  calculateVariableCostPerUnit,
} from './calculation';
import { createDefaultInput } from './types';
import { validateHighLowMethod } from './validation';

// Reference: (30000-18000)/(1000-400)=20; FC=30000-20*1000=10000; TC=10000+20*700=24000
{
  assert.equal(calculateVariableCostPerUnit(30_000, 18_000, 1_000, 400), 20);
  assert.equal(calculateTotalFixedCost(30_000, 20, 1_000), 10_000);
  assert.equal(calculateTotalCost(10_000, 20, 700), 24_000);
  const result = calculateHighLowMethod({
    highCost: 30_000,
    highVolume: 1_000,
    lowCost: 18_000,
    lowVolume: 400,
    unitsX: 700,
    currency: 'PKR',
  });
  assert.ok(result);
  assert.equal(result!.variableCostPerUnit, 20);
  assert.equal(result!.totalFixedCost, 10_000);
  assert.equal(result!.totalCost, 24_000);
}

// Equal volumes → NaN
{
  assert.ok(Number.isNaN(calculateVariableCostPerUnit(100, 50, 10, 10)));
}

// Defaults blank
{
  const d = createDefaultInput();
  assert.ok(Number.isNaN(d.highCost));
  assert.ok(Number.isNaN(d.unitsX));
}

// Validation rejects high <= low volume
{
  const v = validateHighLowMethod({
    highCost: 100,
    highVolume: 5,
    lowCost: 50,
    lowVolume: 5,
    unitsX: 3,
    currency: 'PKR',
  });
  assert.equal(v.isValid, false);
  assert.ok(v.errors.highVolume);
}

console.log('high-low-method calculation.test.ts: ok');
