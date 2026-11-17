import assert from 'node:assert/strict';
import {
  calculateHoursToMinutes,
  hoursToMinutes,
  hoursToSeconds,
  hmsToSeconds,
  minutesToHours,
  normalizeHms,
  shareResultText,
  secondsToMinutes,
} from './calculation';
import { parseOptionalNumber, validateHoursToMinutes } from './validation';

function assertClose(actual: number, expected: number, digits = 9): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(hoursToMinutes(0), 0);
assert.equal(hoursToMinutes(0.25), 15);
assert.equal(hoursToMinutes(0.5), 30);
assert.equal(hoursToMinutes(1), 60);
assert.equal(hoursToMinutes(1.5), 90);
assert.equal(hoursToMinutes(2), 120);
assert.equal(hoursToMinutes(7), 420);
assert.equal(hoursToMinutes(12), 720);
assert.equal(hoursToMinutes(24), 1440);
assert.equal(hoursToMinutes(48), 2880);

assert.equal(minutesToHours(60), 1);
assert.equal(minutesToHours(90), 1.5);
assert.equal(minutesToHours(150), 2.5);

assert.equal(hoursToSeconds(1), 3600);
assert.equal(secondsToMinutes(3600), 60);
assert.equal(secondsToMinutes(5400), 90);

assertClose(hmsToSeconds(2, 15, 30) / 60, 135.5, 10);
assertClose(hmsToSeconds(3, 20, 15) / 60, 200.25, 10);

{
  const n = normalizeHms(0, 90, 0);
  assert.equal(n.hours, 1);
  assert.equal(n.minutes, 30);
  assert.equal(n.seconds, 0);
}
{
  const n = normalizeHms(1, 75, 0);
  assert.equal(n.hours, 2);
  assert.equal(n.minutes, 15);
}
{
  const n = normalizeHms(1, 90, 90);
  assert.equal(n.hours, 2);
  assert.equal(n.minutes, 31);
  assert.equal(n.seconds, 30);
}
{
  const n = normalizeHms(24, 30, 0);
  assert.equal(n.hours, 24);
  assert.equal(n.minutes, 30);
}

assert.throws(() => hoursToMinutes(-1));
assert.throws(() => minutesToHours(-5));

{
  const result = calculateHoursToMinutes({
    source: 'hours',
    hours: 7,
    minutes: null,
    seconds: null,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  });
  assert.equal(result.minutes, 420);
  assert.equal(result.seconds, 25200);
  assert.match(shareResultText(result), /Hours to Minutes Converter/);
}

{
  const result = calculateHoursToMinutes({
    source: 'hms',
    hours: null,
    minutes: null,
    seconds: null,
    hmsHours: 2,
    hmsMinutes: 15,
    hmsSeconds: 30,
  });
  assertClose(result.minutes, 135.5, 10);
  assert.equal(result.seconds, 8130);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  validateHoursToMinutes({
    source: 'hours',
    hours: 0,
    minutes: null,
    seconds: null,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  }).isValid,
);
assert.ok(
  !validateHoursToMinutes({
    source: 'minutes',
    hours: null,
    minutes: -1,
    seconds: null,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  }).isValid,
);

console.log('hours-to-minutes calculation.test.ts: ok');
