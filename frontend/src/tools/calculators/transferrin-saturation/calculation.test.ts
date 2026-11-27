/**
 * Transferrin Saturation — assert-based engine check.
 * Run: npx tsx src/tools/calculators/transferrin-saturation/calculation.test.ts
 */
import {
  calculateTransferrinSaturation,
  formatTsat,
  ironToUgDl,
  tsatFromTibc,
  tsatFromTransferrin,
  transferrinToMgDl,
  UG_DL_PER_UMOL_L,
} from './calculation';
import { createDefaultInput } from './types';
import { validateTransferrinSaturationInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Prompt fixture: Fe 100 / TIBC 400 → 25%
{
  const tsat = tsatFromTibc(100, 400);
  assert(tsat === 25, `fixture ${tsat}`);
  assert(formatTsat(tsat) === '25', `fmt ${formatTsat(tsat)}`);
}

{
  const tsat = tsatFromTransferrin(112, 219);
  assert(Math.abs(tsat - 36.26) < 0.02, `omni TF example ${tsat}`);
}

{
  const r = calculateTransferrinSaturation({
    ...createDefaultInput(),
    fe1Text: '100',
    tibcText: '400',
  });
  assert(r.tsat1 === 25, 'method1 path');
  assert(r.tsat2 === null, 'method2 empty');
}

{
  const r = calculateTransferrinSaturation({
    ...createDefaultInput(),
    fe2Text: '90',
    tfText: '310',
  });
  assert(r.tsat2 != null && Math.abs(r.tsat2 - 20.58) < 0.02, `method2 ${r.tsat2}`);
}

// Unit conversions
{
  const ug = ironToUgDl(1, 'umol_l');
  assert(Math.abs(ug - UG_DL_PER_UMOL_L) < 1e-9, 'umol to ug/dL');
  assert(transferrinToMgDl(2, 'g_l') === 200, 'g/L to mg/dL');
}

{
  let threw = false;
  try {
    tsatFromTibc(100, 0);
  } catch {
    threw = true;
  }
  assert(threw, 'zero TIBC throws');
}

{
  const v = validateTransferrinSaturationInput({
    ...createDefaultInput(),
    tibcText: '0',
    fe1Text: '100',
  });
  assert(v.errors.tibcText != null, 'zero TIBC error');
}

{
  const v = validateTransferrinSaturationInput(createDefaultInput());
  assert(v.result != null && v.result.tsat1 == null, 'blank');
}

console.log('transferrin-saturation calculation.test.ts: ok');
