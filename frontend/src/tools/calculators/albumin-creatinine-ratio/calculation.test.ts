/**
 * Run: cd frontend && npx tsx src/tools/calculators/albumin-creatinine-ratio/calculation.test.ts
 */
import {
  acrMgPerG,
  calculateAlbuminCreatinineRatio,
  categorizeAcr,
  creatinineToMgDl,
} from './calculation';
import { createDefaultInput } from './types';
import { validateAlbuminCreatinineRatioInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  // Omni worked example: 8 mg/dL albumin, 110 mg/dL creatinine → 72.7 mg/g
  const acr = acrMgPerG(8, 110);
  assert(Math.abs(acr - 72.727272) < 1e-6, `acr ${acr}`);
  const r = calculateAlbuminCreatinineRatio({
    albuminText: '8',
    creatinineText: '110',
    creatinineUnit: 'mg_dl',
  });
  assert(r.acrMgPerG === 72.7, `rounded ${r.acrMgPerG}`);
  assert(r.category === 'A2', `cat ${r.category}`);
}

{
  // FAQ example: 10 / 0.15 = 66.7 mg/g
  const r = calculateAlbuminCreatinineRatio({
    albuminText: '10',
    creatinineText: '150',
    creatinineUnit: 'mg_dl',
  });
  assert(r.acrMgPerG === 66.7, `faq ${r.acrMgPerG}`);
  assert(r.category === 'A2', 'A2');
}

{
  // mmol/L: 110 mg/dL ≈ 110/11.3 mmol/L
  const mmol = 110 / 11.3;
  assert(
    Math.abs(creatinineToMgDl(mmol, 'mmol_l') - 110) < 1e-9,
    'mmol convert',
  );
  const r = calculateAlbuminCreatinineRatio({
    albuminText: '8',
    creatinineText: String(mmol),
    creatinineUnit: 'mmol_l',
  });
  assert(r.acrMgPerG === 72.7, `mmol path ${r.acrMgPerG}`);
}

{
  assert(categorizeAcr(29.9) === 'A1', 'A1');
  assert(categorizeAcr(30) === 'A2', 'A2 low');
  assert(categorizeAcr(300) === 'A2', 'A2 high');
  assert(categorizeAcr(300.1) === 'A3', 'A3');
}

{
  let threw = false;
  try {
    acrMgPerG(8, 0);
  } catch {
    threw = true;
  }
  assert(threw, 'zero creatinine throws');
}

{
  const v = validateAlbuminCreatinineRatioInput(createDefaultInput());
  assert(v.result != null && v.result.acrMgPerG == null, 'blank');
}

{
  const v = validateAlbuminCreatinineRatioInput({
    albuminText: '8',
    creatinineText: '0',
    creatinineUnit: 'mg_dl',
  });
  assert(v.errors.creatinineText != null, 'creatinine zero');
}

console.log('albumin-creatinine-ratio calculation.test.ts: ok');
