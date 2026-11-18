import assert from 'node:assert/strict';
import {
  calculateHour,
  convertTime,
  hmsToSeconds,
  normalizeHms,
  shareResultText,
  toSeconds,
} from './calculation';
import {
  HOURS_PER_GREGORIAN_MONTH,
  HOURS_PER_GREGORIAN_YEAR,
  TIME_CONSTANTS,
} from './types';
import { parseOptionalNumber, validateHour } from './validation';

function assertClose(actual: number, expected: number, digits = 9): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(convertTime(1, 'HOUR', 'MINUTE'), 60);
assert.equal(convertTime(1, 'HOUR', 'SECOND'), 3600);
assert.equal(convertTime(24, 'HOUR', 'DAY'), 1);
assert.equal(convertTime(168, 'HOUR', 'WEEK'), 1);
assert.equal(convertTime(2, 'HOUR', 'MINUTE'), 120);
assert.equal(convertTime(2.5, 'HOUR', 'MINUTE'), 150);
assert.equal(convertTime(0.5, 'HOUR', 'MINUTE'), 30);
assert.equal(convertTime(90, 'MINUTE', 'HOUR'), 1.5);
assert.equal(convertTime(7200, 'SECOND', 'HOUR'), 2);
assert.equal(convertTime(48, 'HOUR', 'DAY'), 2);

assertClose(convertTime(1, 'YEAR', 'HOUR'), HOURS_PER_GREGORIAN_YEAR, 8);
assertClose(convertTime(1, 'MONTH', 'HOUR'), HOURS_PER_GREGORIAN_MONTH, 8);
assert.equal(HOURS_PER_GREGORIAN_YEAR, 8765.82);
assert.equal(HOURS_PER_GREGORIAN_MONTH, 730.485);
assert.equal(TIME_CONSTANTS.YEAR, 31_556_952);
assert.equal(TIME_CONSTANTS.MONTH, 2_629_746);

assert.equal(hmsToSeconds(2, 30, 45), 9045);
{
  const n = normalizeHms(1, 75, 90);
  assert.equal(n.hours, 2);
  assert.equal(n.minutes, 16);
  assert.equal(n.seconds, 30);
}
{
  const n = normalizeHms(0, 120, 0);
  assert.equal(n.hours, 2);
  assert.equal(n.minutes, 0);
  assert.equal(n.seconds, 0);
}
{
  const n = normalizeHms(0, 0, 3600);
  assert.equal(n.hours, 1);
  assert.equal(n.minutes, 0);
  assert.equal(n.seconds, 0);
}
{
  const n = normalizeHms(50, 0, 0);
  assert.equal(n.hours, 50);
  assert.equal(n.minutes, 0);
  assert.equal(n.seconds, 0);
}

assert.throws(() => convertTime(-1, 'HOUR', 'MINUTE'));
assert.throws(() => hmsToSeconds(-1, 0, 0));

{
  const result = calculateHour({
    source: 'hours',
    hours: 2,
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
  assert.equal(result.minutes, 120);
  assert.equal(result.seconds, 7200);
  assertClose(result.days, 2 / 24, 10);
  assert.equal(result.combined.hours, 2);
  assert.equal(result.combined.minutes, 0);
  assert.equal(result.combined.seconds, 0);
  assert.match(shareResultText(result), /Hour Converter/);
}

{
  const result = calculateHour({
    source: 'hms',
    hours: null,
    years: null,
    months: null,
    weeks: null,
    days: null,
    minutes: null,
    seconds: null,
    hmsHours: 2,
    hmsMinutes: 30,
    hmsSeconds: 45,
  });
  assert.equal(result.seconds, 9045);
  assertClose(result.hours, 2.5125, 10);
}

assert.equal(toSeconds(1, 'WEEK'), 604_800);
assert.equal(parseOptionalNumber(''), null);
assert.ok(
  validateHour({
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
  !validateHour({
    source: 'hours',
    hours: -2,
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

console.log('hour-converter calculation.test.ts: ok');
