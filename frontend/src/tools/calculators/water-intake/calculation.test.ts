/**
 * Run: cd frontend && npx tsx src/tools/calculators/water-intake/calculation.test.ts
 */
import {
  beverageFromTotal,
  calculateWaterIntake,
  totalAiLiters,
} from './calculation';
import { createDefaultInput } from './types';
import { validateWaterIntakeInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  assert(totalAiLiters('adult', 'male', null) === 3.7, 'adult male');
  assert(totalAiLiters('adult', 'female', null) === 2.7, 'adult female');
  const r = calculateWaterIntake({
    mode: 'adult',
    sex: 'male',
    ageText: '',
    ageUnit: 'years',
  });
  assert(r.totalLiters === 3.7, 'total');
  assert(r.beverageLiters != null && Math.abs(r.beverageLiters - 3.0) < 1e-9, 'bev');
  assert(r.beverageCups === 13, `cups ${r.beverageCups}`);
}

{
  const { beverageLiters, beverageCups } = beverageFromTotal(2.7);
  assert(Math.abs(beverageLiters - 2.2) < 1e-12, 'f bev');
  assert(beverageCups === Math.round((2.2 * 1000) / 240), 'f cups');
}

{
  assert(totalAiLiters('child', 'male', 0.25) === 0.7, '0-6m');
  assert(totalAiLiters('child', 'male', 0.75) === 0.8, '7-12m');
  assert(totalAiLiters('child', 'female', 2) === 1.3, '1-3');
  assert(totalAiLiters('child', 'male', 10) === 2.4, '9-13 m');
  assert(totalAiLiters('child', 'female', 10) === 2.1, '9-13 f');
}

{
  const v = validateWaterIntakeInput(createDefaultInput());
  assert(v.result != null && v.result.totalLiters === 3.7, 'default');
}

console.log('water-intake calculation.test.ts: ok');
