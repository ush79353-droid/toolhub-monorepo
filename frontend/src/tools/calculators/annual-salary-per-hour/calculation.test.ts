import assert from 'node:assert/strict';
import {
  calculateWagePeriods,
  formatWageMoney,
  WEEKS_PER_YEAR,
  WORKDAYS_PER_WEEK,
} from './calculation';
import { validateAnnualSalaryPerHourInput } from './validation';
import { createDefaultInput } from './types';

// Hourly 500 · 40h → annual 1,040,000; weekly 20,000; daily 4,000; monthly ≈ 86,666.67
{
  const out = calculateWagePeriods({
    hoursPerWeek: 40,
    sourceField: 'hourly',
    sourceAmount: 500,
  });
  assert.ok(out);
  assert.equal(out.annualHours, 40 * WEEKS_PER_YEAR);
  assert.equal(out.annual, 1_040_000);
  assert.equal(out.weekly, 20_000);
  assert.equal(out.daily, 4_000);
  assert.ok(Math.abs(out.monthly - 1_040_000 / 12) < 1e-9);
  assert.equal(out.hourly, 500);
}

// Annual → reverse to hourly
{
  const out = calculateWagePeriods({
    hoursPerWeek: 40,
    sourceField: 'annual',
    sourceAmount: 1_040_000,
  });
  assert.ok(out);
  assert.equal(out.hourly, 500);
  assert.equal(out.weekly, 20_000);
  assert.equal(out.daily, 4_000);
}

// Daily authoritative
{
  const out = calculateWagePeriods({
    hoursPerWeek: 40,
    sourceField: 'daily',
    sourceAmount: 4_000,
  });
  assert.ok(out);
  assert.equal(out.annual, 4_000 * WORKDAYS_PER_WEEK * WEEKS_PER_YEAR);
  assert.equal(out.hourly, 500);
}

// Weekly / monthly
{
  const weekly = calculateWagePeriods({
    hoursPerWeek: 40,
    sourceField: 'weekly',
    sourceAmount: 20_000,
  });
  assert.ok(weekly);
  assert.equal(weekly.annual, 1_040_000);

  const monthly = calculateWagePeriods({
    hoursPerWeek: 40,
    sourceField: 'monthly',
    sourceAmount: 1_040_000 / 12,
  });
  assert.ok(monthly);
  assert.ok(Math.abs(monthly.annual - 1_040_000) < 1e-6);
}

// Zero wage allowed
{
  const out = calculateWagePeriods({
    hoursPerWeek: 40,
    sourceField: 'hourly',
    sourceAmount: 0,
  });
  assert.ok(out);
  assert.equal(out.annual, 0);
  assert.equal(out.daily, 0);
}

// Reject non-positive hours / negative wage
{
  assert.equal(
    calculateWagePeriods({
      hoursPerWeek: 0,
      sourceField: 'hourly',
      sourceAmount: 10,
    }),
    null
  );
  assert.equal(
    calculateWagePeriods({
      hoursPerWeek: 40,
      sourceField: 'hourly',
      sourceAmount: -1,
    }),
    null
  );
}

assert.equal(formatWageMoney(1_040_000, 'PKR'), '1,040,000.00');
assert.equal(formatWageMoney(0, 'PKR'), '0.00');

{
  const empty = validateAnnualSalaryPerHourInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);

  const ok = validateAnnualSalaryPerHourInput({
    ...createDefaultInput(),
    hourly: '500',
    sourceField: 'hourly',
  });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.formattedAnnual, '1,040,000.00');
  assert.equal(ok.result.formattedDaily, '4,000.00');
  assert.equal(ok.result.formattedWeekly, '20,000.00');

  const fromMonthly = validateAnnualSalaryPerHourInput({
    ...createDefaultInput(),
    sourceField: 'monthly',
    monthly: String(1_040_000 / 12),
  });
  assert.equal(fromMonthly.isValid, true);
  assert.ok(fromMonthly.result);
  assert.ok(Math.abs(fromMonthly.result.hourlyCanonical - 500) < 1e-6);

  const badHours = validateAnnualSalaryPerHourInput({
    ...createDefaultInput(),
    hoursPerWeek: '0',
    hourly: '10',
  });
  assert.equal(badHours.isValid, false);
  assert.ok(badHours.errors.hoursPerWeek);

  const neg = validateAnnualSalaryPerHourInput({
    ...createDefaultInput(),
    hourly: '-5',
  });
  assert.equal(neg.isValid, false);
  assert.ok(neg.errors.hourly);
}

console.log('annual-salary-per-hour calculation.test.ts: all assertions passed');
