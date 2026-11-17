import assert from 'node:assert/strict';
import {
  calculateGalToCups,
  cupsToGallons,
  gallonsToCups,
  shareResultText,
} from './calculation';
import { CUPS_PER_US_GALLON } from './types';
import { parseOptionalNumber, validateGalToCups } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(CUPS_PER_US_GALLON, 16);
assert.equal(gallonsToCups(0), 0);
assert.equal(gallonsToCups(1), 16);
assert.equal(gallonsToCups(2), 32);
assert.equal(gallonsToCups(3), 48);
assert.equal(gallonsToCups(0.5), 8);
assert.equal(gallonsToCups(0.25), 4);
assert.equal(cupsToGallons(8), 0.5);
assert.equal(cupsToGallons(24), 1.5);
assert.equal(cupsToGallons(32), 2);

assert.throws(() => gallonsToCups(-1));
assert.throws(() => cupsToGallons(-2));

{
  const cups = gallonsToCups(7.5);
  assertClose(cupsToGallons(cups), 7.5, 10);
}

{
  const result = calculateGalToCups({ source: 'gallons', gallons: 2, cups: null });
  assert.equal(result.cups, 32);
  assert.match(shareResultText(result), /Gallons to Cups/);
}

{
  const result = calculateGalToCups({ source: 'cups', gallons: null, cups: 12 });
  assert.equal(result.gallons, 0.75);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(validateGalToCups({ source: 'gallons', gallons: 0, cups: null }).isValid);
assert.ok(!validateGalToCups({ source: 'gallons', gallons: -1, cups: null }).isValid);
assert.ok(!validateGalToCups({ source: 'cups', gallons: null, cups: null }).isValid);

console.log('gallons-to-cups calculation.test.ts: ok');
