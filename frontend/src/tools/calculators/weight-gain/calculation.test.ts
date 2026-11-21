import assert from 'node:assert/strict';
import {
  calculateWeightGain,
  mifflinStJeorBmrKcal,
  weeksToGoal,
} from './calculation';
import type { WeightGainInput } from './types';
import { validateWeightGainInput } from './validation';

// Omni example: F · 28 · 170 cm · 60 kg · light → maintenance ≈ 1906
const bmr = mifflinStJeorBmrKcal(60, 170, 28, 'female');
assert.ok(bmr);
assert.ok(Math.abs(bmr! - (10 * 60 + 6.25 * 170 - 5 * 28 - 161)) < 1e-9);
const maint = bmr! * 1.4;
// 1361.5 × 1.4 = 1906.1 (Omni ≈ 1906)
assert.ok(Math.abs(maint - 1906.1) < 0.05);

const base: WeightGainInput = {
  sex: 'female',
  heightValue: '170',
  heightUnit: 'cm',
  weightValue: '60',
  weightUnit: 'kg',
  ageYears: '28',
  activityId: 'light',
  targetWeightValue: '',
  targetWeightUnit: 'kg',
  gainPace: 'normal',
};

const maintOnly = calculateWeightGain(base);
assert.ok(maintOnly);
assert.equal(maintOnly!.formattedMaintenance, formatRound(maint));
assert.equal(maintOnly!.gainCaloriesKcal, null);

const withGoal: WeightGainInput = {
  ...base,
  targetWeightValue: '65',
  gainPace: 'normal',
};
const plan = calculateWeightGain(withGoal);
assert.ok(plan);
assert.equal(plan!.weeksToGoal, 10);
assert.equal(plan!.surplusKcal, 500);
assert.ok(plan!.gainCaloriesKcal != null);
assert.ok(Math.abs(plan!.gainCaloriesKcal! - (maint + 500)) < 0.5);
assert.equal(plan!.goalFeasible, true);

const strictGoal: WeightGainInput = { ...withGoal, gainPace: 'strict' };
const strict = calculateWeightGain(strictGoal);
assert.ok(strict);
assert.equal(strict!.weeksToGoal, 5);
assert.equal(strict!.surplusKcal, 1000);
assert.ok(Math.abs(strict!.gainCaloriesKcal! - (maint + 1000)) < 0.5);

assert.equal(weeksToGoal(60, 60, 0.5).feasible, false);
assert.equal(weeksToGoal(60, 55, 0.5).feasible, false);
assert.equal(weeksToGoal(60, 65, 1).weeks, 5);

const blank = validateWeightGainInput({ ...base, ageYears: '' });
assert.equal(blank.isValid, false);

const ok = validateWeightGainInput(withGoal);
assert.equal(ok.isValid, true);

console.log('weight-gain calculation.test.ts: ok');

function formatRound(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}
