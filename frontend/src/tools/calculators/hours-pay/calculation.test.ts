import assert from 'node:assert/strict';
import { calculateHoursPay, formatHoursPayMoney } from './calculation';

// Daily source — 8h/day · 5d/week · 52w
{
  const r = calculateHoursPay({
    sourceField: 'daily',
    sourceAmount: 4_000,
    hoursPerDay: 8,
    daysPerWeek: 5,
    weeksPerYear: 52,
  });
  assert.ok(r);
  assert.equal(r.daily, 4_000);
  assert.equal(r.weekly, 20_000);
  assert.equal(r.annual, 1_040_000);
  assert.equal(r.monthly, 1_040_000 / 12);
  assert.equal(r.hourly, 500);
}

// Weekly source
{
  const r = calculateHoursPay({
    sourceField: 'weekly',
    sourceAmount: 20_000,
    hoursPerDay: 8,
    daysPerWeek: 5,
    weeksPerYear: 52,
  });
  assert.ok(r);
  assert.equal(r.daily, 4_000);
  assert.equal(r.annual, 1_040_000);
  assert.equal(r.hourly, 500);
}

// Monthly source
{
  const r = calculateHoursPay({
    sourceField: 'monthly',
    sourceAmount: 1_040_000 / 12,
    hoursPerDay: 8,
    daysPerWeek: 5,
    weeksPerYear: 52,
  });
  assert.ok(r);
  assert.equal(r.annual, 1_040_000);
  assert.equal(r.weekly, 20_000);
  assert.equal(r.hourly, 500);
}

// Annual source
{
  const r = calculateHoursPay({
    sourceField: 'annual',
    sourceAmount: 1_040_000,
    hoursPerDay: 8,
    daysPerWeek: 5,
    weeksPerYear: 52,
  });
  assert.ok(r);
  assert.equal(r.monthly, 1_040_000 / 12);
  assert.equal(r.weekly, 20_000);
  assert.equal(r.daily, 4_000);
  assert.equal(r.hourly, 500);
}

// Zero pay allowed
{
  const r = calculateHoursPay({
    sourceField: 'daily',
    sourceAmount: 0,
    hoursPerDay: 8,
    daysPerWeek: 5,
    weeksPerYear: 52,
  });
  assert.ok(r);
  assert.equal(r.hourly, 0);
  assert.equal(r.annual, 0);
}

// Rejects negative / non-positive schedule / non-finite
assert.equal(
  calculateHoursPay({
    sourceField: 'daily',
    sourceAmount: -1,
    hoursPerDay: 8,
    daysPerWeek: 5,
    weeksPerYear: 52,
  }),
  null
);
assert.equal(
  calculateHoursPay({
    sourceField: 'daily',
    sourceAmount: 100,
    hoursPerDay: 0,
    daysPerWeek: 5,
    weeksPerYear: 52,
  }),
  null
);
assert.equal(
  calculateHoursPay({
    sourceField: 'weekly',
    sourceAmount: 100,
    hoursPerDay: 8,
    daysPerWeek: 0,
    weeksPerYear: 52,
  }),
  null
);
assert.equal(
  calculateHoursPay({
    sourceField: 'annual',
    sourceAmount: Number.NaN,
    hoursPerDay: 8,
    daysPerWeek: 5,
    weeksPerYear: 52,
  }),
  null
);

// Fractional hours/day still produce finite hourly wage
{
  const r = calculateHoursPay({
    sourceField: 'daily',
    sourceAmount: 450,
    hoursPerDay: 7.5,
    daysPerWeek: 5,
    weeksPerYear: 52,
  });
  assert.ok(r);
  assert.equal(r.hourly, 60);
  assert.equal(r.weekly, 2_250);
  assert.equal(r.annual, 117_000);
}

assert.equal(formatHoursPayMoney(500, 'PKR'), '500.00');

console.log('calculation.test.ts: ok');
