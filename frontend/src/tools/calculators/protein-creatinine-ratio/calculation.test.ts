/**
 * Run: npx tsx calculation.test.ts
 */
import {
  calculateProteinCreatinineRatio,
  creatinineToMgDl,
  upcrGramsPerGram,
} from './calculation';
import { createDefaultInput } from './types';
import { validateProteinCreatinineRatioInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const r = calculateProteinCreatinineRatio(createDefaultInput());
  assert(r.upcrGg === null, 'blank empty');
}

{
  const r = calculateProteinCreatinineRatio({
    proteinText: '50',
    creatinineText: '100',
    creatinineUnit: 'mg_dl',
  });
  assert(r.upcrGg === 0.5, `expected 0.5 g/g got ${r.upcrGg}`);
  assert(r.upcrMgG === 500, `expected 500 mg/g got ${r.upcrMgG}`);
  assert(r.formattedGg === '0.5', `fmt ${r.formattedGg}`);
}

{
  assert(creatinineToMgDl(1, 'g_l') === 100, 'g/L → mg/dL');
  assert(Math.abs(creatinineToMgDl(1, 'mmol_l') - 11.3) < 1e-9, 'mmol factor');
}

{
  let threw = false;
  try {
    upcrGramsPerGram(50, 0);
  } catch {
    threw = true;
  }
  assert(threw, 'zero creatinine guarded');
}

{
  const v = validateProteinCreatinineRatioInput({
    proteinText: '50',
    creatinineText: '0',
    creatinineUnit: 'mg_dl',
  });
  assert(v.errors.creatinineText, 'zero creatinine field error');
}

console.log('protein-creatinine-ratio calculation.test.ts: ok');
