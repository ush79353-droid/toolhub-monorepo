/**
 * Runnable self-check for Gratuity Calculator formulas.
 * Run: npx --yes tsx src/tools/calculators/gratuity/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  calculateGratuity,
  eligibleServiceYears,
  GRATUITY_DAYS_DIVISOR,
  GRATUITY_DAYS_PER_YEAR,
} from './calculation';
import { createDefaultInput, EXAMPLE_TEN_YEARS } from './types';
import { validateGratuityInput } from './validation';

{
  assert.equal(eligibleServiceYears(5, 0), 5);
  assert.equal(eligibleServiceYears(5, 6), 5); // not in excess of six
  assert.equal(eligibleServiceYears(5, 7), 6);
  assert.equal(eligibleServiceYears(10, 11), 11);
}

{
  const r = calculateGratuity({ salary: 50_000, years: 10, months: 0 });
  assert.ok(r);
  assert.equal(r.qualifies, true);
  assert.equal(r.eligibleYears, 10);
  const expected =
    (50_000 * GRATUITY_DAYS_PER_YEAR * 10) / GRATUITY_DAYS_DIVISOR;
  assert.ok(Math.abs(r.gratuity - expected) < 1e-9);
  assert.ok(Math.abs(r.gratuity - 288_461.5384615385) < 1e-6);
}

{
  // Default screenshot tenure: 5 yrs 0 mos at 100,000.
  const r = calculateGratuity({ salary: 100_000, years: 5, months: 0 });
  assert.ok(r);
  assert.equal(r.qualifies, true);
  assert.equal(r.eligibleYears, 5);
  assert.ok(
    Math.abs(r.gratuity - (100_000 * 15 * 5) / 26) < 1e-9
  );
}

{
  // 4y 7m → eligible years 5 for pay math, but < 60 months → not qualified.
  const r = calculateGratuity({ salary: 50_000, years: 4, months: 7 });
  assert.ok(r);
  assert.equal(r.eligibleYears, 5);
  assert.equal(r.totalServiceMonths, 55);
  assert.equal(r.qualifies, false);
  assert.equal(r.gratuity, 0);
}

{
  // Exactly 60 months qualifies; 5y 7m pays for 6 years.
  const r = calculateGratuity({ salary: 26_000, years: 5, months: 7 });
  assert.ok(r);
  assert.equal(r.qualifies, true);
  assert.equal(r.eligibleYears, 6);
  assert.equal(r.gratuity, (26_000 * 15 * 6) / 26);
}

{
  // Zero salary → zero gratuity when qualified.
  const r = calculateGratuity({ salary: 0, years: 5, months: 0 });
  assert.ok(r);
  assert.equal(r.gratuity, 0);
}

assert.equal(
  calculateGratuity({ salary: -1, years: 5, months: 0 }),
  null
);
assert.equal(
  calculateGratuity({ salary: 100, years: 1.5, months: 0 }),
  null
);
assert.equal(
  calculateGratuity({ salary: Number.NaN, years: 5, months: 0 }),
  null
);

{
  const empty = validateGratuityInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

{
  const ten = validateGratuityInput(EXAMPLE_TEN_YEARS);
  assert.equal(ten.isValid, true);
  assert.ok(ten.result);
  assert.ok(
    Math.abs(ten.result.gratuityCanonical - (50_000 * 15 * 10) / 26) < 1e-6
  );
}

{
  const short = validateGratuityInput({
    ...createDefaultInput(),
    salary: '50000',
    years: '3',
    months: '0',
  });
  assert.equal(short.isValid, true);
  assert.ok(short.result);
  assert.equal(short.result.qualifies, false);
  assert.equal(short.result.gratuityCanonical, 0);
}

{
  const badMonths = validateGratuityInput({
    ...createDefaultInput(),
    salary: '50000',
    years: '5',
    months: '12',
  });
  assert.equal(badMonths.isValid, false);
  assert.ok(badMonths.errors.months);
}

console.log('gratuity calculation.test.ts: all assertions passed');
