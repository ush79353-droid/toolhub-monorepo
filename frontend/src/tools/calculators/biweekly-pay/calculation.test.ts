import assert from 'node:assert/strict';
import {
  BIWEEKLY_PERIODS_PER_YEAR,
  calculateBiweeklyPay,
  formatBiweeklyMoney,
} from './calculation';

// Annual → / 26
{
  const r = calculateBiweeklyPay({
    sourceField: 'annual',
    sourceAmount: 1_040_000,
    hoursPerWeek: 40,
    daysPerWeek: 5,
  });
  assert.ok(r);
  assert.equal(r.biweekly, 1_040_000 / BIWEEKLY_PERIODS_PER_YEAR);
  assert.equal(r.biweekly, 40_000);
}

// Monthly → × 12 / 26
{
  const r = calculateBiweeklyPay({
    sourceField: 'monthly',
    sourceAmount: 86_666.66666666667,
    hoursPerWeek: 40,
    daysPerWeek: 5,
  });
  assert.ok(r);
  assert.equal(r.biweekly, (86_666.66666666667 * 12) / 26);
}

// Weekly → × 2
{
  const r = calculateBiweeklyPay({
    sourceField: 'weekly',
    sourceAmount: 20_000,
    hoursPerWeek: 40,
    daysPerWeek: 5,
  });
  assert.ok(r);
  assert.equal(r.biweekly, 40_000);
}

// Daily → × days × 2
{
  const r = calculateBiweeklyPay({
    sourceField: 'daily',
    sourceAmount: 4_000,
    hoursPerWeek: 40,
    daysPerWeek: 5,
  });
  assert.ok(r);
  assert.equal(r.biweekly, 40_000);
}

// Hourly → × hours × 2
{
  const r = calculateBiweeklyPay({
    sourceField: 'hourly',
    sourceAmount: 500,
    hoursPerWeek: 40,
    daysPerWeek: 5,
  });
  assert.ok(r);
  assert.equal(r.biweekly, 40_000);
}

// Zero wage allowed
{
  const r = calculateBiweeklyPay({
    sourceField: 'annual',
    sourceAmount: 0,
    hoursPerWeek: 40,
    daysPerWeek: 5,
  });
  assert.ok(r);
  assert.equal(r.biweekly, 0);
}

// Rejects negative / non-positive schedule / non-finite
assert.equal(
  calculateBiweeklyPay({
    sourceField: 'hourly',
    sourceAmount: -1,
    hoursPerWeek: 40,
    daysPerWeek: 5,
  }),
  null
);
assert.equal(
  calculateBiweeklyPay({
    sourceField: 'hourly',
    sourceAmount: 10,
    hoursPerWeek: 0,
    daysPerWeek: 5,
  }),
  null
);
assert.equal(
  calculateBiweeklyPay({
    sourceField: 'daily',
    sourceAmount: 10,
    hoursPerWeek: 40,
    daysPerWeek: 0,
  }),
  null
);
assert.equal(
  calculateBiweeklyPay({
    sourceField: 'weekly',
    sourceAmount: Number.NaN,
    hoursPerWeek: 40,
    daysPerWeek: 5,
  }),
  null
);

// Display formatter
assert.equal(formatBiweeklyMoney(40000, 'PKR'), '40,000.00');

console.log('biweekly-pay calculation.test.ts: all assertions passed');
