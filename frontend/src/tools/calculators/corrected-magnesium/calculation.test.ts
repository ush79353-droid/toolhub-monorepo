/**
 * Run: cd frontend && npx tsx src/tools/calculators/corrected-magnesium/calculation.test.ts
 */
import {
  calculateCorrectedMagnesium,
  correctedMagnesiumMmolL,
  magnesiumFromMmolL,
  magnesiumToMmolL,
} from './calculation';
import { createDefaultInput } from './types';
import { validateCorrectedMagnesiumInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  // Albumin 40 g/L → unchanged
  const r = calculateCorrectedMagnesium({
    magnesiumText: '1.4',
    magnesiumUnit: 'meq_l',
    albuminText: '40',
    albuminUnit: 'g_l',
    resultUnit: 'meq_l',
  });
  assert(r.correctedDisplay === 1.4, `alb40 ${r.correctedDisplay}`);
}

{
  // Prompt: 0.70 mmol/L + alb 30 → 0.75 mmol/L = 1.50 mEq/L
  assert(correctedMagnesiumMmolL(0.7, 30) === 0.75, 'kroll 0.75');
  const r = calculateCorrectedMagnesium({
    magnesiumText: '0.7',
    magnesiumUnit: 'mmol_l',
    albuminText: '30',
    albuminUnit: 'g_l',
    resultUnit: 'mmol_l',
  });
  assert(r.correctedDisplay === 0.75, `mmol ${r.correctedDisplay}`);
  const meq = calculateCorrectedMagnesium({
    magnesiumText: '0.7',
    magnesiumUnit: 'mmol_l',
    albuminText: '30',
    albuminUnit: 'g_l',
    resultUnit: 'meq_l',
  });
  assert(meq.correctedDisplay === 1.5, `meq ${meq.correctedDisplay}`);
}

{
  assert(magnesiumToMmolL(1.4, 'meq_l') === 0.7, 'meq→mmol');
  assert(magnesiumFromMmolL(0.7, 'meq_l') === 1.4, 'mmol→meq');
}

{
  // Unit invariance: same physical inputs
  const a = calculateCorrectedMagnesium({
    magnesiumText: '1.4',
    magnesiumUnit: 'meq_l',
    albuminText: '3',
    albuminUnit: 'g_dl',
    resultUnit: 'mmol_l',
  });
  const b = calculateCorrectedMagnesium({
    magnesiumText: '0.7',
    magnesiumUnit: 'mmol_l',
    albuminText: '30',
    albuminUnit: 'g_l',
    resultUnit: 'mmol_l',
  });
  assert(a.correctedDisplay === b.correctedDisplay, 'unit invariance');
}

{
  const v = validateCorrectedMagnesiumInput(createDefaultInput());
  assert(v.result != null && v.result.correctedDisplay == null, 'blank');
}

{
  const v = validateCorrectedMagnesiumInput({
    magnesiumText: '0',
    magnesiumUnit: 'meq_l',
    albuminText: '40',
    albuminUnit: 'g_l',
    resultUnit: 'meq_l',
  });
  assert(v.errors.magnesiumText != null, 'zero mg');
}

console.log('corrected-magnesium calculation.test.ts: ok');
