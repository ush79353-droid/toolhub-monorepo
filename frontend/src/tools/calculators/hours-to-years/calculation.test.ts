import assert from 'node:assert/strict';
import {
  calculateHoursToYears,
  convertTime,
  hmsToSeconds,
  hoursToYears,
  normalizeHms,
  shareResultText,
  yearsToHours,
} from './calculation';
import { HOURS_PER_GREGORIAN_YEAR } from './types';
import { parseOptionalNumber, validateHoursToYears } from './validation';

function assertClose(actual: number, expected: number, digits = 9): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(HOURS_PER_GREGORIAN_YEAR, 8765.82);
assert.equal(hoursToYears(0), 0);
assert.equal(hoursToYears(HOURS_PER_GREGORIAN_YEAR), 1);
assert.equal(hoursToYears(2 * HOURS_PER_GREGORIAN_YEAR), 2);
assertClose(hoursToYears(50_000), 50_000 / HOURS_PER_GREGORIAN_YEAR, 10);
assertClose(hoursToYears(24), 24 / HOURS_PER_GREGORIAN_YEAR, 12);

assert.equal(yearsToHours(1), HOURS_PER_GREGORIAN_YEAR);
assert.equal(yearsToHours(2), 17_531.64);
assert.equal(yearsToHours(5), 43_829.1);

assert.equal(convertTime(24, 'HOUR', 'DAY'), 1);
assert.equal(convertTime(168, 'HOUR', 'WEEK'), 1);
assert.equal(convertTime(365.2425, 'DAY', 'YEAR'), 1);
assert.equal(convertTime(12, 'MONTH', 'YEAR'), 1);
assert.equal(convertTime(31_556_952, 'SECOND', 'YEAR'), 1);
assert.equal(convertTime(60, 'MINUTE', 'HOUR'), 1);
assert.equal(convertTime(3600, 'SECOND', 'HOUR'), 1);

assert.equal(hmsToSeconds(10, 30, 15), 37_815);

{
  const n = normalizeHms(1, 60, 0);
  assert.equal(n.hours, 2);
  assert.equal(n.minutes, 0);
  assert.equal(n.seconds, 0);
}

assert.throws(() => hoursToYears(-1));
assert.throws(() => yearsToHours(-2));

{
  const result = calculateHoursToYears({
    source: 'hours',
    hours: HOURS_PER_GREGORIAN_YEAR,
    years: null,
    months: null,
    weeks: null,
    days: null,
    minutes: null,
    seconds: null,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  });
  assert.equal(result.years, 1);
  assert.equal(result.months, 12);
  assert.equal(result.days, 365.2425);
  assert.equal(result.minutes, 525_949.2);
  assert.equal(result.seconds, 31_556_952);
  assert.match(shareResultText(result), /Hours to Years Converter/);
}

{
  const result = calculateHoursToYears({
    source: 'years',
    hours: null,
    years: 2,
    months: null,
    weeks: null,
    days: null,
    minutes: null,
    seconds: null,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  });
  assert.equal(result.hours, 17_531.64);
  assert.equal(result.days, 730.485);
  assert.equal(result.months, 24);
  assert.equal(result.minutes, 1_051_898.4);
}

{
  const result = calculateHoursToYears({
    source: 'seconds',
    hours: null,
    years: null,
    months: null,
    weeks: null,
    days: null,
    minutes: null,
    seconds: 31_556_952,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  });
  assert.equal(result.years, 1);
  assert.equal(result.hours, HOURS_PER_GREGORIAN_YEAR);
}

{
  const result = calculateHoursToYears({
    source: 'hms',
    hours: null,
    years: null,
    months: null,
    weeks: null,
    days: null,
    minutes: null,
    seconds: null,
    hmsHours: 10,
    hmsMinutes: 30,
    hmsSeconds: 15,
  });
  assert.equal(result.seconds, 37_815);
  assertClose(result.hours, 10.5041666667, 9);
  assertClose(result.years, 37_815 / 31_556_952, 12);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  validateHoursToYears({
    source: 'hours',
    hours: 0,
    years: null,
    months: null,
    weeks: null,
    days: null,
    minutes: null,
    seconds: null,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  }).isValid,
);
assert.ok(
  !validateHoursToYears({
    source: 'years',
    hours: null,
    years: -1,
    months: null,
    weeks: null,
    days: null,
    minutes: null,
    seconds: null,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  }).isValid,
);

console.log('hours-to-years calculation.test.ts: ok');
