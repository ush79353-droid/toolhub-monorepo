import assert from 'node:assert/strict';
import { calculateBudgetAllocation, splitMonthlyIncome } from './calculation';
import { validateFiftyThirtyTwentyInput } from './validation';
import { createDefaultInput, createExampleInput } from './types';

// Test Case 1 — Standard monthly income $4,500
{
  const r = calculateBudgetAllocation(4500, 'USD');
  assert.ok(r);
  assert.equal(r.necessities.monthlyAmount, 2250);
  assert.equal(r.wants.monthlyAmount, 1350);
  assert.equal(r.savings.monthlyAmount, 900);
  assert.equal(r.totalMonthlyAllocated, 4500);
  assert.equal(r.monthlyRemainingBalance, 0);
}

// Test Case 2 — Annual budget
{
  const r = calculateBudgetAllocation(4500, 'USD');
  assert.ok(r);
  assert.equal(r.annualIncome, 54_000);
  assert.equal(r.necessities.annualAmount, 27_000);
  assert.equal(r.wants.annualAmount, 16_200);
  assert.equal(r.savings.annualAmount, 10_800);
  assert.equal(r.totalAnnualAllocated, 54_000);
}

// Test Case 3 — $3,000
{
  const r = calculateBudgetAllocation(3000, 'USD');
  assert.ok(r);
  assert.equal(r.necessities.monthlyAmount, 1500);
  assert.equal(r.wants.monthlyAmount, 900);
  assert.equal(r.savings.monthlyAmount, 600);
}

// Test Case 4 — $6,000
{
  const r = calculateBudgetAllocation(6000, 'USD');
  assert.ok(r);
  assert.equal(r.necessities.monthlyAmount, 3000);
  assert.equal(r.wants.monthlyAmount, 1800);
  assert.equal(r.savings.monthlyAmount, 1200);
}

// Test Case 5 — Decimal income
{
  const r = calculateBudgetAllocation(4555.5, 'USD');
  assert.ok(r);
  assert.equal(r.necessities.monthlyAmount, 2277.75);
  assert.equal(r.wants.monthlyAmount, 1366.65);
  assert.equal(r.savings.monthlyAmount, 911.1);
  assert.equal(r.totalMonthlyAllocated, 4555.5);
}

// Test Case 6 — Small income
{
  const r = calculateBudgetAllocation(100, 'USD');
  assert.ok(r);
  assert.equal(r.necessities.monthlyAmount, 50);
  assert.equal(r.wants.monthlyAmount, 30);
  assert.equal(r.savings.monthlyAmount, 20);
}

// Test Case 7 — Zero income
{
  const r = calculateBudgetAllocation(0, 'USD');
  assert.ok(r);
  assert.equal(r.totalMonthlyAllocated, 0);
  assert.equal(r.necessities.monthlyAmount, 0);
  assert.ok(Number.isFinite(r.monthlyRemainingBalance));
}

// Reject negatives
assert.equal(calculateBudgetAllocation(-1, 'USD'), null);
assert.equal(splitMonthlyIncome(Number.NaN, 'USD'), null);

// Validation
{
  const empty = validateFiftyThirtyTwentyInput(createDefaultInput());
  assert.equal(empty.isValid, false);

  const example = validateFiftyThirtyTwentyInput(createExampleInput());
  assert.equal(example.isValid, true);
  assert.ok(example.result);
  assert.equal(example.result.necessities.monthlyAmount, 2250);
}

console.log('fifty-thirty-twenty-rule/calculation.test.ts: all assertions passed');
