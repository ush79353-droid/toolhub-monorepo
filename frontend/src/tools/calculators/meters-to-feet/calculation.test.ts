import assert from 'node:assert/strict';
import {
  calculateMetersToFeet,
  feetToMeters,
  metersToFeet,
  shareResultText,
} from './calculation';
import { METERS_PER_FOOT } from './types';
import { parseOptionalNumber, validateMetersToFeet } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(METERS_PER_FOOT, 0.3048);
assertClose(metersToFeet(1), 3.2808398950131235, 10);
assertClose(metersToFeet(2), 6.561679790026247, 10);
assertClose(metersToFeet(3), 9.84251968503937, 10);
assertClose(metersToFeet(5), 16.404199475065617, 9);
assertClose(metersToFeet(10), 32.80839895013123, 9);
assertClose(metersToFeet(100), 328.0839895013123, 9);
assert.equal(metersToFeet(0.3048), 1);
assert.equal(feetToMeters(1), 0.3048);
assert.equal(feetToMeters(5), 1.524);
assert.equal(feetToMeters(10), 3.048);
assert.equal(feetToMeters(100), 30.48);
assert.equal(metersToFeet(0), 0);
assertClose(metersToFeet(-2), -6.561679790026247, 10);

{
  const result = calculateMetersToFeet({ source: 'meters', meters: 5, feet: null });
  assertClose(result.feet, 16.404199475065617, 9);
  assert.match(shareResultText(result), /Meters to Feet/);
}

{
  const result = calculateMetersToFeet({ source: 'feet', meters: null, feet: 10 });
  assert.equal(result.meters, 3.048);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(validateMetersToFeet({ source: 'meters', meters: -2, feet: null }).isValid);
assert.ok(!validateMetersToFeet({ source: 'meters', meters: null, feet: null }).isValid);
assert.ok(!validateMetersToFeet({ source: 'meters', meters: Number.NaN, feet: null }).isValid);

console.log('meters-to-feet calculation.test.ts: ok');
