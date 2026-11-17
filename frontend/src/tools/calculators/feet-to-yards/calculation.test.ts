import assert from 'node:assert/strict';
import {
  calculateFeetToYards,
  feetToYards,
  feetToYardsViaRegistry,
  shareResultText,
  yardsToFeet,
} from './calculation';
import { FEET_PER_YARD } from './types';
import { parseOptionalNumber, validateFeetToYards } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(FEET_PER_YARD, 3);
assert.equal(feetToYards(0), 0);
assertClose(feetToYards(1), 1 / 3);
assert.equal(feetToYards(3), 1);
assert.equal(feetToYards(6), 2);
assert.equal(feetToYards(24), 8);
assert.equal(feetToYards(30), 10);
assertClose(feetToYards(100), 33.3333333333, 8);

assert.equal(yardsToFeet(0), 0);
assert.equal(yardsToFeet(1), 3);
assert.equal(yardsToFeet(10), 30);
assert.equal(yardsToFeet(15), 45);
assert.equal(yardsToFeet(22), 66);

assertClose(feetToYardsViaRegistry(3), 1, 12);
assertClose(feetToYardsViaRegistry(1), feetToYards(1), 12);

{
  const roundTrip = yardsToFeet(feetToYards(99));
  assertClose(roundTrip, 99, 10);
}
{
  const roundTrip = feetToYards(yardsToFeet(7.5));
  assertClose(roundTrip, 7.5, 10);
}

{
  const result = calculateFeetToYards({ source: 'feet', feet: 24, yards: null });
  assert.equal(result.yards, 8);
  assert.match(shareResultText(result), /Feet to Yards/);
}

{
  const result = calculateFeetToYards({ source: 'yards', feet: null, yards: 15 });
  assert.equal(result.feet, 45);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(validateFeetToYards({ source: 'feet', feet: -9, yards: null }).isValid);
assert.ok(!validateFeetToYards({ source: 'feet', feet: null, yards: null }).isValid);
assert.ok(!validateFeetToYards({ source: 'feet', feet: Number.NaN, yards: null }).isValid);

console.log('feet-to-yards calculation.test.ts: ok');
