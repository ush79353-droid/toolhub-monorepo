import assert from 'node:assert/strict';
import {
  acresToSquareKilometers,
  calculateSquareKilometersToAcres,
  formatArea,
  squareKilometersToAcres,
} from './calculation';
import {
  ACRES_PER_KM2,
  DEFAULT_SQUARE_KILOMETERS_TO_ACRES_INPUT,
  KM2_PER_ACRE,
  SQUARE_METERS_PER_ACRE,
  SQUARE_METERS_PER_HECTARE,
  SQUARE_METERS_PER_KM2,
} from './types';
import { validateSquareKilometersToAcres } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(Math.abs(actual - expected) < eps, `expected ${expected}, got ${actual}`);
}

assertClose(ACRES_PER_KM2, 1_000_000 / 4046.8564224);
assertClose(KM2_PER_ACRE, 0.0040468564224);
assert.equal(SQUARE_METERS_PER_ACRE, 4046.8564224);
assert.equal(SQUARE_METERS_PER_KM2, 1_000_000);

const km2Cases: readonly number[] = [0, 0.1, 0.5, 1, 2, 5, 10, 25, 50, 100, 500, 1000];

for (const km2 of km2Cases) {
  const acres = squareKilometersToAcres(km2);
  assertClose(acres, km2 * ACRES_PER_KM2);
  assertClose(acresToSquareKilometers(acres), km2);
  assertClose(
    calculateSquareKilometersToAcres({
      source: 'squareKilometers',
      squareKilometers: km2,
      acres: null,
    }).acres,
    acres
  );
}

{
  assertClose(squareKilometersToAcres(1), 247.10538146717, 1e-8);
  assertClose(squareKilometersToAcres(2), 494.21076293435, 1e-8);
  assertClose(squareKilometersToAcres(5), 1235.5269073359, 1e-8);
  assertClose(squareKilometersToAcres(10), 2471.0538146717, 1e-8);
  assertClose(squareKilometersToAcres(50), 12355.269073359, 1e-7);
  assertClose(squareKilometersToAcres(100), 24710.538146717, 1e-7);
}

{
  assertClose(acresToSquareKilometers(1), 0.0040468564224);
  assertClose(acresToSquareKilometers(10), 0.040468564224);
  assertClose(acresToSquareKilometers(100), 0.40468564224);
  assertClose(acresToSquareKilometers(250), 1.0117141056);
  assertClose(acresToSquareKilometers(1000), 4.0468564224);
  assert.equal(acresToSquareKilometers(0), 0);
}

{
  const result = calculateSquareKilometersToAcres(DEFAULT_SQUARE_KILOMETERS_TO_ACRES_INPUT);
  assert.equal(result.squareKilometers, 5);
  assertClose(result.acres, 5 * ACRES_PER_KM2);
  assert.equal(result.squareMeters, 5_000_000);
  const ha = result.otherUnits.find((row) => row.unit === 'ha');
  assert.ok(ha && Math.abs(ha.value - 5_000_000 / SQUARE_METERS_PER_HECTARE) < 1e-9);
  assert.equal(ha?.value, 500);
}

{
  // Round-trip: no accumulated drift when source stays km².
  let km2 = 5;
  for (let i = 0; i < 20; i += 1) {
    const acres = squareKilometersToAcres(km2);
    km2 = acresToSquareKilometers(acres);
  }
  assertClose(km2, 5);
}

{
  assert.equal(formatArea(0), '0');
  assert.equal(formatArea(247.10538146717).startsWith('247.105381467'), true);
}

{
  const ok = validateSquareKilometersToAcres({
    source: 'squareKilometers',
    squareKilometers: 1,
    acres: null,
  });
  assert.equal(ok.isValid, true);

  const blank = validateSquareKilometersToAcres({
    source: 'acres',
    squareKilometers: null,
    acres: null,
  });
  assert.equal(blank.isValid, false);

  const neg = validateSquareKilometersToAcres({
    source: 'acres',
    squareKilometers: null,
    acres: -1,
  });
  assert.equal(neg.isValid, false);
  assert.ok(neg.errors.acres);

  const zeroOk = validateSquareKilometersToAcres({
    source: 'squareKilometers',
    squareKilometers: 0,
    acres: null,
  });
  assert.equal(zeroOk.isValid, true);
}

console.log('square-kilometers-to-acres calculation.test.ts: ok');
