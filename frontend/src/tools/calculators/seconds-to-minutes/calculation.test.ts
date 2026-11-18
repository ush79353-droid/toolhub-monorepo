import assert from 'node:assert/strict';
import {
  SECONDS_PER_MINUTE,
  calculateSecondsToMinutes,
  minutesToSeconds,
  secondsToMinutes,
  shareResultText,
} from './calculation';
import { parseOptionalNumber, validateSecondsToMinutes } from './validation';

function assertClose(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(SECONDS_PER_MINUTE, 60);

assert.equal(secondsToMinutes(60), 1);
assert.equal(secondsToMinutes(120), 2);
assert.equal(secondsToMinutes(30), 0.5);
assert.equal(secondsToMinutes(78), 1.3);
assert.equal(secondsToMinutes(0), 0);
assert.equal(secondsToMinutes(-60), -1);
assertClose(secondsToMinutes(1), 0.0166666667, 8);

assert.equal(minutesToSeconds(1), 60);
assert.equal(minutesToSeconds(2.5), 150);
assert.equal(minutesToSeconds(0), 0);
assert.equal(minutesToSeconds(-1), -60);
assert.equal(minutesToSeconds(1.25), 75);

assertClose(secondsToMinutes(5), 0.0833333333, 8);
assert.equal(secondsToMinutes(15), 0.25);
assert.equal(secondsToMinutes(45), 0.75);
assert.equal(secondsToMinutes(90), 1.5);
assert.equal(secondsToMinutes(300), 5);
assert.equal(secondsToMinutes(600), 10);
assert.equal(secondsToMinutes(3_600), 60);
assert.equal(secondsToMinutes(86_400), 1_440);

{
  const result = calculateSecondsToMinutes({ source: 'seconds', value: 78 });
  assert.equal(result.minutes, 1.3);
  assert.equal(result.seconds, 78);
  assert.match(shareResultText(result), /Seconds to Minutes Converter/);
  assert.match(shareResultText(result), /78 seconds = 1\.3 minutes/);
}

{
  const result = calculateSecondsToMinutes({ source: 'minutes', value: 2.5 });
  assert.equal(result.seconds, 150);
  assert.equal(result.minutes, 2.5);
}

assert.throws(() => secondsToMinutes(Number.NaN));
assert.equal(parseOptionalNumber(''), null);
assert.ok(validateSecondsToMinutes({ source: 'seconds', value: 0 }).isValid);
assert.ok(validateSecondsToMinutes({ source: 'minutes', value: -1 }).isValid);
assert.ok(!validateSecondsToMinutes({ source: 'seconds', value: Number.NaN }).isValid);
assert.ok(!validateSecondsToMinutes({ source: 'seconds', value: null }).isValid);

console.log('seconds-to-minutes calculation.test.ts: ok');
