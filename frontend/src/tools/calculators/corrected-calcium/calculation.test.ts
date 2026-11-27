/**
 * Run: cd frontend && npx tsx src/tools/calculators/corrected-calcium/calculation.test.ts
 */
import {
  albuminToGDl,
  calculateCorrectedCalcium,
  calciumToMgDl,
  correctedCalciumMgDl,
} from './calculation';
import { createDefaultInput } from './types';
import { validateCorrectedCalciumInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  // Albumin 4 → correction 0 → equals measured
  const r = calculateCorrectedCalcium({
    calciumText: '10',
    calciumUnit: 'mg_dl',
    albuminText: '4',
    albuminUnit: 'g_dl',
    resultUnit: 'mg_dl',
  });
  assert(r.correctedDisplay === 10, `alb4 ${r.correctedDisplay}`);
  assert(r.formattedCorrected === '10', `fmt ${r.formattedCorrected}`);
}

{
  // Classic: 10 + 0.8*(4-3) = 10.8
  assert(correctedCalciumMgDl(10, 3) === 10.8, 'payne 10.8');
  const r = calculateCorrectedCalcium({
    calciumText: '10',
    calciumUnit: 'mg_dl',
    albuminText: '3',
    albuminUnit: 'g_dl',
    resultUnit: 'mg_dl',
  });
  assert(r.correctedDisplay === 10.8, `10.8 got ${r.correctedDisplay}`);
}

{
  // SI calcium 2.5 mmol/L (=10 mg/dL), albumin 40 g/L (=4) → 2.5
  assert(calciumToMgDl(2.5, 'mmol_l') === 10, 'ca convert');
  assert(albuminToGDl(40, 'g_l') === 4, 'alb convert');
  const r = calculateCorrectedCalcium({
    calciumText: '2.5',
    calciumUnit: 'mmol_l',
    albuminText: '40',
    albuminUnit: 'g_l',
    resultUnit: 'mmol_l',
  });
  assert(r.correctedDisplay === 2.5, `si ${r.correctedDisplay}`);
}

{
  // Low albumin SI: 2.5 mmol/L, albumin 30 g/L → mg path 10 + 0.8 = 10.8 → 2.7 mmol/L
  const r = calculateCorrectedCalcium({
    calciumText: '2.5',
    calciumUnit: 'mmol_l',
    albuminText: '30',
    albuminUnit: 'g_l',
    resultUnit: 'mmol_l',
  });
  assert(r.correctedDisplay === 2.7, `si low alb ${r.correctedDisplay}`);
}

{
  const v = validateCorrectedCalciumInput(createDefaultInput());
  assert(v.result != null && v.result.correctedDisplay == null, 'blank');
}

{
  const v = validateCorrectedCalciumInput({
    calciumText: '0',
    calciumUnit: 'mg_dl',
    albuminText: '4',
    albuminUnit: 'g_dl',
    resultUnit: 'mg_dl',
  });
  assert(v.errors.calciumText != null, 'zero calcium');
}

{
  const v = validateCorrectedCalciumInput({
    calciumText: '10',
    calciumUnit: 'mg_dl',
    albuminText: '0',
    albuminUnit: 'g_dl',
    resultUnit: 'mg_dl',
  });
  assert(v.errors.albuminText != null, 'zero albumin');
}

console.log('corrected-calcium calculation.test.ts: ok');
