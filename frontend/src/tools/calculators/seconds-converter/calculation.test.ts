import assert from 'node:assert/strict';
import {
  SECONDS_PER_GREGORIAN_MONTH,
  SECONDS_PER_GREGORIAN_YEAR,
  TIME_UNIT_SECONDS,
  calculateSecondsConverter,
  convertTime,
  secondsToHMS,
  shareResultText,
} from './calculation';
import { parseOptionalNumber, validateSecondsConverter } from './validation';

function close(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(TIME_UNIT_SECONDS.sec, 1);
assert.equal(TIME_UNIT_SECONDS.min, 60);
assert.equal(TIME_UNIT_SECONDS.hrs, 3600);
assert.equal(TIME_UNIT_SECONDS.days, 86_400);
assert.equal(TIME_UNIT_SECONDS.wks, 604_800);
assert.equal(TIME_UNIT_SECONDS.mos, 2_629_746);
assert.equal(TIME_UNIT_SECONDS.yrs, 31_556_952);
assert.equal(SECONDS_PER_GREGORIAN_YEAR, 31_556_952);
assert.equal(SECONDS_PER_GREGORIAN_MONTH, 2_629_746);

assert.equal(convertTime(60, 'sec', 'min'), 1);
assert.equal(convertTime(3600, 'sec', 'hrs'), 1);
assert.equal(convertTime(86_400, 'sec', 'days'), 1);
assert.equal(convertTime(604_800, 'sec', 'wks'), 1);
assert.equal(convertTime(31_556_952, 'sec', 'yrs'), 1);
assert.equal(convertTime(2_629_746, 'sec', 'mos'), 1);
assert.equal(convertTime(1, 'sec', 'ms'), 1000);
assert.equal(convertTime(90, 'sec', 'min'), 1.5);
assert.equal(convertTime(2, 'hrs', 'sec'), 7200);
assert.equal(convertTime(-60, 'sec', 'min'), -1);

{
  const hms = secondsToHMS(3665);
  assert.equal(hms.hours, 1);
  assert.equal(hms.minutes, 1);
  assert.equal(hms.seconds, 5);
}

{
  const hms = secondsToHMS(90.5);
  assert.equal(hms.hours, 0);
  assert.equal(hms.minutes, 1);
  close(hms.seconds, 30.5, 10);
}

{
  const result = calculateSecondsConverter({
    source: 'seconds',
    seconds: 3600,
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
  assert.equal(result.hours, 1);
  assert.equal(result.minutes, 60);
  close(result.days, 3600 / 86_400, 12);
  assert.match(shareResultText(result), /Seconds Converter/);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  validateSecondsConverter({
    source: 'seconds',
    seconds: 0,
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
assert.ok(
  !validateSecondsConverter({
    source: 'seconds',
    seconds: null,
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

console.log('seconds-converter calculation.test.ts: ok');
