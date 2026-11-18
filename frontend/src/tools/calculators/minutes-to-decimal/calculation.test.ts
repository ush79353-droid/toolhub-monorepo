import assert from 'node:assert/strict';
import {
  decimalHoursToMinutes,
  formatDecimal,
  minutesToDecimalHours,
  minutesToSeconds,
  secondsToDecimalHours,
  shareResultText,
  valuesFromMinutes,
} from './calculation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(minutesToDecimalHours(0), 0);
assertClose(minutesToDecimalHours(1), 1 / 60);
assert.equal(minutesToDecimalHours(15), 0.25);
assert.equal(minutesToDecimalHours(30), 0.5);
assert.equal(minutesToDecimalHours(45), 0.75);
assert.equal(minutesToDecimalHours(60), 1);
assert.equal(minutesToDecimalHours(75), 1.25);
assert.equal(minutesToDecimalHours(90), 1.5);
assert.equal(minutesToDecimalHours(120), 2);
assert.equal(minutesToDecimalHours(150), 2.5);

assert.equal(minutesToSeconds(15), 900);
assert.equal(minutesToSeconds(30), 1800);
assert.equal(minutesToSeconds(60), 3600);

assert.equal(decimalHoursToMinutes(1.75), 105);
assert.equal(decimalHoursToMinutes(2.5), 150);
assert.equal(secondsToDecimalHours(1800), 0.5);

assertClose(minutesToDecimalHours(-45), -0.75);

const v = valuesFromMinutes(15);
assert.equal(v.hours, 0.25);
assert.equal(v.minutes, 15);
assert.equal(v.seconds, 900);

assert.match(shareResultText(45), /Minutes to Decimal/);
assert.equal(formatDecimal(0), '0');

console.log('minutes-to-decimal calculation.test.ts: ok');
