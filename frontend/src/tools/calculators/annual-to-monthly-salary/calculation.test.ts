import assert from 'node:assert/strict';
import {
  calculateAnnualToMonthly,
  formatWageMoney,
  WEEKS_PER_YEAR,
  WORKDAYS_PER_WEEK,
} from './calculation';
import { validateAnnualToMonthlySalaryInput } from './validation';
import { createDefaultInput } from './types';

// Annual 1,040,000 · 40h → monthly ≈ 86,666.67; weekly 20,000; daily 4,000; hourly 500
{
  const out = calculateAnnualToMonthly({
    annualSalary: 1_040_000,
    hoursPerWeek: 40,
  });
  assert.ok(out);
  assert.equal(out.annualHours, 40 * WEEKS_PER_YEAR);
  assert.equal(out.weekly, 20_000);
  assert.equal(out.daily, 1_040_000 / (WEEKS_PER_YEAR * WORKDAYS_PER_WEEK));
  assert.equal(out.hourly, 500);
  assert.ok(Math.abs(out.monthly - 1_040_000 / 12) < 1e-9);
}

// Zero annual allowed
{
  const out = calculateAnnualToMonthly({
    annualSalary: 0,
    hoursPerWeek: 40,
  });
  assert.ok(out);
  assert.equal(out.monthly, 0);
  assert.equal(out.hourly, 0);
  assert.equal(out.daily, 0);
}

// Reject non-positive hours / negative annual
{
  assert.equal(
    calculateAnnualToMonthly({ annualSalary: 10_000, hoursPerWeek: 0 }),
    null
  );
  assert.equal(
    calculateAnnualToMonthly({ annualSalary: -1, hoursPerWeek: 40 }),
    null
  );
}

assert.equal(formatWageMoney(1_040_000, 'PKR'), '1,040,000.00');
assert.equal(formatWageMoney(0, 'PKR'), '0.00');

{
  const empty = validateAnnualToMonthlySalaryInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);

  const ok = validateAnnualToMonthlySalaryInput({
    ...createDefaultInput(),
    annualSalary: '1040000',
  });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.formattedWeekly, '20,000.00');
  assert.equal(ok.result.formattedDaily, '4,000.00');
  assert.equal(ok.result.formattedHourly, '500.00');
  assert.ok(Math.abs(ok.result.monthlyCanonical - 1_040_000 / 12) < 1e-9);

  const badHours = validateAnnualToMonthlySalaryInput({
    ...createDefaultInput(),
    hoursPerWeek: '0',
    annualSalary: '10000',
  });
  assert.equal(badHours.isValid, false);
  assert.ok(badHours.errors.hoursPerWeek);

  const neg = validateAnnualToMonthlySalaryInput({
    ...createDefaultInput(),
    annualSalary: '-5',
  });
  assert.equal(neg.isValid, false);
  assert.ok(neg.errors.annualSalary);
}

console.log('annual-to-monthly-salary calculation.test.ts: all assertions passed');
