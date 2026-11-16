import assert from 'node:assert/strict';
import { convertMeasurement, formatValue, shareResultText } from './calculation';
import { LENGTH_TO_METERS, MASS_TO_KILOGRAMS } from './units';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

function must(result: ReturnType<typeof convertMeasurement>): number {
  assert.equal(result.ok, true);
  if (!result.ok) throw new Error(result.error);
  return result.value;
}

// Length
assertClose(must(convertMeasurement(1, 'length', 'm', 'ft')), 1 / LENGTH_TO_METERS.ft);
assertClose(must(convertMeasurement(1, 'length', 'km', 'mi')), 1000 / 1609.344);
assert.equal(must(convertMeasurement(1, 'length', 'in', 'cm')), 2.54);
assert.equal(must(convertMeasurement(1, 'length', 'mi', 'km')), 1.609344);

// Area
assertClose(must(convertMeasurement(1, 'area', 'm2', 'ft2')), 10.76391041671, 8);
assertClose(must(convertMeasurement(1, 'area', 'ha', 'acre')), 2.47105381467, 8);
assert.equal(must(convertMeasurement(1, 'area', 'acre', 'm2')), 4046.8564224);

// Volume
assertClose(must(convertMeasurement(1, 'volume', 'L', 'usGal')), 1 / 3.785411784, 8);
assert.equal(must(convertMeasurement(1, 'volume', 'usGal', 'L')), 3.785411784);
assert.equal(must(convertMeasurement(1, 'volume', 'impGal', 'L')), 4.54609);

// Mass
assertClose(must(convertMeasurement(1, 'mass', 'kg', 'lb')), 1 / MASS_TO_KILOGRAMS.lb, 8);
assert.equal(must(convertMeasurement(1, 'mass', 'lb', 'kg')), 0.45359237);
assertClose(must(convertMeasurement(1, 'mass', 'oz', 'g')), 28.349523125, 8);

// Temperature
assertClose(must(convertMeasurement(0, 'temperature', 'C', 'F')), 32);
assertClose(must(convertMeasurement(100, 'temperature', 'C', 'F')), 212);
assertClose(must(convertMeasurement(-40, 'temperature', 'C', 'F')), -40);
assertClose(must(convertMeasurement(0, 'temperature', 'K', 'F')), -459.67, 8);
assert.ok(!convertMeasurement(-1, 'temperature', 'K', 'F').ok);

// Speed
assertClose(must(convertMeasurement(100, 'speed', 'kmh', 'mph')), 62.13711922, 6);
assertClose(must(convertMeasurement(60, 'speed', 'mph', 'kmh')), 96.56064, 6);
assertClose(must(convertMeasurement(1, 'speed', 'mps', 'fps')), 1 / 0.3048, 8);

assert.equal(formatValue(0), '0');
assert.match(
  shareResultText({
    category: 'length',
    metricValue: 1,
    imperialValue: 3.280839895,
    metricUnitId: 'm',
    imperialUnitId: 'ft',
  }),
  /Metric to Imperial/,
);

console.log('metric-to-imperial calculation.test.ts: ok');
