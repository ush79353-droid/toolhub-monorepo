/**
 * Run: npx --yes tsx src/tools/calculators/hourly-to-salary-wage/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  calculateWageFromSource,
  formatWageMoney,
  WEEKS_PER_YEAR,
  WORKDAYS_PER_WEEK,
} from './calculation';
import { validateHourlyToSalaryWageInput } from './validation';
import { createDefaultInput } from './types';

// Hourly 500 · 40h → annual 1,040,000; weekly 20,000; biweekly 40,000; daily 4,000
{
  const out = calculateWageFromSource({
    hoursPerWeek: 40,
    sourceField: 'hourly',
    sourceAmount: 500,
  });
  assert.ok(out);
  assert.equal(out.annualHours, 40 * WEEKS_PER_YEAR);
  assert.equal(out.annual, 1_040_000);
  assert.equal(out.weekly, 20_000);
  assert.equal(out.biweekly, 40_000);
  assert.equal(out.daily, 4_000);
  assert.ok(Math.abs(out.monthly - 1_040_000 / 12) < 1e-9);
  assert.equal(out.hourly, 500);
  assert.equal(out.daily, out.weekly / WORKDAYS_PER_WEEK);
}

// Annual → reverse to hourly
{
  const out = calculateWageFromSource({
    hoursPerWeek: 40,
    sourceField: 'annual',
    sourceAmount: 1_040_000,
  });
  assert.ok(out);
  assert.equal(out.hourly, 500);
  assert.equal(out.weekly, 20_000);
  assert.equal(out.biweekly, 40_000);
  assert.equal(out.daily, 4_000);
}

// Zero wage allowed
{
  const out = calculateWageFromSource({
    hoursPerWeek: 40,
    sourceField: 'hourly',
    sourceAmount: 0,
  });
  assert.ok(out);
  assert.equal(out.annual, 0);
  assert.equal(out.biweekly, 0);
  assert.equal(out.daily, 0);
}

// Reject non-positive hours / negative wage
{
  assert.equal(
    calculateWageFromSource({
      hoursPerWeek: 0,
      sourceField: 'hourly',
      sourceAmount: 10,
    }),
    null
  );
  assert.equal(
    calculateWageFromSource({
      hoursPerWeek: 40,
      sourceField: 'annual',
      sourceAmount: -1,
    }),
    null
  );
}

assert.equal(formatWageMoney(1_040_000, 'PKR'), '1,040,000.00');
assert.equal(formatWageMoney(0, 'PKR'), '0.00');

{
  const empty = validateHourlyToSalaryWageInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);

  const fromHourly = validateHourlyToSalaryWageInput({
    ...createDefaultInput(),
    hourlyWage: '500',
    sourceField: 'hourly',
  });
  assert.equal(fromHourly.isValid, true);
  assert.ok(fromHourly.result);
  assert.equal(fromHourly.result.formattedAnnual, '1,040,000.00');
  assert.equal(fromHourly.result.formattedWeekly, '20,000.00');
  assert.equal(fromHourly.result.formattedBiweekly, '40,000.00');
  assert.equal(fromHourly.result.formattedDaily, '4,000.00');

  const fromAnnual = validateHourlyToSalaryWageInput({
    ...createDefaultInput(),
    sourceField: 'annual',
    annualSalary: '1040000',
  });
  assert.equal(fromAnnual.isValid, true);
  assert.ok(fromAnnual.result);
  assert.equal(fromAnnual.result.formattedHourly, '500.00');
  assert.equal(fromAnnual.result.formattedBiweekly, '40,000.00');

  const badHours = validateHourlyToSalaryWageInput({
    ...createDefaultInput(),
    hoursPerWeek: '0',
    hourlyWage: '10',
  });
  assert.equal(badHours.isValid, false);
  assert.ok(badHours.errors.hoursPerWeek);

  const neg = validateHourlyToSalaryWageInput({
    ...createDefaultInput(),
    hourlyWage: '-5',
  });
  assert.equal(neg.isValid, false);
  assert.ok(neg.errors.hourlyWage);
}

console.log('hourly-to-salary-wage calculation.test.ts: all assertions passed');
