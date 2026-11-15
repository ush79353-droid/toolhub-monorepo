import assert from 'node:assert/strict';
import { calculateExpectedUtility } from './calculation';
import { validateExpectedUtilityInput } from './validation';

// Example: 40% × 1000 + 60% × 2000 = 1600
{
  const r = calculateExpectedUtility({
    probability1: 40,
    value1: 1000,
    probability2: 60,
    value2: 2000,
    currency: 'PKR',
  });
  assert.ok(r);
  assert.equal(r.expectedUtility, 1600);
}

// Probabilities must total 100%
{
  const v = validateExpectedUtilityInput({
    probability1: '40',
    value1: '1000',
    probability2: '50',
    value2: '2000',
    currency: 'PKR',
  });
  assert.equal(v.isValid, false);
  assert.ok(v.errors.form);
  assert.equal(v.result, null);
}

// Signed outcomes
{
  const r = calculateExpectedUtility({
    probability1: 50,
    value1: -100,
    probability2: 50,
    value2: 200,
    currency: 'PKR',
  });
  assert.ok(r);
  assert.equal(r.expectedUtility, 50);
}

console.log('expected-utility/calculation.test.ts: ok');
