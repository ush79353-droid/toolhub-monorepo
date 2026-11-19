import assert from 'node:assert/strict';
import {
  calculateCellPhonePlan,
  calculateMonthlySavingsWithdrawal,
  calculateOutrightCost,
  simulateSavingsAccount,
} from './calculation';
import { validateCellPhonePlanInput } from './validation';
import { createDefaultInput, createExampleInput } from './types';

function approxEqual(actual: number, expected: number, tol = 0.02) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`,
  );
}

// Test 1 — Reference example
{
  const r = calculateCellPhonePlan({
    contractDuration: 24,
    annualInterestRate: 4,
    phonePrice: 800,
    outrightMonthlyBill: 20,
    carrierMonthlyBill: 50,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.outrightTotalCost, 1280);
  assert.equal(r.monthlyDifference, 30);
  approxEqual(r.interestEarned, 35.73);
  approxEqual(r.carrierEffectiveTotalCost, 1164.27);
  approxEqual(r.absoluteCostDifference, 115.73);
  assert.equal(r.recommendedOption, 'carrier');
  assert.equal(r.savingsSimulation.isFeasible, true);
}

// Test 2 — Zero interest
{
  const r = calculateCellPhonePlan({
    contractDuration: 24,
    annualInterestRate: 0,
    phonePrice: 800,
    outrightMonthlyBill: 20,
    carrierMonthlyBill: 50,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.outrightTotalCost, 1280);
  assert.equal(r.interestEarned, 0);
  assert.equal(r.carrierEffectiveTotalCost, 1200);
  assert.equal(r.absoluteCostDifference, 80);
  assert.equal(r.recommendedOption, 'carrier');
}

// Test 3 — Equal monthly bills (no withdrawal)
{
  const r = calculateCellPhonePlan({
    contractDuration: 24,
    annualInterestRate: 4,
    phonePrice: 800,
    outrightMonthlyBill: 30,
    carrierMonthlyBill: 30,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.monthlyDifference, 0);
  assert.ok(r.interestEarned > 0);
  assert.equal(r.outrightTotalCost, 800 + 30 * 24);
  assert.equal(
    r.carrierEffectiveTotalCost,
    Math.round((30 * 24 - r.interestEarned) * 100) / 100,
  );
  assert.equal(r.recommendedOption, 'carrier');
}

// Test 4 — Carrier bill lower → zero withdrawal
{
  const w = calculateMonthlySavingsWithdrawal(50, 30);
  assert.equal(w, 0);
  const r = calculateCellPhonePlan({
    contractDuration: 24,
    annualInterestRate: 4,
    phonePrice: 800,
    outrightMonthlyBill: 50,
    carrierMonthlyBill: 30,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.monthlyDifference, 0);
  assert.equal(r.savingsSimulation.isFeasible, true);
  assert.ok(r.interestEarned > 0);
  assert.equal(r.recommendedOption, 'carrier');
}

// Test 5 — Zero phone price
{
  const r = calculateCellPhonePlan({
    contractDuration: 24,
    annualInterestRate: 4,
    phonePrice: 0,
    outrightMonthlyBill: 20,
    carrierMonthlyBill: 50,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.interestEarned, 0);
  assert.equal(r.recommendedOption, 'infeasible');
}

// Test 6 — Zero contract duration rejected
{
  assert.equal(calculateOutrightCost(800, 20, 0), null);
  const input = createExampleInput();
  input.contractDuration = '0';
  const v = validateCellPhonePlanInput(input);
  assert.equal(v.isValid, false);
}

// Test 7 — Higher rates increase interest
{
  const a = simulateSavingsAccount(800, 30, 2, 24)!;
  const b = simulateSavingsAccount(800, 30, 4, 24)!;
  const c = simulateSavingsAccount(800, 30, 6, 24)!;
  assert.ok(a.isFeasible && b.isFeasible && c.isFeasible);
  assert.ok(a.totalInterestEarned < b.totalInterestEarned);
  assert.ok(b.totalInterestEarned < c.totalInterestEarned);
}

// Test 8 — Durations use correct periods
{
  const m12 = simulateSavingsAccount(800, 20, 4, 12)!;
  const m24 = simulateSavingsAccount(800, 20, 4, 24)!;
  const m36 = simulateSavingsAccount(800, 20, 4, 36)!;
  assert.ok(m12.isFeasible && m24.isFeasible && m36.isFeasible);
  assert.equal(m12.totalWithdrawals, 240);
  assert.equal(m24.totalWithdrawals, 480);
  assert.equal(m36.totalWithdrawals, 720);
  assert.ok(m12.totalInterestEarned < m24.totalInterestEarned);
  assert.ok(m24.totalInterestEarned < m36.totalInterestEarned);
}

// Test 9 — Insufficient savings
{
  const sim = simulateSavingsAccount(100, 50, 0, 12)!;
  assert.equal(sim.isFeasible, false);
  const r = calculateCellPhonePlan({
    contractDuration: 12,
    annualInterestRate: 0,
    phonePrice: 100,
    outrightMonthlyBill: 0,
    carrierMonthlyBill: 50,
    currency: 'USD',
  });
  assert.ok(r);
  assert.equal(r.recommendedOption, 'infeasible');
}

// Test 10 — Decimals + example validation
{
  const r = calculateCellPhonePlan({
    contractDuration: 24,
    annualInterestRate: 4.5,
    phonePrice: 799.99,
    outrightMonthlyBill: 19.99,
    carrierMonthlyBill: 49.99,
    currency: 'USD',
  });
  assert.ok(r);
  assert.ok(Number.isFinite(r.interestEarned));
  assert.ok(Number.isFinite(r.carrierEffectiveTotalCost));

  const v = validateCellPhonePlanInput(createExampleInput());
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  approxEqual(v.result.interestEarned, 35.73);

  const empty = validateCellPhonePlanInput(createDefaultInput());
  assert.equal(empty.isValid, false);
}

console.log('cell-phone-plan/calculation.test.ts: all assertions passed');
