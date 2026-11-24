/**
 * Run: npx tsx src/tools/calculators/iifym/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  amdrSharesTotalOk,
  calculateIifym,
  macroGramsFromKcal,
  mifflinStJeorBmrKcal,
  weeksToGoal,
} from './calculation';
import type { IifymInput } from './types';
import { CARB_SHARE, FAT_SHARE, PROTEIN_SHARE } from './types';
import { validateIifymInput } from './validation';

assert.equal(amdrSharesTotalOk(), true);
assert.equal(
  PROTEIN_SHARE.min + CARB_SHARE.min + FAT_SHARE.min <= 100,
  true,
);
assert.equal(
  PROTEIN_SHARE.max + CARB_SHARE.max + FAT_SHARE.max >= 100,
  true,
);

// Omni fixture: F · 30 · 165 cm · 65 kg · light → maintenance ≈ 1,918
const bmr = mifflinStJeorBmrKcal(65, 165, 30, 'female');
assert.ok(bmr);
assert.ok(Math.abs(bmr! - (10 * 65 + 6.25 * 165 - 5 * 30 - 161)) < 1e-9);
const maint = bmr! * 1.4;
assert.ok(Math.abs(maint - 1918.35) < 0.05);
assert.equal(Math.round(maint), 1918);

const macros = macroGramsFromKcal(maint);
assert.equal(Math.round(macros.proteinMinG), 48);
assert.equal(Math.round(macros.proteinMaxG), 168);
assert.equal(Math.round(macros.carbMinG), 216);
assert.equal(Math.round(macros.carbMaxG), 312);
assert.equal(Math.round(macros.fatMinG), 43);
assert.equal(Math.round(macros.fatMaxG), 75);

const base: IifymInput = {
  sex: 'female',
  heightValue: '165',
  heightUnit: 'cm',
  weightValue: '65',
  weightUnit: 'kg',
  ageYears: '30',
  activityId: 'light',
  goalMode: 'maintain',
  targetWeightValue: '',
  targetWeightUnit: 'kg',
  changePace: 'normal',
};

const maintain = calculateIifym(base);
assert.ok(maintain);
assert.equal(maintain!.formattedMaintenance, '1,918');
assert.equal(maintain!.goalMode, 'maintain');
assert.equal(Math.round(maintain!.macros.proteinMinG), 48);
assert.equal(Math.round(maintain!.macros.proteinMaxG), 168);
assert.equal(Math.round(maintain!.macros.carbMinG), 216);
assert.equal(Math.round(maintain!.macros.carbMaxG), 312);
assert.equal(Math.round(maintain!.macros.fatMinG), 43);
assert.equal(Math.round(maintain!.macros.fatMaxG), 75);

const lose: IifymInput = {
  ...base,
  goalMode: 'change',
  targetWeightValue: '60',
  changePace: 'normal',
};
const losePlan = calculateIifym(lose);
assert.ok(losePlan);
assert.equal(losePlan!.changeDirection, 'lose');
assert.equal(losePlan!.weeksToGoal, 10);
assert.equal(losePlan!.deltaKcal, -500);
assert.ok(Math.abs(losePlan!.targetKcal - (maint - 500)) < 0.5);
assert.equal(Math.round(losePlan!.macros.proteinMinG), Math.round(((maint - 500) * 0.1) / 4));

const gain: IifymInput = {
  ...base,
  goalMode: 'change',
  targetWeightValue: '70',
  changePace: 'strict',
};
const gainPlan = calculateIifym(gain);
assert.ok(gainPlan);
assert.equal(gainPlan!.changeDirection, 'gain');
assert.equal(gainPlan!.weeksToGoal, 5);
assert.equal(gainPlan!.deltaKcal, 1000);
assert.ok(Math.abs(gainPlan!.targetKcal - (maint + 1000)) < 0.5);

assert.equal(weeksToGoal(65, 65, 0.5).feasible, false);
assert.equal(weeksToGoal(65, 60, 0.5).weeks, 10);
assert.equal(weeksToGoal(65, 70, 1).weeks, 5);

const blank = validateIifymInput({ ...base, ageYears: '' });
assert.equal(blank.isValid, false);

const ok = validateIifymInput(base);
assert.equal(ok.isValid, true);
assert.ok(ok.result);

const changeMissingTarget = validateIifymInput({
  ...base,
  goalMode: 'change',
  targetWeightValue: '',
});
assert.equal(changeMissingTarget.isValid, false);

console.log('iifym calculation.test.ts: ok');
