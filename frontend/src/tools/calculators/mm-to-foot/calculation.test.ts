import assert from 'node:assert/strict';
import {
  MM_PER_FOOT,
  convertLength,
  feetToMillimeters,
  formatLength,
  millimetersToFeet,
  shareResultText,
  toMeters,
} from './calculation';
import { metersFromField, parseLengthInput } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(MM_PER_FOOT, 304.8);

assert.equal(millimetersToFeet(304.8), 1);
assert.equal(millimetersToFeet(609.6), 2);
assert.equal(millimetersToFeet(1219.2), 4);
assert.equal(millimetersToFeet(2438.4), 8);
assert.equal(millimetersToFeet(3048), 10);

assert.equal(feetToMillimeters(1), 304.8);
assert.equal(feetToMillimeters(2), 609.6);
assert.equal(feetToMillimeters(4), 1219.2);
assert.equal(feetToMillimeters(8), 2438.4);

assertClose(millimetersToFeet(150), 150 / 304.8);
assertClose(millimetersToFeet(1000), 1000 / 304.8);

assert.equal(convertLength(304.8, 'mm', 'ft'), 1);
assert.equal(convertLength(1, 'ft', 'mm'), 304.8);
assert.equal(convertLength(1000, 'mm', 'cm'), 100);
assertClose(convertLength(1, 'ft', 'in'), 12);

assert.equal(parseLengthInput('').blank, true);
assert.equal(parseLengthInput('1.').incomplete, true);
assert.equal(parseLengthInput('-5').value, -5);
assert.ok(parseLengthInput('abc').value === null);

{
  const ok = metersFromField(304.8, 'mm');
  assert.ok(ok.ok);
  if (ok.ok) assertClose(ok.meters, 0.3048);
}

assert.match(shareResultText(toMeters(1000, 'mm')), /mm to Foot Converter/);
assert.match(shareResultText(toMeters(1000, 'mm')), /\/tools\/mm-to-foot-converter/);
assert.ok(formatLength(millimetersToFeet(1000)).startsWith('3.280'));

console.log('mm-to-foot calculation.test.ts: ok');
