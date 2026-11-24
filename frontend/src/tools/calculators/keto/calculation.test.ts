/**
 * Run: npx tsx src/tools/calculators/keto/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  calculateKeto,
  macroPercentsTotalOk,
  macrosFromAllocation,
  mifflinStJeorBmrKcal,
  weeksToGoal,
} from './calculation';
import type { KetoInput } from './types';
import { validateKetoInput } from './validation';

assert.equal(macroPercentsTotalOk(75, 5, 20), true);
assert.equal(macroPercentsTotalOk(70, 5, 20), false);
assert.equal(macroPercentsTotalOk(80, 10, 10), true);

// 2,000 kcal allocation @ 75/5/20 → Atwater grams
const alloc = macrosFromAllocation(2000, 75, 5, 20);
assert.ok(alloc);
assert.equal(alloc!.fatKcal, 1500);
assert.equal(alloc!.carbKcal, 100);
assert.equal(alloc!.proteinKcal, 400);
assert.ok(Math.abs(alloc!.fatG - 1500 / 9) < 1e-9);
assert.equal(alloc!.carbG, 25);
assert.equal(alloc!.proteinG, 100);
assert.equal(macrosFromAllocation(2000, 70, 5, 20), null);

// Mifflin fixture: F · 30 · 165 cm · 65 kg · light PAL 1.4
const bmr = mifflinStJeorBmrKcal(65, 165, 30, 'female');
assert.ok(bmr);
assert.ok(Math.abs(bmr! - (10 * 65 + 6.25 * 165 - 5 * 30 - 161)) < 1e-9);
const maint = bmr! * 1.4;
assert.equal(Math.round(maint), 1918);

const base: KetoInput = {
  sex: 'female',
  heightValue: '165',
  heightUnit: 'cm',
  weightValue: '65',
  weightUnit: 'kg',
  ageYears: '30',
  activityId: 'light',
  targetWeightValue: '65',
  targetWeightUnit: 'kg',
  dietPace: 'normal',
  fatPct: '75',
  carbPct: '5',
  proteinPct: '20',
  macroMassUnit: 'g',
};

const maintain = calculateKeto(base);
assert.ok(maintain);
assert.equal(maintain!.changeDirection, 'maintain');
assert.equal(maintain!.formattedAllocated, '1,918');
assert.equal(maintain!.deltaKcal, null);
assert.ok(Math.abs(maintain!.macros.fatKcal - maint * 0.75) < 0.5);
assert.ok(Math.abs(maintain!.macros.carbKcal - maint * 0.05) < 0.5);
assert.ok(Math.abs(maintain!.macros.proteinKcal - maint * 0.2) < 0.5);

const lose: KetoInput = {
  ...base,
  targetWeightValue: '60',
  dietPace: 'normal',
};
const losePlan = calculateKeto(lose);
assert.ok(losePlan);
assert.equal(losePlan!.changeDirection, 'lose');
assert.equal(losePlan!.weeksToGoal, 10);
assert.equal(losePlan!.deltaKcal, -500);
assert.ok(Math.abs(losePlan!.allocatedKcal - (maint - 500)) < 0.5);
assert.ok(Math.abs(losePlan!.macros.fatG - ((maint - 500) * 0.75) / 9) < 0.05);

const gain: KetoInput = {
  ...base,
  targetWeightValue: '70',
  dietPace: 'strict',
};
const gainPlan = calculateKeto(gain);
assert.ok(gainPlan);
assert.equal(gainPlan!.changeDirection, 'gain');
assert.equal(gainPlan!.weeksToGoal, 5);
assert.equal(gainPlan!.deltaKcal, 1000);
assert.ok(Math.abs(gainPlan!.allocatedKcal - (maint + 1000)) < 0.5);

assert.equal(weeksToGoal(65, 65, 0.5).direction, 'maintain');
assert.equal(weeksToGoal(65, 60, 0.5).weeks, 10);
assert.equal(weeksToGoal(65, 70, 1).weeks, 5);

const blank = validateKetoInput({ ...base, ageYears: '' });
assert.equal(blank.isValid, false);
assert.ok(blank.errors.ageYears);

const badTotal = validateKetoInput({
  ...base,
  fatPct: '70',
  carbPct: '5',
  proteinPct: '20',
});
assert.equal(badTotal.isValid, false);
assert.ok(badTotal.errors.macrosTotal);

const ok = validateKetoInput(base);
assert.equal(ok.isValid, true);
assert.ok(ok.result);

console.log('keto calculation.test.ts: ok');
