import assert from 'node:assert/strict';
import {
  calculateCalorieFromInput,
  heightToCm,
  mifflinStJeorBmrKcal,
  weightToKg,
} from './calculation';
import type { CalorieInput } from './types';
import { validateCalorieInput } from './validation';

// Lisa fixture (Omni maintenance): F · 25 · 168 cm · 62 kg · PAL 1.4
const lisaBmr = mifflinStJeorBmrKcal(62, 168, 25, 'female');
assert.ok(lisaBmr);
assert.ok(Math.abs(lisaBmr! - 1384) < 0.01);

const lisa: CalorieInput = {
  sex: 'female',
  ageYears: '25',
  heightValue: '168',
  heightUnit: 'cm',
  weightValue: '62',
  weightUnit: 'kg',
  activityId: 'light',
};
const lisaResult = calculateCalorieFromInput(lisa);
assert.ok(lisaResult);
assert.ok(Math.abs(lisaResult!.tdeeKcal - 1384 * 1.4) < 0.05);
assert.equal(lisaResult!.formattedTdee, '1,938');

// Male Mifflin: 80 kg · 180 cm · 30 → 10*80+6.25*180−5*30+5 = 800+1125−150+5 = 1780
assert.equal(mifflinStJeorBmrKcal(80, 180, 30, 'male'), 1780);

assert.equal(heightToCm(1.68, 'm'), 168);
assert.ok(Math.abs(weightToKg(136.686, 'lb')! - 62) < 0.05);

const blank = validateCalorieInput({
  ...lisa,
  ageYears: '',
});
assert.equal(blank.isValid, false);

const ok = validateCalorieInput(lisa);
assert.equal(ok.isValid, true);

// All PAL levels produce finite TDEE
for (const id of [
  'sedentary',
  'light',
  'moderate',
  'hard',
  'extra',
  'athlete',
] as const) {
  const r = calculateCalorieFromInput({ ...lisa, activityId: id });
  assert.ok(r && Number.isFinite(r.tdeeKcal) && r.tdeeKcal > 0);
}

console.log('calorie calculation.test.ts: ok');
