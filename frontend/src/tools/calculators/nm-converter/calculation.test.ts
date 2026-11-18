import assert from 'node:assert/strict';
import {
  convertLength,
  formatLength,
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

assert.equal(toMeters(1, 'nm'), 1e-9);
assertClose(convertLength(1, 'nm', 'um'), 0.001, 12);
assertClose(convertLength(1, 'nm', 'mm'), 0.000001, 12);
assert.equal(convertLength(1, 'nm', 'angstrom'), 10);

assertClose(convertLength(100, 'nm', 'um'), 0.1, 12);
assertClose(convertLength(100, 'nm', 'mm'), 0.0001, 12);
assertClose(convertLength(100, 'nm', 'm'), 1e-7, 12);

assertClose(convertLength(1000, 'nm', 'um'), 1, 12);
assertClose(convertLength(1_000_000, 'nm', 'mm'), 1, 12);
assertClose(convertLength(1_000_000_000, 'nm', 'm'), 1, 10);

assertClose(convertLength(1, 'um', 'nm'), 1000, 12);
assertClose(convertLength(1, 'mm', 'nm'), 1_000_000, 10);
assertClose(convertLength(1, 'm', 'nm'), 1_000_000_000, 8);
assertClose(convertLength(1, 'km', 'nm'), 1_000_000_000_000, 6);

assertClose(convertLength(1, 'in', 'nm'), 25_400_000, 8);
assertClose(convertLength(1, 'ft', 'nm'), 304_800_000, 8);

assertClose(convertLength(-100, 'nm', 'um'), -0.1, 12);

assert.ok(metersFromField(100, 'nm').ok);
assert.equal(parseLengthInput('').blank, true);
assert.ok(parseLengthInput('abc').value === null);

assert.match(shareResultText(1e-7), /nm Converter/);
assert.ok(formatLength(1e-9).includes('e') || formatLength(1e-9) === '0.000000001');
assert.ok(formatLength(convertLength(1, 'nm', 'm')) !== '0');

console.log('nm-converter calculation.test.ts: ok');
