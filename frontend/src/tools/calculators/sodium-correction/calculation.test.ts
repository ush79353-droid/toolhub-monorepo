/**
 * Run: cd frontend && npx tsx src/tools/calculators/sodium-correction/calculation.test.ts
 */
import {
  calculateSodiumCorrection,
  correctedSodiumHillier,
  correctedSodiumKatz,
  glucoseToMgDl,
} from './calculation';
import { createDefaultInput } from './types';
import { validateSodiumCorrectionInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  // Glucose at reference → corrected equals measured
  assert(correctedSodiumHillier(140, 100) === 140, 'hillier@100');
  assert(correctedSodiumKatz(140, 100) === 140, 'katz@100');
  const r = calculateSodiumCorrection({
    sodiumText: '140',
    glucoseText: '100',
    glucoseUnit: 'mg_dl',
    showOlderVersion: false,
  });
  assert(r.correctedHillier === 140, `hillier display ${r.correctedHillier}`);
  assert(r.correctedKatz === 140, `katz display ${r.correctedKatz}`);
}

{
  // Classic high glucose: 140 + 0.024*400 = 149.6; Katz 146.4
  assert(correctedSodiumHillier(140, 500) === 149.6, 'hillier 149.6');
  assert(correctedSodiumKatz(140, 500) === 146.4, 'katz 146.4');
  const r = calculateSodiumCorrection({
    sodiumText: '140',
    glucoseText: '500',
    glucoseUnit: 'mg_dl',
    showOlderVersion: true,
  });
  assert(r.correctedHillier === 149.6, `h ${r.correctedHillier}`);
  assert(r.correctedKatz === 146.4, `k ${r.correctedKatz}`);
  assert(r.formattedHillier === '149.6', `fmt ${r.formattedHillier}`);
}

{
  // mmol/L path: 27.75 mmol/L ≈ 500 mg/dL (×18.0182)
  const mg = glucoseToMgDl(27.75, 'mmol_l');
  assert(Math.abs(mg - 500) < 0.05, `mmol convert ${mg}`);
  const r = calculateSodiumCorrection({
    sodiumText: '140',
    glucoseText: '27.75',
    glucoseUnit: 'mmol_l',
    showOlderVersion: false,
  });
  assert(
    r.correctedHillier != null && Math.abs(r.correctedHillier - 149.6) < 0.1,
    `mmol hillier ${r.correctedHillier}`,
  );
}

{
  const v = validateSodiumCorrectionInput(createDefaultInput());
  assert(v.result != null && v.result.correctedHillier == null, 'blank');
}

{
  const v = validateSodiumCorrectionInput({
    sodiumText: '0',
    glucoseText: '100',
    glucoseUnit: 'mg_dl',
    showOlderVersion: false,
  });
  assert(v.errors.sodiumText != null, 'zero sodium');
}

{
  const v = validateSodiumCorrectionInput({
    sodiumText: '140',
    glucoseText: '0',
    glucoseUnit: 'mg_dl',
    showOlderVersion: false,
  });
  assert(v.errors.glucoseText != null, 'zero glucose');
}

{
  // Erased input clears result path
  const v = validateSodiumCorrectionInput({
    sodiumText: '140',
    glucoseText: '',
    glucoseUnit: 'mg_dl',
    showOlderVersion: false,
  });
  assert(v.result?.correctedHillier == null, 'cleared glucose');
}

console.log('sodium-correction calculation.test.ts: ok');
