/**
 * Run: npx tsx --tsconfig tsconfig.json src/tools/calculators/fat-intake/calculation.test.ts
 */
import {
  fatGramsFromKcalAndShare,
  calculateFatIntake,
  SATURATED_FAT_MAX_SHARE_PERCENT,
  FAT_SHARE_PERCENTS,
} from './calculation';
import { createDefaultInput } from './types';
import { validateFatIntakeInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Prompt fixture: 2,000 kcal at 30% → 66.7 g
assert(
  Math.abs(fatGramsFromKcalAndShare(2000, 30) - 66.6666666667) < 1e-9,
  '2000 kcal 30% → 2000×0.30/9',
);
assert(
  Math.abs(Number(fatGramsFromKcalAndShare(2000, 30).toFixed(1)) - 66.7) < 1e-9,
  'presentation rounding 66.7 g',
);

{
  const r = calculateFatIntake({
    ...createDefaultInput(),
    caloriesText: '2000',
  });
  assert(r.fatRows.length === FAT_SHARE_PERCENTS.length, 'amdr rows');
  const row30 = r.fatRows.find((x) => x.sharePercent === 30);
  assert(row30 != null && Math.abs(row30.fatGramsPerDay - 2000 / 9 * 0.3) < 1e-9, 'row 30%');
  assert(
    row30 != null && Math.abs(Number(row30.fatGramsPerDay.toFixed(1)) - 66.7) < 1e-9,
    'row 30% rounded',
  );
  const row20 = r.fatRows.find((x) => x.sharePercent === 20);
  const row35 = r.fatRows.find((x) => x.sharePercent === 35);
  assert(row20 != null && Math.abs(row20.fatGramsPerDay - 2000 * 0.2 / 9) < 1e-9, '20%');
  assert(row35 != null && Math.abs(row35.fatGramsPerDay - 2000 * 0.35 / 9) < 1e-9, '35%');
  assert(r.saturatedSharePercent === SATURATED_FAT_MAX_SHARE_PERCENT, 'sat %');
  assert(
    r.saturatedFatMaxGrams != null &&
      Math.abs(r.saturatedFatMaxGrams - 2000 * 0.1 / 9) < 1e-9,
    'sat grams <10%',
  );
  assert(r.tdeeSource === 'Calories field', 'kcal override source');
}

{
  const r = calculateFatIntake({
    ...createDefaultInput(),
    sex: 'female',
    ageYearsText: '30',
    heightText: '165',
    weightText: '60',
    activityId: 'light',
  });
  assert(r.totalKcalPerDay != null && r.fatRows.length === 4, 'tdee path');
  assert(r.tdeeSource === 'Mifflin–St Jeor × PAL', 'tdee source');
  assert(r.saturatedFatMaxGrams != null && r.saturatedFatMaxGrams > 0, 'sat from tdee');
}

{
  const r = calculateFatIntake(createDefaultInput());
  assert(r.fatRows.length === 0 && r.totalKcalPerDay == null, 'empty default');
}

{
  const v = validateFatIntakeInput({
    ...createDefaultInput(),
    ageYearsText: '12',
  });
  assert(v.errors.ageYearsText != null, 'invalid age');
}

{
  const v = validateFatIntakeInput({
    ...createDefaultInput(),
    caloriesText: '-5',
  });
  assert(v.errors.caloriesText != null, 'negative calories');
}

console.log('fat-intake calculation.test.ts: ok');
