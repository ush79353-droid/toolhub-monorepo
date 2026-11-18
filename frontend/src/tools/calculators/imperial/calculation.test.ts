import assert from 'node:assert/strict';
import {
  calculateImperial,
  celsiusToFahrenheit,
  convertImperialField,
  fahrenheitToCelsius,
  imperialGallonsToLiters,
  inchesToFeet,
  poundsToKilograms,
  shareResultText,
  usGallonsToLiters,
} from './calculation';
import { validateImperial } from './validation';

function assertClose(actual: number, expected: number, digits = 9): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

// Length
assertClose(inchesToFeet(12), 1, 12);
assertClose(convertImperialField(36, 'length', 'in', 'yd'), 1, 12);
assertClose(convertImperialField(3, 'length', 'ft', 'yd'), 1, 12);
assertClose(convertImperialField(5280, 'length', 'ft', 'mi'), 1, 12);
assertClose(convertImperialField(1, 'length', 'in', 'cm'), 2.54, 12);
assertClose(convertImperialField(1, 'length', 'ft', 'm'), 0.3048, 12);
assertClose(convertImperialField(1, 'length', 'mi', 'km'), 1.609344, 12);

{
  const result = calculateImperial({ category: 'length', sourceKey: 'in', value: 12 });
  assertClose(result.values.ft!, 1, 12);
  assertClose(result.values.cm!, 30.48, 12);
  assertClose(result.values.m!, 0.3048, 12);
  assert.match(shareResultText(result), /Imperial Calculator/);
}

// Area
assert.equal(convertImperialField(1, 'area', 'ft2', 'm2'), 0.09290304);
assert.equal(convertImperialField(1, 'area', 'ac', 'm2'), 4046.8564224);
assertClose(convertImperialField(1, 'area', 'mi2', 'km2'), 2.589988110336, 12);

// Volume
assert.equal(usGallonsToLiters(1), 3.785411784);
assert.equal(imperialGallonsToLiters(1), 4.54609);
assert.equal(convertImperialField(1, 'volume', 'usLiquidGal', 'usQt'), 4);
assert.equal(convertImperialField(1, 'volume', 'usLiquidGal', 'usPt'), 8);
assert.equal(convertImperialField(1, 'volume', 'usLiquidGal', 'usFlOz'), 128);
assertClose(convertImperialField(1, 'volume', 'ft3', 'usLiquidGal'), 7.4805194805, 8);

// Mass
assert.equal(poundsToKilograms(1), 0.45359237);
assert.equal(convertImperialField(1, 'mass', 'lb', 'oz'), 16);
assert.equal(convertImperialField(1, 'mass', 'st', 'lb'), 14);
assert.equal(convertImperialField(1, 'mass', 'shortTon', 'lb'), 2000);
assert.equal(convertImperialField(1, 'mass', 'longTon', 'lb'), 2240);

// Temperature
assert.equal(celsiusToFahrenheit(0), 32);
assert.equal(celsiusToFahrenheit(100), 212);
assert.equal(fahrenheitToCelsius(32), 0);
assert.equal(fahrenheitToCelsius(212), 100);
assert.equal(convertImperialField(0, 'temperature', 'celsius', 'kelvin'), 273.15);
assert.equal(convertImperialField(0, 'temperature', 'kelvin', 'celsius'), -273.15);
assert.equal(convertImperialField(0, 'temperature', 'rankine', 'kelvin'), 0);
assertClose(convertImperialField(100, 'temperature', 'celsius', 'rankine'), 671.67, 10);

assert.throws(() =>
  calculateImperial({ category: 'temperature', sourceKey: 'kelvin', value: -1 }),
);
assert.throws(() => calculateImperial({ category: 'length', sourceKey: 'ft', value: -1 }));

assert.ok(
  !validateImperial({ category: 'length', sourceKey: 'm', value: -2 }).isValid,
);
assert.ok(
  validateImperial({ category: 'temperature', sourceKey: 'celsius', value: -40 }).isValid,
);
assert.ok(
  !validateImperial({ category: 'temperature', sourceKey: 'celsius', value: -300 }).isValid,
);

console.log('imperial calculation.test.ts: ok');
