import assert from 'node:assert/strict';
import {
  FEET_PER_MILE,
  KM_PER_MILE,
  METERS_PER_MILE,
  convertLength,
  formatLength,
  metersToMiles,
  milesToMeters,
  shareResultText,
} from './calculation';
import { METERS_PER_NAUTICAL_MILE } from './types';
import { metersFromField, parseLengthInput } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(METERS_PER_MILE, 1609.344);
assert.equal(KM_PER_MILE, 1.609344);
assert.equal(FEET_PER_MILE, 5280);

assertClose(convertLength(1, 'mi', 'm'), 1609.344, 12);
assertClose(convertLength(1, 'mi', 'km'), 1.609344, 12);
assertClose(convertLength(1, 'mi', 'ft'), 5280, 12);
assertClose(convertLength(1, 'mi', 'yd'), 1760, 12);
assertClose(convertLength(1, 'mi', 'in'), 63360, 12);
assertClose(convertLength(1, 'mi', 'cm'), 160934.4, 10);
assertClose(convertLength(1, 'mi', 'mm'), 1609344, 8);
assertClose(convertLength(10, 'mi', 'km'), 16.09344, 12);
assertClose(convertLength(60, 'mi', 'km'), 96.56064, 12);
assertClose(convertLength(1, 'km', 'mi'), 0.621371192237, 10);
assertClose(convertLength(1, 'nmi', 'mi'), 1852 / 1609.344, 10);

assertClose(milesToMeters(1), 1609.344, 12);
assertClose(metersToMiles(1609.344), 1, 12);
assert.equal(METERS_PER_NAUTICAL_MILE, 1852);
assert.ok(METERS_PER_NAUTICAL_MILE !== METERS_PER_MILE);

assertClose(convertLength(-2, 'mi', 'km'), -3.218688, 12);
assert.equal(convertLength(0, 'mi', 'ft'), 0);

assert.equal(parseLengthInput('').blank, true);
assert.ok(parseLengthInput('-1').value === -1);
assert.ok(metersFromField(1, 'mi').ok);

assert.match(shareResultText(milesToMeters(10)), /Mile Conversion/);
assert.ok(formatLength(convertLength(1, 'km', 'mi')).startsWith('0.621'));

console.log('mile-conversion calculation.test.ts: ok');
