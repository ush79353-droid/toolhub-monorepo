import assert from 'node:assert/strict';
import { calculateCostOfDoingBusiness, calculateCostPerBillableDay } from './calculation';
import { createDefaultInput } from './types';
import { validateCostOfDoingBusiness } from './validation';

// Reference: 1,200,000 / 240 → 5,000
{
  assert.equal(calculateCostPerBillableDay(1_200_000, 240), 5_000);
  const result = calculateCostOfDoingBusiness({
    totalAnnualCost: 1_200_000,
    billableDays: 240,
    currency: 'PKR',
  });
  assert.ok(result);
  assert.equal(result!.costPerBillableDay, 5_000);
  assert.equal(result!.costDisplay, '5,000.00');
}

// Zero / negative days → NaN
{
  assert.ok(Number.isNaN(calculateCostPerBillableDay(100, 0)));
  assert.ok(Number.isNaN(calculateCostPerBillableDay(100, -1)));
}

// Non-finite → NaN
{
  assert.ok(Number.isNaN(calculateCostPerBillableDay(Number.NaN, 10)));
  assert.ok(Number.isNaN(calculateCostPerBillableDay(10, Number.POSITIVE_INFINITY)));
}

// Defaults blank
{
  const d = createDefaultInput();
  assert.ok(Number.isNaN(d.totalAnnualCost));
  assert.ok(Number.isNaN(d.billableDays));
}

// Negative cost rejected
{
  const v = validateCostOfDoingBusiness({
    totalAnnualCost: -1,
    billableDays: 200,
    currency: 'PKR',
  });
  assert.equal(v.isValid, false);
  assert.ok(v.errors.totalAnnualCost);
}

// Zero days rejected
{
  const v = validateCostOfDoingBusiness({
    totalAnnualCost: 100,
    billableDays: 0,
    currency: 'PKR',
  });
  assert.equal(v.isValid, false);
  assert.ok(v.errors.billableDays);
}

console.log('cost-of-doing-business calculation.test.ts: ok');
