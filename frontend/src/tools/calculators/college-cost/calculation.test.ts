import assert from 'node:assert/strict';
import {
  calculateAfterTaxReturn,
  calculateCollegeCost,
  calculateFutureAnnualCollegeCost,
  calculateRequiredMonthlySavings,
  calculateTotalCollegeCost,
} from './calculation';
import { validateCollegeCostInput } from './validation';
import {
  COLLEGE_TYPE_PRESETS,
  createDefaultInput,
  createExampleInput,
} from './types';

function approxEqual(actual: number, expected: number, tol = 0.05) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`,
  );
}

// Test 1 — Default college cost
{
  const r = calculateCollegeCost({
    annualCollegeCost: 30_990,
    collegeCostIncreaseRate: 5,
    attendanceDuration: 4,
    percentFromSavings: 35,
    currentSavingsBalance: 0,
    investmentReturnRate: 5,
    taxRate: 25,
    yearsUntilCollege: 3,
    currency: 'USD',
  });
  assert.ok(r);
  approxEqual(r.firstYearFutureCost, 35_874.8);
  approxEqual(r.totalProjectedCollegeCost, 154_624.87);
  approxEqual(r.savingsFundedTarget, 54_118.7);
  approxEqual(r.afterTaxInvestmentReturnPercent, 3.75);
  assert.equal(r.projectedCurrentSavings, 0);
  approxEqual(r.fundingGap, 54_118.7);
  assert.ok(r.requiredMonthlySavings > 0);
  assert.equal(r.annualCostBreakdown.length, 4);
  assert.equal(r.financialStatus, 'additional-savings-required');
  for (let i = 1; i < 4; i += 1) {
    approxEqual(
      r.annualCostBreakdown[i]!.projectedAnnualCost,
      r.annualCostBreakdown[i - 1]!.projectedAnnualCost * 1.05,
      0.02,
    );
  }
}

// Test 2 — Zero inflation
{
  const total = calculateTotalCollegeCost(30_000, 0, 2, 3)!;
  assert.equal(total, 90_000);
  const y0 = calculateFutureAnnualCollegeCost(30_000, 0, 2, 0)!;
  const y1 = calculateFutureAnnualCollegeCost(30_000, 0, 2, 1)!;
  assert.equal(y0, 30_000);
  assert.equal(y1, 30_000);
}

// Test 3 — Zero investment return
{
  const r = calculateCollegeCost({
    annualCollegeCost: 30_990,
    collegeCostIncreaseRate: 5,
    attendanceDuration: 4,
    percentFromSavings: 35,
    currentSavingsBalance: 10_000,
    investmentReturnRate: 0,
    taxRate: 25,
    yearsUntilCollege: 3,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.afterTaxInvestmentReturnPercent, 0);
  assert.equal(r.projectedCurrentSavings, 10_000);
  const monthly = calculateRequiredMonthlySavings(r.fundingGap, 0, 3)!;
  approxEqual(r.requiredMonthlySavings, monthly);
}

// Test 4 — 100% savings
{
  const r = calculateCollegeCost({
    annualCollegeCost: 20_000,
    collegeCostIncreaseRate: 0,
    attendanceDuration: 2,
    percentFromSavings: 100,
    currentSavingsBalance: 0,
    investmentReturnRate: 0,
    taxRate: 0,
    yearsUntilCollege: 1,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.savingsFundedTarget, r.totalProjectedCollegeCost);
  assert.equal(r.otherFundingTarget, 0);
}

// Test 5 — 0% savings
{
  const r = calculateCollegeCost({
    annualCollegeCost: 20_000,
    collegeCostIncreaseRate: 0,
    attendanceDuration: 2,
    percentFromSavings: 0,
    currentSavingsBalance: 0,
    investmentReturnRate: 5,
    taxRate: 0,
    yearsUntilCollege: 2,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.savingsFundedTarget, 0);
  assert.equal(r.requiredMonthlySavings, 0);
  assert.equal(r.otherFundingTarget, r.totalProjectedCollegeCost);
  assert.equal(r.financialStatus, 'fully-funded');
}

// Test 6 — Surplus
{
  const r = calculateCollegeCost({
    annualCollegeCost: 10_000,
    collegeCostIncreaseRate: 0,
    attendanceDuration: 1,
    percentFromSavings: 50,
    currentSavingsBalance: 100_000,
    investmentReturnRate: 0,
    taxRate: 0,
    yearsUntilCollege: 0,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.fundingGap, 0);
  assert.ok(r.savingsSurplus > 0);
  assert.equal(r.requiredMonthlySavings, 0);
  assert.equal(r.financialStatus, 'savings-surplus');
}

// Test 7 — Tax-free 529
{
  assert.equal(calculateAfterTaxReturn(5, 0), 0.05);
}

// Test 8 — Fully taxed
{
  assert.equal(calculateAfterTaxReturn(5, 100), 0);
}

// Test 9 — Immediate start
{
  const r = calculateCollegeCost({
    annualCollegeCost: 30_990,
    collegeCostIncreaseRate: 5,
    attendanceDuration: 4,
    percentFromSavings: 35,
    currentSavingsBalance: 5_000,
    investmentReturnRate: 5,
    taxRate: 25,
    yearsUntilCollege: 0,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.projectedCurrentSavings, 5_000);
  assert.equal(r.requiredMonthlySavings, 0);
  assert.equal(r.firstYearFutureCost, 30_990);
}

// Test 10 — Presets
{
  const map = Object.fromEntries(
    COLLEGE_TYPE_PRESETS.map((p) => [p.id, p.annualCost]),
  );
  assert.equal(map['private-4'], 65_470);
  assert.equal(map['public-in-4'], 30_990);
  assert.equal(map['public-out-4'], 50_920);
  assert.equal(map['public-2'], 21_320);

  const v = validateCollegeCostInput(createExampleInput());
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  approxEqual(v.result.firstYearFutureCost, 35_874.8);

  const cleared = createDefaultInput();
  cleared.annualCollegeCost = '';
  assert.equal(validateCollegeCostInput(cleared).isValid, false);
}

console.log('college-cost/calculation.test.ts: all assertions passed');
