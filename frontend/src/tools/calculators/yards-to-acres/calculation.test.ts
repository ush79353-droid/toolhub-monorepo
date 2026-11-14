import assert from 'node:assert/strict';
import {
  acresToSquareYards,
  calculateYardsToAcres,
  formatArea,
  squareYardsToAcres,
} from './calculation';
import {
  DEFAULT_YARDS_TO_ACRES_INPUT,
  SQUARE_FEET_PER_YD2,
  SQUARE_METERS_PER_ACRE,
  SQUARE_METERS_PER_YD2,
  SQUARE_YARDS_PER_ACRE,
} from './types';
import { validateYardsToAcres } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-12): void {
  assert.ok(Math.abs(actual - expected) < eps, `expected ${expected}, got ${actual}`);
}

assert.equal(SQUARE_YARDS_PER_ACRE, 4840);
assertClose(SQUARE_METERS_PER_YD2, 0.83612736);
assertClose(SQUARE_METERS_PER_ACRE, 4046.8564224);
assertClose(4840 * SQUARE_METERS_PER_YD2, SQUARE_METERS_PER_ACRE);

const cases: readonly [number, number][] = [
  [0, 0],
  [1210, 0.25],
  [2420, 0.5],
  [4840, 1],
  [9680, 2],
  [14520, 3],
  [24200, 5],
  [48400, 10],
  [96800, 20],
  [242000, 50],
  [484000, 100],
];

for (const [yd2, acres] of cases) {
  assert.equal(squareYardsToAcres(yd2), acres);
  assert.equal(acresToSquareYards(acres), yd2);
  assert.equal(
    calculateYardsToAcres({ source: 'squareYards', squareYards: yd2, acres: null }).acres,
    acres
  );
  assert.equal(
    calculateYardsToAcres({ source: 'acres', squareYards: null, acres }).squareYards,
    yd2
  );
}

assertClose(squareYardsToAcres(100), 100 / 4840);
assertClose(squareYardsToAcres(500), 500 / 4840);
assertClose(squareYardsToAcres(1000), 1000 / 4840);
assertClose(squareYardsToAcres(10_000), 10_000 / 4840);

{
  const result = calculateYardsToAcres(DEFAULT_YARDS_TO_ACRES_INPUT);
  assert.equal(result.squareYards, 9680);
  assert.equal(result.acres, 2);
  const ft2 = result.otherUnits.find((row) => row.unit === 'ft²');
  assert.equal(ft2?.value, 9680 * SQUARE_FEET_PER_YD2);
  assertClose(result.squareMeters, 9680 * SQUARE_METERS_PER_YD2);
}

{
  // Round-trip: no drift.
  let acres = 2.5;
  for (let i = 0; i < 20; i += 1) {
    const yd2 = acresToSquareYards(acres);
    acres = squareYardsToAcres(yd2);
  }
  assert.equal(acres, 2.5);
  assert.equal(acresToSquareYards(2.5), 12_100);
}

{
  assert.equal(formatArea(0), '0');
  assert.equal(formatArea(2), '2');
  assert.equal(formatArea(0.25), '0.25');
}

{
  const ok = validateYardsToAcres({
    source: 'squareYards',
    squareYards: 4840,
    acres: null,
  });
  assert.equal(ok.isValid, true);

  const blank = validateYardsToAcres({
    source: 'acres',
    squareYards: null,
    acres: null,
  });
  assert.equal(blank.isValid, false);

  const neg = validateYardsToAcres({
    source: 'squareYards',
    squareYards: -1,
    acres: null,
  });
  assert.equal(neg.isValid, false);
  assert.ok(neg.errors.squareYards);
}

console.log('yards-to-acres calculation.test.ts: ok');
