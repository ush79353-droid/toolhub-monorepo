import assert from 'node:assert/strict';
import {
  calculateHoursToDays,
  convertTime,
  daysToHours,
  gcd,
  hmsToSeconds,
  hoursToDayFractionLabel,
  hoursToDays,
  normalizeHms,
  shareResultText,
} from './calculation';
import { parseOptionalNumber, validateHoursToDays } from './validation';

function assertClose(actual: number, expected: number, digits = 9): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(hoursToDays(0), 0);
assertClose(hoursToDays(1), 1 / 24, 12);
assert.equal(hoursToDays(6), 0.25);
assert.equal(hoursToDays(12), 0.5);
assert.equal(hoursToDays(24), 1);
assert.equal(hoursToDays(36), 1.5);
assert.equal(hoursToDays(48), 2);
assert.equal(hoursToDays(72), 3);
assertClose(hoursToDays(100), 100 / 24, 10);
assert.equal(hoursToDays(168), 7);
assert.equal(daysToHours(1), 24);
assert.equal(daysToHours(2.5), 60);

assertClose(convertTime(90, 'MINUTE', 'DAY'), 0.0625, 12);
assertClose(convertTime(3600, 'SECOND', 'DAY'), 1 / 24, 12);

assert.equal(hmsToSeconds(2, 30, 45), 9045);
assertClose(hoursToDays(convertTime(9045, 'SECOND', 'HOUR')), 0.1046875, 12);

{
  const n = normalizeHms(1, 75, 90);
  assert.equal(n.hours, 2);
  assert.equal(n.minutes, 16);
  assert.equal(n.seconds, 30);
}

assert.equal(gcd(36, 24), 12);
assert.equal(hoursToDayFractionLabel(1), '1/24');
assert.equal(hoursToDayFractionLabel(2), '1/12');
assert.equal(hoursToDayFractionLabel(3), '1/8');
assert.equal(hoursToDayFractionLabel(4), '1/6');
assert.equal(hoursToDayFractionLabel(6), '1/4');
assert.equal(hoursToDayFractionLabel(8), '1/3');
assert.equal(hoursToDayFractionLabel(12), '1/2');
assert.equal(hoursToDayFractionLabel(18), '3/4');
assert.equal(hoursToDayFractionLabel(24), '1');
assert.equal(hoursToDayFractionLabel(36), '3/2');
assert.equal(hoursToDayFractionLabel(48), '2');

assert.throws(() => hoursToDays(-1));
assert.throws(() => daysToHours(-2));

{
  const result = calculateHoursToDays({
    source: 'hours',
    hours: 48,
    days: null,
    years: null,
    months: null,
    weeks: null,
    minutes: null,
    seconds: null,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  });
  assert.equal(result.days, 2);
  assert.equal(result.minutes, 2880);
  assert.equal(result.seconds, 172_800);
  assert.equal(result.dayFractionLabel, '2');
  assert.match(shareResultText(result), /Hours to Days Calculator/);
}

{
  const result = calculateHoursToDays({
    source: 'hms',
    hours: null,
    days: null,
    years: null,
    months: null,
    weeks: null,
    minutes: null,
    seconds: null,
    hmsHours: 2,
    hmsMinutes: 30,
    hmsSeconds: 45,
  });
  assertClose(result.days, 0.1046875, 12);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  validateHoursToDays({
    source: 'hours',
    hours: 0,
    days: null,
    years: null,
    months: null,
    weeks: null,
    minutes: null,
    seconds: null,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  }).isValid,
);
assert.ok(
  !validateHoursToDays({
    source: 'days',
    hours: null,
    days: -1,
    years: null,
    months: null,
    weeks: null,
    minutes: null,
    seconds: null,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  }).isValid,
);

console.log('hours-to-days calculation.test.ts: ok');
