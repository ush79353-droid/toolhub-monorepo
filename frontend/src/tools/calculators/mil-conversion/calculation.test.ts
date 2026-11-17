import assert from 'node:assert/strict';
import {
  METERS_PER_MIL,
  MICRONS_PER_MIL,
  MILS_PER_INCH,
  convertLength,
  formatLength,
  metersToMil,
  milToMeters,
  shareResultText,
} from './calculation';
import { metersFromField, parseLengthInput } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(METERS_PER_MIL, 0.0000254);
assert.equal(MICRONS_PER_MIL, 25.4);
assert.equal(MILS_PER_INCH, 1000);

assertClose(convertLength(1, 'mil', 'in'), 0.001, 12);
assertClose(convertLength(1000, 'mil', 'in'), 1, 12);
assertClose(convertLength(1, 'mil', 'um'), 25.4, 12);
assertClose(convertLength(10, 'mil', 'um'), 254, 12);
assertClose(convertLength(100, 'mil', 'um'), 2540, 12);
assertClose(convertLength(1, 'mil', 'mm'), 0.0254, 12);
assertClose(convertLength(100, 'mil', 'mm'), 2.54, 12);
assertClose(convertLength(1, 'in', 'mil'), 1000, 12);
assertClose(convertLength(1, 'mm', 'mil'), 39.37007874015748, 10);

assertClose(milToMeters(1), 0.0000254, 12);
assertClose(metersToMil(0.0000254), 1, 12);
assertClose(convertLength(100, 'mil', 'cm'), 0.254, 12);
assertClose(convertLength(100, 'mil', 'ft'), 100 / 12000, 12);

assertClose(convertLength(-10, 'mil', 'um'), -254, 12);
assert.equal(convertLength(0, 'mil', 'mm'), 0);

assert.equal(parseLengthInput('').blank, true);
assert.ok(parseLengthInput('-1').value === -1);
assert.ok(metersFromField(100, 'mil').ok);
assert.ok(metersFromField(-1, 'mm').ok);

assert.match(shareResultText(milToMeters(100)), /Mil Conversion/);
assert.ok(formatLength(convertLength(1, 'mm', 'mil')).startsWith('39.37'));

console.log('mil-conversion calculation.test.ts: ok');
