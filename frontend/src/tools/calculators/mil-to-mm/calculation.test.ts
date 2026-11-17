import assert from 'node:assert/strict';
import {
  MM_PER_MIL,
  MILS_PER_MM,
  convertLength,
  formatLength,
  milToMm,
  mmToMil,
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

assert.equal(MM_PER_MIL, 0.0254);
assertClose(MILS_PER_MM, 5000 / 127, 15);

assertClose(milToMm(1), 0.0254);
assertClose(milToMm(2), 0.0508);
assertClose(milToMm(5), 0.127);
assertClose(milToMm(7), 0.1778);
assertClose(milToMm(10), 0.254);
assertClose(milToMm(12), 0.3048);
assertClose(milToMm(20), 0.508);
assertClose(milToMm(25), 0.635);
assertClose(milToMm(50), 1.27);
assertClose(milToMm(100), 2.54);
assertClose(milToMm(250), 6.35);
assertClose(milToMm(500), 12.7);
assertClose(milToMm(1000), 25.4);

assertClose(mmToMil(0.0254), 1);
assertClose(mmToMil(0.127), 5);
assertClose(mmToMil(0.254), 10);
assertClose(mmToMil(0.508), 20);
assertClose(mmToMil(1.27), 50);
assertClose(mmToMil(2.54), 100);
assertClose(mmToMil(12.7), 500);
assertClose(mmToMil(25.4), 1000);

assertClose(convertLength(1, 'mil', 'mm'), 0.0254);
assertClose(convertLength(1, 'mm', 'mil'), MILS_PER_MM, 10);
assertClose(milToMm(-10), -0.254);
assert.equal(milToMm(0), 0);

assert.equal(parseLengthInput('').blank, true);
assert.ok(parseLengthInput('-1').value === -1);
assert.ok(metersFromField(1, 'mil').ok);

assert.match(shareResultText(toMeters(12, 'mil')), /Mil to mm/);
assert.equal(formatLength(milToMm(12)), '0.3048');

console.log('mil-to-mm calculation.test.ts: ok');
