/**
 * Net Carbs Calculator — engine tests (run: npx tsx calculation.test.ts).
 */

import {
  calculateNetCarbs,
  computeNetCarbsG,
  KCAL_PER_G_NET_CARBS,
  parseNumber,
  POLYOL_FACTOR_APPROVED,
  POLYOL_FACTOR_OTHER,
  polyolFactor,
} from './calculation';
import { createDefaultInput, type NetCarbsInput } from './types';
import { validateNetCarbsInput } from './validation';

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

// --- Polyol factors ---
assert(polyolFactor('yes') === POLYOL_FACTOR_APPROVED, 'approved factor 1');
assert(polyolFactor('no') === POLYOL_FACTOR_OTHER, 'other factor 0.5');

// --- US/Canada: total − fiber − sugar/2 ---
{
  const c = computeNetCarbsG({
    totalCarbsG: 20,
    fiberG: 5,
    sugarAlcoholG: 8,
    usaCanada: 'yes',
    approvedPolyolsOnly: 'no',
  });
  // 20 − 5 − 4 = 11
  assert(approx(c.netCarbsG, 11), 'US half-polyol: 20−5−4=11');
  assert(approx(c.fiberSubtractedG, 5), 'fiber subtracted US');
  assert(approx(c.sugarAlcoholSubtractedG, 4), 'half of 8');
}

// --- US/Canada: approved polyols full deduct ---
{
  const c = computeNetCarbsG({
    totalCarbsG: 20,
    fiberG: 5,
    sugarAlcoholG: 8,
    usaCanada: 'yes',
    approvedPolyolsOnly: 'yes',
  });
  // 20 − 5 − 8 = 7
  assert(approx(c.netCarbsG, 7), 'US full polyol: 20−5−8=7');
  assert(approx(c.sugarAlcoholSubtractedG, 8), 'full 8');
}

// --- Non-US: fiber already excluded — do not subtract fiber again ---
{
  const c = computeNetCarbsG({
    totalCarbsG: 20,
    fiberG: 5,
    sugarAlcoholG: 8,
    usaCanada: 'no',
    approvedPolyolsOnly: 'no',
  });
  // 20 − 0 − 4 = 16
  assert(approx(c.netCarbsG, 16), 'non-US: no fiber subtract');
  assert(approx(c.fiberSubtractedG, 0), 'fiber subtracted 0');
}

// --- Floor at zero ---
{
  const c = computeNetCarbsG({
    totalCarbsG: 5,
    fiberG: 10,
    sugarAlcoholG: 0,
    usaCanada: 'yes',
    approvedPolyolsOnly: 'no',
  });
  assert(approx(c.netCarbsG, 0), 'over-subtract floors at 0');
}

// --- calculateNetCarbs defaults (blank total → empty) ---
{
  const r = calculateNetCarbs(createDefaultInput());
  assert(r.netCarbsG == null, 'blank total → no net');
}

// --- End-to-end US fixture + meal ---
{
  const input: NetCarbsInput = {
    ...createDefaultInput(),
    totalCarbsText: '24',
    fiberText: '9',
    sugarAlcoholText: '8',
    approvedPolyolsOnly: 'yes',
    servingsText: '2',
  };
  const r = calculateNetCarbs(input);
  // 24 − 9 − 8 = 7; meal 14 g; kcal 56
  assert(r.netCarbsG != null && approx(r.netCarbsG, 7), 'fixture net 7');
  assert(r.totalNetCarbsG != null && approx(r.totalNetCarbsG, 14), 'meal 14');
  assert(
    r.caloriesFromNetCarbsKcal != null &&
      approx(r.caloriesFromNetCarbsKcal, 14 * KCAL_PER_G_NET_CARBS),
    'kcal 56',
  );
}

// --- Sugar alcohol blank treated as 0 ---
{
  const r = calculateNetCarbs({
    ...createDefaultInput(),
    totalCarbsText: '10',
    fiberText: '2',
    sugarAlcoholText: '',
    usaCanada: 'yes',
  });
  assert(r.netCarbsG != null && approx(r.netCarbsG, 8), 'blank sugar → 10−2');
}

// --- Validation rejects negatives ---
{
  const v = validateNetCarbsInput({
    ...createDefaultInput(),
    totalCarbsText: '-1',
  });
  assert(v.errors.totalCarbsText != null, 'negative total');
  assert(v.result == null, 'no result on errors');
}
{
  const v = validateNetCarbsInput({
    ...createDefaultInput(),
    totalCarbsText: '10',
    fiberText: '12',
    usaCanada: 'yes',
  });
  assert(v.errors.fiberText != null, 'fiber > total US');
}
{
  const v = validateNetCarbsInput({
    ...createDefaultInput(),
    totalCarbsText: '20',
    fiberText: '5',
    sugarAlcoholText: '0',
    servingsText: '1',
  });
  assert(Object.keys(v.errors).length === 0, 'valid input');
  assert(v.result?.netCarbsG != null && approx(v.result.netCarbsG, 15), '20−5');
}

// --- Non-US fiber may exceed "carbohydrate" figure (not an error) ---
{
  const v = validateNetCarbsInput({
    ...createDefaultInput(),
    usaCanada: 'no',
    totalCarbsText: '10',
    fiberText: '12',
    sugarAlcoholText: '0',
  });
  assert(v.errors.fiberText == null, 'non-US fiber > carb allowed');
  assert(v.result?.netCarbsG != null && approx(v.result.netCarbsG, 10), 'non-US net=10');
}

console.log('All net-carbs calculation tests passed.');
