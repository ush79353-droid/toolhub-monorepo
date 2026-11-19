import assert from 'node:assert/strict';
import {
  calculateDreamComeTrue,
  calculateFutureSavings,
  calculateTimeToGoal,
  formatGoalCompletionTime,
} from './calculation';
import { validateDreamComeTrueInput } from './validation';
import { createDefaultInput, createExampleInput } from './types';

function approxEqual(actual: number, expected: number, tol = 0.02) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`,
  );
}

// Test 1 — Incomplete defaults
{
  const v = validateDreamComeTrueInput(createDefaultInput());
  assert.equal(v.incomplete, true);
  assert.equal(v.result, null);
}

// Test 2 — Zero interest
{
  const r = calculateDreamComeTrue({
    dreamPrice: 10_000,
    initialSavings: 2_000,
    monthlySavings: 400,
    annualInterestRate: 0,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.timeRequiredMonths, 20);
  assert.equal(r.timeLabel, '1 year, 8 months');
  assert.equal(r.goalReachable, true);
}

// Test 3 — Compound interest (solve then ceil)
{
  const rMonth = 0.04 / 12;
  const n = calculateTimeToGoal(25_000, 5_000, 300, rMonth)!;
  const months = Math.ceil(n);
  const r = calculateDreamComeTrue({
    dreamPrice: 25_000,
    initialSavings: 5_000,
    monthlySavings: 300,
    annualInterestRate: 4,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.timeRequiredMonths, months);
  assert.ok(r.finalSavingsBalance >= 25_000);
  assert.ok(r.breakdown.length > 0);
  const last = r.breakdown[r.breakdown.length - 1]!;
  approxEqual(
    last.totalSavings,
    last.initialSavingsGrowth + last.monthlyContributions + last.interestEarned,
    0.05,
  );
}

// Test 4 — Already achieved
{
  const r = calculateDreamComeTrue({
    dreamPrice: 10_000,
    initialSavings: 12_000,
    monthlySavings: 100,
    annualInterestRate: 4,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.timeRequiredMonths, 0);
  assert.equal(r.goalAlreadyAchieved, true);
  assert.equal(r.status, 'achieved');
}

// Test 5 — Unreachable
{
  const r = calculateDreamComeTrue({
    dreamPrice: 20_000,
    initialSavings: 5_000,
    monthlySavings: 0,
    annualInterestRate: 0,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.goalReachable, false);
  assert.equal(r.status, 'unreachable');
}

// Test 6 — Zero contributions, positive interest
{
  const r = calculateDreamComeTrue({
    dreamPrice: 10_000,
    initialSavings: 5_000,
    monthlySavings: 0,
    annualInterestRate: 6,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.goalReachable, true);
  assert.ok(r.timeRequiredMonths > 0);
  assert.ok(r.finalSavingsBalance >= 10_000);
}

// Test 7 — Zero initial savings
{
  const r = calculateDreamComeTrue({
    dreamPrice: 5_000,
    initialSavings: 0,
    monthlySavings: 250,
    annualInterestRate: 0,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.timeRequiredMonths, 20);
}

// Test 8 — Chart totals at goal
{
  const r = calculateDreamComeTrue({
    dreamPrice: 30_000,
    initialSavings: 5_000,
    monthlySavings: 500,
    annualInterestRate: 4,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.timeRequiredMonths, 45);
  assert.ok(r.finalSavingsBalance >= 30_000);
  const last = r.breakdown[r.breakdown.length - 1]!;
  assert.equal(last.month, 45);
  approxEqual(
    last.totalSavings,
    last.initialSavingsGrowth + last.monthlyContributions + last.interestEarned,
    0.05,
  );
}

// Test 9 — Time formatting
{
  assert.equal(formatGoalCompletionTime(6), '6 months');
  assert.equal(formatGoalCompletionTime(12), '1 year');
  assert.equal(formatGoalCompletionTime(18), '1 year, 6 months');
  assert.equal(formatGoalCompletionTime(24), '2 years');
  assert.equal(formatGoalCompletionTime(37), '3 years, 1 month');
  assert.equal(formatGoalCompletionTime(96), '8 years');
}

// Example + FV helpers
{
  assert.equal(calculateFutureSavings(1000, 100, 0, 10), 2000);
  const v = validateDreamComeTrueInput(createExampleInput());
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  assert.equal(v.result.timeRequiredMonths, 45);
}

console.log('dream-come-true/calculation.test.ts: all assertions passed');
