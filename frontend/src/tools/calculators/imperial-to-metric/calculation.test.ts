import assert from 'node:assert/strict';
import {
  calculateImperial,
  convertImperialField,
  fahrenheitToCelsius,
  imperialGallonsToLiters,
  poundsToKilograms,
  shareResultText,
  usGallonsToLiters,
} from './calculation';

function assertClose(actual: number, expected: number, digits = 9): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(convertImperialField(1, 'length', 'in', 'cm'), 2.54, 12);
assertClose(convertImperialField(1, 'length', 'ft', 'm'), 0.3048, 12);
assertClose(convertImperialField(1, 'length', 'yd', 'm'), 0.9144, 12);
assertClose(convertImperialField(1, 'length', 'mi', 'km'), 1.609344, 12);
assertClose(convertImperialField(12, 'length', 'in', 'ft'), 1, 12);
assertClose(convertImperialField(3, 'length', 'ft', 'yd'), 1, 12);
assertClose(convertImperialField(5280, 'length', 'ft', 'mi'), 1, 12);

assert.equal(convertImperialField(1, 'area', 'ft2', 'm2'), 0.09290304);
assert.equal(convertImperialField(1, 'area', 'ac', 'm2'), 4046.8564224);
assertClose(convertImperialField(1, 'area', 'mi2', 'm2'), 2_589_988.110336, 12);

assert.equal(usGallonsToLiters(1), 3.785411784);
assert.equal(imperialGallonsToLiters(1), 4.54609);
assert.equal(convertImperialField(1, 'volume', 'ft3', 'L'), 28.316846592);

assert.equal(poundsToKilograms(1), 0.45359237);
assert.equal(convertImperialField(1, 'mass', 'lb', 'oz'), 16);
assert.equal(convertImperialField(1, 'mass', 'st', 'lb'), 14);
assert.equal(convertImperialField(1, 'mass', 'shortTon', 'kg'), 907.18474);

assert.equal(convertImperialField(0, 'temperature', 'celsius', 'fahrenheit'), 32);
assert.equal(convertImperialField(100, 'temperature', 'celsius', 'fahrenheit'), 212);
assert.equal(fahrenheitToCelsius(32), 0);
assert.equal(fahrenheitToCelsius(212), 100);
assert.equal(convertImperialField(0, 'temperature', 'kelvin', 'celsius'), -273.15);

{
  const result = calculateImperial({ category: 'length', sourceKey: 'in', value: 12 });
  assertClose(result.values.cm!, 30.48, 12);
  assertClose(result.values.m!, 0.3048, 12);
  assert.match(
    shareResultText(result, 'Imperial to Metric Conversion'),
    /Imperial to Metric Conversion/,
  );
}

console.log('imperial-to-metric calculation.test.ts: ok');
