/**
 * Runnable self-check for Prorated Salary Calculator formulas.
 * Run: npx --yes tsx src/tools/calculators/prorated-salary/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  calculateProratedSalary,
  countScheduledWorkingDays,
  daysInCalendarMonth,
  normalizeToMonthlySalary,
} from './calculation';
import { createDefaultInput } from './types';
import { validateProratedSalaryInput } from './validation';

{
  // January 2025 has 31 days; leap Feb 2024 has 29; Feb 2025 has 28.
  assert.equal(daysInCalendarMonth(2025, 1), 31);
  assert.equal(daysInCalendarMonth(2024, 2), 29);
  assert.equal(daysInCalendarMonth(2025, 2), 28);
  assert.equal(daysInCalendarMonth(2025, 13), null);
}

{
  // Jan 2025 · Sun+Sat off → 23 scheduled working days (screenshot).
  assert.equal(countScheduledWorkingDays(2025, 1, [0, 6]), 23);
}

{
  // Screenshot parity: 2,000/mo · 10+1+1 payable · 23 scheduled → ≈ 1,043.48
  const r = calculateProratedSalary({
    year: 2025,
    month: 1,
    grossSalary: 2000,
    payPeriod: 'month',
    daysWorked: 10,
    holidays: 1,
    approvedLeave: 1,
    daysOff: [0, 6],
  });
  assert.ok(r);
  assert.equal(r.scheduledWorkingDays, 23);
  assert.equal(r.payableDays, 12);
  assert.ok(Math.abs(r.proratedSalary - (2000 * 12) / 23) < 1e-9);
  assert.ok(Math.abs(r.proratedSalary - 1043.4782608695652) < 1e-9);
}

{
  // Pay-period normalization conventions.
  assert.equal(normalizeToMonthlySalary(24000, 'year', 23), 2000);
  assert.ok(
    Math.abs(normalizeToMonthlySalary(500, 'week', 23)! - (500 * 52) / 12) <
      1e-9
  );
  assert.equal(normalizeToMonthlySalary(100, 'day', 23), 2300);
  assert.equal(normalizeToMonthlySalary(2000, 'month', 23), 2000);
}

{
  // Seven-day workweek → no days off → all calendar days scheduled.
  const r = calculateProratedSalary({
    year: 2025,
    month: 1,
    grossSalary: 3100,
    payPeriod: 'month',
    daysWorked: 31,
    holidays: 0,
    approvedLeave: 0,
    daysOff: [],
  });
  assert.ok(r);
  assert.equal(r.scheduledWorkingDays, 31);
  assert.equal(r.proratedSalary, 3100);
}

{
  // Zero scheduled working days (all weekdays off) → null.
  const r = calculateProratedSalary({
    year: 2025,
    month: 1,
    grossSalary: 2000,
    payPeriod: 'month',
    daysWorked: 0,
    holidays: 0,
    approvedLeave: 0,
    daysOff: [0, 1, 2, 3, 4, 5, 6],
  });
  assert.equal(r, null);
}

{
  // Defaults validate to screenshot result (same currency — no FX needed).
  const v = validateProratedSalaryInput(createDefaultInput(), null);
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  assert.equal(v.result.scheduledWorkingDays, 23);
  assert.equal(v.result.payableDays, 12);
  assert.ok(Math.abs(v.result.proratedSalary - (2000 * 12) / 23) < 1e-9);
  assert.equal(v.result.formattedProratedSalary, '1,043.48');
}

{
  // Over-count payable vs scheduled → invalid (double-count guard).
  const input = createDefaultInput();
  input.daysWorked = '20';
  input.holidays = '5';
  input.approvedLeave = '5';
  const v = validateProratedSalaryInput(input, null);
  assert.equal(v.isValid, false);
  assert.ok(v.errors.form);
}

{
  // Duplicate days off rejected.
  const input = createDefaultInput();
  input.daysOff = [0, 0, 1, 2, 3, 4];
  const v = validateProratedSalaryInput(input, null);
  assert.equal(v.isValid, false);
  assert.ok(v.errors.daysOff);
}

console.log('prorated-salary calculation.test.ts: all assertions passed');
