import assert from 'node:assert/strict';
import {
  INCHES_PER_MIL,
  MILS_PER_INCH,
  convertLength,
  formatLength,
  inchToMil,
  milToInch,
  shareResultText,
  toMeters,
} from './calculation';
import { metersFromField, parseLengthInput } from './validation';

function assertClose(actual: number, expected: number, digits = 12): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(INCHES_PER_MIL, 0.001);
assert.equal(MILS_PER_INCH, 1000);

assertClose(milToInch(1), 0.001);
assertClose(milToInch(10), 0.01);
assertClose(milToInch(20), 0.02);
assertClose(milToInch(60), 0.06);
assertClose(milToInch(100), 0.1);
assertClose(milToInch(250), 0.25);
assertClose(milToInch(500), 0.5);
assertClose(milToInch(1000), 1);

assertClose(inchToMil(0.001), 1);
assertClose(inchToMil(0.01), 10);
assertClose(inchToMil(0.1), 100);
assertClose(inchToMil(0.25), 250);
assertClose(inchToMil(0.5), 500);
assertClose(inchToMil(1), 1000);

assertClose(convertLength(1, 'mil', 'in'), 0.001);
assertClose(convertLength(1, 'in', 'mil'), 1000);
assertClose(convertLength(1, 'mil', 'mm'), 0.0254);
assertClose(milToInch(-60), -0.06);
assert.equal(milToInch(0), 0);

assert.equal(parseLengthInput('').blank, true);
assert.ok(parseLengthInput('-1').value === -1);
assert.ok(metersFromField(1, 'mil').ok);

assert.match(shareResultText(toMeters(60, 'mil')), /mil to inch/);
assert.equal(formatLength(milToInch(60)), '0.06');

console.log('mil-to-inch calculation.test.ts: ok');
