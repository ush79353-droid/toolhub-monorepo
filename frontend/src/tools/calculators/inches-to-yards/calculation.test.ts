import assert from 'node:assert/strict';
import {
  calculateInchesToYards,
  inchesToYards,
  inchesToYardsViaRegistry,
  shareResultText,
  yardsToInches,
} from './calculation';
import { INCHES_PER_YARD } from './types';
import { parseOptionalNumber, validateInchesToYards } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(INCHES_PER_YARD, 36);
assert.equal(inchesToYards(0), 0);
assertClose(inchesToYards(1), 1 / 36);
assertClose(inchesToYards(12), 1 / 3);
assert.equal(inchesToYards(18), 0.5);
assert.equal(inchesToYards(36), 1);
assert.equal(inchesToYards(54), 1.5);
assert.equal(inchesToYards(72), 2);
assertClose(inchesToYards(100), 100 / 36);
assert.equal(inchesToYards(108), 3);
assert.equal(inchesToYards(180), 5);
assert.equal(inchesToYards(360), 10);
assert.equal(inchesToYards(720), 20);
assertClose(inchesToYards(1000), 1000 / 36);

assert.equal(yardsToInches(0), 0);
assert.equal(yardsToInches(0.5), 18);
assert.equal(yardsToInches(1), 36);
assert.equal(yardsToInches(2), 72);
assert.equal(yardsToInches(3), 108);
assert.equal(yardsToInches(5), 180);
assert.equal(yardsToInches(10), 360);
assert.equal(yardsToInches(25), 900);
assert.equal(yardsToInches(100), 3600);
assert.equal(yardsToInches(2.5), 90);

assertClose(inchesToYardsViaRegistry(36), 1, 12);
assertClose(inchesToYardsViaRegistry(1), inchesToYards(1), 12);

{
  const roundTrip = yardsToInches(inchesToYards(99));
  assertClose(roundTrip, 99, 10);
}
{
  const roundTrip = inchesToYards(yardsToInches(7.5));
  assertClose(roundTrip, 7.5, 10);
}

{
  const result = calculateInchesToYards({ source: 'inches', inches: 180, yards: null });
  assert.equal(result.yards, 5);
  assert.match(shareResultText(result), /Inches to Yard Conversion/);
}

{
  const result = calculateInchesToYards({ source: 'yards', inches: null, yards: 5 });
  assert.equal(result.inches, 180);
}

assert.equal(parseOptionalNumber(''), null);
assert.equal(parseOptionalNumber('1e2'), 100);
assert.ok(validateInchesToYards({ source: 'inches', inches: -9, yards: null }).isValid);
assert.ok(!validateInchesToYards({ source: 'inches', inches: null, yards: null }).isValid);
assert.ok(!validateInchesToYards({ source: 'inches', inches: Number.NaN, yards: null }).isValid);
assert.ok(!validateInchesToYards({ source: 'inches', inches: Number.POSITIVE_INFINITY, yards: null }).isValid);

console.log('inches-to-yards calculation.test.ts: ok');
