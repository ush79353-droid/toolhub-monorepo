/**
 * Run: npx tsx src/tools/calculators/meal-calorie/calculation.test.ts
 */
import {
  buildMealRows,
  calculateMealCalorieFromInput,
  reconcileMealCenters,
} from './calculation';
import { createDefaultInput, createThreeMealFixtureInput } from './types';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function rowByLabel(
  rows: { label: string; centerKcal: number; minKcal: number; maxKcal: number }[],
  label: string,
) {
  const r = rows.find((x) => x.label === label);
  assert(r, `row ${label}`);
  return r!;
}

{
  const centers = reconcileMealCenters(2000, [32.5, 37.5, 30]);
  assert(
    centers[0] === 650 && centers[1] === 750 && centers[2] === 600,
    `three reconcile ${centers.join('/')}`,
  );
  assert(centers.reduce((a, b) => a + b, 0) === 2000, 'three sum');
}

{
  const r = calculateMealCalorieFromInput(createThreeMealFixtureInput(), 2000);
  assert(r != null, 'three-meal fixture result');
  const b = rowByLabel(r!.rows, 'Breakfast');
  const l = rowByLabel(r!.rows, 'Lunch');
  const d = rowByLabel(r!.rows, 'Dinner');
  assert(b.centerKcal === 650, `breakfast center ${b.centerKcal}`);
  assert(b.minKcal === 600 && b.maxKcal === 700, `breakfast range ${b.minKcal}-${b.maxKcal}`);
  assert(l.centerKcal === 750, `lunch center ${l.centerKcal}`);
  assert(l.minKcal === 700 && l.maxKcal === 800, `lunch range`);
  assert(d.centerKcal === 600, `dinner center ${d.centerKcal}`);
  assert(d.minKcal === 500 && d.maxKcal === 700, `dinner range`);
  assert(
    r!.rows.reduce((a, x) => a + x.centerKcal, 0) === 2000,
    'fixture center sum',
  );
}

{
  const input = { ...createDefaultInput(), mealsPerDay: 'four' as const };
  const rows = buildMealRows(2000, 'four');
  const b = rowByLabel(rows, 'Breakfast');
  const ms = rowByLabel(rows, 'Morning snack');
  const l = rowByLabel(rows, 'Lunch');
  const d = rowByLabel(rows, 'Dinner');
  assert(b.centerKcal === 550, `four B ${b.centerKcal}`);
  assert(ms.centerKcal === 150, `four snack ${ms.centerKcal}`);
  assert(l.centerKcal === 750, `four L ${l.centerKcal}`);
  assert(d.centerKcal === 550, `four D ${d.centerKcal}`);
  assert(rows.reduce((a, x) => a + x.centerKcal, 0) === 2000, 'four sum');
  const r = calculateMealCalorieFromInput(input, 2000);
  assert(r != null && r.rows.length === 4, 'four calculate');
}

{
  const rows = buildMealRows(2000, 'five');
  assert(rows.length === 5, 'five rows');
  assert(rows.reduce((a, x) => a + x.centerKcal, 0) === 2000, 'five sum');
}

{
  const input = {
    ...createDefaultInput(),
    calculateRequiredCalories: true,
    sex: 'female' as const,
    ageYears: '50',
    heightValue: '165',
    weightValue: '65',
    activityId: 'regular' as const,
    mealsPerDay: 'three' as const,
  };
  const r = calculateMealCalorieFromInput(input, null);
  assert(r != null && r.fromMaintenance, 'maintenance path');
  assert(r!.maintenanceKcal != null && r!.maintenanceKcal > 0, 'maintenance kcal');
}

console.log('meal-calorie calculation.test.ts: ok');