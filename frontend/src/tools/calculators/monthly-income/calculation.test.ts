import assert from 'node:assert/strict';
import { calculateMonthlyIncome, formatMonthlyIncomeMoney } from './calculation';

{
  const r = calculateMonthlyIncome({
    sourceField: 'hourly',
    sourceAmount: 500,
    hoursPerDay: 8,
    daysPerWeek: 5,
    weeksPerYear: 52,
  });
  assert.ok(r);
  assert.equal(r.daily, 4_000);
  assert.equal(r.weekly, 20_000);
  assert.equal(r.yearly, 1_040_000);
  assert.equal(r.monthly, 1_040_000 / 12);
}

{
  const r = calculateMonthlyIncome({
    sourceField: 'yearly',
    sourceAmount: 1_040_000,
    hoursPerDay: 8,
    daysPerWeek: 5,
    weeksPerYear: 52,
  });
  assert.ok(r);
  assert.equal(r.hourly, 500);
  assert.equal(r.monthly, 1_040_000 / 12);
}

assert.equal(
  calculateMonthlyIncome({
    sourceField: 'hourly',
    sourceAmount: -1,
    hoursPerDay: 8,
    daysPerWeek: 5,
    weeksPerYear: 52,
  }),
  null
);
assert.equal(formatMonthlyIncomeMoney(86_666.66666666667, 'PKR'), '86,666.67');
console.log('calculation.test.ts: ok');
