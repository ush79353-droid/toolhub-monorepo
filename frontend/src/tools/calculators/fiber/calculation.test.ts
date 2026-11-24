/**
 * Fiber Calculator — engine tests (run: npx tsx calculation.test.ts).
 */

import {
  calculateFiber,
  energyToKcal,
  fiberGramsFromKcal,
  KJ_PER_KCAL,
  lookupFiberAiG,
  parseNumber,
} from './calculation';
import { createDefaultInput, type FiberInput } from './types';
import { validateFiberInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(`FAIL: ${msg}`);
}

function approx(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

// --- Energy-scaled: 2,000 kcal → 28 g ---
assert(approx(fiberGramsFromKcal(2000), 28), '2000 kcal → 28 g');
assert(approx(fiberGramsFromKcal(2500), 35), '2500 kcal → 35 g');
assert(approx(fiberGramsFromKcal(1000), 14), '1000 kcal → 14 g');

// --- Energy unit parity (kJ ↔ kcal) ---
assert(approx(energyToKcal(4184, 'kJ'), 1000, 1e-6), '4184 kJ → 1000 kcal');
assert(approx(energyToKcal(2000, 'kcal'), 2000), 'kcal passthrough');
{
  const input: FiberInput = {
    ...createDefaultInput(),
    caloriesText: String(2000 * KJ_PER_KCAL),
    energyUnit: 'kJ',
  };
  const r = calculateFiber(input);
  assert(r.energyScaledFiberG != null, 'kJ path yields fiber');
  assert(approx(r.energyScaledFiberG!, 28, 1e-6), '2000 kcal-equivalent kJ → 28 g');
  assert(approx(r.totalKcalPerDay!, 2000, 1e-6), 'kJ normalized to kcal');
}

// --- Direct kcal field ---
{
  const r = calculateFiber({
    ...createDefaultInput(),
    caloriesText: '2000',
    energyUnit: 'kcal',
  });
  assert(r.energyScaledFiberG != null && approx(r.energyScaledFiberG, 28), 'field 2000 → 28 g');
  assert(r.tdeeSource === 'Calorie intake field', 'source = field');
  assert(r.aiFiberG == null, 'AI absent without sex/age');
}

// --- Blank sex: no AI, no profile TDEE ---
{
  const r = calculateFiber(createDefaultInput());
  assert(r.energyScaledFiberG == null, 'blank defaults → no fiber');
  assert(r.aiFiberG == null, 'blank sex → no AI');
  assert(r.tdeeFromProfile == null, 'blank profile → no TDEE');
}

// --- Age/sex AI distinct from energy-scaled ---
{
  const r = calculateFiber({
    ...createDefaultInput(),
    sex: 'male',
    ageYearsText: '30',
    caloriesText: '2000',
  });
  assert(r.energyScaledFiberG != null && approx(r.energyScaledFiberG, 28), 'scaled 28 g');
  assert(r.aiFiberG === 38, 'male 19–50 AI 38 g');
  assert(r.aiLabel === 'males 19–50 y', 'AI label');
  assert(r.energyScaledFiberG !== r.aiFiberG, 'AI distinct from scaled');
}
{
  const r = calculateFiber({
    ...createDefaultInput(),
    sex: 'female',
    ageYearsText: '30',
    caloriesText: '2000',
  });
  assert(r.aiFiberG === 25, 'female 19–50 AI 25 g');
  assert(approx(r.energyScaledFiberG!, 28), 'scaled still 28 g');
}
{
  const r = calculateFiber({
    ...createDefaultInput(),
    sex: 'male',
    ageYearsText: '55',
    caloriesText: '2000',
  });
  assert(r.aiFiberG === 30, 'male ≥51 AI 30 g');
}
{
  const r = calculateFiber({
    ...createDefaultInput(),
    sex: 'female',
    ageYearsText: '60',
    caloriesText: '2000',
  });
  assert(r.aiFiberG === 21, 'female ≥51 AI 21 g');
}

// --- AI table edges ---
assert(lookupFiberAiG(2, 'male')?.grams === 19, 'AI 1–3');
assert(lookupFiberAiG(6, 'female')?.grams === 25, 'AI 4–8');
assert(lookupFiberAiG(10, 'male')?.grams === 31, 'AI male 9–13');
assert(lookupFiberAiG(10, 'female')?.grams === 26, 'AI female 9–13');
assert(lookupFiberAiG(16, 'male')?.grams === 38, 'AI male 14–18');
assert(lookupFiberAiG(16, 'female')?.grams === 26, 'AI female 14–18');
assert(lookupFiberAiG(0.5, 'male') == null, 'infant ND');

// --- Unsupported population for Mifflin (age < 15) with blank calories ---
{
  const r = calculateFiber({
    ...createDefaultInput(),
    sex: 'male',
    ageYearsText: '10',
    heightText: '140',
    weightText: '35',
  });
  assert(r.tdeeFromProfile == null, 'no TDEE under 15');
  assert(r.energyScaledFiberG == null, 'no scaled fiber without kcal');
  assert(r.aiFiberG === 31, 'AI still available for male 9–13');
}

// --- Profile TDEE path (Mifflin × light PAL 1.4) ---
{
  const r = calculateFiber({
    ...createDefaultInput(),
    sex: 'female',
    ageYearsText: '30',
    heightText: '165',
    weightText: '60',
    activityId: 'light',
  });
  assert(r.tdeeFromProfile != null && r.tdeeFromProfile > 0, 'profile TDEE');
  assert(r.energyScaledFiberG != null, 'scaled from TDEE');
  assert(r.tdeeSource === 'Mifflin–St Jeor × PAL', 'TDEE source');
  // BMR = 10*60 + 6.25*165 - 5*30 - 161 = 600 + 1031.25 - 150 - 161 = 1320.25
  // TDEE = 1320.25 * 1.4 = 1848.35; fiber = 1848.35 * 0.014
  assert(approx(r.tdeeFromProfile!, 1848.35, 0.02), 'Mifflin×1.4 female fixture');
  assert(
    approx(r.energyScaledFiberG!, fiberGramsFromKcal(1848.35), 0.02),
    'fiber matches TDEE',
  );
  assert(r.aiFiberG === 25, 'AI distinct on profile path');
}

// --- Calorie override wins over profile ---
{
  const r = calculateFiber({
    ...createDefaultInput(),
    sex: 'male',
    ageYearsText: '25',
    heightText: '180',
    weightText: '80',
    caloriesText: '2000',
  });
  assert(approx(r.totalKcalPerDay!, 2000), 'override kcal');
  assert(approx(r.energyScaledFiberG!, 28), 'override → 28 g');
  assert(r.tdeeFromProfile != null, 'profile TDEE still computed');
  assert(r.tdeeSource === 'Calorie intake field', 'field wins');
}

// --- Validation rejects non-finite / negative ---
assert(parseNumber('') === null, 'empty parse');
assert(parseNumber('NaN') === null, 'NaN parse');
assert(parseNumber('Infinity') === null, 'Infinity parse');
{
  const v = validateFiberInput({
    ...createDefaultInput(),
    caloriesText: '-5',
  });
  assert(v.errors.caloriesText != null, 'negative calories');
  assert(v.result == null, 'no result on errors');
}
{
  const v = validateFiberInput({
    ...createDefaultInput(),
    caloriesText: '2000',
  });
  assert(Object.keys(v.errors).length === 0, 'valid calories');
  assert(v.result?.energyScaledFiberG != null, 'valid result');
}

console.log('All fiber calculation tests passed.');
