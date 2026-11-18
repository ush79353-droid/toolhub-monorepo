import assert from 'node:assert/strict';
import {
  calculateFtToM,
  feetToMeters,
  feetToMetersViaRegistry,
  metersToFeet,
  shareResultText,
} from './calculation';
import { METERS_PER_FOOT } from './types';
import { parseOptionalNumber, validateFtToM } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(METERS_PER_FOOT, 0.3048);
assert.equal(feetToMeters(0), 0);
assert.equal(feetToMeters(1), 0.3048);
assertClose(feetToMeters(2), 0.6096, 12);
assertClose(feetToMeters(3), 0.9144, 12);
assertClose(feetToMeters(5), 1.524, 12);
assertClose(feetToMeters(6), 1.8288, 12);
assert.equal(feetToMeters(10), 3.048);
assertClose(feetToMeters(20), 6.096, 12);
assert.equal(feetToMeters(100), 30.48);
assertClose(feetToMeters(300), 91.44, 10);
assert.equal(feetToMeters(1000), 304.8);
assertClose(feetToMeters(-10), -3.048, 12);

assert.equal(metersToFeet(0), 0);
assertClose(metersToFeet(0.3048), 1, 10);
assertClose(metersToFeet(0.6096), 2, 10);
assertClose(metersToFeet(1), 3.280839895, 8);
assertClose(metersToFeet(1.524), 5, 10);
assertClose(metersToFeet(1.8288), 6, 10);
assertClose(metersToFeet(3.048), 10, 10);
assertClose(metersToFeet(30.48), 100, 10);

assertClose(feetToMetersViaRegistry(1), 0.3048, 12);
assertClose(feetToMetersViaRegistry(10), feetToMeters(10), 12);

{
  const roundTrip = metersToFeet(feetToMeters(7.25));
  assertClose(roundTrip, 7.25, 10);
}

{
  const result = calculateFtToM({ source: 'feet', feet: 10, meters: null });
  assert.equal(result.meters, 3.048);
  assert.match(shareResultText(result), /ft to m/);
}

{
  const result = calculateFtToM({ source: 'meters', feet: null, meters: 1.8288 });
  assertClose(result.feet, 6, 10);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(validateFtToM({ source: 'feet', feet: -9, meters: null }).isValid);
assert.ok(!validateFtToM({ source: 'feet', feet: null, meters: null }).isValid);
assert.ok(!validateFtToM({ source: 'feet', feet: Number.NaN, meters: null }).isValid);

console.log('ft-to-m calculation.test.ts: ok');
