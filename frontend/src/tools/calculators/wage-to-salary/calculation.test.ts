import assert from 'node:assert/strict';
import { calculateWageToSalary, formatWageMoney } from './calculation';

// Hourly source — guide example
{
  const r = calculateWageToSalary({
    sourceField: 'hourly',
    sourceAmount: 500,
    hoursPerWeek: 40,
    daysPerWeek: 5,
  });
  assert.ok(r);
  assert.equal(r.weekly, 20_000);
  assert.equal(r.yearly, 1_040_000);
  assert.equal(r.monthly, 1_040_000 / 12);
  assert.equal(r.hourly, 500);
  assert.equal(r.daily, 4_000);
}

// Daily source
{
  const r = calculateWageToSalary({
    sourceField: 'daily',
    sourceAmount: 4_000,
    hoursPerWeek: 40,
    daysPerWeek: 5,
  });
  assert.ok(r);
  assert.equal(r.weekly, 20_000);
  assert.equal(r.yearly, 1_040_000);
  assert.equal(r.hourly, 500);
}

// Weekly source
{
  const r = calculateWageToSalary({
    sourceField: 'weekly',
    sourceAmount: 20_000,
    hoursPerWeek: 40,
    daysPerWeek: 5,
  });
  assert.ok(r);
  assert.equal(r.weekly, 20_000);
  assert.equal(r.monthly, 20_000 * 52 / 12);
  assert.equal(r.yearly, 20_000 * 52);
}

// Zero wage allowed
{
  const r = calculateWageToSalary({
    sourceField: 'hourly',
    sourceAmount: 0,
    hoursPerWeek: 40,
    daysPerWeek: 5,
  });
  assert.ok(r);
  assert.equal(r.weekly, 0);
  assert.equal(r.monthly, 0);
  assert.equal(r.yearly, 0);
}

// Rejects negative wage / non-positive schedule / non-finite
assert.equal(
  calculateWageToSalary({
    sourceField: 'hourly',
    sourceAmount: -1,
    hoursPerWeek: 40,
    daysPerWeek: 5,
  }),
  null
);
assert.equal(
  calculateWageToSalary({
    sourceField: 'hourly',
    sourceAmount: 10,
    hoursPerWeek: 0,
    daysPerWeek: 5,
  }),
  null
);
assert.equal(
  calculateWageToSalary({
    sourceField: 'daily',
    sourceAmount: 10,
    hoursPerWeek: 40,
    daysPerWeek: 0,
  }),
  null
);
assert.equal(
  calculateWageToSalary({
    sourceField: 'weekly',
    sourceAmount: Number.NaN,
    hoursPerWeek: 40,
    daysPerWeek: 5,
  }),
  null
);

assert.equal(formatWageMoney(86_666.66666666667, 'PKR'), '86,666.67');

console.log('calculation.test.ts: ok');
