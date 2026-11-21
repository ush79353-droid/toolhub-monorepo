/**
 * Assert self-check for Wage Calculator.
 * Run: npx --yes tsx src/tools/calculators/wage/calculation.test.ts
 */
import assert from 'node:assert/strict';
import { calculateWagePeriods } from './calculation';
import { createDefaultInput } from './types';
import { validateWageCalculatorInput } from './validation';

// Hourly 500 · 40h → weekly 20,000; annual 1,040,000; daily 4,000; biweekly 40,000
{
  const out = calculateWagePeriods({
    hoursPerWeek: 40,
    sourceField: 'hourly',
    sourceAmount: 500,
  });
  assert.ok(out);
  assert.equal(out.hourly, 500);
  assert.equal(out.weekly, 20_000);
  assert.equal(out.annual, 1_040_000);
  assert.equal(out.biweekly, 40_000);
  assert.equal(out.daily, 4_000);
  assert.equal(out.monthly, 1_040_000 / 12);
  assert.equal(out.perMinute, 500 / 60);
  assert.equal(out.perSecond, 500 / 3600);
  assert.equal(out.annualHours, 2080);
}

// Annual source reverses to same hourly
{
  const out = calculateWagePeriods({
    hoursPerWeek: 40,
    sourceField: 'annual',
    sourceAmount: 1_040_000,
  });
  assert.ok(out);
  assert.equal(out.hourly, 500);
  assert.equal(out.weekly, 20_000);
}

// Per-second source
{
  const out = calculateWagePeriods({
    hoursPerWeek: 40,
    sourceField: 'perSecond',
    sourceAmount: 500 / 3600,
  });
  assert.ok(out);
  assert.ok(Math.abs(out.hourly - 500) < 1e-9);
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
  assert.equal(out.perSecond, 0);
}

// Invalid hours
{
  assert.equal(
    calculateWagePeriods({
      hoursPerWeek: 0,
      sourceField: 'hourly',
      sourceAmount: 500,
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

// Validation: incomplete blank source
{
  const input = createDefaultInput();
  const v = validateWageCalculatorInput(input, null);
  assert.equal(v.isValid, false);
  assert.equal(v.result, null);
}

// Validation: bad hours
{
  const input = createDefaultInput();
  input.hoursPerWeek = '0';
  input.hourly = '500';
  const v = validateWageCalculatorInput(input, null);
  assert.ok(v.errors.hoursPerWeek);
  assert.equal(v.isValid, false);
}

// Validation: happy path same-currency (no FX needed)
{
  const input = createDefaultInput();
  input.hourly = '500';
  const v = validateWageCalculatorInput(input, null);
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  assert.equal(v.result.weeklyCanonical, 20_000);
  assert.equal(v.result.annualCanonical, 1_040_000);
}

console.log('wage calculation.self-check: ok');
