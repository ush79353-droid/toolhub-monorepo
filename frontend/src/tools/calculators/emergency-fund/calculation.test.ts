import assert from 'node:assert/strict';
import {
  calculateAnnualExpenses,
  calculateDailyExpenses,
  calculateEmergencyFund,
  calculateEmergencyFundProgress,
  calculateEmergencyFundResults,
} from './calculation';
import { validateEmergencyFundInput } from './validation';
import { createDefaultInput, createExampleInput } from './types';

// Test 1 — Reference example
{
  assert.equal(calculateEmergencyFund(2500, 6), 15_000);
  const r = calculateEmergencyFundResults({
    monthlyExpenses: 2500,
    monthsDesired: 6,
    currentSavings: null,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.emergencyFund, 15_000);
}

// Test 2 — Three months
assert.equal(calculateEmergencyFund(2500, 3), 7500);

// Test 3 — Twelve months
assert.equal(calculateEmergencyFund(2500, 12), 30_000);

// Test 4 — Decimal expenses
{
  const r = calculateEmergencyFundResults({
    monthlyExpenses: 2450.75,
    monthsDesired: 6,
    currentSavings: null,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.emergencyFund, 14_704.5);
}

// Test 5 — Large expenses
assert.equal(calculateEmergencyFund(15_000, 12), 180_000);

// Test 6 — Annual
assert.equal(calculateAnnualExpenses(2500), 30_000);

// Test 7 — Daily
assert.equal(calculateDailyExpenses(3000), 100);

// Test 8 — Invalid monthly
assert.equal(calculateEmergencyFund(0, 6), null);
assert.equal(calculateEmergencyFund(-100, 6), null);

// Test 9 — Invalid months
assert.equal(calculateEmergencyFund(2500, 0), null);
assert.equal(calculateEmergencyFund(2500, -1), null);

// Test 10 — Progress optional
{
  const p = calculateEmergencyFundProgress(15_000, 5_000)!;
  assert.equal(p.remainingAmount, 10_000);
  assert.equal(p.progressPercentage, (5_000 / 15_000) * 100);
  assert.equal(p.isGoalAchieved, false);

  const done = calculateEmergencyFundProgress(15_000, 20_000)!;
  assert.equal(done.remainingAmount, 0);
  assert.equal(done.progressPercentage, 100);
  assert.equal(done.isGoalAchieved, true);
}

// Validation
{
  const empty = validateEmergencyFundInput(createDefaultInput());
  assert.equal(empty.incomplete, true);

  const example = validateEmergencyFundInput(createExampleInput());
  assert.equal(example.isValid, true);
  assert.equal(example.result?.emergencyFund, 15_000);

  const bad = createExampleInput();
  bad.monthlyExpenses = '0';
  assert.equal(validateEmergencyFundInput(bad).isValid, false);
}

console.log('emergency-fund/calculation.test.ts: all assertions passed');
