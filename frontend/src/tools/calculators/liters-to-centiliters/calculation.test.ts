import assert from 'node:assert/strict';
import {
  calculateLitersToCentiliters,
  centilitersToLiters,
  formatVolume,
  litersToCentiliters,
} from './calculation';
import {
  CENTILITERS_PER_LITER,
  CUBIC_CENTIMETERS_PER_LITER,
  CUBIC_METERS_PER_LITER,
  DECILITERS_PER_LITER,
  DEFAULT_LITERS_TO_CENTILITERS_INPUT,
  LITERS_PER_US_FLUID_OUNCE,
  LITERS_PER_US_GALLON,
  MILLILITERS_PER_CENTILITER,
  MILLILITERS_PER_LITER,
} from './types';
import { validateLitersToCentiliters } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-12): void {
  assert.ok(Math.abs(actual - expected) < eps, `expected ${expected}, got ${actual}`);
}

assert.equal(CENTILITERS_PER_LITER, 100);
assert.equal(MILLILITERS_PER_LITER, 1000);
assert.equal(MILLILITERS_PER_CENTILITER, 10);
assert.equal(DECILITERS_PER_LITER, 10);
assert.equal(CUBIC_CENTIMETERS_PER_LITER, 1000);
assert.equal(CUBIC_METERS_PER_LITER, 0.001);
assertClose(LITERS_PER_US_GALLON, 3.785411784);
assertClose(LITERS_PER_US_FLUID_OUNCE, 3.785411784 / 128);
assertClose(LITERS_PER_US_FLUID_OUNCE, 0.0295735295625);

const cases: readonly [number, number][] = [
  [0, 0],
  [0.01, 1],
  [0.05, 5],
  [0.1, 10],
  [0.25, 25],
  [0.5, 50],
  [0.75, 75],
  [1, 100],
  [1.5, 150],
  [2, 200],
  [2.5, 250],
  [5, 500],
  [10, 1000],
  [25, 2500],
  [100, 10_000],
];

for (const [liters, centiliters] of cases) {
  assert.equal(litersToCentiliters(liters), centiliters);
  assert.equal(centilitersToLiters(centiliters), liters);
  assert.equal(
    calculateLitersToCentiliters({ source: 'liters', liters, centiliters: null }).centiliters,
    centiliters
  );
  assert.equal(
    calculateLitersToCentiliters({ source: 'centiliters', liters: null, centiliters }).liters,
    liters
  );
}

{
  const result = calculateLitersToCentiliters(DEFAULT_LITERS_TO_CENTILITERS_INPUT);
  assert.equal(result.liters, 2.5);
  assert.equal(result.centiliters, 250);
  const ml = result.otherUnits.find((row) => row.unit === 'mL');
  assert.equal(ml?.value, 2500);
  const dl = result.otherUnits.find((row) => row.unit === 'dL');
  assert.equal(dl?.value, 25);
  const cm3 = result.otherUnits.find((row) => row.unit === 'cm³');
  assert.equal(cm3?.value, 2500);
  const m3 = result.otherUnits.find((row) => row.unit === 'm³');
  assertClose(m3?.value ?? NaN, 0.0025);
}

{
  // Round-trip: no drift.
  let liters = 0.3;
  for (let i = 0; i < 20; i += 1) {
    const cl = litersToCentiliters(liters);
    liters = centilitersToLiters(cl);
  }
  assert.equal(liters, 0.3);
}

{
  assert.equal(formatVolume(0), '0');
  assert.equal(formatVolume(2.5), '2.5');
  assert.equal(formatVolume(0.3), '0.3');
}

{
  const ok = validateLitersToCentiliters({ source: 'liters', liters: 1, centiliters: null });
  assert.equal(ok.isValid, true);

  const blank = validateLitersToCentiliters({
    source: 'centiliters',
    liters: null,
    centiliters: null,
  });
  assert.equal(blank.isValid, false);

  const neg = validateLitersToCentiliters({ source: 'liters', liters: -1, centiliters: null });
  assert.equal(neg.isValid, false);
  assert.ok(neg.errors.liters);
}

console.log('liters-to-centiliters calculation.test.ts: ok');
