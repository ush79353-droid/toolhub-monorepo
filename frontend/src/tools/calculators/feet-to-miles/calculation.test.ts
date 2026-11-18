import assert from 'node:assert/strict';
import {
  calculateFeetToMiles,
  feetToMiles,
  feetToMilesViaRegistry,
  milesToFeet,
  shareResultText,
} from './calculation';
import { FEET_PER_MILE } from './types';
import { parseOptionalNumber, validateFeetToMiles } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(FEET_PER_MILE, 5280);
assert.equal(feetToMiles(0), 0);
assertClose(feetToMiles(1), 1 / 5280);
assert.equal(feetToMiles(5280), 1);
assert.equal(feetToMiles(10560), 2);
assertClose(feetToMiles(46000), 8.7121212121, 8);
assertClose(feetToMiles(1000), 0.1893939394, 8);
assertClose(feetToMiles(10), 0.0018939394, 8);

assert.equal(milesToFeet(0), 0);
assert.equal(milesToFeet(1), 5280);
assert.equal(milesToFeet(2), 10560);
assert.equal(milesToFeet(3.5), 18480);

assertClose(feetToMilesViaRegistry(5280), 1, 12);
assertClose(feetToMilesViaRegistry(1), feetToMiles(1), 12);

{
  const roundTrip = milesToFeet(feetToMiles(12345));
  assertClose(roundTrip, 12345, 10);
}
{
  const roundTrip = feetToMiles(milesToFeet(7.25));
  assertClose(roundTrip, 7.25, 10);
}

{
  const result = calculateFeetToMiles({ source: 'feet', feet: 5280, miles: null });
  assert.equal(result.miles, 1);
  assert.match(shareResultText(result), /Feet to Miles/);
}

{
  const result = calculateFeetToMiles({ source: 'miles', feet: null, miles: 3.5 });
  assert.equal(result.feet, 18480);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(validateFeetToMiles({ source: 'feet', feet: -100, miles: null }).isValid);
assert.ok(!validateFeetToMiles({ source: 'feet', feet: null, miles: null }).isValid);
assert.ok(!validateFeetToMiles({ source: 'feet', feet: Number.NaN, miles: null }).isValid);

console.log('feet-to-miles calculation.test.ts: ok');
