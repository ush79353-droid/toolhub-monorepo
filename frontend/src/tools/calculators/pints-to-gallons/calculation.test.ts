import assert from 'node:assert/strict';
import {
  calculatePintsToGallons,
  convertPintGallon,
  shareResultText,
  VOLUME_UNITS_ML,
} from './calculation';
import { parseOptionalNumber, validatePintsToGallons } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(VOLUME_UNITS_ML.usPt, 473.176473);
assert.equal(VOLUME_UNITS_ML.ukPt, 568.26125);
assert.equal(VOLUME_UNITS_ML.usGal, 3785.411784);
assert.equal(VOLUME_UNITS_ML.ukGal, 4546.09);

assertClose(convertPintGallon(1, 'usPt', 'usGal'), 0.125, 10);
assertClose(convertPintGallon(4, 'usPt', 'usGal'), 0.5, 10);
assertClose(convertPintGallon(8, 'usPt', 'usGal'), 1, 10);
assertClose(convertPintGallon(16, 'usPt', 'usGal'), 2, 10);
assertClose(convertPintGallon(1, 'ukPt', 'ukGal'), 0.125, 10);
assertClose(convertPintGallon(4, 'ukPt', 'ukGal'), 0.5, 10);
assertClose(convertPintGallon(8, 'ukPt', 'ukGal'), 1, 10);
assertClose(convertPintGallon(16, 'ukPt', 'ukGal'), 2, 10);
assertClose(convertPintGallon(1, 'usGal', 'usPt'), 8, 10);
assertClose(convertPintGallon(1, 'ukGal', 'ukPt'), 8, 10);
assert.equal(convertPintGallon(0, 'usPt', 'usGal'), 0);

assertClose(convertPintGallon(1, 'usPt', 'ukPt'), VOLUME_UNITS_ML.usPt / VOLUME_UNITS_ML.ukPt, 10);
assertClose(
  convertPintGallon(1, 'usPt', 'ukGal'),
  VOLUME_UNITS_ML.usPt / VOLUME_UNITS_ML.ukGal,
  10,
);

assert.throws(() => convertPintGallon(-1, 'usPt', 'usGal'));

{
  const gal = convertPintGallon(3.75, 'usPt', 'ukGal');
  assertClose(convertPintGallon(gal, 'ukGal', 'usPt'), 3.75, 10);
}

{
  const result = calculatePintsToGallons({ source: 'usPt', value: 1 });
  assertClose(result.usGal, 0.125, 10);
  assertClose(result.ukPt, VOLUME_UNITS_ML.usPt / VOLUME_UNITS_ML.ukPt, 8);
  assertClose(result.ukGal, VOLUME_UNITS_ML.usPt / VOLUME_UNITS_ML.ukGal, 8);
  assert.match(shareResultText(result), /Pints to Gallons/);
}

{
  const result = calculatePintsToGallons({ source: 'ukPt', value: 1 });
  assertClose(result.ukGal, 0.125, 10);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(validatePintsToGallons({ source: 'usPt', value: 0 }).isValid);
assert.ok(!validatePintsToGallons({ source: 'usPt', value: -1 }).isValid);
assert.ok(!validatePintsToGallons({ source: 'usPt', value: null }).isValid);

console.log('pints-to-gallons calculation.test.ts: ok');
