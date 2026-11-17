import assert from 'node:assert/strict';
import {
  METERS_PER_KM,
  calculateKilometerToMeter,
  formatLength,
  kilometersToMeters,
  metersToKilometers,
  shareResultText,
} from './calculation';
import { convertLength } from '../meter-converter/calculation';
import { validateKilometerToMeter } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(METERS_PER_KM, 1000);

assert.equal(kilometersToMeters(0), 0);
assert.equal(kilometersToMeters(0.001), 1);
assert.equal(kilometersToMeters(0.01), 10);
assert.equal(kilometersToMeters(0.1), 100);
assert.equal(kilometersToMeters(0.5), 500);
assert.equal(kilometersToMeters(1), 1000);
assert.equal(kilometersToMeters(2), 2000);
assert.equal(kilometersToMeters(2.535), 2535);
assert.equal(kilometersToMeters(2.5), 2500);
assert.equal(kilometersToMeters(3.5), 3500);
assert.equal(kilometersToMeters(5), 5000);
assert.equal(kilometersToMeters(10), 10000);
assert.equal(kilometersToMeters(25), 25000);
assert.equal(kilometersToMeters(50), 50000);
assert.equal(kilometersToMeters(100), 100000);
assert.equal(kilometersToMeters(1000), 1000000);

assert.equal(metersToKilometers(1000), 1);
assert.equal(metersToKilometers(250), 0.25);
assert.equal(metersToKilometers(4500), 4.5);
assert.equal(metersToKilometers(0), 0);
assert.equal(metersToKilometers(125), 0.125);
assert.equal(metersToKilometers(7500), 7.5);

{
  const original = 12.345;
  assertClose(metersToKilometers(kilometersToMeters(original)), original, 10);
}

assertClose(kilometersToMeters(1), convertLength(1, 'km', 'm'), 12);
assertClose(metersToKilometers(1), convertLength(1, 'm', 'km'), 12);

{
  const result = calculateKilometerToMeter({ source: 'km', km: 2.5, m: null });
  assert.equal(result.m, 2500);
  assert.match(shareResultText(result), /Kilometer to Meter/);
}

{
  const result = calculateKilometerToMeter({ source: 'm', km: null, m: 7500 });
  assert.equal(result.km, 7.5);
}

assert.ok(validateKilometerToMeter({ source: 'km', km: 0, m: null }).isValid);
assert.ok(!validateKilometerToMeter({ source: 'km', km: -1, m: null }).isValid);
assert.ok(!validateKilometerToMeter({ source: 'm', km: null, m: Number.NaN }).isValid);
assert.ok(formatLength(kilometersToMeters(1)) === '1000' || formatLength(1).length > 0);

console.log('kilometer-to-meter calculation.test.ts: ok');
