import assert from 'node:assert/strict';
import {
  MINUTES_PER_DAY,
  MINUTES_PER_WEEK,
  calculateMinutesToDays,
  daysToMinutes,
  formatDuration,
  minutesToDays,
  minutesToHours,
  minutesToSeconds,
  minutesToWeeks,
  secondsToHms,
  shareResultText,
} from './calculation';

function assertClose(actual: number, expected: number, digits = 12): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(MINUTES_PER_DAY, 1440);
assert.equal(MINUTES_PER_WEEK, 10_080);

assert.equal(minutesToDays(1440), 1);
assertClose(minutesToDays(720), 0.5);
assertClose(minutesToDays(360), 0.25);
assertClose(minutesToDays(180), 0.125);
assertClose(minutesToDays(30), 30 / 1440);
assertClose(minutesToDays(45), 45 / 1440);
assert.equal(minutesToDays(2880), 2);
assert.equal(minutesToDays(10_080), 7);
assert.equal(daysToMinutes(2.5), 3600);

assert.equal(minutesToSeconds(1), 60);
assert.equal(minutesToHours(120), 2);
assert.equal(minutesToWeeks(10_080), 1);

const hms = secondsToHms(150.5 * 60);
assert.equal(hms.hours, 2);
assert.equal(hms.minutes, 30);
assertClose(hms.seconds, 30, 10);

const result = calculateMinutesToDays({
  source: 'minutes',
  minutes: 1440,
  days: null,
  seconds: null,
  hours: null,
  weeks: null,
  hmsHours: null,
  hmsMinutes: null,
  hmsSeconds: null,
});
assert.equal(result.days, 1);
assert.match(shareResultText(result), /Minutes to Days/);
assert.equal(formatDuration(0), '0');

console.log('minutes-to-days calculation.test.ts: ok');
