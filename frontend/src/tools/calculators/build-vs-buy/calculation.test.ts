import assert from 'node:assert/strict';
import {
  annualMaintenanceCost,
  buildDurationInMonths,
  calculateBuildVsBuy,
  effectiveMonthlyEmployeeCost,
} from './calculation';
import { createDefaultInput, WEEKS_PER_MONTH } from './types';

assert.equal(effectiveMonthlyEmployeeCost(10_000, 25), 12_500);
assert.ok(Math.abs(buildDurationInMonths(12, 'weeks') - 12 / WEEKS_PER_MONTH) < 1e-12);
assert.ok(Math.abs(annualMaintenanceCost(1, 12_500) - (1 / 22) * 12_500 * 12) < 1e-9);

{
  const input = createDefaultInput();
  input.buyCostAnnual = 120_000;
  input.employees = 1;
  input.buildTime = 12;
  input.buildTimeUnit = 'weeks';
  input.salaryMonthly = 10_000;
  input.overheadPercent = 25;
  input.maintenanceDaysPerMonth = 1;
  const result = calculateBuildVsBuy(input);
  assert.ok(result);
  assert.equal(result.hasPayback, true);
  assert.ok(result.yearsToProfit !== null && result.yearsToProfit > 0);
}

{
  const input = createDefaultInput();
  input.buyCostAnnual = 1000;
  input.employees = 1;
  input.buildTime = 12;
  input.buildTimeUnit = 'months';
  input.salaryMonthly = 10_000;
  input.overheadPercent = 0;
  input.maintenanceDaysPerMonth = 22;
  const result = calculateBuildVsBuy(input);
  assert.ok(result);
  assert.equal(result.hasPayback, false);
  assert.equal(result.paybackDisplay, 'No payback');
}

console.log('build-vs-buy calculation.test.ts: ok');
