/**
 * Rate of Pay Calculator — pure engine self-check.
 * Run: npx --yes tsx src/tools/calculators/rate-of-pay/calculation.test.ts
 */
import assert from 'node:assert/strict';
import { calculateRateOfPay } from './calculation';

function approx(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

// Hourly 500 · 40h → weekly 20k · annual 1.04M · monthly ≈ 86666.67 · biweekly 40k · daily 4k
{
  const r = calculateRateOfPay({
    hoursPerWeek: 40,
    sourceField: 'hourly',
    sourceAmount: 500,
  });
  assert.ok(r);
  approx(r!.hourly, 500);
  approx(r!.weekly, 20_000);
  approx(r!.annual, 1_040_000);
  approx(r!.monthly, 1_040_000 / 12);
  approx(r!.biweekly, 40_000);
  approx(r!.daily, 4_000);
  approx(r!.annualHours, 2080);
}

// Reverse from annual
{
  const r = calculateRateOfPay({
    hoursPerWeek: 40,
    sourceField: 'annual',
    sourceAmount: 1_040_000,
  });
  assert.ok(r);
  approx(r!.hourly, 500);
  approx(r!.weekly, 20_000);
}

// Reverse from monthly
{
  const r = calculateRateOfPay({
    hoursPerWeek: 40,
    sourceField: 'monthly',
    sourceAmount: 1_040_000 / 12,
  });
  assert.ok(r);
  approx(r!.hourly, 500);
}

// Reverse from biweekly / weekly / daily
{
  const fromBi = calculateRateOfPay({
    hoursPerWeek: 40,
    sourceField: 'biweekly',
    sourceAmount: 40_000,
  });
  assert.ok(fromBi);
  approx(fromBi!.hourly, 500);

  const fromWeek = calculateRateOfPay({
    hoursPerWeek: 40,
    sourceField: 'weekly',
    sourceAmount: 20_000,
  });
  assert.ok(fromWeek);
  approx(fromWeek!.hourly, 500);

  const fromDay = calculateRateOfPay({
    hoursPerWeek: 40,
    sourceField: 'daily',
    sourceAmount: 4_000,
  });
  assert.ok(fromDay);
  approx(fromDay!.hourly, 500);
}

// Zero wage allowed
{
  const r = calculateRateOfPay({
    hoursPerWeek: 40,
    sourceField: 'hourly',
    sourceAmount: 0,
  });
  assert.ok(r);
  approx(r!.annual, 0);
}

// Reject non-positive hours / negative wage / non-finite
assert.equal(
  calculateRateOfPay({
    hoursPerWeek: 0,
    sourceField: 'hourly',
    sourceAmount: 500,
  }),
  null
);
assert.equal(
  calculateRateOfPay({
    hoursPerWeek: 40,
    sourceField: 'hourly',
    sourceAmount: -1,
  }),
  null
);
assert.equal(
  calculateRateOfPay({
    hoursPerWeek: Number.NaN,
    sourceField: 'hourly',
    sourceAmount: 500,
  }),
  null
);

console.log('rate-of-pay calculation.test.ts: all assertions passed');
