import assert from 'node:assert/strict';
import {
  SECONDS_PER_MONTH,
  SECONDS_PER_WEEK,
  SECONDS_PER_YEAR,
  WEEKS_PER_MONTH,
  convertTime,
  monthsToWeeks,
  shareResultText,
  weeksToDays,
  weeksToHours,
  weeksToMonths,
  calculateWeeksToMonths,
} from './calculation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(SECONDS_PER_WEEK, 604_800);
assert.equal(SECONDS_PER_MONTH, 2_629_746);
assert.equal(SECONDS_PER_YEAR, 31_556_952);
assertClose(WEEKS_PER_MONTH, 4.348125, 12);

assertClose(weeksToMonths(1), 0.229984, 5);
assertClose(weeksToMonths(13), 2.99, 2);
assertClose(weeksToMonths(6), 1.38, 2);
assertClose(weeksToMonths(14), 3.22, 2);
assertClose(monthsToWeeks(6), 26.09, 2);
assert.equal(weeksToDays(13), 91);
assert.equal(weeksToHours(1), 168);
assert.equal(weeksToMonths(0), 0);
assert.equal(convertTime(120, 'second', 'minute'), 2);

const months = weeksToMonths(13);
assertClose(monthsToWeeks(months), 13, 10);

const result = calculateWeeksToMonths({
  source: 'weeks',
  weeks: 13,
  months: null,
  years: null,
  days: null,
  hours: null,
  minutes: null,
  seconds: null,
  hmsHours: null,
  hmsMinutes: null,
  hmsSeconds: null,
});
assertClose(result.months, 2.99, 2);
assert.equal(result.days, 91);
assert.match(shareResultText(result), /Weeks to Months Calculator/);
assert.match(shareResultText(result), /Average Gregorian month/);

console.log('weeks-to-months calculation.test.ts: ok');
