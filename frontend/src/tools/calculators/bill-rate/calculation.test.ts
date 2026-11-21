import assert from 'node:assert/strict';
import { calculateBillRate } from './calculation';

// Guide example: 1,040,000 / 2,080 × 4 → base 500 · bill 2,000
{
  const result = calculateBillRate({
    annualSalary: 1_040_000,
    capacity: 2_080,
    multiplier: 4,
  });
  assert.ok(result);
  assert.equal(result.baseHourlyCost, 500);
  assert.equal(result.billRate, 2_000);
}

// Zero salary and zero multiplier allowed
{
  const result = calculateBillRate({
    annualSalary: 0,
    capacity: 2_080,
    multiplier: 0,
  });
  assert.ok(result);
  assert.equal(result.baseHourlyCost, 0);
  assert.equal(result.billRate, 0);
}

// Capacity ≤ 0 rejected (division by zero)
{
  assert.equal(
    calculateBillRate({
      annualSalary: 100_000,
      capacity: 0,
      multiplier: 4,
    }),
    null
  );
  assert.equal(
    calculateBillRate({
      annualSalary: 100_000,
      capacity: -1,
      multiplier: 4,
    }),
    null
  );
}

// Negative salary / multiplier rejected
{
  assert.equal(
    calculateBillRate({
      annualSalary: -1,
      capacity: 2_080,
      multiplier: 4,
    }),
    null
  );
  assert.equal(
    calculateBillRate({
      annualSalary: 100_000,
      capacity: 2_080,
      multiplier: -0.5,
    }),
    null
  );
}

console.log('bill-rate calculation.test.ts: all assertions passed');
