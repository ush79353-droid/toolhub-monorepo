import assert from 'node:assert/strict';
import {
  convertMeasurement,
  conversionFactor,
  formatWithPrecision,
  shareResultText,
  calculateMeasurement,
} from './calculation';
import { getCategory } from './units';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

{
  const r = convertMeasurement({ value: 1000, category: 'length', fromUnit: 'm', toUnit: 'km' });
  assert.ok(r.ok);
  assert.equal(r.value, 1);
}
{
  const r = convertMeasurement({ value: 2.54, category: 'length', fromUnit: 'cm', toUnit: 'in' });
  assert.ok(r.ok);
  assertClose(r.value, 1, 10);
}
{
  const r = convertMeasurement({ value: 1, category: 'length', fromUnit: 'mi', toUnit: 'm' });
  assert.ok(r.ok);
  assert.equal(r.value, 1609.344);
}
{
  const r = convertMeasurement({ value: 1, category: 'mass', fromUnit: 'kg', toUnit: 'lb' });
  assert.ok(r.ok);
  assertClose(r.value, 2.20462262185, 10);
}
{
  const r = convertMeasurement({ value: 1000, category: 'mass', fromUnit: 'g', toUnit: 'kg' });
  assert.ok(r.ok);
  assert.equal(r.value, 1);
}
{
  const r = convertMeasurement({ value: 1, category: 'time', fromUnit: 'h', toUnit: 's' });
  assert.ok(r.ok);
  assert.equal(r.value, 3600);
}
{
  const r = convertMeasurement({ value: 100, category: 'speed', fromUnit: 'kmh', toUnit: 'mps' });
  assert.ok(r.ok);
  assertClose(r.value, 27.7777777778, 8);
}
{
  const r = convertMeasurement({ value: 1, category: 'area', fromUnit: 'ha', toUnit: 'm2' });
  assert.ok(r.ok);
  assert.equal(r.value, 10_000);
}
{
  const r = convertMeasurement({ value: 1, category: 'volume', fromUnit: 'L', toUnit: 'cm3' });
  assert.ok(r.ok);
  assertClose(r.value, 1000, 10);
}
{
  const r = convertMeasurement({ value: 0, category: 'temperature', fromUnit: 'C', toUnit: 'F' });
  assert.ok(r.ok);
  assert.equal(r.value, 32);
}
{
  const r = convertMeasurement({ value: 100, category: 'temperature', fromUnit: 'C', toUnit: 'F' });
  assert.ok(r.ok);
  assert.equal(r.value, 212);
}
{
  const r = convertMeasurement({ value: 0, category: 'temperature', fromUnit: 'C', toUnit: 'K' });
  assert.ok(r.ok);
  assert.equal(r.value, 273.15);
}
{
  const r = convertMeasurement({ value: 1, category: 'pressure', fromUnit: 'bar', toUnit: 'Pa' });
  assert.ok(r.ok);
  assert.equal(r.value, 100_000);
}
{
  const r = convertMeasurement({ value: 1, category: 'energy', fromUnit: 'kWh', toUnit: 'J' });
  assert.ok(r.ok);
  assert.equal(r.value, 3_600_000);
}

assertClose(conversionFactor('length', 'm', 'km')!, 0.001, 12);
assertClose(conversionFactor('speed', 'kmh', 'mps')!, 1000 / 3600, 12);

{
  const forward = convertMeasurement({
    value: 1500,
    category: 'length',
    fromUnit: 'm',
    toUnit: 'km',
  });
  assert.ok(forward.ok);
  const back = convertMeasurement({
    value: forward.value,
    category: 'length',
    fromUnit: 'km',
    toUnit: 'm',
  });
  assert.ok(back.ok);
  assertClose(back.value, 1500, 10);
}

assert.equal(formatWithPrecision(0.000001, 'auto'), '0.000001');
assert.match(formatWithPrecision(1234.56789, '3'), /^1\.23e\+3$/i);

assert.equal(getCategory('length').symbol, '[L]');
assert.equal(getCategory('temperature').symbol, '[Θ]');

{
  const result = calculateMeasurement({
    dimension: 'length',
    fromUnit: 'm',
    toUnit: 'km',
    value: 1500,
    activeField: 'input',
    precision: 'auto',
  });
  assert.ok(result);
  assert.equal(result.outputValue, 1.5);
  assert.match(shareResultText(result), /Measurement Converter/);
}

console.log('measurement-converter calculation.test.ts: ok');
