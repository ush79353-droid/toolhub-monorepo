import assert from 'node:assert/strict';
import {
  calculatePricePerLiterToGallon,
  pricePerGallonToLiter,
  pricePerLiterToGallon,
  shareResultText,
} from './calculation';
import { LITERS_PER_GALLON } from './types';
import { parseOptionalNumber, validatePricePerLiterToGallon } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(LITERS_PER_GALLON.us, 3.785411784);
assert.equal(LITERS_PER_GALLON.imperial, 4.54609);

assertClose(pricePerLiterToGallon(1, 'us'), 3.785411784, 9);
assertClose(pricePerLiterToGallon(1.5, 'us'), 5.678117676, 9);
assertClose(pricePerLiterToGallon(2, 'imperial'), 9.09218, 5);
assertClose(pricePerGallonToLiter(4, 'us'), 1.0566882094, 5);
assert.equal(pricePerLiterToGallon(0, 'us'), 0);

{
  const original = 2.75;
  const perGallon = pricePerLiterToGallon(original, 'us');
  assertClose(pricePerGallonToLiter(perGallon, 'us'), original, 12);
}

{
  const result = calculatePricePerLiterToGallon({
    source: 'perLiter',
    pricePerLiter: 1.5,
    pricePerGallon: null,
    gallonSystem: 'us',
    currency: 'USD',
  });
  assertClose(result.pricePerGallon, 5.678117676, 9);
  assert.match(shareResultText(result), /Price Per Liter to Price Per Gallon/);
}

{
  const result = calculatePricePerLiterToGallon({
    source: 'perGallon',
    pricePerLiter: null,
    pricePerGallon: 4,
    gallonSystem: 'us',
    currency: 'USD',
  });
  assertClose(result.pricePerLiter, 1.0566882094, 5);
}

{
  const result = calculatePricePerLiterToGallon({
    source: 'perLiter',
    pricePerLiter: 300,
    pricePerGallon: null,
    gallonSystem: 'us',
    currency: 'PKR',
  });
  assertClose(result.pricePerGallon, 1135.6235352, 7);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  !validatePricePerLiterToGallon({
    source: 'perLiter',
    pricePerLiter: -1,
    pricePerGallon: null,
    gallonSystem: 'us',
    currency: 'USD',
  }).isValid,
);
assert.ok(
  validatePricePerLiterToGallon({
    source: 'perLiter',
    pricePerLiter: 1.5,
    pricePerGallon: null,
    gallonSystem: 'us',
    currency: 'USD',
  }).isValid,
);

console.log('price-per-liter-to-gallon calculation.test.ts: ok');
