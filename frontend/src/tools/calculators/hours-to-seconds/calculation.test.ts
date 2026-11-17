import assert from 'node:assert/strict';
import {
  calculateHoursToSeconds,
  hoursToSeconds,
  hmsToSeconds,
  normalizeHms,
  secondsToHours,
  shareResultText,
} from './calculation';
import { parseOptionalNumber, validateHoursToSeconds } from './validation';

function assertClose(actual: number, expected: number, digits = 9): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(hoursToSeconds(0), 0);
assert.equal(hoursToSeconds(0.25), 900);
assert.equal(hoursToSeconds(0.5), 1800);
assert.equal(hoursToSeconds(1), 3600);
assert.equal(hoursToSeconds(1.5), 5400);
assert.equal(hoursToSeconds(2), 7200);
assert.equal(hoursToSeconds(3), 10800);
assert.equal(hoursToSeconds(5), 18000);
assert.equal(hoursToSeconds(7), 25200);
assert.equal(hoursToSeconds(12), 43200);
assert.equal(hoursToSeconds(13), 46800);
assert.equal(hoursToSeconds(14), 50400);
assert.equal(hoursToSeconds(24), 86400);
assert.equal(hoursToSeconds(48), 172800);

assert.equal(secondsToHours(3600), 1);
assert.equal(secondsToHours(7200), 2);
assert.equal(secondsToHours(5400), 1.5);

assert.equal(hmsToSeconds(1, 45, 30), 6330);
assert.equal(hmsToSeconds(2, 15, 30), 8130);
assert.equal(hmsToSeconds(3, 20, 15), 12015);

{
  const n = normalizeHms(0, 60, 0);
  assert.equal(n.hours, 1);
  assert.equal(n.minutes, 0);
}
{
  const n = normalizeHms(1, 90, 90);
  assert.equal(n.hours, 2);
  assert.equal(n.minutes, 31);
  assert.equal(n.seconds, 30);
}
{
  const n = normalizeHms(24, 0, 0);
  assert.equal(n.hours, 24);
}

assert.throws(() => hoursToSeconds(-1));
assert.throws(() => secondsToHours(-10));

{
  const result = calculateHoursToSeconds({
    source: 'hours',
    hours: 13,
    seconds: null,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  });
  assert.equal(result.seconds, 46800);
  assert.equal(result.minutes, 780);
  assert.match(shareResultText(result), /Hours to Seconds Converter/);
}

{
  const result = calculateHoursToSeconds({
    source: 'hms',
    hours: null,
    seconds: null,
    hmsHours: 1,
    hmsMinutes: 45,
    hmsSeconds: 30,
  });
  assert.equal(result.seconds, 6330);
  assertClose(result.hours, 6330 / 3600, 10);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  validateHoursToSeconds({
    source: 'hours',
    hours: 0,
    seconds: null,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  }).isValid,
);
assert.ok(
  !validateHoursToSeconds({
    source: 'seconds',
    hours: null,
    seconds: -1,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  }).isValid,
);

console.log('hours-to-seconds calculation.test.ts: ok');
