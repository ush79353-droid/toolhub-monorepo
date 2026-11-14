import assert from 'node:assert/strict';
import { calculateCpa, calculateCpaResult, calculateTotalAdSpend } from './calculation';
import { createDefaultInput } from './types';
import { validateCpa } from './validation';

// Reference: 1,000 × 20 → 20,000; / 50 → 400
{
  assert.equal(calculateTotalAdSpend(1_000, 20), 20_000);
  assert.equal(calculateCpa(20_000, 50), 400);
  const result = calculateCpaResult({
    numberOfClicks: 1_000,
    averageCpc: 20,
    totalConversions: 50,
    currency: 'PKR',
  });
  assert.ok(result);
  assert.equal(result!.totalAdSpend, 20_000);
  assert.equal(result!.cpa, 400);
}

// Zero spend allowed; CPA still finite
{
  assert.equal(calculateTotalAdSpend(0, 20), 0);
  assert.equal(calculateCpa(0, 10), 0);
}

// Division by zero / negatives → NaN
{
  assert.ok(Number.isNaN(calculateCpa(100, 0)));
  assert.ok(Number.isNaN(calculateTotalAdSpend(-1, 10)));
  assert.ok(Number.isNaN(calculateTotalAdSpend(10, -1)));
}

// Blank defaults
{
  const d = createDefaultInput();
  assert.ok(Number.isNaN(d.numberOfClicks));
  assert.ok(Number.isNaN(d.averageCpc));
  assert.ok(Number.isNaN(d.totalConversions));
}

// Spend without conversions → CPA blank
{
  const v = validateCpa({
    numberOfClicks: 100,
    averageCpc: 2,
    totalConversions: Number.NaN,
    currency: 'PKR',
  });
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  assert.equal(v.result!.totalAdSpend, 200);
  assert.equal(v.result!.cpa, null);
}

// Zero conversions rejected
{
  const v = validateCpa({
    numberOfClicks: 100,
    averageCpc: 2,
    totalConversions: 0,
    currency: 'PKR',
  });
  assert.equal(v.isValid, false);
  assert.ok(v.errors.totalConversions);
}

console.log('cpa calculation.test.ts: ok');
