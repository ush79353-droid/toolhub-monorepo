import assert from 'node:assert/strict';
import {
  calculateGramsToOunces,
  formatMass,
  gramsToOunces,
  ouncesToGrams,
} from './calculation';
import {
  DEFAULT_GRAMS_TO_OUNCES_INPUT,
  GRAMS_PER_AVOIRDUPOIS_OUNCE,
  GRAMS_PER_POUND,
} from './types';
import { validateGramsToOunces } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-12): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

{
  assert.equal(GRAMS_PER_AVOIRDUPOIS_OUNCE, 28.349523125);
  assertClose(GRAMS_PER_POUND, 453.59237);
  assertClose(ouncesToGrams(0), 0);
  assertClose(ouncesToGrams(0.25), 7.08738078125);
  assertClose(ouncesToGrams(0.5), 14.1747615625);
  assertClose(ouncesToGrams(1), 28.349523125);
  assertClose(ouncesToGrams(2), 56.69904625);
  assertClose(ouncesToGrams(4), 113.3980925);
  assertClose(ouncesToGrams(8), 226.796185);
  assertClose(ouncesToGrams(16), 453.59237);
}

{
  assertClose(gramsToOunces(0), 0);
  assertClose(gramsToOunces(1), 1 / GRAMS_PER_AVOIRDUPOIS_OUNCE);
  assertClose(gramsToOunces(10), 10 / GRAMS_PER_AVOIRDUPOIS_OUNCE);
  assertClose(gramsToOunces(20), 20 / GRAMS_PER_AVOIRDUPOIS_OUNCE);
  assertClose(gramsToOunces(50), 50 / GRAMS_PER_AVOIRDUPOIS_OUNCE);
  assertClose(gramsToOunces(100), 100 / GRAMS_PER_AVOIRDUPOIS_OUNCE);
  assertClose(gramsToOunces(200), 200 / GRAMS_PER_AVOIRDUPOIS_OUNCE);
  assertClose(gramsToOunces(500), 500 / GRAMS_PER_AVOIRDUPOIS_OUNCE);
  assertClose(gramsToOunces(1000), 1000 / GRAMS_PER_AVOIRDUPOIS_OUNCE);
}

{
  const r = calculateGramsToOunces(DEFAULT_GRAMS_TO_OUNCES_INPUT);
  assertClose(r.g, 100);
  assertClose(r.oz, 100 / GRAMS_PER_AVOIRDUPOIS_OUNCE);
  assertClose(r.otherUnits.find((row) => row.unit === 'lb')!.value, 100 / GRAMS_PER_POUND);

  const fromOz = calculateGramsToOunces({ source: 'oz', g: null, oz: 5 });
  assertClose(fromOz.g, 141.747615625);
}

{
  const ok = validateGramsToOunces(DEFAULT_GRAMS_TO_OUNCES_INPUT);
  assert.equal(ok.isValid, true);
  const blank = validateGramsToOunces({ source: 'g', g: null, oz: null });
  assert.equal(blank.isValid, false);
  const neg = validateGramsToOunces({ source: 'g', g: -1, oz: null });
  assert.equal(neg.isValid, false);
}

{
  assert.equal(formatMass(0), '0');
  assert.equal(formatMass(28.349523125), '28.349523125');
}

console.log('grams-to-ounces calculation.test.ts: ok');
