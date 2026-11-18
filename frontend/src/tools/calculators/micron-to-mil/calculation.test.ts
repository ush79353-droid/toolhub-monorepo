import assert from 'node:assert/strict';
import {
  MICRONS_PER_MIL,
  convertLength,
  formatLength,
  milsToMicrons,
  micronsToMils,
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

assert.equal(MICRONS_PER_MIL, 25.4);

assert.equal(micronsToMils(0), 0);
assert.equal(milsToMicrons(0), 0);
assertClose(micronsToMils(25.4), 1, 12);
assertClose(micronsToMils(50.8), 2, 12);
assertClose(micronsToMils(127), 5, 12);
assertClose(micronsToMils(254), 10, 12);
assertClose(micronsToMils(1000), 39.37007874015748, 10);

assertClose(milsToMicrons(1), 25.4, 12);
assertClose(milsToMicrons(10), 254, 12);
assertClose(milsToMicrons(40), 1016, 12);
assertClose(milsToMicrons(50), 1270, 12);

assertClose(micronsToMils(1), 1 / 25.4, 12);
assertClose(micronsToMils(100), 100 / 25.4, 12);

{
  const original = 77.7;
  assertClose(milsToMicrons(micronsToMils(original)), original, 10);
}

assertClose(micronsToMils(1), convertLength(1, 'um', 'mil'), 12);
assertClose(milsToMicrons(1), convertLength(1, 'mil', 'um'), 12);
assertClose(toMeters(1, 'mil') / toMeters(1, 'um'), 25.4, 12);

assertClose(micronsToMils(-25.4), -1, 12);
assertClose(milsToMicrons(-2), -50.8, 12);

assert.equal(parseLengthInput('').blank, true);
assert.ok(parseLengthInput('1.5').value === 1.5);
assert.ok(parseLengthInput('-1').value === -1);
assert.ok(metersFromField(1, 'um').ok);
assert.ok(metersFromField(-1, 'mil').ok);
assert.ok(!metersFromField(Number.NaN, 'um').ok);

assert.match(shareResultText(toMeters(100, 'um')), /Micron to Mil/);
assert.ok(formatLength(micronsToMils(1)).includes('03937') || formatLength(micronsToMils(1)).includes('e'));

console.log('micron-to-mil calculation.test.ts: ok');
