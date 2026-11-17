import assert from 'node:assert/strict';
import {
  calculateHeight,
  centimetersToMeters,
  feetInchesToMeters,
  feetToMeters,
  inchesToMeters,
  metersCentimetersToMeters,
  metersToCentimeters,
  metersToFeetInches,
  metersToMetersCm,
  normalizeFeetInches,
  normalizeMetersCm,
  shareResultText,
} from './calculation';
import {
  CENTIMETERS_PER_FOOT,
  CENTIMETERS_PER_INCH,
  METERS_PER_FOOT,
  METERS_PER_INCH,
} from './types';
import { parseOptionalNumber, validateHeight } from './validation';

function assertClose(actual: number, expected: number, digits = 9): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(centimetersToMeters(0), 0);
assert.equal(centimetersToMeters(100), 1);
assert.equal(centimetersToMeters(170), 1.7);
assert.equal(metersToCentimeters(1.75), 175);

assert.equal(inchesToMeters(1), METERS_PER_INCH);
assert.equal(metersToCentimeters(inchesToMeters(1)), CENTIMETERS_PER_INCH);
assert.equal(feetToMeters(1), METERS_PER_FOOT);
assert.equal(metersToCentimeters(feetToMeters(1)), CENTIMETERS_PER_FOOT);
assertClose(metersToCentimeters(feetToMeters(5)), 152.4, 10);
assertClose(metersToCentimeters(feetToMeters(6)), 182.88, 10);

assertClose(metersToCentimeters(feetInchesToMeters(5, 7)), 170.18, 10);
assert.equal(metersToCentimeters(feetInchesToMeters(5, 10)), 177.8);
assertClose(feetInchesToMeters(5, 10), 1.778, 10);

assert.equal(metersCentimetersToMeters(1, 75), 1.75);
assert.equal(metersToCentimeters(metersCentimetersToMeters(1, 75)), 175);

{
  const inches = 180 / CENTIMETERS_PER_INCH;
  assertClose(inches, 70.8661417323, 8);
  const feet = 180 / CENTIMETERS_PER_FOOT;
  assertClose(feet, 5.905511811, 8);
}

{
  const n = normalizeFeetInches(5, 14);
  assert.equal(n.feetPart, 6);
  assertClose(n.inchesPart, 2, 10);
}

{
  const n = normalizeFeetInches(5, 12);
  assert.equal(n.feetPart, 6);
  assertClose(n.inchesPart, 0, 10);
}

{
  const n = normalizeFeetInches(0, 70);
  assert.equal(n.feetPart, 5);
  assertClose(n.inchesPart, 10, 10);
}

{
  const n = normalizeMetersCm(1, 100);
  assert.equal(n.metersPart, 2);
  assertClose(n.centimetersPart, 0, 10);
}

{
  const n = normalizeMetersCm(0, 185);
  assert.equal(n.metersPart, 1);
  assertClose(n.centimetersPart, 85, 10);
}

{
  const mixed = metersToFeetInches(centimetersToMeters(170));
  assert.equal(mixed.feetPart, 5);
  assertClose(mixed.inchesPart, 6.9291338583, 6);
}

{
  const compound = metersToMetersCm(1.75);
  assert.equal(compound.metersPart, 1);
  assertClose(compound.centimetersPart, 75, 10);
}

assert.throws(() => centimetersToMeters(-1));
assert.throws(() => feetInchesToMeters(-1, 0));
assert.throws(() => feetInchesToMeters(5, -1));

{
  const result = calculateHeight({
    source: 'centimeters',
    centimeters: 170,
    meters: null,
    metersPart: null,
    centimetersPart: null,
    inches: null,
    feet: null,
    feetPart: null,
    inchesPart: null,
    otherUnit: 'mm',
    otherValue: null,
  });
  assert.equal(result.meters, 1.7);
  assert.equal(result.centimeters, 170);
  assert.equal(result.metersPart, 1);
  assertClose(result.centimetersPart, 70, 10);
  assert.equal(result.feetPart, 5);
  assertClose(result.otherValue, 1700, 8);
  assert.match(shareResultText(result), /Height Converter/);
}

{
  const result = calculateHeight({
    source: 'feetInches',
    centimeters: null,
    meters: null,
    metersPart: null,
    centimetersPart: null,
    inches: null,
    feet: null,
    feetPart: 5,
    inchesPart: 10,
    otherUnit: 'km',
    otherValue: null,
  });
  assertClose(result.centimeters, 177.8, 10);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  validateHeight({
    source: 'centimeters',
    centimeters: 0,
    meters: null,
    metersPart: null,
    centimetersPart: null,
    inches: null,
    feet: null,
    feetPart: null,
    inchesPart: null,
    otherUnit: 'km',
    otherValue: null,
  }).isValid,
);
assert.ok(
  !validateHeight({
    source: 'centimeters',
    centimeters: -3,
    meters: null,
    metersPart: null,
    centimetersPart: null,
    inches: null,
    feet: null,
    feetPart: null,
    inchesPart: null,
    otherUnit: 'km',
    otherValue: null,
  }).isValid,
);

console.log('height-converter calculation.test.ts: ok');
