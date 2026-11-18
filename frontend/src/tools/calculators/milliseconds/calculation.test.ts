import assert from 'node:assert/strict';
import { convertTime, MS_PER_SECOND, shareResultText, toSeconds } from './calculation';
import {
  MS_PER_DAY,
  MS_PER_HOUR,
  MS_PER_JULIAN_YEAR,
  MS_PER_MINUTE,
  MS_PER_WEEK,
} from './types';
import { parseTimeInput } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(MS_PER_SECOND, 1000);
assert.equal(MS_PER_MINUTE, 60_000);
assert.equal(MS_PER_HOUR, 3_600_000);
assert.equal(MS_PER_DAY, 86_400_000);
assert.equal(MS_PER_WEEK, 604_800_000);
assert.equal(MS_PER_JULIAN_YEAR, 31_557_600_000);

assertClose(convertTime(1, 'milliseconds', 'seconds'), 0.001, 12);
assertClose(convertTime(1000, 'milliseconds', 'seconds'), 1, 12);
assertClose(convertTime(60_000, 'milliseconds', 'minutes'), 1, 12);
assertClose(convertTime(3_600_000, 'milliseconds', 'hours'), 1, 12);
assertClose(convertTime(86_400_000, 'milliseconds', 'days'), 1, 12);

assertClose(convertTime(1, 'seconds', 'milliseconds'), 1000, 12);
assertClose(convertTime(1, 'minutes', 'milliseconds'), 60_000, 12);
assertClose(convertTime(1, 'hours', 'milliseconds'), 3_600_000, 12);
assertClose(convertTime(1, 'days', 'milliseconds'), 86_400_000, 12);

assertClose(convertTime(500, 'milliseconds', 'seconds'), 0.5, 12);
assertClose(convertTime(220, 'milliseconds', 'seconds'), 0.22, 12);
assertClose(convertTime(2500, 'milliseconds', 'seconds'), 2.5, 12);
assertClose(convertTime(120_000, 'milliseconds', 'minutes'), 2, 12);
assertClose(convertTime(7_200_000, 'milliseconds', 'hours'), 2, 12);

assertClose(convertTime(1, 'milliseconds', 'microseconds'), 1000, 12);
assertClose(convertTime(1, 'microseconds', 'nanoseconds'), 1000, 12);
assertClose(convertTime(1, 'weeks', 'milliseconds'), MS_PER_WEEK, 8);
assertClose(convertTime(1, 'years', 'milliseconds'), MS_PER_JULIAN_YEAR, 6);

assertClose(convertTime(-1000, 'milliseconds', 'seconds'), -1, 12);
assert.equal(convertTime(0, 'milliseconds', 'hours'), 0);

assert.equal(parseTimeInput('').blank, true);
assert.ok(parseTimeInput('-1').value);

const oneSecond = toSeconds({ sign: 1, digits: '1000', exp: 0 }, 'milliseconds');
assert.match(shareResultText(oneSecond), /Milliseconds Converter/);

console.log('milliseconds calculation.test.ts: ok');
