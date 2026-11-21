/**
 * Focused engine self-check.
 * Run: npx tsx src/tools/calculators/maintenance-calorie/calculation.test.ts
 */
import {
  buildChangePlan,
  buildMacros,
  computeMaintenanceCalorie,
  devineIdealWeightKg,
} from './calculation';
import { validateMaintenanceCalorieInput } from './validation';
import { createDefaultInput } from './types';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}
function approx(a: number, b: number, tol = 0.5): boolean {
  return Math.abs(a - b) <= tol;
}

// Lisa Omni example (female 62 kg, 168 cm, 25 y, PAL 1.4) via regular 1.55 path:
// First verify BMR path with none PAL then scale.
const base = createDefaultInput();
const lisa = {
  ...base,
  sex: 'female' as const,
  heightValue: '168',
  weightValue: '62',
  ageYears: '25',
  activityId: 'regular' as const, // 1.55
};
const r = computeMaintenanceCalorie(lisa);
assert(r != null, 'lisa compute');
// BMR = 10*62 + 6.25*168 - 5*25 - 161 = 1384
assert(approx(r!.bmrKcal, 1384, 0.5), `bmr ${r!.bmrKcal}`);
assert(approx(r!.maintenanceKcal, 1384 * 1.55, 1), `tdee ${r!.maintenanceKcal}`);

const sedentary = computeMaintenanceCalorie({ ...lisa, activityId: 'none' });
assert(
  sedentary != null && approx(sedentary.maintenanceKcal, 1384 * 1.2, 1),
  'sedentary',
);

const macros = buildMacros(2000, 20, 50, 30);
assert(macros != null && approx(macros.proteinKcal, 400, 0.01), 'macro p');
assert(approx(macros!.carbGrams, 250, 0.01), 'macro c g');
assert(approx(macros!.fatGrams, 2000 * 0.3 / 9, 0.01), 'macro f g');

const badMacro = buildMacros(2000, 40, 40, 20);
assert(badMacro == null, 'macro AMDR reject');

const devine = devineIdealWeightKg('male', 180);
assert(devine != null && approx(devine, 50 + 2.3 * ((180 - 152.4) / 2.54), 0.05), 'devine');

const plan = buildChangePlan(2500, 80, 75, 0.5, 'lose');
assert(plan != null && plan.plannedIntakeKcal < 2500, 'lose plan');
assert(approx(plan!.dailyDeltaKcal, -(0.5 * 7700) / 7, 0.5), 'delta');

const unsafe = buildChangePlan(1400, 80, 70, 1.0, 'lose');
assert(unsafe != null && unsafe.warning != null, 'floor warning');

const v = validateMaintenanceCalorieInput(lisa);
assert(v.isValid && v.result != null, 'validate lisa');

const blank = validateMaintenanceCalorieInput(createDefaultInput());
assert(!blank.isValid, 'blank invalid');

console.log('maintenance-calorie calculation.test.ts: ok');
