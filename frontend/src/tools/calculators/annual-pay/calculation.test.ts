import assert from 'node:assert/strict';
import { calculateAnnualPay } from './calculation';

{
  const result = calculateAnnualPay({
    hourlyWage: 500,
    hoursPerWeek: 40,
    weeksPerYear: 52,
    taxPercent: 12,
  });
  assert.ok(result);
  assert.equal(result.annualPay, 1_040_000);
  assert.equal(result.netHourly, 440);
  assert.equal(result.netAnnual, 915_200);
}

{
  const result = calculateAnnualPay({
    hourlyWage: 0,
    hoursPerWeek: 40,
    weeksPerYear: 0,
    taxPercent: 0,
  });
  assert.ok(result);
  assert.equal(result.annualPay, 0);
  assert.equal(result.netHourly, 0);
  assert.equal(result.netAnnual, 0);
}

{
  assert.equal(
    calculateAnnualPay({
      hourlyWage: 10,
      hoursPerWeek: 40,
      weeksPerYear: 53,
      taxPercent: 0,
    }),
    null
  );
}

{
  assert.equal(
    calculateAnnualPay({
      hourlyWage: 10,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      taxPercent: 100.1,
    }),
    null
  );
}

console.log('annual-pay calculation.test.ts: all assertions passed');