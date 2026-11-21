import assert from 'node:assert/strict';
import {
  SEMI_MONTHLY_PERIODS_PER_YEAR,
  calculateSemiMonthlyPay,
  formatSemiMonthlyMoney,
} from './calculation';
import { createExampleInput } from './types';
import { validateSemiMonthlyPayInput } from './validation';

assert.equal(SEMI_MONTHLY_PERIODS_PER_YEAR, 24);

{
  const r = calculateSemiMonthlyPay({
    sourceField: 'hourly',
    sourceAmount: 500,
    hoursPerWeek: 40,
    daysPerWeek: 5,
  });
  assert.ok(r);
  assert.equal(r.weekly, 20_000);
  assert.equal(r.daily, 4_000);
  assert.equal(r.yearly, 1_040_000);
  assert.equal(r.monthly, 1_040_000 / 12);
  assert.equal(r.semiMonthly, 1_040_000 / 24);
  assert.equal(Number(r.semiMonthly.toFixed(2)), 43333.33);
}

{
  const r = calculateSemiMonthlyPay({
    sourceField: 'yearly',
    sourceAmount: 1_040_000,
    hoursPerWeek: 40,
    daysPerWeek: 5,
  });
  assert.ok(r);
  assert.equal(r.semiMonthly, 1_040_000 / 24);
  assert.equal(r.hourly, 500);
}

{
  const r = calculateSemiMonthlyPay({
    sourceField: 'monthly',
    sourceAmount: 86_666.66666666667,
    hoursPerWeek: 40,
    daysPerWeek: 5,
  });
  assert.ok(r);
  assert.ok(Math.abs(r.semiMonthly - 43_333.33333333333) < 1e-6);
}

{
  const r = calculateSemiMonthlyPay({
    sourceField: 'hourly',
    sourceAmount: 0,
    hoursPerWeek: 40,
    daysPerWeek: 5,
  });
  assert.ok(r);
  assert.equal(r.semiMonthly, 0);
}

assert.equal(
  calculateSemiMonthlyPay({
    sourceField: 'hourly',
    sourceAmount: -1,
    hoursPerWeek: 40,
    daysPerWeek: 5,
  }),
  null,
);
assert.equal(
  calculateSemiMonthlyPay({
    sourceField: 'hourly',
    sourceAmount: 10,
    hoursPerWeek: 0,
    daysPerWeek: 5,
  }),
  null,
);
assert.equal(
  calculateSemiMonthlyPay({
    sourceField: 'daily',
    sourceAmount: 10,
    hoursPerWeek: 40,
    daysPerWeek: 8,
  }),
  null,
);

assert.equal(formatSemiMonthlyMoney(43333.3333, 'PKR'), '43,333.33');

{
  const sameFx = validateSemiMonthlyPayInput(createExampleInput(), null);
  assert.equal(sameFx.isValid, true);
  assert.equal(sameFx.result?.semiMonthlyCanonical, 1_040_000 / 24);
  assert.equal(Number(sameFx.result!.semiMonthly.toFixed(2)), 43333.33);
}

console.log('semi-monthly-pay calculation.test.ts: all assertions passed');
