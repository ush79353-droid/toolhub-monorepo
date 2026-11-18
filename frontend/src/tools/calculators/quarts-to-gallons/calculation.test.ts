import assert from 'node:assert/strict';
import {
  US_QUARTS_PER_GALLON,
  VOLUME_UNITS_ML,
  calculateQuartsToGallons,
  convertQuartsGallons,
  gallonsToQuarts,
  quartsToGallons,
  shareResultText,
} from './calculation';
import { parseOptionalNumber, validateQuartsToGallons } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(US_QUARTS_PER_GALLON, 4);
assert.equal(VOLUME_UNITS_ML.usLiquidQuart, 946.352946);
assert.equal(VOLUME_UNITS_ML.usLiquidGallon, 3785.411784);
assert.equal(VOLUME_UNITS_ML.imperialQuart, 1136.5225);
assert.equal(VOLUME_UNITS_ML.imperialGallon, 4546.09);

assert.equal(quartsToGallons(0), 0);
assertClose(quartsToGallons(1), 0.25, 10);
assertClose(quartsToGallons(2), 0.5, 10);
assertClose(quartsToGallons(4), 1, 10);
assertClose(quartsToGallons(8), 2, 10);
assertClose(quartsToGallons(10), 2.5, 10);
assertClose(quartsToGallons(0.25), 0.0625, 10);
assertClose(quartsToGallons(0.5), 0.125, 10);

assert.equal(gallonsToQuarts(0), 0);
assertClose(gallonsToQuarts(1), 4, 10);
assertClose(gallonsToQuarts(2), 8, 10);
assertClose(gallonsToQuarts(2.5), 10, 10);

assertClose(gallonsToQuarts(quartsToGallons(7.25)), 7.25, 10);

assertClose(convertQuartsGallons(1, 'ukQt', 'ukGal'), 0.25, 10);
assertClose(convertQuartsGallons(1, 'ukGal', 'ukQt'), 4, 10);
assertClose(
  convertQuartsGallons(1, 'usGal', 'ukQt'),
  VOLUME_UNITS_ML.usLiquidGallon / VOLUME_UNITS_ML.imperialQuart,
  10,
);

{
  const result = calculateQuartsToGallons({
    source: 'quarts',
    value: 4,
    gallonUnit: 'usGal',
    quartUnit: 'usQt',
  });
  assertClose(result.gallons, 1, 10);
  assertClose(result.extras.usCup, 16, 10);
  assertClose(result.extras.usPt, 8, 10);
  assertClose(result.extras.usFlOz, 128, 10);
  assert.match(shareResultText(result), /Quarts to Gallons Converter/);
  assert.match(shareResultText(result), /4 US qt/);
}

assert.throws(() => quartsToGallons(-1));
assert.equal(parseOptionalNumber(''), null);
assert.ok(
  validateQuartsToGallons({
    source: 'quarts',
    value: 0,
    gallonUnit: 'usGal',
    quartUnit: 'usQt',
  }).isValid,
);
assert.ok(
  !validateQuartsToGallons({
    source: 'quarts',
    value: -1,
    gallonUnit: 'usGal',
    quartUnit: 'usQt',
  }).isValid,
);

console.log('quarts-to-gallons calculation.test.ts: ok');
