import assert from 'node:assert/strict';
import {
  applyScaleToMeasurement,
  calculateScale,
  formatScaleRatio,
  linearScaleFromMeasurements,
  parseScaleFactor,
  realFromScaledMeasurement,
  toBase,
} from './calculation';
import { parseScaleInput } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-10): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected} ± ${eps}, got ${actual}`
  );
}

// Ratio parsing
assertClose(parseScaleFactor('1:200')!, 0.005);
assertClose(parseScaleFactor('2:1')!, 2);
assertClose(parseScaleFactor('1:1')!, 1);
assertClose(parseScaleFactor('0.005')!, 0.005);
assert.equal(Number.isNaN(parseScaleFactor('1:0')!), true);
assert.equal(Number.isNaN(parseScaleFactor('-1')!), true);
assert.equal(parseScaleFactor('') , null);

assert.equal(formatScaleRatio(0.005), '1:200');
assert.equal(formatScaleRatio(0.2), '1:5');
assert.equal(formatScaleRatio(2), '2:1');
assert.equal(formatScaleRatio(1), '1:1');

// Length scale factor: 5 cm / 10 m
{
  const scaled = toBase(5, 'cm', 'length');
  const real = toBase(10, 'm', 'length');
  const k = linearScaleFromMeasurements(scaled, real, 'length');
  assertClose(k, 0.005);
  assert.equal(formatScaleRatio(k), '1:200');

  const result = calculateScale({
    dimension: 'length',
    mode: 'scale-factor',
    scaledValue: 5,
    realValue: 10,
    scaledUnit: 'cm',
    realUnit: 'm',
    scaleFactor: null,
  });
  assertClose(result.scaleFactor, 0.005);
  assert.equal(result.scaleRatio, '1:200');
  assert.equal(result.scaleKind, 'reduction');
}

// Real length: 2.5 cm at 1:100 → 2.5 m
{
  const result = calculateScale({
    dimension: 'length',
    mode: 'real-measurement',
    scaledValue: 2.5,
    realValue: null,
    scaledUnit: 'cm',
    realUnit: 'm',
    scaleFactor: parseScaleFactor('1:100'),
  });
  assertClose(result.realValue, 2.5);
  assert.equal(result.scaleRatio, '1:100');
}

// Scaled length: 10 m at 1:100 → 0.1 m (= 10 cm in cm unit)
{
  const result = calculateScale({
    dimension: 'length',
    mode: 'scaled-measurement',
    scaledValue: null,
    realValue: 10,
    scaledUnit: 'cm',
    realUnit: 'm',
    scaleFactor: 0.01,
  });
  assertClose(result.scaledValue, 10); // 0.1 m in cm
}

{
  const result = calculateScale({
    dimension: 'length',
    mode: 'scaled-measurement',
    scaledValue: null,
    realValue: 10,
    scaledUnit: 'm',
    realUnit: 'm',
    scaleFactor: 0.01,
  });
  assertClose(result.scaledValue, 0.1);
}

// Area scale factor: 4 / 100 → k = 0.2
{
  const k = linearScaleFromMeasurements(4, 100, 'area');
  assertClose(k, 0.2);
  assert.equal(formatScaleRatio(k), '1:5');
}

// Volume scale factor: 8 / 1000 → k = 0.2
{
  const k = linearScaleFromMeasurements(8, 1000, 'volume');
  assertClose(k, 0.2);
  assert.equal(formatScaleRatio(k), '1:5');
}

// Area scaled: 100 m² at 1:10 → 1 m²
{
  const result = calculateScale({
    dimension: 'area',
    mode: 'scaled-measurement',
    scaledValue: null,
    realValue: 100,
    scaledUnit: 'm2',
    realUnit: 'm2',
    scaleFactor: 0.1,
  });
  assertClose(result.scaledValue, 1);
  assertClose(result.measurementMultiplier, 0.01);
}

// Volume scaled: 1000 m³ at 1:10 → 1 m³
{
  const result = calculateScale({
    dimension: 'volume',
    mode: 'scaled-measurement',
    scaledValue: null,
    realValue: 1000,
    scaledUnit: 'm3',
    realUnit: 'm3',
    scaleFactor: 0.1,
  });
  assertClose(result.scaledValue, 1);
  assertClose(result.measurementMultiplier, 0.001);
}

// Enlargement 2:1
{
  const result = calculateScale({
    dimension: 'length',
    mode: 'scaled-measurement',
    scaledValue: null,
    realValue: 10,
    scaledUnit: 'cm',
    realUnit: 'cm',
    scaleFactor: 2,
  });
  assertClose(result.scaledValue, 20);
  assert.equal(result.scaleKind, 'enlargement');
  assert.equal(result.scaleRatio, '2:1');
}

// Actual size
{
  const result = calculateScale({
    dimension: 'length',
    mode: 'scaled-measurement',
    scaledValue: null,
    realValue: 10,
    scaledUnit: 'cm',
    realUnit: 'cm',
    scaleFactor: 1,
  });
  assertClose(result.scaledValue, 10);
  assert.equal(result.scaleKind, 'actual');
  assert.equal(result.scaleRatio, '1:1');
}

// Map distance: 5 cm at 1:100000 → 5 km
{
  const result = calculateScale({
    dimension: 'length',
    mode: 'real-measurement',
    scaledValue: 5,
    realValue: null,
    scaledUnit: 'cm',
    realUnit: 'km',
    scaleFactor: parseScaleFactor('1:100000'),
  });
  assertClose(result.realValue, 5);
}

assert.throws(() => linearScaleFromMeasurements(1, 0, 'length'));
assert.throws(() => applyScaleToMeasurement(1, 0, 'length'));
assert.throws(() => realFromScaledMeasurement(1, -1, 'length'));

{
  const bad = parseScaleInput('1:0');
  assert.equal(bad.value, null);
  assert.ok(bad.error);
}
{
  const ok = parseScaleInput('1:100');
  assertClose(ok.value!, 0.01);
}

console.log('scale calculation.test.ts: ok');
