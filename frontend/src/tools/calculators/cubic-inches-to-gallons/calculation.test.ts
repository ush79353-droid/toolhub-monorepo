import assert from 'node:assert/strict';
import {
  calculateCuInToGal,
  convertVolume,
  cubicInchesToLiters,
  cubicInchesToUKGallons,
  cubicInchesToUSGallons,
  shareResultText,
  ukGallonsToCubicInches,
  usGallonsToCubicInches,
} from './calculation';
import {
  CUBIC_INCHES_PER_US_GALLON,
  LITERS_PER_CUBIC_INCH,
  LITERS_PER_UK_GALLON,
  LITERS_PER_US_GALLON,
} from './types';
import { parseOptionalNumber, validateCuInToGal } from './validation';

function close(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(CUBIC_INCHES_PER_US_GALLON, 231);
assert.equal(LITERS_PER_CUBIC_INCH, 0.016387064);
assert.equal(LITERS_PER_UK_GALLON, 4.54609);
close(LITERS_PER_US_GALLON, 3.785411784, 12);

assert.equal(cubicInchesToUSGallons(0), 0);
close(cubicInchesToUSGallons(1), 1 / 231, 12);
close(cubicInchesToUSGallons(10), 10 / 231, 12);
close(cubicInchesToUSGallons(50), 50 / 231, 12);
close(cubicInchesToUSGallons(100), 100 / 231, 12);
close(cubicInchesToUSGallons(231), 1, 12);
close(cubicInchesToUSGallons(462), 2, 12);
close(cubicInchesToUSGallons(500), 500 / 231, 12);
close(cubicInchesToUSGallons(1000), 1000 / 231, 12);
close(cubicInchesToUSGallons(1155), 5, 12);
close(usGallonsToCubicInches(5), 1155, 12);

close(cubicInchesToLiters(0), 0, 12);
close(cubicInchesToLiters(1), 0.016387064, 12);
close(cubicInchesToLiters(10), 0.16387064, 12);
close(cubicInchesToLiters(100), 1.6387064, 12);
close(cubicInchesToLiters(231), 3.785411784, 12);
close(cubicInchesToLiters(500), 8.193532, 12);
close(cubicInchesToLiters(1000), 16.387064, 12);

close(cubicInchesToUKGallons(1), LITERS_PER_CUBIC_INCH / LITERS_PER_UK_GALLON, 12);
close(cubicInchesToUKGallons(100), (100 * LITERS_PER_CUBIC_INCH) / LITERS_PER_UK_GALLON, 10);
close(cubicInchesToUKGallons(231), (231 * LITERS_PER_CUBIC_INCH) / LITERS_PER_UK_GALLON, 10);
close(cubicInchesToUKGallons(500), (500 * LITERS_PER_CUBIC_INCH) / LITERS_PER_UK_GALLON, 10);
close(cubicInchesToUKGallons(1000), (1000 * LITERS_PER_CUBIC_INCH) / LITERS_PER_UK_GALLON, 10);
close(ukGallonsToCubicInches(1), LITERS_PER_UK_GALLON / LITERS_PER_CUBIC_INCH, 8);

close(convertVolume(231, 'in3', 'us_gal'), 1, 12);
close(convertVolume(231, 'in3', 'L'), 3.785411784, 12);
close(convertVolume(100, 'in3', 'mL'), 1638.7064, 8);
assert.equal(convertVolume(0, 'in3', 'us_gal'), 0);

assert.throws(() => cubicInchesToUSGallons(-1));
assert.throws(() => convertVolume(-1, 'in3', 'L'));

{
  const result = calculateCuInToGal({
    source: 'cubicInches',
    cubicInches: 231,
    gallons: null,
    other: null,
    gallonKind: 'usGal',
    otherUnit: 'L',
  });
  close(result.gallons, 1, 12);
  close(result.liters, 3.785411784, 12);
  close(result.other, 3.785411784, 12);
  assert.match(shareResultText(result), /231/);
}

{
  const uk = calculateCuInToGal({
    source: 'cubicInches',
    cubicInches: 231,
    gallons: null,
    other: null,
    gallonKind: 'ukGal',
    otherUnit: 'L',
  });
  close(uk.gallons, (231 * LITERS_PER_CUBIC_INCH) / LITERS_PER_UK_GALLON, 10);
  close(uk.liters, 3.785411784, 12);
}

{
  const fromL = calculateCuInToGal({
    source: 'other',
    cubicInches: null,
    gallons: null,
    other: 10,
    gallonKind: 'usGal',
    otherUnit: 'L',
  });
  close(fromL.cubicInches, 10 / LITERS_PER_CUBIC_INCH, 8);
  close(fromL.gallons, 10 / LITERS_PER_US_GALLON, 8);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  !validateCuInToGal({
    source: 'cubicInches',
    cubicInches: null,
    gallons: null,
    other: null,
    gallonKind: 'usGal',
    otherUnit: 'L',
  }).isValid,
);

console.log('cubic-inches-to-gallons calculation.test.ts: ok');
