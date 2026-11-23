/**
 * Absolute Lymphocyte Count — assert-based engine check.
 * Run: npx tsx src/tools/calculators/absolute-lymphocyte-count/calculation.test.ts
 */
import {
  absoluteLymphocyteCount,
  alcToCellsPerMicroliter,
  calculateAbsoluteLymphocyteCount,
  formatAlc,
  formatCellsPerUl,
} from './calculation';
import { createDefaultInput } from './types';
import { validateAbsoluteLymphocyteCountInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Prompt fixture: WBC 6 ×10³/µL, lymphocytes 25% → ALC 1.5 ×10³/µL
{
  const alc = absoluteLymphocyteCount(6, 25);
  assert(alc === 1.5, `fixture ALC ${alc}`);
  assert(formatAlc(alc) === '1.5', `fmt ${formatAlc(alc)}`);
  assert(alcToCellsPerMicroliter(alc) === 1500, 'cells/µL 1500');
  assert(formatCellsPerUl(1500) === '1,500', 'fmt cells');
}

{
  const alc = absoluteLymphocyteCount(8, 5);
  assert(alc === 0.4, '8 @ 5%');
}

{
  const alc = absoluteLymphocyteCount(10, 0);
  assert(alc === 0, 'zero lymph %');
}

{
  const alc = absoluteLymphocyteCount(4.5, 100);
  assert(alc === 4.5, '100% lymph');
}

{
  let threw = false;
  try {
    absoluteLymphocyteCount(-1, 25);
  } catch {
    threw = true;
  }
  assert(threw, 'negative WBC throws');
}

{
  let threw = false;
  try {
    absoluteLymphocyteCount(6, 101);
  } catch {
    threw = true;
  }
  assert(threw, 'lymph > 100 throws');
}

{
  let threw = false;
  try {
    absoluteLymphocyteCount(6, -0.1);
  } catch {
    threw = true;
  }
  assert(threw, 'negative lymph throws');
}

{
  const v = validateAbsoluteLymphocyteCountInput(createDefaultInput());
  assert(v.result != null && v.result.absoluteCount == null, 'blank inputs');
}

{
  const v = validateAbsoluteLymphocyteCountInput({
    wbcText: '6',
    lymphocytePercentText: '',
  });
  assert(v.result != null && v.result.absoluteCount == null, 'partial WBC');
}

{
  const v = validateAbsoluteLymphocyteCountInput({
    wbcText: '6',
    lymphocytePercentText: '150',
  });
  assert(v.errors.lymphocytePercentText != null, 'lymph > 100 error');
  assert(v.result == null, 'invalid null result');
}

{
  const r = calculateAbsoluteLymphocyteCount({
    wbcText: '6',
    lymphocytePercentText: '25',
  });
  assert(r.absoluteCount === 1.5, 'calc path 6 @ 25%');
  assert(r.absoluteCountPerLiter === 1.5, 'per-liter equiv');
  assert(r.absoluteCountCellsPerMicroliter === 1500, 'cells per µL');
}

console.log('absolute-lymphocyte-count calculation.test.ts: ok');