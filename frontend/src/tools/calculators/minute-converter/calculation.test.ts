import assert from 'node:assert/strict';
import {
  MINUTES_PER_DAY,
  MINUTES_PER_GREGORIAN_MONTH,
  MINUTES_PER_GREGORIAN_YEAR,
  MINUTES_PER_WEEK,
  calculateMinute,
  convertTime,
  formatDuration,
  hmsToSeconds,
  secondsToHms,
  shareResultText,
} from './calculation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(MINUTES_PER_DAY, 1440);
assert.equal(MINUTES_PER_WEEK, 10_080);
assertClose(MINUTES_PER_GREGORIAN_YEAR, 525_949.2, 10);
assertClose(MINUTES_PER_GREGORIAN_MONTH, 43_829.1, 10);

assert.equal(convertTime(1, 'MINUTE', 'SECOND'), 60);
assert.equal(convertTime(60, 'MINUTE', 'HOUR'), 1);
assert.equal(convertTime(120, 'MINUTE', 'HOUR'), 2);
assert.equal(convertTime(1440, 'MINUTE', 'DAY'), 1);
assert.equal(convertTime(10_080, 'MINUTE', 'WEEK'), 1);
assertClose(convertTime(525_949.2, 'MINUTE', 'YEAR'), 1, 8);
assertClose(convertTime(43_829.1, 'MINUTE', 'MONTH'), 1, 8);

assert.equal(convertTime(3600, 'SECOND', 'MINUTE'), 60);
assert.equal(convertTime(2, 'HOUR', 'MINUTE'), 120);
assert.equal(convertTime(3, 'DAY', 'MINUTE'), 4320);
assert.equal(convertTime(2, 'WEEK', 'MINUTE'), 20_160);

assertClose(hmsToSeconds(1, 30, 0) / 60, 90, 12);
assertClose(hmsToSeconds(2, 15, 30) / 60, 135.5, 12);
assertClose(hmsToSeconds(0, 0, 30) / 60, 0.5, 12);

const hms1505 = secondsToHms(150.5 * 60);
assert.equal(hms1505.hours, 2);
assert.equal(hms1505.minutes, 30);
assertClose(hms1505.seconds, 30, 10);

const result = calculateMinute({
  source: 'minutes',
  minutes: 120,
  years: null,
  months: null,
  weeks: null,
  days: null,
  hours: null,
  seconds: null,
  hmsHours: null,
  hmsMinutes: null,
  hmsSeconds: null,
});
assert.equal(result.hours, 2);
assert.equal(result.seconds, 7200);
assertClose(result.days, 120 / 1440, 12);
assert.match(shareResultText(result), /Minute Converter/);
assert.equal(formatDuration(0), '0');

console.log('minute-converter calculation.test.ts: ok');
