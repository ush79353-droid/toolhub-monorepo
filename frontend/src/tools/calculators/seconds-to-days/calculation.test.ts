import assert from 'node:assert/strict';
import {
  SECONDS_PER_DAY,
  calculateSecondsToDays,
  daysToSeconds,
  secondsToDays,
  shareResultText,
} from './calculation';
import { parseOptionalNumber, validateSecondsToDays } from './validation';

function assertClose(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(SECONDS_PER_DAY, 86_400);

assert.equal(secondsToDays(86_400), 1);
assert.equal(secondsToDays(172_800), 2);
assert.equal(secondsToDays(43_200), 0.5);
assert.equal(secondsToDays(0), 0);
assert.equal(secondsToDays(-86_400), -1);
assertClose(secondsToDays(1_000_000), 11.574074074, 8);

assert.equal(daysToSeconds(1), 86_400);
assert.equal(daysToSeconds(2), 172_800);
assert.equal(daysToSeconds(0.5), 43_200);
assert.equal(daysToSeconds(-1), -86_400);

assertClose(secondsToDays(1), 1 / 86_400, 12);
assertClose(secondsToDays(60), 60 / 86_400, 12);
assertClose(secondsToDays(3_600), 3_600 / 86_400, 12);
assert.equal(secondsToDays(21_600), 0.25);
assert.equal(secondsToDays(604_800), 7);
assert.equal(secondsToDays(2_592_000), 30);

{
  const result = calculateSecondsToDays({ source: 'seconds', value: 172_800 });
  assert.equal(result.days, 2);
  assert.equal(result.seconds, 172_800);
  assert.match(shareResultText(result), /Seconds to Days Converter/);
  assert.match(shareResultText(result), /172800 seconds = 2 days/);
}

{
  const result = calculateSecondsToDays({ source: 'days', value: 1.5 });
  assert.equal(result.seconds, 129_600);
  assert.equal(result.days, 1.5);
}

assert.throws(() => secondsToDays(Number.NaN));
assert.throws(() => daysToSeconds(Number.POSITIVE_INFINITY));

assert.equal(parseOptionalNumber(''), null);
assert.ok(validateSecondsToDays({ source: 'seconds', value: 0 }).isValid);
assert.ok(validateSecondsToDays({ source: 'seconds', value: -86_400 }).isValid);
assert.ok(!validateSecondsToDays({ source: 'days', value: Number.NaN }).isValid);
assert.ok(!validateSecondsToDays({ source: 'seconds', value: null }).isValid);

console.log('seconds-to-days calculation.test.ts: ok');
