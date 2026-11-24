/**
 * Weight Watchers Points Calculator — engine tests
 * (run: npx tsx calculation.test.ts).
 */

import {
  calculateWeightWatchersPoints,
  COEF_CALORIES,
  COEF_PROTEIN,
  COEF_SAT_FAT,
  COEF_SUGAR,
  computeSmartPoints,
  fromGrams,
  parseNumber,
  toGrams,
} from './calculation';
import { createDefaultInput, type WeightWatchersPointsInput } from './types';
import { validateWeightWatchersPointsInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(`FAIL: ${msg}`);
}

function approx(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

// --- Parse ---
assert(parseNumber('') === null, 'empty parse');
assert(parseNumber('NaN') === null, 'NaN parse');
assert(parseNumber('Infinity') === null, 'Infinity parse');
assert(parseNumber('12.5') === 12.5, 'decimal parse');
assert(parseNumber('1,200') === 1200, 'comma parse');

// --- Mass unit conversion ---
assert(approx(toGrams(5, 'g'), 5), '5 g → 5 g');
assert(approx(toGrams(500, 'mg'), 0.5), '500 mg → 0.5 g');
assert(approx(fromGrams(0.5, 'mg'), 500), '0.5 g → 500 mg');

// --- Published fixture: 150 kcal, 1 g sat, 5 g sugar, 9 g protein → 5 ---
{
  const { raw, smartPoints } = computeSmartPoints({
    caloriesKcal: 150,
    sugarG: 5,
    proteinG: 9,
    saturatedFatG: 1,
  });
  const expected =
    150 * COEF_CALORIES +
    1 * COEF_SAT_FAT +
    5 * COEF_SUGAR -
    9 * COEF_PROTEIN;
  assert(approx(raw, expected), 'fixture raw matches coefficients');
  assert(approx(raw, 4.568, 1e-3), 'fixture ~4.568');
  assert(smartPoints === 5, 'fixture rounds to 5 SmartPoints');
}

// --- Floor at zero (high protein vs low calories) ---
{
  const { smartPoints } = computeSmartPoints({
    caloriesKcal: 10,
    sugarG: 0,
    proteinG: 50,
    saturatedFatG: 0,
  });
  assert(smartPoints === 0, 'negative raw floors at 0');
}

// --- Blank calories → empty ---
{
  const r = calculateWeightWatchersPoints(createDefaultInput());
  assert(r.smartPoints == null, 'blank calories → no points');
}

// --- Blank macros treated as 0 ---
{
  const r = calculateWeightWatchersPoints({
    ...createDefaultInput(),
    caloriesText: '100',
  });
  // 100 * 0.0305 = 3.05 → 3
  assert(r.smartPoints === 3, 'calories-only → 3');
  assert(r.sugarG === 0 && r.proteinG === 0 && r.saturatedFatG === 0, 'blank macros 0');
}

// --- mg unit preserves mass in grams for math ---
{
  const input: WeightWatchersPointsInput = {
    ...createDefaultInput(),
    caloriesText: '150',
    sugarText: '5000',
    sugarUnit: 'mg',
    proteinText: '9000',
    proteinUnit: 'mg',
    saturatedFatText: '1000',
    saturatedFatUnit: 'mg',
  };
  const r = calculateWeightWatchersPoints(input);
  assert(r.smartPoints === 5, 'mg inputs same as 5/9/1 g fixture');
  assert(r.sugarG != null && approx(r.sugarG, 5), 'sugar 5 g');
  assert(r.proteinG != null && approx(r.proteinG, 9), 'protein 9 g');
  assert(r.saturatedFatG != null && approx(r.saturatedFatG, 1), 'sat 1 g');
}

// --- Validation rejects negatives ---
{
  const v = validateWeightWatchersPointsInput({
    ...createDefaultInput(),
    caloriesText: '-1',
  });
  assert(v.errors.caloriesText != null, 'negative calories');
  assert(v.result == null, 'no result on errors');
}
{
  const v = validateWeightWatchersPointsInput({
    ...createDefaultInput(),
    caloriesText: '150',
    sugarText: '5',
    proteinText: '9',
    saturatedFatText: '1',
  });
  assert(Object.keys(v.errors).length === 0, 'valid input');
  assert(v.result?.smartPoints === 5, 'valid → 5');
}

console.log('All weight-watchers-points calculation tests passed.');
