import assert from 'node:assert/strict';
import {
  calculateYardToMile,
  milesToYards,
  shareResultText,
  yardsToMiles,
  yardsToMilesViaRegistry,
} from './calculation';
import { YARDS_PER_MILE } from './types';
import { parseOptionalNumber, validateYardToMile } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(YARDS_PER_MILE, 1760);
assert.equal(yardsToMiles(1760), 1);
assert.equal(yardsToMiles(880), 0.5);
assert.equal(yardsToMiles(440), 0.25);
assertClose(yardsToMiles(500), 0.2840909090909091, 9);
assert.equal(milesToYards(3), 5280);
assert.equal(milesToYards(2.5), 4400);
assert.equal(yardsToMiles(0), 0);
assert.equal(milesToYards(0), 0);

{
  const original = 1234.5;
  const miles = yardsToMiles(original);
  assertClose(milesToYards(miles), original, 12);
}

assertClose(yardsToMilesViaRegistry(1760), 1, 12);
assertClose(yardsToMilesViaRegistry(880), yardsToMiles(880), 12);

{
  const result = calculateYardToMile({ source: 'yards', yards: 1760, miles: null });
  assert.equal(result.miles, 1);
  assert.equal(result.otherUnits.length, 5);
  assertClose(result.otherUnits.find((r) => r.unit === 'ft')!.value, 5280, 10);
  assert.match(shareResultText(result), /Yard to Mile/);
}

{
  const result = calculateYardToMile({ source: 'miles', yards: null, miles: 2 });
  assert.equal(result.yards, 3520);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(!validateYardToMile({ source: 'yards', yards: -1, miles: null }).isValid);
assert.ok(!validateYardToMile({ source: 'yards', yards: null, miles: null }).isValid);
assert.ok(validateYardToMile({ source: 'yards', yards: 1760, miles: null }).isValid);

console.log('yard-to-mile calculation.test.ts: ok');
