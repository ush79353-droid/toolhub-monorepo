import assert from 'node:assert/strict';
import { calculateCustomerRetention } from './calculation';
import { emptyDraft, validateCustomerRetentionDraft } from './validation';

// Reference: 1,000 existing, 200 new, 1,100 total → 90% retention, 10% attrition
{
  const result = calculateCustomerRetention({
    existingCustomers: 1_000,
    newCustomers: 200,
    totalCustomers: 1_100,
  });
  assert.ok(result);
  assert.equal(result!.retainedCustomers, 900);
  assert.equal(result!.retentionRatePercent, 90);
  assert.equal(result!.attritionRatePercent, 10);
}

// Existing must be > 0
{
  assert.equal(
    calculateCustomerRetention({
      existingCustomers: 0,
      newCustomers: 0,
      totalCustomers: 0,
    }),
    null
  );
}

// Retained below 0 rejected
{
  assert.equal(
    calculateCustomerRetention({
      existingCustomers: 100,
      newCustomers: 50,
      totalCustomers: 40,
    }),
    null
  );
}

// Retained above existing rejected
{
  assert.equal(
    calculateCustomerRetention({
      existingCustomers: 100,
      newCustomers: 10,
      totalCustomers: 120,
    }),
    null
  );
}

// Defaults blank
{
  const d = emptyDraft();
  assert.equal(d.existingCustomers, '');
  assert.equal(d.newCustomers, '');
  assert.equal(d.totalCustomers, '');
}

// Draft validation happy path
{
  const v = validateCustomerRetentionDraft({
    existingCustomers: '1000',
    newCustomers: '200',
    totalCustomers: '1100',
  });
  assert.equal(v.isValid, true);
  assert.equal(v.result!.retentionDisplay, '90');
  assert.equal(v.result!.attritionDisplay, '10');
}

console.log('customer-retention-rate calculation.test.ts: ok');
