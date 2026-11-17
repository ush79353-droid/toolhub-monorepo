import assert from 'node:assert/strict';
import {
  KM_PER_MILE,
  calculateKilometersToMiles,
  formatLength,
  kilometersToMiles,
  milesToKilometers,
  shareResultText,
} from './calculation';
import { convertLength } from '../meter-converter/calculation';
import { validateKilometersToMiles } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(KM_PER_MILE, 1.609344);

assert.equal(kilometersToMiles(0), 0);
assertClose(kilometersToMiles(0.1), 0.062137119237334, 8);
assertClose(kilometersToMiles(0.5), 0.31068559618667, 8);
assertClose(kilometersToMiles(1), 0.621371192237334, 9);
assertClose(kilometersToMiles(2), 1.242742384474668, 8);
assertClose(kilometersToMiles(2.5), 1.553427980593335, 8);
assertClose(kilometersToMiles(5), 3.10685596118667, 9);
assertClose(kilometersToMiles(10), 6.21371192237334, 9);
assertClose(kilometersToMiles(21.0975), 13.1093778449867, 7);
assertClose(kilometersToMiles(42.195), 26.2187556899734, 7);
assertClose(kilometersToMiles(50), 31.0685596118667, 7);
assertClose(kilometersToMiles(100), 62.1371192237334, 7);
assertClose(kilometersToMiles(160.9344), 100, 10);

assert.equal(milesToKilometers(0), 0);
assert.equal(milesToKilometers(1), 1.609344);
assert.equal(milesToKilometers(5), 8.04672);
assert.equal(milesToKilometers(10), 16.09344);

{
  const original = 42.195;
  assertClose(milesToKilometers(kilometersToMiles(original)), original, 10);
}

assertClose(kilometersToMiles(1), convertLength(1, 'km', 'mi'), 12);
assertClose(milesToKilometers(1), convertLength(1, 'mi', 'km'), 12);

{
  const result = calculateKilometersToMiles({ source: 'km', km: 10, mi: null });
  assertClose(result.mi, 6.2137119224, 9);
  assert.match(shareResultText(result), /Kilometers to Miles/);
}

{
  const result = calculateKilometersToMiles({ source: 'mi', km: null, mi: 5 });
  assert.equal(result.km, 8.04672);
}

assert.ok(validateKilometersToMiles({ source: 'km', km: 0, mi: null }).isValid);
assert.ok(!validateKilometersToMiles({ source: 'km', km: -1, mi: null }).isValid);
assert.ok(!validateKilometersToMiles({ source: 'mi', km: null, mi: Number.NaN }).isValid);
assert.ok(formatLength(kilometersToMiles(1)).startsWith('0.621'));

console.log('kilometers-to-miles calculation.test.ts: ok');
