import assert from 'node:assert/strict';
import {
  SECONDS_PER_WEEK,
  SECONDS_PER_YEAR,
  WEEKS_PER_YEAR,
  calculateWeeksToYears,
  convertTime,
  shareResultText,
  weeksToDays,
  weeksToMonths,
  weeksToYears,
  yearsToWeeks,
} from './calculation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(SECONDS_PER_WEEK, 604_800);
assert.equal(SECONDS_PER_YEAR, 31_556_952);
assertClose(WEEKS_PER_YEAR, 52.1775, 10);

assertClose(weeksToYears(1), 0.01916535, 7);
assertClose(weeksToYears(20), 0.3833, 4);
assertClose(weeksToYears(50), 0.9583, 4);
assertClose(weeksToYears(72), 1.38, 2);
assertClose(yearsToWeeks(3), 156.5325, 4);
assert.equal(weeksToDays(13), 91);
assert.equal(convertTime(120, 'second', 'minute'), 2);
assert.equal(weeksToYears(0), 0);
assertClose(weeksToMonths(13), 2.99, 2);

const years = weeksToYears(72);
assertClose(yearsToWeeks(years), 72, 10);

const result = calculateWeeksToYears({
  source: 'weeks',
  weeks: 50,
  years: null,
  months: null,
  days: null,
  hours: null,
  minutes: null,
  seconds: null,
  hmsHours: null,
  hmsMinutes: null,
  hmsSeconds: null,
});
assertClose(result.years, 0.9583, 4);
assert.equal(result.days, 350);
assert.match(shareResultText(result), /Weeks to Years Converter/);
assert.match(shareResultText(result), /365\.2425/);

console.log('weeks-to-years calculation.test.ts: ok');
