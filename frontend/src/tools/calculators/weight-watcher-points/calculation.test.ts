/**
 * Weight Watcher Points — assert self-check (run: npx tsx calculation.test.ts).
 */

import {
  COEF_KCAL,
  COEF_PROTEIN,
  COEF_SAT_FAT,
  COEF_SUGAR,
  G_PER_OZ,
  calculateWeightWatcherPoints,
  computeSmartPoints,
  fromGrams,
  parseNumber,
  toGrams,
} from './calculation';
import { createDefaultInput } from './types';
import { validateWeightWatcherPointsInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, tol = 1e-9): boolean {
  return Math.abs(a - b) <= tol;
}

// --- Coefficients ---
assert(COEF_KCAL === 0.0305, 'kcal coef');
assert(COEF_SAT_FAT === 0.275, 'sat fat coef');
assert(COEF_SUGAR === 0.12, 'sugar coef');
assert(COEF_PROTEIN === 0.098, 'protein coef');

// --- Unit conversion preserves mass ---
assert(approx(toGrams(1, 'g'), 1), '1 g');
assert(approx(toGrams(1000, 'mg'), 1), '1000 mg → 1 g');
assert(approx(toGrams(1, 'oz'), G_PER_OZ), '1 oz → g');
assert(approx(fromGrams(1, 'mg'), 1000), '1 g → 1000 mg');
assert(approx(fromGrams(G_PER_OZ, 'oz'), 1), 'oz round-trip');

// --- Reference snack (public SmartPoints worked example) ---
// 250 kcal, 10 g sugar, 5 g sat fat, 8 g protein → raw 9.416 → 9 points
const ref = computeSmartPoints({
  caloriesKcal: 250,
  sugarG: 10,
  proteinG: 8,
  saturatedFatG: 5,
});
assert(approx(ref.rawPoints, 9.416, 1e-6), `ref raw ${ref.rawPoints}`);
assert(ref.smartPoints === 9, `ref points ${ref.smartPoints}`);

const label = createDefaultInput();
label.caloriesText = '250';
label.sugarText = '10';
label.proteinText = '8';
label.saturatedFatText = '5';
const labelR = calculateWeightWatcherPoints(label);
assert(labelR.smartPoints === 9, `label smart ${labelR.smartPoints}`);
assert(
  labelR.rawPoints != null && approx(labelR.rawPoints, 9.416, 1e-6),
  'label raw',
);

// --- Zero input → 0 points ---
const zero = createDefaultInput();
zero.caloriesText = '0';
zero.sugarText = '0';
zero.proteinText = '0';
zero.saturatedFatText = '0';
const zeroR = calculateWeightWatcherPoints(zero);
assert(zeroR.smartPoints === 0, `zero points ${zeroR.smartPoints}`);
assert(zeroR.rawPoints === 0, 'zero raw');

// --- Rounding boundary: raw just under / at / over 0.5 ---
const under = computeSmartPoints({
  caloriesKcal: 16, // 16×0.0305 = 0.488 → 0
  sugarG: 0,
  proteinG: 0,
  saturatedFatG: 0,
});
assert(approx(under.rawPoints, 0.488, 1e-9), `under raw ${under.rawPoints}`);
assert(under.smartPoints === 0, `under rounds to 0, got ${under.smartPoints}`);

const over = computeSmartPoints({
  caloriesKcal: 17, // 17×0.0305 = 0.5185 → 1
  sugarG: 0,
  proteinG: 0,
  saturatedFatG: 0,
});
assert(approx(over.rawPoints, 0.5185, 1e-9), `over raw ${over.rawPoints}`);
assert(over.smartPoints === 1, `over rounds to 1, got ${over.smartPoints}`);

// --- Floor at 0: high protein can drive raw negative ---
const proteinHeavy = computeSmartPoints({
  caloriesKcal: 50,
  sugarG: 0,
  proteinG: 40,
  saturatedFatG: 0,
});
assert(proteinHeavy.rawPoints < 0, 'protein-heavy raw negative');
assert(proteinHeavy.smartPoints === 0, 'protein-heavy floors to 0');

// --- Unit switch parity: same physical sugar as 10 g via mg ---
const mgSugar = createDefaultInput();
mgSugar.caloriesText = '250';
mgSugar.sugarText = '10000';
mgSugar.sugarUnit = 'mg';
mgSugar.proteinText = '8';
mgSugar.saturatedFatText = '5';
const mgR = calculateWeightWatcherPoints(mgSugar);
assert(mgR.smartPoints === 9, `mg sugar parity ${mgR.smartPoints}`);
assert(
  mgR.sugarG != null && approx(mgR.sugarG, 10),
  `mg sugar grams ${mgR.sugarG}`,
);

// --- Incomplete blanks → null Smart points ---
const blank = calculateWeightWatcherPoints(createDefaultInput());
assert(blank.smartPoints === null, 'blank stays null');

// --- Validation rejects negative ---
const neg = createDefaultInput();
neg.caloriesText = '-1';
neg.sugarText = '0';
neg.proteinText = '0';
neg.saturatedFatText = '0';
const negV = validateWeightWatcherPointsInput(neg);
assert(negV.errors.caloriesText != null, 'negative calories error');
assert(negV.result === null, 'negative suppresses result');

// --- parseNumber guards ---
assert(parseNumber('') === null, 'empty');
assert(parseNumber('1,000') === 1000, 'comma');
assert(parseNumber('NaN') === null, 'nan');
assert(parseNumber('Infinity') === null, 'inf');

console.log('weight-watcher-points calculation.test.ts: ok');
