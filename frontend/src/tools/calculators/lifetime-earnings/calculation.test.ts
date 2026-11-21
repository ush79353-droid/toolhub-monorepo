import assert from 'node:assert/strict';
import {
  calculateAnnualSalary,
  calculateLifetimeEarnings,
  calculateLifetimeEarningsResults,
  calculateWorkingYearsLeft,
  generateSalaryProjection,
} from './calculation';
import { validateLifetimeEarningsInput } from './validation';

// Test 1 — Working years
assert.equal(calculateWorkingYearsLeft(25, 65), 40);

// Test 2 — Retirement age validation
{
  const v = validateLifetimeEarningsInput({
    currentAge: '65',
    retirementAge: '60',
    currentSalary: '100000',
    annualSalaryIncrease: '5',
    currency: 'USD',
  });
  assert.equal(v.isValid, false);
  assert.ok(v.errors.retirementAge);
}

// Test 3 — Salary after 1 completed raise
assert.equal(calculateAnnualSalary(100_000, 5, 1), 105_000);

// Test 4 — Lifetime earnings without growth
assert.equal(calculateLifetimeEarnings(100_000, 0, 40), 4_000_000);

// Test 5 — Lifetime earnings with growth
{
  const expected = 100_000 * ((Math.pow(1.05, 40) - 1) / 0.05);
  const actual = calculateLifetimeEarnings(100_000, 5, 40)!;
  assert.ok(Math.abs(actual - expected) < 0.01);
}

// Test 6 — Salary projection years 1–5
{
  const rows = generateSalaryProjection({
    currentAge: 25,
    currentSalary: 100_000,
    growthRatePercent: 5,
    workingYears: 5,
  });
  assert.equal(rows.length, 5);
  assert.ok(Math.abs(rows[0]!.annualSalary - 100_000) < 1e-9);
  assert.ok(Math.abs(rows[1]!.annualSalary - 105_000) < 1e-9);
  assert.ok(Math.abs(rows[2]!.annualSalary - 110_250) < 1e-9);
  assert.ok(Math.abs(rows[3]!.annualSalary - 115_762.5) < 1e-9);
  assert.ok(Math.abs(rows[4]!.annualSalary - 121_550.625) < 1e-9);
}

// Test 7 — Cumulative equals sum
{
  const rows = generateSalaryProjection({
    currentAge: 25,
    currentSalary: 100_000,
    growthRatePercent: 5,
    workingYears: 5,
  });
  const sum = rows.reduce((acc, r) => acc + r.annualSalary, 0);
  assert.ok(Math.abs(rows[4]!.cumulativeEarnings - sum) < 1e-6);
  const closed = calculateLifetimeEarnings(100_000, 5, 5)!;
  assert.ok(Math.abs(sum - closed) < 0.01);
}

// Test 8 — Zero working years / invalid retirement
{
  const result = calculateLifetimeEarningsResults({
    currentAge: 65,
    retirementAge: 65,
    currentSalary: 100_000,
    annualSalaryIncreasePercent: 5,
    currency: 'USD',
  });
  assert.equal(result, null);
}

// Test 9 — Invalid inputs
{
  const negative = validateLifetimeEarningsInput({
    currentAge: '-1',
    retirementAge: '65',
    currentSalary: '100000',
    annualSalaryIncrease: '5',
    currency: 'USD',
  });
  assert.equal(negative.isValid, false);

  const negSalary = validateLifetimeEarningsInput({
    currentAge: '25',
    retirementAge: '65',
    currentSalary: '-100',
    annualSalaryIncrease: '5',
    currency: 'USD',
  });
  assert.equal(negSalary.isValid, false);

  const negGrowth = validateLifetimeEarningsInput({
    currentAge: '25',
    retirementAge: '65',
    currentSalary: '100000',
    annualSalaryIncrease: '-1',
    currency: 'USD',
  });
  assert.equal(negGrowth.isValid, false);
}

// Test 10 — Worked example result
{
  const result = calculateLifetimeEarningsResults({
    currentAge: 25,
    retirementAge: 65,
    currentSalary: 100_000,
    annualSalaryIncreasePercent: 5,
    currency: 'USD',
  });
  assert.ok(result);
  assert.equal(result!.workingYearsLeft, 40);
  assert.ok(result!.projection.length === 40);
  assert.ok(
    Math.abs(
      result!.lifetimeEarnings -
        100_000 * ((Math.pow(1.05, 40) - 1) / 0.05),
    ) < 0.01,
  );
}

console.log('lifetime-earnings/calculation.test.ts: all assertions passed');
