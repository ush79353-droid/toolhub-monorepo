import assert from 'node:assert/strict';
import {
  METERS_PER_MM,
  MM_PER_INCH,
  convertLength,
  formatLength,
  metersToMillimeters,
  millimetersToMeters,
  shareResultText,
} from './calculation';
import { MM_PER_FOOT, MM_PER_MILE, MM_PER_YARD } from './types';
import { metersFromField, parseLengthInput } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(METERS_PER_MM, 0.001);
assert.equal(MM_PER_INCH, 25.4);
assert.equal(MM_PER_FOOT, 304.8);
assert.equal(MM_PER_YARD, 914.4);
assert.equal(MM_PER_MILE, 1_609_344);

assertClose(convertLength(1, 'mm', 'cm'), 0.1, 12);
assertClose(convertLength(1, 'mm', 'm'), 0.001, 12);
assertClose(convertLength(1, 'mm', 'km'), 0.000001, 12);
assertClose(convertLength(10, 'mm', 'cm'), 1, 12);
assertClose(convertLength(1000, 'mm', 'm'), 1, 12);
assertClose(convertLength(25.4, 'mm', 'in'), 1, 12);
assertClose(convertLength(304.8, 'mm', 'ft'), 1, 12);
assertClose(convertLength(914.4, 'mm', 'yd'), 1, 12);
assertClose(convertLength(1_609_344, 'mm', 'mi'), 1, 12);
assertClose(convertLength(50.8, 'mm', 'in'), 2, 12);
assertClose(convertLength(127, 'mm', 'in'), 5, 12);
assertClose(convertLength(2500, 'mm', 'm'), 2.5, 12);
assertClose(convertLength(1, 'in', 'mm'), 25.4, 12);
assertClose(convertLength(1, 'ft', 'mm'), 304.8, 12);

assertClose(millimetersToMeters(1), 0.001, 12);
assertClose(metersToMillimeters(0.001), 1, 12);
assertClose(convertLength(-10, 'mm', 'cm'), -1, 12);
assert.equal(convertLength(0, 'mm', 'in'), 0);

assert.equal(parseLengthInput('').blank, true);
assert.ok(parseLengthInput('-1').value === -1);
assert.ok(metersFromField(1, 'mm').ok);

assert.match(shareResultText(millimetersToMeters(25.4)), /Millimeter Calculator/);
assert.ok(formatLength(convertLength(1, 'mm', 'in')).startsWith('0.039'));

console.log('millimeter calculation.test.ts: ok');
