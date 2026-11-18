import assert from 'node:assert/strict';
import {
  calculateDayConverter,
  convertDays,
  convertTime,
  shareResultText,
  splitDaysToHms,
} from './calculation';
import { DAYS_PER_MONTH, DAYS_PER_YEAR } from './types';
import { parseOptionalNumber, validateDayConverter } from './validation';

function close(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(DAYS_PER_YEAR, 365.2425);
assert.equal(DAYS_PER_MONTH, 365.2425 / 12);

assert.equal(convertTime(0, 'days', 'hours'), 0);
assert.equal(convertTime(1, 'days', 'hours'), 24);
assert.equal(convertTime(1, 'days', 'minutes'), 1440);
assert.equal(convertTime(1, 'days', 'seconds'), 86400);
assert.equal(convertTime(7, 'days', 'weeks'), 1);
assert.equal(convertTime(14, 'days', 'weeks'), 2);
assert.equal(convertTime(0.5, 'days', 'hours'), 12);
assert.equal(convertTime(0.4, 'days', 'minutes'), 576);
assert.equal(convertTime(100, 'days', 'hours'), 2400);
assert.equal(convertTime(24, 'hours', 'days'), 1);
assert.equal(convertTime(1440, 'minutes', 'days'), 1);
assert.equal(convertTime(86400, 'seconds', 'days'), 1);

close(convertTime(1, 'days', 'years'), 1 / DAYS_PER_YEAR, 10);
close(convertTime(1, 'days', 'months'), 1 / DAYS_PER_MONTH, 10);

{
  const parts = convertDays(0.25);
  close(parts.weeks, 0.25 / 7, 10);
  assert.equal(parts.hours, 6);
  assert.equal(parts.minutes, 360);
  assert.equal(parts.seconds, 21600);
}

{
  const hms = splitDaysToHms(0.4);
  assert.equal(hms.hours, 9);
  assert.equal(hms.minutes, 36);
  assert.equal(hms.seconds, 0);
}

{
  const hms = splitDaysToHms(1.3);
  assert.equal(hms.hours, 31);
  assert.equal(hms.minutes, 12);
  assert.equal(hms.seconds, 0);
}

{
  const hms = splitDaysToHms(2);
  assert.equal(hms.hours, 48);
  assert.equal(hms.minutes, 0);
  assert.equal(hms.seconds, 0);
}

{
  const hms = splitDaysToHms(100);
  assert.equal(hms.hours, 2400);
  assert.equal(hms.minutes, 0);
  assert.equal(hms.seconds, 0);
}

assert.throws(() => convertTime(-1, 'days', 'hours'));

{
  const result = calculateDayConverter({ source: 'days', value: 2 });
  assert.equal(result.hours, 48);
  assert.equal(result.minutes, 2880);
  assert.equal(result.seconds, 172800);
  assert.match(shareResultText(result), /48/);
  assert.match(shareResultText(result), /Combined Duration/);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(!validateDayConverter({ source: 'days', value: null }).isValid);

console.log('day-converter calculation.test.ts: ok');
