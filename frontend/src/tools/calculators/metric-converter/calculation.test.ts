import assert from 'node:assert/strict';
import {
  allFromBase,
  convertLinear,
  formatMetricNumber,
  fromBase,
  fromKelvin,
  shareResultText,
  toBase,
  toKelvin,
} from './calculation';
import { convertLength, LENGTH_TO_METERS } from './units';
import { baseFromField, parseMetricInput } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

// Length
assert.equal(convertLength(1, 'meter', 'centimeter'), 100);
assert.equal(convertLength(1, 'meter', 'millimeter'), 1000);
assert.equal(convertLength(1, 'kilometer', 'meter'), 1000);
assertClose(convertLength(1, 'centimeter', 'millimeter'), 10);
assertClose(convertLength(1, 'nanometer', 'picometer'), 1000);
assert.equal(convertLength(1, 'inch', 'centimeter'), 2.54);
assert.equal(convertLength(1, 'foot', 'meter'), 0.3048);
assert.equal(convertLength(1, 'mile', 'meter'), 1609.344);
assert.equal(convertLength(1, 'nauticalMile', 'meter'), 1852);
assert.equal(LENGTH_TO_METERS.meter, 1);

{
  const values = allFromBase('length', 1);
  assert.equal(values.centimeter, 100);
  assert.equal(values.millimeter, 1000);
  assertClose(values.inch, 39.3700787402, 8);
  assertClose(values.foot, 3.28083989501, 8);
}

// Mass
assert.equal(convertLinear(1, 'mass', 'kilogram', 'gram'), 1000);
assertClose(convertLinear(1, 'mass', 'gram', 'milligram'), 1000);
assert.equal(convertLinear(1, 'mass', 'pound', 'kilogram'), 0.45359237);

// Area
assertClose(convertLinear(1, 'area', 'squareMeter', 'squareCentimeter'), 10_000);
assert.equal(convertLinear(1, 'area', 'hectare', 'squareMeter'), 10_000);
assert.equal(convertLinear(1, 'area', 'acre', 'squareMeter'), 4046.8564224);

// Volume (liter base)
assertClose(convertLinear(1, 'volume', 'liter', 'milliliter'), 1000);
assert.equal(convertLinear(1, 'volume', 'cubicMeter', 'liter'), 1000);
assert.equal(convertLinear(1, 'volume', 'usGallon', 'liter'), 3.785411784);

// Temperature
assert.equal(fromKelvin(toKelvin(0, 'celsius'), 'fahrenheit'), 32);
assert.equal(fromKelvin(toKelvin(100, 'celsius'), 'fahrenheit'), 212);
assert.equal(toKelvin(0, 'celsius'), 273.15);
assert.equal(fromKelvin(toKelvin(-40, 'celsius'), 'fahrenheit'), -40);
assert.ok(!baseFromField(-300, 'temperature', 'celsius').ok);

// Speed
assertClose(convertLinear(1, 'speed', 'meterPerSecond', 'kilometerPerHour'), 3.6, 12);
assertClose(convertLinear(1, 'speed', 'knot', 'kilometerPerHour'), 1.852, 12);

// Pressure
assert.equal(convertLinear(1, 'pressure', 'atmosphere', 'pascal'), 101_325);
assert.equal(convertLinear(1, 'pressure', 'bar', 'pascal'), 100_000);

// Data
assert.equal(convertLinear(1, 'dataStorage', 'kilobyte', 'byte'), 1000);
assert.equal(convertLinear(1, 'dataStorage', 'kibibyte', 'byte'), 1024);
assert.equal(convertLinear(1, 'dataStorage', 'megabyte', 'byte'), 1_000_000);
assert.equal(convertLinear(1, 'dataStorage', 'mebibyte', 'byte'), 1_048_576);

// Time / energy / power smoke
assert.equal(convertLinear(1, 'time', 'minute', 'second'), 60);
assert.equal(toBase(1, 'energy', 'kilojoule'), 1000);
assert.equal(fromBase(1000, 'power', 'kilowatt'), 1);

assert.equal(parseMetricInput('').blank, true);
assert.ok(parseMetricInput('1e').incomplete);
assert.ok(!baseFromField(-1, 'length', 'meter').ok);
assert.match(shareResultText('length', 1000, 'kilometer'), /Metric Converter/);
assert.equal(formatMetricNumber(0), '0');

console.log('metric-converter calculation.test.ts: ok');
