import assert from 'node:assert/strict';
import {
  calculateMeterToMile,
  metersToMiles,
  milesToMeters,
  shareResultText,
} from './calculation';
import { METERS_PER_MILE } from './types';
import { parseOptionalNumber, validateMeterToMile } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(METERS_PER_MILE, 1609.344);
assert.equal(metersToMiles(0), 0);
assertClose(metersToMiles(1), 0.000621371192237334, 12);
assertClose(metersToMiles(100), 0.0621371192237334, 12);
assertClose(metersToMiles(500), 0.310685596118667, 12);
assertClose(metersToMiles(1000), 0.621371192237334, 12);
assert.equal(metersToMiles(1609.344), 1);
assertClose(metersToMiles(5000), 3.10685596118667, 10);
assertClose(metersToMiles(10000), 6.21371192237334, 10);
assert.equal(milesToMeters(1), 1609.344);
assert.equal(milesToMeters(2), 3218.688);
assert.equal(milesToMeters(2.5), 4023.36);
assert.equal(milesToMeters(0.5), 804.672);

{
  const result = calculateMeterToMile({ source: 'meters', meters: 1000, miles: null });
  assertClose(result.miles, 0.621371192237334, 12);
  assert.match(shareResultText(result), /Meter to Mile/);
}

{
  const result = calculateMeterToMile({ source: 'miles', meters: null, miles: 1 });
  assert.equal(result.meters, 1609.344);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(!validateMeterToMile({ source: 'meters', meters: -1, miles: null }).isValid);
assert.ok(!validateMeterToMile({ source: 'meters', meters: null, miles: null }).isValid);

console.log('meter-to-mile calculation.test.ts: ok');
