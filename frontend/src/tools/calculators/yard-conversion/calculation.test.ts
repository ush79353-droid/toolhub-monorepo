import assert from 'node:assert/strict';
import {
  convertLength,
  formatLength,
  metersToFeetAndInches,
  metersToYards,
  normalizeFeetInches,
  shareResultText,
  yardsToFeet,
  yardsToInches,
  yardsToMeters,
  yardsToMiles,
} from './calculation';
import { metersFromField, parseLengthInput } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(yardsToFeet(1), 3, 12);
assertClose(yardsToInches(1), 36, 12);
assert.equal(yardsToMeters(1), 0.9144);
assertClose(yardsToMeters(100), 91.44, 12);
assertClose(yardsToMiles(1760), 1, 12);
assertClose(metersToYards(1), 1.0936132983377078, 7);
assertClose(convertLength(1000, 'yd', 'km'), 0.9144, 12);
assert.equal(yardsToMeters(0), 0);

{
  const value = 125;
  const meters = yardsToMeters(value);
  assertClose(metersToYards(meters), value, 12);
}

assertClose(convertLength(10, 'yd', 'ft'), 30, 12);
assertClose(convertLength(25, 'yd', 'm'), 22.86, 12);
assertClose(convertLength(100, 'yd', 'in'), 3600, 12);
assertClose(convertLength(100, 'yd', 'km'), 0.09144, 12);
assertClose(convertLength(1, 'mi', 'yd'), 1760, 12);
assertClose(convertLength(1, 'km', 'yd'), 1093.6132983377078, 7);
assertClose(convertLength(914.4, 'cm', 'yd'), 10, 10);

{
  const mixed = metersToFeetAndInches(yardsToMeters(2.5));
  assert.equal(mixed.feet, 7);
  assertClose(mixed.inches, 6, 10);
}

{
  const n = normalizeFeetInches(7, 12);
  assert.equal(n.feet, 8);
  assertClose(n.inches, 0, 10);
}

assert.equal(parseLengthInput('').blank, true);
assert.ok(parseLengthInput('-1').value == null);
assert.ok(parseLengthInput('10').value === 10);
assert.ok(metersFromField(1, 'yd').ok);
assert.equal(metersFromField(-1, 'yd').ok, false);

assert.match(shareResultText(yardsToMeters(10)), /Yard Conversion/);
assert.ok(formatLength(yardsToMeters(1)) === '0.9144');

console.log('yard-conversion calculation.test.ts: ok');
