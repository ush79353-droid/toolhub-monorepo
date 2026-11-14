import assert from 'node:assert/strict';
import {
  calculateCcfToGallons,
  ccfToUsGallons,
  formatVolume,
  usGallonsToCcf,
} from './calculation';
import {
  CUBIC_FEET_PER_CCF,
  CUBIC_INCHES_PER_CCF,
  CUBIC_INCHES_PER_US_GALLON,
  CUBIC_METERS_PER_CCF,
  DEFAULT_CCF_TO_GALLONS_INPUT,
  LITERS_PER_CCF,
  LITERS_PER_IMP_GALLON,
  LITERS_PER_US_GALLON,
  US_GALLONS_PER_CCF,
} from './types';
import { validateCcfToGallons } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(Math.abs(actual - expected) < eps, `expected ${expected}, got ${actual}`);
}

assert.equal(CUBIC_FEET_PER_CCF, 100);
assert.equal(CUBIC_INCHES_PER_CCF, 172_800);
assert.equal(CUBIC_INCHES_PER_US_GALLON, 231);
assert.equal(US_GALLONS_PER_CCF, 172_800 / 231);
assertClose(CUBIC_METERS_PER_CCF, 2.8316846592);
assertClose(LITERS_PER_CCF, 2831.6846592);
assertClose(LITERS_PER_US_GALLON, 3.785411784);
assertClose(LITERS_PER_IMP_GALLON, 4.54609);

const cases: readonly [number, number][] = [
  [0, 0],
  [0.5, 0.5 * (172_800 / 231)],
  [1, 172_800 / 231],
  [2, 2 * (172_800 / 231)],
  [3, 3 * (172_800 / 231)],
  [5, 5 * (172_800 / 231)],
  [10, 10 * (172_800 / 231)],
  [20, 20 * (172_800 / 231)],
  [25, 25 * (172_800 / 231)],
  [50, 50 * (172_800 / 231)],
  [100, 100 * (172_800 / 231)],
  [200, 200 * (172_800 / 231)],
];

for (const [ccf, gallons] of cases) {
  assertClose(ccfToUsGallons(ccf), gallons);
  assertClose(usGallonsToCcf(gallons), ccf);
  assertClose(
    calculateCcfToGallons({ source: 'ccf', ccf, usGallons: null }).usGallons,
    gallons
  );
  assertClose(
    calculateCcfToGallons({ source: 'usGallons', ccf: null, usGallons: gallons }).ccf,
    ccf
  );
}

assertClose(ccfToUsGallons(1), 748.051948051948);
assertClose(ccfToUsGallons(2), 1496.103896103896);
assertClose(ccfToUsGallons(5), 3740.25974025974);
assertClose(ccfToUsGallons(10), 7480.519480519481);
assertClose(ccfToUsGallons(20), 14961.038961038961);
assertClose(ccfToUsGallons(100), 74805.1948051948);

assertClose(usGallonsToCcf(1000), 1000 * (231 / 172_800));
assertClose(usGallonsToCcf(825), 825 * (231 / 172_800));
assertClose(usGallonsToCcf(1), 231 / 172_800);
assertClose(usGallonsToCcf(US_GALLONS_PER_CCF), 1);

assertClose(ccfToUsGallons(2.4), 2.4 * (172_800 / 231));
assertClose(ccfToUsGallons(12.4), 12.4 * (172_800 / 231));

{
  const result = calculateCcfToGallons(DEFAULT_CCF_TO_GALLONS_INPUT);
  assert.equal(result.ccf, 5);
  assertClose(result.usGallons, 5 * (172_800 / 231));
  assert.equal(result.cubicFeet, 500);
  const ft3 = result.otherUnits.find((row) => row.unit === 'ft³');
  assert.equal(ft3?.value, 500);
  const liters = result.otherUnits.find((row) => row.unit === 'L');
  assertClose(liters?.value ?? NaN, 5 * LITERS_PER_CCF);
  const imp = result.otherUnits.find((row) => row.unit === 'imp gal');
  assertClose(imp?.value ?? NaN, (5 * LITERS_PER_CCF) / LITERS_PER_IMP_GALLON);
}

{
  // Round-trip: no drift.
  let gallons = 1000;
  for (let i = 0; i < 20; i += 1) {
    const ccf = usGallonsToCcf(gallons);
    gallons = ccfToUsGallons(ccf);
  }
  assertClose(gallons, 1000);
}

{
  assert.equal(formatVolume(0), '0');
  assert.equal(formatVolume(5), '5');
}

{
  const ok = validateCcfToGallons({ source: 'ccf', ccf: 1, usGallons: null });
  assert.equal(ok.isValid, true);

  const blank = validateCcfToGallons({ source: 'usGallons', ccf: null, usGallons: null });
  assert.equal(blank.isValid, false);

  const neg = validateCcfToGallons({ source: 'ccf', ccf: -1, usGallons: null });
  assert.equal(neg.isValid, false);
  assert.ok(neg.errors.ccf);
}

console.log('ccf-to-gallons calculation.test.ts: ok');
