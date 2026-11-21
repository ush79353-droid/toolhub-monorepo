/**
 * Run: npx tsx src/tools/calculators/calorie-intake-simple/calculation.test.ts
 */
import { calculateCalorieIntakeSimpleFromInput } from './calculation';
import { createExampleInput } from './types';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 0.05): boolean {
  return Math.abs(a - b) <= eps;
}

{
  const r = calculateCalorieIntakeSimpleFromInput(createExampleInput());
  assert(r != null, 'example result');
  // Omni: female 50y 165cm 65kg light PAL 1.4 → 1778.4
  assert(approx(r!.bmrKcal, 1270.25), `bmr ${r!.bmrKcal}`);
  assert(approx(r!.tdeeKcal, 1778.35), `tdee ${r!.tdeeKcal}`);
  assert(r!.pal === 1.4, 'pal 1.4');
}

{
  const r = calculateCalorieIntakeSimpleFromInput({
    sex: 'male',
    ageYears: '30',
    heightValue: '180',
    heightUnit: 'cm',
    weightValue: '80',
    weightUnit: 'kg',
    activityId: 'sedentary',
  });
  assert(r != null, 'male sedentary');
  // BMR = 10*80 + 6.25*180 - 5*30 + 5 = 800 + 1125 - 150 + 5 = 1780
  assert(approx(r!.bmrKcal, 1780), `male bmr ${r!.bmrKcal}`);
  assert(approx(r!.tdeeKcal, 1780 * 1.2), 'sedentary tdee');
}

{
  const r = calculateCalorieIntakeSimpleFromInput({
    ...createExampleInput(),
    activityId: 'extra',
  });
  assert(r != null && r.pal === 2.0, 'extra pal');
}

console.log('calorie-intake-simple calculation.test.ts: ok');
