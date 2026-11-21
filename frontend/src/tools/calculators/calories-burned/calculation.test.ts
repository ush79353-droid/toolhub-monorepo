/**
 * Calories Burned Calculator — engine self-check.
 * Run: npx tsx src/tools/calculators/calories-burned/calculation.test.ts
 */
import { activityById } from './activities';
import {
  caloriesFromMet,
  LB_TO_KG,
  minutesFromDistance,
  totalMinutes,
  weightToKg,
} from './calculation';
import { createDefaultInput, type CaloriesBurnedInput } from './types';
import { validateCaloriesBurnedInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, tol = 1e-6): boolean {
  return Math.abs(a - b) <= tol;
}

// Fixture: MET 9.5, 90 kg, 7 h → 7×60×9.5×3.5×90/200
const minutes7h = 7 * 60;
const kcalFixture = (9.5 * 3.5 * 90 * minutes7h) / 200;
assert(approx(kcalFixture, 6284.25), `fixture kcal got ${kcalFixture}`);
const fromMet = caloriesFromMet(9.5, 90, minutes7h);
assert(fromMet != null && approx(fromMet, 6284.25), `caloriesFromMet got ${fromMet}`);

assert(
  weightToKg(154, 'lb') != null &&
    approx(weightToKg(154, 'lb')!, 154 * LB_TO_KG, 1e-9),
  'lb→kg',
);

assert(totalMinutes(1, 30) === 90, 'totalMinutes');
assert(
  minutesFromDistance(3.5, 7) != null &&
    approx(minutesFromDistance(3.5, 7)!, 30),
  'distance→time',
);

const run60 = activityById('run-60');
assert(run60 != null && run60.met === 9.8, 'run-60 MET');

const validTime: CaloriesBurnedInput = {
  ...createDefaultInput(),
  activityId: 'run-60',
  durationHours: '',
  durationMinutes: '45',
  weightValue: '70',
};
const timeResult = validateCaloriesBurnedInput(validTime);
assert(timeResult.isValid && timeResult.result != null, 'valid time mode');
assert(
  timeResult.result!.caloriesKcal > 0 &&
    timeResult.result!.caloriesPerHour > 0,
  'positive outputs',
);

const distInput: CaloriesBurnedInput = {
  ...createDefaultInput(),
  activityId: 'walk-35',
  durationInputMode: 'distance',
  distanceMiles: '3.5',
  durationMinutes: '',
};
const distResult = validateCaloriesBurnedInput(distInput);
assert(distResult.isValid && distResult.result != null, 'valid distance mode');
assert(
  approx(distResult.result!.durationMinutes, 60, 0.01),
  `expected 60 min from 3.5 mi @ 3.5 mph, got ${distResult.result!.durationMinutes}`,
);

const badDistance: CaloriesBurnedInput = {
  ...createDefaultInput(),
  activityId: 'sport-basketball',
  durationInputMode: 'distance',
  distanceMiles: '2',
};
const blocked = validateCaloriesBurnedInput(badDistance);
assert(!blocked.isValid, 'distance blocked for basketball');
assert(Boolean(blocked.errors.durationInputMode), 'distance mode error');

const lightWeight: CaloriesBurnedInput = {
  ...createDefaultInput(),
  activityId: 'walk-30',
  weightValue: '30',
};
const w = validateCaloriesBurnedInput(lightWeight);
assert(!w.isValid && Boolean(w.errors.weightValue), 'weight range');

console.log('calories-burned calculation.test.ts ok');