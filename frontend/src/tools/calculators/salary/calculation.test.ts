/**
 * Runnable self-check for Salary Calculator formulas.
 * Run: npx --yes tsx src/tools/calculators/salary/calculation.test.ts
 */
import assert from 'node:assert/strict';
import { calculateSalary } from './calculation';
import { createDefaultInput } from './types';
import { validateSalaryInput } from './validation';

{
  const r = calculateSalary({
    hourlyPay: 500,
    hoursPerDay: 8,
    daysPerWeek: 5,
  });
  assert.ok(r);
  assert.equal(r.hoursPerWeek, 40);
  assert.equal(r.annualScheduledDays, 260);
  assert.equal(r.hourly, 500);
  assert.equal(r.daily, 4_000);
  assert.equal(r.weekly, 20_000);
  assert.equal(r.annual, 1_040_000);
  assert.ok(Math.abs(r.monthly - 1_040_000 / 12) < 1e-9);
}

{
  // Zero hourly → zero all periods.
  const r = calculateSalary({
    hourlyPay: 0,
    hoursPerDay: 8,
    daysPerWeek: 5,
  });
  assert.ok(r);
  assert.equal(r.weekly, 0);
  assert.equal(r.annual, 0);
  assert.equal(r.monthly, 0);
  assert.equal(r.daily, 0);
}

{
  // Custom schedule.
  const r = calculateSalary({
    hourlyPay: 25,
    hoursPerDay: 10,
    daysPerWeek: 4,
  });
  assert.ok(r);
  assert.equal(r.hoursPerWeek, 40);
  assert.equal(r.annualScheduledDays, 208);
  assert.equal(r.weekly, 1_000);
  assert.equal(r.annual, 52_000);
  assert.equal(r.daily, 250);
}

assert.equal(
  calculateSalary({ hourlyPay: -1, hoursPerDay: 8, daysPerWeek: 5 }),
  null
);
assert.equal(
  calculateSalary({ hourlyPay: 10, hoursPerDay: 0, daysPerWeek: 5 }),
  null
);
assert.equal(
  calculateSalary({ hourlyPay: 10, hoursPerDay: 8, daysPerWeek: 0 }),
  null
);
assert.equal(
  calculateSalary({
    hourlyPay: Number.NaN,
    hoursPerDay: 8,
    daysPerWeek: 5,
  }),
  null
);

{
  const empty = validateSalaryInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

{
  const valid = validateSalaryInput({
    ...createDefaultInput(),
    payAmount: '500',
    hoursPerDay: '8',
    daysPerWeek: '5',
    holidaysPerYear: '8',
    paidVacationPerYear: '15',
  });
  assert.equal(valid.isValid, true);
  assert.ok(valid.result);
  assert.equal(valid.result.annualCanonical, 1_040_000);
  assert.equal(valid.result.weeklyCanonical, 20_000);
  assert.equal(valid.result.dailyCanonical, 4_000);
  assert.equal(valid.result.hourlyCanonical, 500);
  assert.equal(valid.result.hoursPerWeek, 40);
  assert.equal(valid.result.annualScheduledDays, 260);
  assert.ok(Math.abs(valid.result.monthlyCanonical - 1_040_000 / 12) < 1e-9);
}

{
  // Holidays/vacation do not change annual (not deducted).
  const withLeave = validateSalaryInput({
    ...createDefaultInput(),
    payAmount: '500',
    hoursPerDay: '8',
    daysPerWeek: '5',
    holidaysPerYear: '20',
    paidVacationPerYear: '30',
  });
  assert.equal(withLeave.isValid, true);
  assert.ok(withLeave.result);
  assert.equal(withLeave.result.annualCanonical, 1_040_000);
}

{
  const badHours = validateSalaryInput({
    ...createDefaultInput(),
    payAmount: '500',
    hoursPerDay: '0',
    daysPerWeek: '5',
  });
  assert.equal(badHours.isValid, false);
  assert.ok(badHours.errors.hoursPerDay);
}

{
  const badDays = validateSalaryInput({
    ...createDefaultInput(),
    payAmount: '500',
    hoursPerDay: '8',
    daysPerWeek: '0',
  });
  assert.equal(badDays.isValid, false);
  assert.ok(badDays.errors.daysPerWeek);
}

{
  const negPay = validateSalaryInput({
    ...createDefaultInput(),
    payAmount: '-1',
    hoursPerDay: '8',
    daysPerWeek: '5',
  });
  assert.equal(negPay.isValid, false);
  assert.ok(negPay.errors.payAmount);
}

{
  const negHolidays = validateSalaryInput({
    ...createDefaultInput(),
    payAmount: '500',
    hoursPerDay: '8',
    daysPerWeek: '5',
    holidaysPerYear: '-1',
  });
  assert.equal(negHolidays.isValid, false);
  assert.ok(negHolidays.errors.holidaysPerYear);
}

console.log('salary calculation.test.ts: all assertions passed');
