/**
 * Run: npx tsx src/tools/calculators/carbohydrate-calculator/calculation.test.ts
 */
import {
  calculateCarbohydrateCalculator,
  resolveHeightWeightCmKg,
} from './calculation';
import { createDefaultInput } from './types';
import { validateCarbohydrateCalculatorInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const input = { ...createDefaultInput(), isSubmitted: true };
  const hw = resolveHeightWeightCmKg(input);
  assert(hw != null && hw.heightCm === 180 && hw.weightKg === 60, 'metric hw');
  const r = calculateCarbohydrateCalculator(input);
  assert(r.maintenanceKcalPerDay != null && r.carbRows.length === 5, 'submitted');
}

{
  const v = validateCarbohydrateCalculatorInput(createDefaultInput());
  assert(v.result != null && v.result.maintenanceKcalPerDay == null, 'not submitted');
}

{
  const v = validateCarbohydrateCalculatorInput({
    ...createDefaultInput(),
    isSubmitted: true,
    ageYearsText: '17',
  });
  assert(v.errors.ageYearsText != null, 'age boundary');
}

console.log('carbohydrate-calculator calculation.test.ts: ok');