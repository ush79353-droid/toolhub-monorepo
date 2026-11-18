import assert from 'node:assert/strict';
import {
  MONTHS_PER_YEAR,
  calculateMonthsToYears,
  monthsToYears,
  monthsToYearsMonths,
  normalizeYearsMonths,
  shareResultText,
  yearsMonthsToMonths,
  yearsToMonths,
} from './calculation';

function assertClose(actual: number, expected: number, digits = 12): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(MONTHS_PER_YEAR, 12);

assert.equal(monthsToYears(0), 0);
assertClose(monthsToYears(1), 1 / 12);
assert.equal(monthsToYears(3), 0.25);
assert.equal(monthsToYears(6), 0.5);
assert.equal(monthsToYears(9), 0.75);
assert.equal(monthsToYears(12), 1);
assert.equal(monthsToYears(18), 1.5);
assert.equal(monthsToYears(24), 2);
assert.equal(monthsToYears(30), 2.5);
assert.equal(monthsToYears(42), 3.5);
assert.equal(monthsToYears(48), 4);
assert.equal(monthsToYears(60), 5);
assert.equal(monthsToYears(120), 10);

assert.equal(yearsToMonths(4.25), 51);

assert.deepEqual(monthsToYearsMonths(14), { years: 1, months: 2 });
assert.deepEqual(monthsToYearsMonths(18), { years: 1, months: 6 });
assert.deepEqual(monthsToYearsMonths(26), { years: 2, months: 2 });
assert.deepEqual(monthsToYearsMonths(42), { years: 3, months: 6 });
assert.deepEqual(monthsToYearsMonths(51), { years: 4, months: 3 });
assert.deepEqual(monthsToYearsMonths(120), { years: 10, months: 0 });

assert.equal(yearsMonthsToMonths(2, 15), 39);
assert.deepEqual(normalizeYearsMonths(2, 15), { years: 3, months: 3 });

{
  const result = calculateMonthsToYears({
    source: 'yearsMonths',
    months: null,
    years: null,
    yearsPart: 2,
    monthsPart: 15,
  });
  assert.equal(result.months, 39);
  assert.equal(result.years, 3.25);
  assert.equal(result.yearsPart, 3);
  assert.equal(result.monthsPart, 3);
}

assert.match(
  shareResultText(calculateMonthsToYears({ source: 'months', months: 42, years: null, yearsPart: null, monthsPart: null })),
  /Months to Years Calculator/,
);
assert.match(
  shareResultText(calculateMonthsToYears({ source: 'months', months: 42, years: null, yearsPart: null, monthsPart: null })),
  /42 months = 3.5 years/,
);
assert.match(
  shareResultText(calculateMonthsToYears({ source: 'months', months: 42, years: null, yearsPart: null, monthsPart: null })),
  /\/tools\/months-to-years-calculator/,
);

console.log('months-to-years calculation.test.ts: ok');
