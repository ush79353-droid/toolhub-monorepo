/**
 * Runnable self-check for Hourly to Salary with Overtime (reuses sibling math).
 * Run: npx --yes tsx --tsconfig tsconfig.json src/tools/calculators/hourly-to-salary-with-overtime/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  calculateHourlyToSalaryWithOvertime,
  toWeeklyHours,
  WEEKS_PER_YEAR,
} from './calculation';
import { createDefaultInput } from './types';
import { validateHourlyToSalaryWithOvertimeInput } from './validation';

{
  const weekly = toWeeklyHours(40, 'hours', 'week');
  assert.equal(weekly, 40);
  const r = calculateHourlyToSalaryWithOvertime({
    hourlyRegularRate: 500,
    weeklyRegularHours: 40,
    overtimeMultiplier: 1.5,
    monthlyOvertimeHours: 20,
  });
  assert.ok(r);
  assert.equal(r.hourlyOvertimeRate, 750);
  assert.equal(r.monthlyRegularPay, 500 * 40 * (WEEKS_PER_YEAR / 12));
  assert.equal(r.monthlyOvertimePay, 15_000);
  assert.equal(r.monthlyTotalPay, r.monthlyRegularPay + 15_000);
}

{
  const r = calculateHourlyToSalaryWithOvertime({
    hourlyRegularRate: 100,
    weeklyRegularHours: 40,
    overtimeMultiplier: 1.5,
    monthlyOvertimeHours: 0,
  });
  assert.ok(r);
  assert.equal(r.monthlyOvertimePay, 0);
  assert.equal(r.monthlyTotalPay, r.monthlyRegularPay);
}

{
  const defaults = createDefaultInput();
  assert.equal(defaults.regularWorkTime, '40');
  assert.equal(defaults.regularWorkFrequency, 'week');
  assert.equal(defaults.overtimeMultiplier, '1.5');
}

{
  const ok = validateHourlyToSalaryWithOvertimeInput({
    ...createDefaultInput(),
    regularPay: '500',
    overtimeHours: '20',
  });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.hourlyOvertimeRate, 750);
  assert.equal(ok.result.weeklyRegularHours, 40);
  assert.equal(ok.result.monthlyOvertimeHours, 20);
}

assert.equal(
  calculateHourlyToSalaryWithOvertime({
    hourlyRegularRate: -1,
    weeklyRegularHours: 40,
    overtimeMultiplier: 1.5,
    monthlyOvertimeHours: 0,
  }),
  null
);

console.log('hourly-to-salary-with-overtime calculation.self-check: ok');
