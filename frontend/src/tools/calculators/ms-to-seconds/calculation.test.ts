import assert from 'node:assert/strict';
import {
  calculateMsToSeconds,
  formatDuration,
  hmsToMilliseconds,
  millisecondsToHms,
  millisecondsToSeconds,
  MILLISECONDS_PER_DAY,
  MILLISECONDS_PER_HOUR,
  MILLISECONDS_PER_MINUTE,
  MILLISECONDS_PER_SECOND,
  MILLISECONDS_PER_WEEK,
  secondsToMilliseconds,
  shareResultText,
} from './calculation';
import { validateMsToSeconds } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(MILLISECONDS_PER_SECOND, 1000);
assert.equal(millisecondsToSeconds(0), 0);
assertClose(millisecondsToSeconds(1), 0.001, 12);
assertClose(millisecondsToSeconds(10), 0.01, 12);
assertClose(millisecondsToSeconds(65), 0.065, 12);
assertClose(millisecondsToSeconds(100), 0.1, 12);
assertClose(millisecondsToSeconds(305), 0.305, 12);
assertClose(millisecondsToSeconds(500), 0.5, 12);
assert.equal(millisecondsToSeconds(1000), 1);
assertClose(millisecondsToSeconds(1500), 1.5, 12);
assertClose(millisecondsToSeconds(2500), 2.5, 12);
assert.equal(millisecondsToSeconds(7000), 7);

assert.equal(secondsToMilliseconds(0.001), 1);
assert.equal(secondsToMilliseconds(0.5), 500);
assert.equal(secondsToMilliseconds(1), 1000);
assert.equal(secondsToMilliseconds(2.5), 2500);
assert.equal(secondsToMilliseconds(7), 7000);

assert.equal(MILLISECONDS_PER_MINUTE, 60_000);
assert.equal(MILLISECONDS_PER_HOUR, 3_600_000);
assert.equal(MILLISECONDS_PER_DAY, 86_400_000);
assert.equal(MILLISECONDS_PER_WEEK, 604_800_000);

assertClose(millisecondsToSeconds(-305), -0.305, 12);

{
  const hms = millisecondsToHms(3_723_000);
  assert.equal(hms.hours, 1);
  assert.equal(hms.minutes, 2);
  assert.equal(hms.seconds, 3);
  assert.equal(hmsToMilliseconds(1, 2, 3), 3_723_000);
}

{
  const result = calculateMsToSeconds({
    source: 'milliseconds',
    milliseconds: 305,
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
  });
  assertClose(result.seconds, 0.305, 12);
  assert.match(shareResultText(result), /ms to Seconds Converter/);
}

{
  const result = calculateMsToSeconds({
    source: 'minutes',
    milliseconds: null,
    seconds: null,
    years: null,
    months: null,
    weeks: null,
    days: null,
    hours: null,
    minutes: 1,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  });
  assert.equal(result.milliseconds, 60_000);
  assert.equal(result.seconds, 60);
}

assert.ok(
  validateMsToSeconds({
    source: 'milliseconds',
    milliseconds: 0,
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
assert.ok(
  validateMsToSeconds({
    source: 'milliseconds',
    milliseconds: -10,
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
assert.ok(
  !validateMsToSeconds({
    source: 'milliseconds',
    milliseconds: Number.NaN,
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

assert.ok(formatDuration(millisecondsToSeconds(65)).startsWith('0.065'));

console.log('ms-to-seconds calculation.test.ts: ok');
