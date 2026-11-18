import assert from 'node:assert/strict';
import {
  acresToSquareFeet,
  calculateAcresToSquareFeet,
  shareResultText,
  squareFeetToAcres,
} from './calculation';
import { SQUARE_FEET_PER_ACRE } from './types';
import { parseOptionalNumber, validateAcresToSquareFeet } from './validation';

function close(actual: number, expected: number, digits = 9): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(acresToSquareFeet(1), 43_560);
assert.equal(acresToSquareFeet(0.5), 21_780);
assert.equal(acresToSquareFeet(10), 435_600);
assert.equal(acresToSquareFeet(500), 21_780_000);
assert.equal(squareFeetToAcres(43_560), 1);
close(squareFeetToAcres(100), 0.002295684);
assert.equal(acresToSquareFeet(0), 0);
assert.equal(SQUARE_FEET_PER_ACRE, 43_560);

assert.equal(acresToSquareFeet(0.001), 43.56);
assert.equal(acresToSquareFeet(0.25), 10_890);
assert.equal(squareFeetToAcres(21_780), 0.5);

{
  const result = calculateAcresToSquareFeet({
    source: 'acres',
    acres: 1,
    squareFeet: null,
  });
  assert.equal(result.squareFeet, 43_560);
  assert.match(shareResultText(result), /43,560/);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  !validateAcresToSquareFeet({ source: 'acres', acres: -1, squareFeet: null }).isValid,
);

console.log('acres-to-square-feet calculation.test.ts: ok');
