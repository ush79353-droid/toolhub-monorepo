/**
 * Runnable self-check for Hourly to Annual Salary Calculator formulas.
 * Run: npx --yes tsx src/tools/calculators/hourly-to-annual-salary/calculation.test.ts
 */
import assert from 'node:assert/strict';
import { calculateHourlyToAnnual } from './calculation';
import { createDefaultInput } from './types';
import { validateHourlyToAnnualSalaryInput } from './validation';

{
  const r = calculateHourlyToAnnual({
    hourlyWage: 500,
    hoursPerWeek: 40,
    daysPerWeek: 5,
  });
  assert.ok(r);
  assert.equal(r.weekly, 20_000);
  assert.equal(r.annual, 1_040_000);
  assert.ok(Math.abs(r.monthly - 1_040_000 / 12) < 1e-9);
  assert.equal(r.daily, 4_000);
}

{
  // Zero hourly wage → zero all periods.
  const r = calculateHourlyToAnnual({
    hourlyWage: 0,
    hoursPerWeek: 40,
    daysPerWeek: 5,
  });
  assert.ok(r);
  assert.equal(r.weekly, 0);
  assert.equal(r.annual, 0);
  assert.equal(r.monthly, 0);
  assert.equal(r.daily, 0);
}

{
  // Custom days/week.
  const r = calculateHourlyToAnnual({
    hourlyWage: 25,
    hoursPerWeek: 40,
    daysPerWeek: 4,
  });
  assert.ok(r);
  assert.equal(r.weekly, 1_000);
  assert.equal(r.annual, 52_000);
  assert.equal(r.daily, 250);
}

assert.equal(
  calculateHourlyToAnnual({
    hourlyWage: -1,
    hoursPerWeek: 40,
    daysPerWeek: 5,
  }),
  null
);

assert.equal(
  calculateHourlyToAnnual({
    hourlyWage: 10,
    hoursPerWeek: 0,
    daysPerWeek: 5,
  }),
  null
);

assert.equal(
  calculateHourlyToAnnual({
    hourlyWage: 10,
    hoursPerWeek: 40,
    daysPerWeek: 0,
  }),
  null
);

assert.equal(
  calculateHourlyToAnnual({
    hourlyWage: Number.NaN,
    hoursPerWeek: 40,
    daysPerWeek: 5,
  }),
  null
);

{
  const empty = validateHourlyToAnnualSalaryInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

{
  const valid = validateHourlyToAnnualSalaryInput({
    ...createDefaultInput(),
    hourlyWage: '500',
    hoursPerWeek: '40',
    daysPerWeek: '5',
  });
  assert.equal(valid.isValid, true);
  assert.ok(valid.result);
  assert.equal(valid.result.annualCanonical, 1_040_000);
  assert.equal(valid.result.weeklyCanonical, 20_000);
  assert.equal(valid.result.dailyCanonical, 4_000);
  assert.ok(Math.abs(valid.result.monthlyCanonical - 1_040_000 / 12) < 1e-9);
}

{
  const badHours = validateHourlyToAnnualSalaryInput({
    ...createDefaultInput(),
    hourlyWage: '500',
    hoursPerWeek: '0',
    daysPerWeek: '5',
  });
  assert.equal(badHours.isValid, false);
  assert.ok(badHours.errors.hoursPerWeek);
}

{
  const badDays = validateHourlyToAnnualSalaryInput({
    ...createDefaultInput(),
    hourlyWage: '500',
    hoursPerWeek: '40',
    daysPerWeek: '0',
  });
  assert.equal(badDays.isValid, false);
  assert.ok(badDays.errors.daysPerWeek);
}

{
  const negWage = validateHourlyToAnnualSalaryInput({
    ...createDefaultInput(),
    hourlyWage: '-1',
    hoursPerWeek: '40',
    daysPerWeek: '5',
  });
  assert.equal(negWage.isValid, false);
  assert.ok(negWage.errors.hourlyWage);
}

console.log('hourly-to-annual-salary calculation.test.ts: all assertions passed');
