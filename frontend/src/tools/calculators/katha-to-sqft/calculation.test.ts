import assert from 'node:assert/strict';
import {
  calculateKathaToSqft,
  kathaToSquareFeet,
  kathaToSquareMeters,
  shareResultText,
  squareFeetToKatha,
  squareFeetToSquareMeters,
  squareMetersPerKatha,
  squareMetersToKatha,
  squareMetersToSquareFeet,
} from './calculation';
import { KATHA_REGIONS, SQUARE_METERS_PER_SQUARE_FOOT, getKathaRegion } from './types';
import { parseOptionalNumber, validateKathaToSqft } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

const NEPAL_R = getKathaRegion('nepal').squareFeetPerKatha;
assert.equal(NEPAL_R, 3645);
assert.equal(SQUARE_METERS_PER_SQUARE_FOOT, 0.09290304);

assert.equal(kathaToSquareFeet(0, NEPAL_R), 0);
assert.equal(kathaToSquareFeet(0.5, NEPAL_R), 1822.5);
assert.equal(kathaToSquareFeet(1, NEPAL_R), 3645);
assert.equal(kathaToSquareFeet(2, NEPAL_R), 7290);
assert.equal(kathaToSquareFeet(5, NEPAL_R), 18225);
assert.equal(kathaToSquareFeet(10, NEPAL_R), 36450);
assert.equal(kathaToSquareFeet(20, NEPAL_R), 72900);
assert.equal(kathaToSquareFeet(100, NEPAL_R), 364500);

assertClose(kathaToSquareMeters(1, NEPAL_R), 338.6315808, 10);
assertClose(kathaToSquareMeters(0.5, NEPAL_R), 169.3157904, 10);
assertClose(kathaToSquareMeters(2, NEPAL_R), 677.2631616, 10);
assertClose(kathaToSquareMeters(10, NEPAL_R), 3386.315808, 10);

assert.equal(squareFeetToKatha(7290, NEPAL_R), 2);
assertClose(squareMetersToKatha(338.6315808, NEPAL_R), 1, 10);
assertClose(squareFeetToSquareMeters(1), 0.09290304, 12);
assertClose(squareMetersToSquareFeet(0.09290304), 1, 12);

assert.equal(getKathaRegion('bangladesh').squareFeetPerKatha, 720);
assert.equal(getKathaRegion('west-bengal').squareFeetPerKatha, 720);
assert.equal(getKathaRegion('assam').squareFeetPerKatha, 2880);
assert.equal(getKathaRegion('patna').squareFeetPerKatha, 1361.25);
assert.equal(getKathaRegion('gaya').squareFeetPerKatha, 1361.25);
assert.equal(getKathaRegion('aurangabad').squareFeetPerKatha, 1361.25);
assert.equal(getKathaRegion('saran').squareFeetPerKatha, 1742.4);

for (const region of KATHA_REGIONS) {
  assert.ok(region.squareFeetPerKatha > 0);
  assertClose(
    squareMetersPerKatha(region.squareFeetPerKatha),
    region.squareFeetPerKatha * SQUARE_METERS_PER_SQUARE_FOOT,
    12,
  );
}

{
  const result = calculateKathaToSqft({
    source: 'katha',
    regionId: 'nepal',
    katha: 1,
    ft2: null,
    m2: null,
  });
  assert.equal(result.ft2, 3645);
  assertClose(result.m2, 338.6315808, 10);
  assert.match(shareResultText(result), /Nepal/);
}

{
  const fromFt = calculateKathaToSqft({
    source: 'ft2',
    regionId: 'nepal',
    katha: null,
    ft2: 7290,
    m2: null,
  });
  assert.equal(fromFt.katha, 2);
}

{
  const bangladesh = calculateKathaToSqft({
    source: 'katha',
    regionId: 'bangladesh',
    katha: 1,
    ft2: null,
    m2: null,
  });
  assert.equal(bangladesh.ft2, 720);
}

{
  const regionChange = calculateKathaToSqft({
    source: 'katha',
    regionId: 'assam',
    katha: 1,
    ft2: null,
    m2: null,
  });
  assert.equal(regionChange.ft2, 2880);
}

assert.equal(parseOptionalNumber(''), null);
assert.equal(parseOptionalNumber('1e2'), 100);
assert.ok(
  !validateKathaToSqft({
    source: 'katha',
    regionId: 'nepal',
    katha: -1,
    ft2: null,
    m2: null,
  }).isValid,
);
assert.ok(
  validateKathaToSqft({
    source: 'katha',
    regionId: 'nepal',
    katha: 0,
    ft2: null,
    m2: null,
  }).isValid,
);
assert.ok(
  !validateKathaToSqft({
    source: 'katha',
    regionId: 'nepal',
    katha: null,
    ft2: null,
    m2: null,
  }).isValid,
);

console.log('katha-to-sqft calculation.test.ts: ok');
