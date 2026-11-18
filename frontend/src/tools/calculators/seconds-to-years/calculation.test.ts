import assert from 'node:assert/strict';
import {
  SECONDS_PER_YEAR,
  calculateSecondsToYears,
  secondsToDays,
  secondsToHours,
  secondsToMinutes,
  secondsToMonths,
  secondsToWeeks,
  secondsToYears,
  shareResultText,
  yearsToSeconds,
} from './calculation';
import { parseOptionalNumber, validateSecondsToYears } from './validation';

function assertClose(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(SECONDS_PER_YEAR, 31_556_952);

assert.equal(secondsToYears(31_556_952), 1);
assert.equal(secondsToYears(63_113_904), 2);
assert.equal(secondsToYears(0), 0);
assert.equal(secondsToYears(-31_556_952), -1);

assert.equal(yearsToSeconds(1), 31_556_952);
assert.equal(yearsToSeconds(2), 63_113_904);
assert.equal(yearsToSeconds(0), 0);
assert.equal(yearsToSeconds(0.5), 15_778_476);

assert.equal(secondsToMinutes(60), 1);
assert.equal(secondsToHours(3_600), 1);
assert.equal(secondsToDays(86_400), 1);
assert.equal(secondsToWeeks(604_800), 1);
assertClose(secondsToMonths(31_556_952), 12, 10);

assertClose(secondsToYears(60), 60 / 31_556_952, 10);
assertClose(secondsToYears(1_000_000), 1_000_000 / 31_556_952, 8);
assert.equal(yearsToSeconds(10), 315_569_520);
assert.equal(yearsToSeconds(100), 3_155_695_200);

{
  const result = calculateSecondsToYears({
    source: 'seconds',
    seconds: 31_556_952,
    years: null,
    months: null,
    weeks: null,
    days: null,
    hours: null,
    minutes: null,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  });
  assert.equal(result.years, 1);
  assertClose(result.months, 12, 10);
  assert.match(shareResultText(result), /Seconds to Years Conversion/);
}

{
  const result = calculateSecondsToYears({
    source: 'hms',
    seconds: null,
    years: null,
    months: null,
    weeks: null,
    days: null,
    hours: null,
    minutes: null,
    hmsHours: 2,
    hmsMinutes: 30,
    hmsSeconds: 0,
  });
  assert.equal(result.seconds, 9_000);
}

assert.throws(() => secondsToYears(Number.NaN));
assert.equal(parseOptionalNumber(''), null);
assert.ok(
  validateSecondsToYears({
    source: 'years',
    seconds: null,
    years: 1,
    months: null,
    weeks: null,
    days: null,
    hours: null,
    minutes: null,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  }).isValid,
);
assert.ok(
  validateSecondsToYears({
    source: 'seconds',
    seconds: -60,
    years: null,
    months: null,
    weeks: null,
    days: null,
    hours: null,
    minutes: null,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  }).isValid,
);

console.log('seconds-to-years calculation.test.ts: ok');
