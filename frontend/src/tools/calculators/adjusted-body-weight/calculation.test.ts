/**
 * Run: cd frontend && npx tsx src/tools/calculators/adjusted-body-weight/calculation.test.ts
 */
import {
  adjustedBodyWeightKg,
  calculateAdjustedBodyWeight,
  robinsonIbwKg,
} from './calculation';
import { createDefaultInput } from './types';
import { validateAdjustedBodyWeightInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  // Prompt fixture: female 65 in · 80 kg → IBW 57.5 · AjBW 66.5
  const ibw = robinsonIbwKg(65, 'female');
  assert(Math.abs(ibw - 57.5) < 1e-12, `ibw ${ibw}`);
  const { adjKg, adjustmentApplied } = adjustedBodyWeightKg(ibw, 80);
  assert(adjustmentApplied, 'applied');
  assert(Math.abs(adjKg - 66.5) < 1e-12, `adj ${adjKg}`);

  const r = calculateAdjustedBodyWeight({
    sex: 'female',
    heightText: '65',
    heightUnit: 'in',
    weightText: '80',
    weightUnit: 'kg',
    resultWeightUnit: 'kg',
  });
  assert(r.ibwKg != null && Math.abs(r.ibwKg - 57.5) < 1e-12, 'wired ibw');
  assert(r.adjBwKg != null && Math.abs(r.adjBwKg - 66.5) < 1e-12, 'wired adj');
}

{
  // Equal ideal/actual → AjBW = IBW
  const ibw = robinsonIbwKg(65, 'female');
  const { adjKg, adjustmentApplied } = adjustedBodyWeightKg(ibw, ibw);
  assert(!adjustmentApplied, 'equal no adj');
  assert(Math.abs(adjKg - ibw) < 1e-12, 'equal');
}

{
  // Underweight: adjustment does not apply
  const ibw = robinsonIbwKg(65, 'female');
  const { adjKg, adjustmentApplied } = adjustedBodyWeightKg(ibw, 50);
  assert(!adjustmentApplied, 'under');
  assert(Math.abs(adjKg - 50) < 1e-12, 'use actual');
}

{
  // Male Robinson quick check: 70 in → 52 + 1.9×10 = 71
  assert(Math.abs(robinsonIbwKg(70, 'male') - 71) < 1e-12, 'male');
}

{
  // Metric path: 65 in = 165.1 cm
  const r = calculateAdjustedBodyWeight({
    sex: 'female',
    heightText: '165.1',
    heightUnit: 'cm',
    weightText: '80',
    weightUnit: 'kg',
    resultWeightUnit: 'kg',
  });
  assert(r.ibwKg != null && Math.abs(r.ibwKg - 57.5) < 1e-9, `cm ${r.ibwKg}`);
}

{
  const v = validateAdjustedBodyWeightInput(createDefaultInput());
  assert(v.result != null && v.result.ibwKg == null, 'blank');
}

console.log('adjusted-body-weight calculation.test.ts: ok');
