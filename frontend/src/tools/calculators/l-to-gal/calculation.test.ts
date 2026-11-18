import assert from 'node:assert/strict';
import {
  calculateLToGal,
  imperialGallonsToLiters,
  litersToImperialGallons,
  litersToUSGallons,
  shareResultText,
  usGallonsToLiters,
} from './calculation';
import { LITERS_PER_IMPERIAL_GALLON, LITERS_PER_US_GALLON } from './types';
import { parseOptionalNumber, validateLToGal } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(LITERS_PER_US_GALLON, 3.785411784);
assert.equal(LITERS_PER_IMPERIAL_GALLON, 4.54609);

assertClose(litersToUSGallons(1), 0.264172052358, 10);
assert.equal(usGallonsToLiters(1), 3.785411784);
assertClose(litersToImperialGallons(1), 0.219969248299, 10);
assert.equal(imperialGallonsToLiters(1), 4.54609);
assertClose(usGallonsToLiters(3), 11.356235352, 9);
assert.equal(litersToUSGallons(0), 0);
assertClose(usGallonsToLiters(litersToUSGallons(12.5)), 12.5, 10);

{
  const result = calculateLToGal({
    source: 'liters',
    liters: 7,
    gallons: null,
    other: null,
    gallonKind: 'usGal',
    otherUnit: 'usFlOz',
  });
  assertClose(result.gallons, 1.849204, 5);
  assert.match(shareResultText(result), /L to gal/);
}

{
  const result = calculateLToGal({
    source: 'gallons',
    liters: null,
    gallons: 5,
    other: null,
    gallonKind: 'usGal',
    otherUnit: 'usFlOz',
  });
  assertClose(result.liters, 18.92705892, 8);
}

{
  const result = calculateLToGal({
    source: 'liters',
    liters: 1,
    gallons: null,
    other: null,
    gallonKind: 'usGal',
    otherUnit: 'usFlOz',
  });
  // 1 L ≈ 33.814 US fl oz (128 fl oz per US gal)
  assertClose(result.other, 128 / LITERS_PER_US_GALLON, 8);
}

{
  const usThenImp = calculateLToGal({
    source: 'liters',
    liters: 10,
    gallons: null,
    other: null,
    gallonKind: 'usGal',
    otherUnit: 'usFlOz',
  });
  const asImp = calculateLToGal({
    source: 'liters',
    liters: usThenImp.liters,
    gallons: null,
    other: null,
    gallonKind: 'impGal',
    otherUnit: 'usFlOz',
  });
  assertClose(asImp.gallons, litersToImperialGallons(10), 10);
  assertClose(asImp.liters, 10, 12);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  !validateLToGal({
    source: 'liters',
    liters: -1,
    gallons: null,
    other: null,
    gallonKind: 'usGal',
    otherUnit: 'usFlOz',
  }).isValid,
);

console.log('l-to-gal calculation.test.ts: ok');
