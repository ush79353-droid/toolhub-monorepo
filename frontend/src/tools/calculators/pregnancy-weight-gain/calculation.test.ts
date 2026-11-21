/**
 * Pregnancy Weight Gain — engine self-check.
 * Run: npx tsx src/tools/calculators/pregnancy-weight-gain/calculation.test.ts
 */

import {
  calculateBmi,
  calculatePregnancyWeightGain,
  classifyPrepregnancyBmi,
  computeGestationalGainBounds,
  FIRST_TRIMESTER_GAIN,
  formatBmi,
  heightToMeters,
  singletonGainAtWeek,
  twinGainAtWeek,
  weightToKg,
} from './calculation';
import { createEmptyInput, createExampleInput } from './types';
import { validatePregnancyWeightGainInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

function nearly(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) < eps;
}

// Units
assert(heightToMeters(100, 'cm') === 1, '100 cm = 1 m');
assert(nearly(heightToMeters(100 / 2.54, 'in'), 1, 1e-9), 'in → m');
assert(nearly(weightToKg(1, 'lb'), 0.45359237), 'lb');

// BMI fixture: 165 cm · 60 kg → ≈ 22.0386
const meters = heightToMeters(165, 'cm');
const bmi = calculateBmi(meters, 60);
assert(nearly(bmi, 60 / (1.65 * 1.65)), `bmi ${bmi}`);
assert(formatBmi(bmi) === '22.04', `format ${formatBmi(bmi)}`);
assert(classifyPrepregnancyBmi(bmi)?.category === 'normal', 'normal cat');

// Boundaries
assert(classifyPrepregnancyBmi(18.49)?.category === 'underweight', 'uw');
assert(classifyPrepregnancyBmi(18.5)?.category === 'normal', 'n lo');
assert(classifyPrepregnancyBmi(24.9)?.category === 'normal', 'n hi');
assert(classifyPrepregnancyBmi(25)?.category === 'overweight', 'ow');
assert(classifyPrepregnancyBmi(29.9)?.category === 'overweight', 'ow hi');
assert(classifyPrepregnancyBmi(30)?.category === 'obese', 'ob');

// Week 40 official singleton totals
const termNormal = singletonGainAtWeek('normal', 40)!;
assert(termNormal.minKg === 11.5 && termNormal.maxKg === 16, 'term normal');
const termUw = singletonGainAtWeek('underweight', 40)!;
assert(termUw.minKg === 12.5 && termUw.maxKg === 18, 'term uw');
const termOw = singletonGainAtWeek('overweight', 40)!;
assert(termOw.minKg === 7 && termOw.maxKg === 11.5, 'term ow');
const termOb = singletonGainAtWeek('obese', 40)!;
assert(termOb.minKg === 5 && termOb.maxKg === 9, 'term ob');

// First trimester linear: week 13 = FT band
const w13 = singletonGainAtWeek('normal', 13)!;
assert(nearly(w13.minKg, FIRST_TRIMESTER_GAIN.minKg), 'w13 min');
assert(nearly(w13.maxKg, FIRST_TRIMESTER_GAIN.maxKg), 'w13 max');
const w6 = singletonGainAtWeek('normal', 6.5)!;
assert(nearly(w6.minKg, 0.5 * 0.5), 'w6.5 min');
assert(nearly(w6.maxKg, 2.0 * 0.5), 'w6.5 max');

// Mid-pregnancy: FT + rate*(W-13)
const w27 = singletonGainAtWeek('normal', 27)!;
assert(nearly(w27.minKg, 0.5 + 0.35 * 14), `w27 min ${w27.minKg}`);
assert(nearly(w27.maxKg, 2.0 + 0.5 * 14), `w27 max ${w27.maxKg}`);

// Example input week 40 singleton
const example = calculatePregnancyWeightGain(createExampleInput());
assert(example != null, 'example');
assert(example!.availability === 'ok', 'example ok');
assert(nearly(example!.minGainKg!, 11.5), 'ex min gain');
assert(nearly(example!.maxGainKg!, 16), 'ex max gain');
assert(nearly(example!.minWeightKg!, 60 + 11.5), 'ex min wt');
assert(nearly(example!.maxWeightKg!, 60 + 16), 'ex max wt');

// Twins normal at week 40
const twinTerm = twinGainAtWeek('normal', 40);
assert(twinTerm.availability === 'ok', 'twin term');
assert(twinTerm.band!.minKg === 17 && twinTerm.band!.maxKg === 25, 'twin band');

// Twins mid-pregnancy blocked
const twinMid = twinGainAtWeek('normal', 20);
assert(
  twinMid.availability === 'twins_midpregnancy_unavailable',
  'twin mid',
);
assert(twinMid.band == null, 'twin mid null');

// Twins underweight blocked
const twinUw = twinGainAtWeek('underweight', 40);
assert(
  twinUw.availability === 'twins_underweight_unavailable',
  'twin uw',
);

// Shared compute helper
const shared = computeGestationalGainBounds({
  heightMeters: meters,
  weightKg: 60,
  week: 40,
  twins: false,
});
assert(shared?.gain?.minKg === 11.5, 'shared');

// Twins week 37 OK
const twin37 = calculatePregnancyWeightGain({
  ...createExampleInput(),
  twins: true,
  week: '37',
});
assert(twin37?.availability === 'ok', 'twin 37');
assert(twin37?.minGainKg === 17, 'twin 37 min');

// Empty invalid
const empty = validatePregnancyWeightGainInput(createEmptyInput());
assert(!empty.isValid && empty.result == null, 'empty invalid');

console.log('pregnancy-weight-gain calculation.test.ts: ok');
