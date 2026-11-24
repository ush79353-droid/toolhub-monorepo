import assert from 'node:assert/strict';
import { mifflinStJeorBmrKcal } from '../calorie/calculation';
import { calculateTdee } from './calculation';
import { createEmptyInput } from './types';

const sex = 'male' as const;
const age = 30;
const heightCm = 175;
const weightKg = 70;
const bmr = mifflinStJeorBmrKcal(weightKg, heightCm, age, sex);
assert.ok(bmr != null);

{
  const input = createEmptyInput();
  input.sex = sex;
  input.ageYearsText = String(age);
  input.heightText = String(heightCm);
  input.weightText = String(weightKg);
  input.activityId = 'light';
  const r = calculateTdee(input);
  assert.ok(r.bmrKcal != null);
  assert.ok(Math.abs(r.bmrKcal - bmr!) < 1e-6);
  assert.ok(r.tdeeKcal != null);
  assert.ok(Math.abs(r.tdeeKcal - bmr! * 1.4) < 1e-6);

  input.activityId = 'hard';
  const r2 = calculateTdee(input);
  assert.ok(r2.bmrKcal != null);
  assert.ok(Math.abs(r2.bmrKcal - bmr!) < 1e-6);
  assert.ok(r2.tdeeKcal != null && r2.tdeeKcal > r.tdeeKcal!);
}

{
  const input = createEmptyInput();
  input.ageYearsText = '85';
  input.heightText = '170';
  input.weightText = '65';
  const r = calculateTdee(input);
  assert.equal(r.ageExtrapolated, true);
}

{
  const input = createEmptyInput();
  input.ageYearsText = '17';
  input.heightText = '170';
  input.weightText = '65';
  const r = calculateTdee(input);
  assert.equal(r.tdeeKcal, null);
}

console.log('tdee calculation.test.ts: ok');
