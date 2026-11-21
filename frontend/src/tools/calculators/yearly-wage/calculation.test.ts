import assert from 'node:assert/strict';
import { calculateYearlyWage } from './calculation';

// Prompt example path: 500 × 40 × 52 · 12% tax
{
  const result = calculateYearlyWage({
    hourlyWage: 500,
    hoursPerWeek: 40,
    weeksPerYear: 52,
    taxPercent: 12,
  });
  assert.ok(result);
  assert.equal(result.yearlyWage, 1_040_000);
  assert.equal(result.netHourly, 440);
  assert.equal(result.netYearly, 915_200);
}

// Zero wage / zero tax / zero weeks allowed
{
  const result = calculateYearlyWage({
    hourlyWage: 0,
    hoursPerWeek: 40,
    weeksPerYear: 0,
    taxPercent: 0,
  });
  assert.ok(result);
  assert.equal(result.yearlyWage, 0);
  assert.equal(result.netHourly, 0);
  assert.equal(result.netYearly, 0);
}

// Weeks above 52 rejected
{
  assert.equal(
    calculateYearlyWage({
      hourlyWage: 10,
      hoursPerWeek: 40,
      weeksPerYear: 53,
      taxPercent: 0,
    }),
    null
  );
}

// Tax above 100 rejected
{
  assert.equal(
    calculateYearlyWage({
      hourlyWage: 10,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      taxPercent: 100.1,
    }),
    null
  );
}

console.log('yearly-wage calculation.test.ts: all assertions passed');
