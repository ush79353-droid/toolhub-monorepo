import assert from 'node:assert/strict';
import {
  SECONDS_PER_HOUR,
  calculateSecondsToHours,
  hoursToSeconds,
  normalizeHms,
  secondsToHours,
  secondsToTimeParts,
  shareResultText,
} from './calculation';
import { parseOptionalNumber, validateSecondsToHours } from './validation';

function assertClose(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(SECONDS_PER_HOUR, 3_600);

assert.equal(secondsToHours(3_600), 1);
assert.equal(secondsToHours(7_200), 2);
assert.equal(secondsToHours(1_800), 0.5);
assert.equal(secondsToHours(0), 0);
assert.equal(secondsToHours(-3_600), -1);
assertClose(secondsToHours(1_920), 0.5333333333, 8);

assert.equal(hoursToSeconds(1), 3_600);
assert.equal(hoursToSeconds(2), 7_200);
assert.equal(hoursToSeconds(0.5), 1_800);
assert.equal(hoursToSeconds(-1), -3_600);
assert.equal(hoursToSeconds(1.25), 4_500);

assert.deepEqual(secondsToTimeParts(7_260), {
  hours: 2,
  minutes: 1,
  seconds: 0,
  label: '2 hrs 1 min 0 sec',
});

{
  const neg = secondsToTimeParts(-7_260);
  assert.equal(neg.hours, -2);
  assert.equal(neg.minutes, 1);
  assert.equal(neg.seconds, 0);
}

{
  const n = normalizeHms(0, 90, 0);
  assert.equal(n.hours, 1);
  assert.equal(n.minutes, 30);
  assert.equal(n.seconds, 0);
}

{
  const result = calculateSecondsToHours({
    source: 'seconds',
    seconds: 7_260,
    hours: null,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  });
  assertClose(result.hours, 2.0166666667, 8);
  assert.equal(result.combined.hours, 2);
  assert.equal(result.combined.minutes, 1);
  assert.match(shareResultText(result), /Seconds to Hours Converter/);
  assert.match(shareResultText(result), /7260 seconds/);
}

{
  const result = calculateSecondsToHours({
    source: 'hms',
    seconds: null,
    hours: null,
    hmsHours: 1,
    hmsMinutes: 45,
    hmsSeconds: 30,
  });
  assert.equal(result.seconds, 6_330);
  assertClose(result.hours, 1.7583333333, 8);
}

assert.throws(() => secondsToHours(Number.NaN));
assert.equal(parseOptionalNumber(''), null);
assert.ok(
  validateSecondsToHours({
    source: 'seconds',
    seconds: 0,
    hours: null,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  }).isValid,
);
assert.ok(
  validateSecondsToHours({
    source: 'hours',
    seconds: null,
    hours: -1,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  }).isValid,
);
assert.ok(
  !validateSecondsToHours({
    source: 'seconds',
    seconds: null,
    hours: null,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  }).isValid,
);

console.log('seconds-to-hours calculation.test.ts: ok');
