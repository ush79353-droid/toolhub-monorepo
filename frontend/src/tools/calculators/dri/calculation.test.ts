/**
 * Run: npx tsx src/tools/calculators/dri/calculation.test.ts
 */
import {
  buildNutrientRows,
  calculateDri,
  harrisBenedictBmrKcal,
  macroRangeFromKcal,
  totalDailyCaloriesKcal,
} from './calculation';
import { createDefaultInput } from './types';
import { validateDriInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Fixture: male 180 cm / 80 kg / 19–50 / sedentary → 2,280 kcal (Harris age 25 → BMR 1900×1.2)
{
  const kcal = totalDailyCaloriesKcal('male', 80, 180, 'y19_50', 'little_no');
  assert(kcal === 2280, `sedentary male calories ${kcal}`);
}

// Activity 3–5×/week uses PAL 1.75 → 3,325
{
  const kcal = totalDailyCaloriesKcal('male', 80, 180, 'y19_50', 'ex_3_5');
  assert(kcal === 3325, `active male calories ${kcal}`);
}

// BMI 80 kg @ 180 cm
{
  const r = calculateDri({
    ...createDefaultInput(),
    heightText: '180',
    weightText: '80',
  });
  assert(r.bmi != null && Math.abs(r.bmi - 24.691) < 0.01, `bmi ${r.bmi}`);
  assert(r.caloriesDisplay === '2,280', `cal display ${r.caloriesDisplay}`);
  assert(r.carbs?.lowGrams === 257 && r.carbs.highGrams === 371, `carbs ${JSON.stringify(r.carbs)}`);
  assert(r.protein?.lowGrams === 57 && r.protein.highGrams === 171, `protein ${JSON.stringify(r.protein)}`);
  assert(r.fat?.lowGrams === 51 && r.fat.highGrams === 89, `fat ${JSON.stringify(r.fat)}`);
  assert(r.fiberGrams === 32, `fiber ${r.fiberGrams}`);
  assert(r.waterLiters === 2.3, `water ${r.waterLiters}`);
  const vitC = r.nutrientRows.find((n) => n.id === 'vit_c');
  assert(vitC?.display === '90', `vit C ${vitC?.display}`);
  const iron = r.nutrientRows.find((n) => n.id === 'iron');
  assert(iron?.display === '8', `iron ${iron?.display}`);
  const mg = r.nutrientRows.find((n) => n.id === 'magnesium');
  assert(mg?.display === '410', `magnesium ${mg?.display}`);
}

// Smoker adds +35 mg vitamin C only
{
  const rows = buildNutrientRows('male', 'y19_50', true);
  const vitC = rows.find((n) => n.id === 'vit_c');
  assert(vitC?.display === '125', `smoker vit C ${vitC?.display}`);
  const iron = rows.find((n) => n.id === 'iron');
  assert(iron?.display === '8', 'iron unchanged by smoker');
}

// Female 19–50 iron RDA 18 mg; vit C 75 nonsmoker
{
  const rows = buildNutrientRows('female', 'y19_50', false);
  assert(rows.find((n) => n.id === 'iron')?.display === '18', 'female iron');
  assert(rows.find((n) => n.id === 'vit_c')?.display === '75', 'female vit C');
}

// Unit equivalence: 180 cm / 80 kg == 70.866 in / 176.37 lb (approx)
{
  const metric = calculateDri({
    ...createDefaultInput(),
    heightText: '180',
    weightText: '80',
  });
  const imperial = calculateDri({
    ...createDefaultInput(),
    heightText: '70.8661417',
    heightUnit: 'in',
    weightText: '176.3698097',
    weightUnit: 'lb',
  });
  assert(
    metric.caloriesKcal != null &&
      imperial.caloriesKcal != null &&
      Math.abs(metric.caloriesKcal - imperial.caloriesKcal) < 1,
    `unit parity ${metric.caloriesKcal} vs ${imperial.caloriesKcal}`,
  );
}

// Age band boundary: 51–70 uses older representative age → lower BMR than 19–50
{
  const young = harrisBenedictBmrKcal('male', 80, 180, 25);
  const older = harrisBenedictBmrKcal('male', 80, 180, 60);
  assert(older < young, 'older BMR lower');
}

// AMDR helper
{
  const p = macroRangeFromKcal(2280, 10, 30, 4);
  assert(p.lowGrams === 57 && p.highGrams === 171, 'amdr protein');
}

// Empty / invalid
{
  const blank = validateDriInput(createDefaultInput());
  assert(blank.result?.caloriesKcal == null, 'blank calories');
  const bad = validateDriInput({
    ...createDefaultInput(),
    heightText: '-1',
    weightText: '80',
  });
  assert(bad.errors.heightText, 'negative height error');
  assert(bad.result == null, 'no result on error');
}

console.log('dri calculation.test.ts: ok');
