import assert from 'node:assert/strict';
import {
  convertTemperature,
  formatMetricNumber,
  shareResultText,
  toKelvin,
} from './calculation';
import {
  convertArea,
  convertLength,
  convertMass,
  convertVolume,
} from './units';
import { baseFromField, parseMetricInput } from './validation';

function assertClose(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

// Length
assert.equal(convertLength(1, 'm', 'cm'), 100);
assert.equal(convertLength(1, 'in', 'cm'), 2.54);
assert.equal(convertLength(1, 'ft', 'm'), 0.3048);
assert.equal(convertLength(1, 'mi', 'km'), 1.609344);
assert.equal(convertLength(1, 'yd', 'm'), 0.9144);
assertClose(convertLength(1, 'm', 'ft'), 3.280839895, 8);
assertClose(convertLength(1, 'km', 'mi'), 0.621371192, 8);

// Area
assert.equal(convertArea(1, 'ha', 'm2'), 10_000);
assertClose(convertArea(1, 'ft2', 'm2'), 0.09290304, 10);
assertClose(convertArea(1, 'acre', 'm2'), 4046.8564224, 8);
assertClose(convertArea(1, 'ha', 'acre'), 2.4710538147, 6);
assertClose(convertArea(1, 'km2', 'mi2'), 0.3861021585, 6);

// Mass
assertClose(convertMass(1, 'lb', 'kg'), 0.45359237, 10);
assertClose(convertMass(1, 'kg', 'lb'), 2.2046226218, 8);
assertClose(convertMass(1, 'oz', 'g'), 28.349523125, 8);
assertClose(convertMass(1, 'st', 'kg'), 6.35029318, 8);

// Volume
assertClose(convertVolume(1, 'usGallon', 'L'), 3.785411784, 10);
assertClose(convertVolume(1, 'impGallon', 'L'), 4.54609, 10);
assert.equal(convertVolume(1, 'L', 'mL'), 1000);
assert.notEqual(convertVolume(1, 'usGallon', 'L'), convertVolume(1, 'impGallon', 'L'));

// Temperature
assert.equal(convertTemperature(0, 'C', 'F'), 32);
assert.equal(convertTemperature(100, 'C', 'F'), 212);
assert.equal(convertTemperature(0, 'C', 'K'), 273.15);
assertClose(convertTemperature(273.15, 'K', 'C'), 0, 10);
assert.equal(convertTemperature(-40, 'C', 'F'), -40);
assert.equal(convertTemperature(37, 'C', 'F'), 98.6);
assert.equal(toKelvin(20, 'C'), 293.15);
assert.ok(!baseFromField(-300, 'temperature', 'C').ok);
assert.ok(baseFromField(-40, 'temperature', 'C').ok);

assert.equal(parseMetricInput('').blank, true);
assert.ok(parseMetricInput('1.').incomplete);
assert.ok(!baseFromField(-1, 'length', 'm').ok);
assert.match(shareResultText('length', 1, 'm'), /Metric to Standard Converter/);
assert.equal(formatMetricNumber(0), '0');

console.log('metric-to-standard calculation.test.ts: ok');
