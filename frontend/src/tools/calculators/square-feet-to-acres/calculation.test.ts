import assert from 'node:assert/strict';
import {
  acresToSquareFeet,
  calculateSquareFeetToAcres,
  convertArea,
  formatArea,
  shareResultText,
  squareFeetToAcres,
  SQUARE_FEET_PER_ACRE,
} from './calculation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const tol = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${actual} ≈ ${expected} (tol ${tol})`,
  );
}

assert.equal(SQUARE_FEET_PER_ACRE, 43560);
assert.equal(acresToSquareFeet(1), 43560);
assert.equal(squareFeetToAcres(43560), 1);
assert.equal(squareFeetToAcres(21780), 0.5);
assert.equal(acresToSquareFeet(2), 87120);
assertClose(squareFeetToAcres(10000), 0.2295684114, 9);
assert.equal(squareFeetToAcres(0), 0);
assert.equal(acresToSquareFeet(0), 0);
assert.equal(acresToSquareFeet(1.5), 65340);

{
  const original = 12345.678;
  const acres = squareFeetToAcres(original);
  assertClose(acresToSquareFeet(acres), original, 8);
}

assert.throws(() => squareFeetToAcres(-1), /negative/i);
assert.throws(() => acresToSquareFeet(Number.NaN), /finite/i);

{
  const result = calculateSquareFeetToAcres({
    source: 'squareFeet',
    value: 43560,
    otherUnit: 'm2',
  });
  assert.equal(result.acres, 1);
  assertClose(result.otherValue, 4046.8564224, 8);
  assertClose(convertArea(43560, 'ft2', 'yd2'), 4840, 8);
  assertClose(convertArea(43560, 'ft2', 'hectare'), 0.40468564224, 10);
}

{
  const result = calculateSquareFeetToAcres({
    source: 'acres',
    value: 2.5,
    otherUnit: 'm2',
  });
  assert.equal(result.squareFeet, 108900);
}

{
  const text = shareResultText({
    squareFeet: 43560,
    acres: 1,
    otherValue: 4046.8564224,
    otherUnit: 'm2',
    explanation: '43560 ft² = 1 ac',
  });
  assert.match(text, /Square Feet to Acres Calculator/);
  assert.match(text, /43560 ft² = 1 acre/);
  assert.match(text, /square-feet-to-acres-calculator/);
}

assert.equal(formatArea(0), '0');
console.log('square-feet-to-acres calculation.test.ts: ok');
