import assert from 'node:assert/strict';
import {
  calculateFireNumber,
  calculateFirePlan,
  futureValueLumpSum,
  inflateExpenses,
  requiredAnnualContribution,
  retirementDuration,
  yearsUntilRetirement,
} from './calculation';

// Test 1 — Traditional FIRE number
{
  const fire = calculateFireNumber(40_000, 4);
  assert.equal(fire, 1_000_000);
}

// Test 2 — Years until retirement
assert.equal(yearsUntilRetirement(30, 45), 15);

// Test 3 — Retirement duration
assert.equal(retirementDuration(85, 45), 40);

// Test 4 — Inflation-adjusted expenses
{
  const eR = inflateExpenses(40_000, 2.5, 15);
  const expected = 40_000 * Math.pow(1.025, 15);
  assert.ok(Math.abs(eR - expected) < 1e-6);
}

// Test 5 — Current savings growth
{
  const fv = futureValueLumpSum(10_000, 5, 15);
  const expected = 10_000 * Math.pow(1.05, 15);
  assert.ok(Math.abs(fv - expected) < 1e-6);
}

// Test 6 — Required annual savings
{
  const target = 1_000_000;
  const c = requiredAnnualContribution(target, 10_000, 5, 15)!;
  const fvSavings = futureValueLumpSum(10_000, 5, 15);
  const fvAnnuity = c * ((Math.pow(1.05, 15) - 1) / 0.05);
  assert.ok(Math.abs(fvSavings + fvAnnuity - target) < 0.05);
}

// Test 7 — Zero investment return
{
  const c = requiredAnnualContribution(100_000, 10_000, 0, 10)!;
  assert.ok(Math.abs(c - 9_000) < 1e-9);
}

// Test 8 — Zero current savings
{
  const c = requiredAnnualContribution(100_000, 0, 5, 10)!;
  const fv = c * ((Math.pow(1.05, 10) - 1) / 0.05);
  assert.ok(Math.abs(fv - 100_000) < 0.05);
}

// Test 9 — Already financially independent
{
  const result = calculateFirePlan({
    currentAge: 40,
    retirementAge: 45,
    lifeExpectancy: 85,
    annualIncome: 80_000,
    annualExpenses: 20_000,
    currentSavings: 2_000_000,
    investmentReturnPercent: 5,
    expenseInflationPercent: 2,
    salaryGrowthPercent: 2,
    safeWithdrawalRatePercent: 4,
    method: 'traditional-fire',
    currency: 'USD',
  });
  assert.ok(result);
  assert.equal(result!.alreadyFundedByExistingSavings, true);
  assert.equal(result!.requiredAnnualSavings, 0);
  assert.equal(result!.status, 'financially-independent');
}

// Test 10 — Required savings above 100%
{
  const result = calculateFirePlan({
    currentAge: 30,
    retirementAge: 35,
    lifeExpectancy: 85,
    annualIncome: 40_000,
    annualExpenses: 50_000,
    currentSavings: 0,
    investmentReturnPercent: 3,
    expenseInflationPercent: 2,
    salaryGrowthPercent: 0,
    safeWithdrawalRatePercent: 4,
    method: 'traditional-fire',
    currency: 'USD',
  });
  assert.ok(result);
  assert.ok(result!.requiredSavingsRatePercent > 100);
  assert.equal(result!.status, 'not-achievable');
}

// Test 11 — Worked example plan
{
  const result = calculateFirePlan({
    currentAge: 30,
    retirementAge: 45,
    lifeExpectancy: 85,
    annualIncome: 80_000,
    annualExpenses: 40_000,
    currentSavings: 10_000,
    investmentReturnPercent: 5,
    expenseInflationPercent: 2.5,
    salaryGrowthPercent: 2.5,
    safeWithdrawalRatePercent: 4,
    method: 'traditional-fire',
    currency: 'USD',
  });
  assert.ok(result);
  assert.equal(result!.yearsUntilRetirement, 15);
  assert.equal(result!.retirementDuration, 40);
  const eR = 40_000 * Math.pow(1.025, 15);
  assert.ok(Math.abs(result!.annualExpensesAtRetirement - eR) < 0.02);
  assert.ok(Math.abs(result!.fireNumber - eR / 0.04) < 0.5);
  assert.ok(result!.projection.length === 16);
  assert.ok(result!.scenarios.length === 3);
}

// Test 12 — Custom withdrawal
{
  const result = calculateFirePlan({
    currentAge: 30,
    retirementAge: 45,
    lifeExpectancy: 85,
    annualIncome: 80_000,
    annualExpenses: 40_000,
    currentSavings: 10_000,
    investmentReturnPercent: 5,
    expenseInflationPercent: 0,
    salaryGrowthPercent: 0,
    safeWithdrawalRatePercent: 5,
    method: 'custom-withdrawal',
    currency: 'USD',
  });
  assert.ok(result);
  assert.ok(Math.abs(result!.fireNumber - 800_000) < 0.01);
}

// Test 13 — Duration-based model
{
  const result = calculateFirePlan({
    currentAge: 30,
    retirementAge: 45,
    lifeExpectancy: 85,
    annualIncome: 80_000,
    annualExpenses: 40_000,
    currentSavings: 10_000,
    investmentReturnPercent: 5,
    expenseInflationPercent: 5,
    salaryGrowthPercent: 0,
    safeWithdrawalRatePercent: 4,
    method: 'retirement-duration',
    currency: 'USD',
  });
  assert.ok(result);
  // real return ≈ 0 → FIRE ≈ E_R * T
  const eR = 40_000 * Math.pow(1.05, 15);
  assert.ok(Math.abs(result!.fireNumber - eR * 40) < 1);
}

console.log('fire/calculation.test.ts: all assertions passed');
