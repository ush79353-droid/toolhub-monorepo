/**
 * Run: npx tsx src/tools/calculators/carb-calculator/calculation.test.ts
 */
import {
  carbGramsFromKcalAndShare,
  calculateCarbCalculator,
  ADULT_RDA_G,
} from './calculation';
import { createDefaultInput } from './types';
import { validateCarbCalculatorInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(
  Math.abs(carbGramsFromKcalAndShare(2000, 50) - 250) < 0.01,
  '2000 kcal 50% → 250 g',
);

{
  const r = calculateCarbCalculator({
    ...createDefaultInput(),
    totalKcalText: '2000',
  });
  const row50 = r.carbRows.find((x) => x.sharePercent === 50);
  assert(row50 != null && Math.abs(row50.carbGramsPerDay - 250) < 0.01, 'row 50%');
  assert(r.rdaGrams === ADULT_RDA_G, 'rda');
}

{
  const r = calculateCarbCalculator({
    ...createDefaultInput(),
    sex: 'female',
    ageYearsText: '30',
    heightText: '165',
    weightText: '60',
    activityId: 'light',
  });
  assert(r.totalKcalPerDay != null && r.carbRows.length === 5, 'tdee path');
}

{
  const v = validateCarbCalculatorInput({
    ...createDefaultInput(),
    ageYearsText: '12',
  });
  assert(v.errors.ageYearsText != null, 'invalid age');
}

console.log('carb-calculator calculation.test.ts: ok');