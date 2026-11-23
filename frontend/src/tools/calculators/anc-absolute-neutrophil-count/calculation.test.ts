/**
 * Absolute Neutrophil Count — assert-based engine check.
 * Run: npx tsx src/tools/calculators/anc-absolute-neutrophil-count/calculation.test.ts
 */
import {
  absoluteNeutrophilCount,
  calculateAncAbsoluteNeutrophilCount,
  formatAnc,
} from './calculation';
import { createDefaultInput } from './types';
import { validateAncAbsoluteNeutrophilCountInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Authoritative fixture: WBC 5, segs 40%, bands 2% → ANC 2.1 ×10³/µL
{
  const anc = absoluteNeutrophilCount(5, 40, 2);
  assert(anc === 2.1, `fixture ANC ${anc}`);
  assert(formatAnc(anc) === '2.1', `fmt ${formatAnc(anc)}`);
}

{
  const anc = absoluteNeutrophilCount(8, 60, 0);
  assert(anc === 4.8, 'segs only');
}

{
  const anc = absoluteNeutrophilCount(10, 50, 50);
  assert(anc === 10, 'segs+bands = 100%');
}

{
  let threw = false;
  try {
    absoluteNeutrophilCount(-1, 40, 2);
  } catch {
    threw = true;
  }
  assert(threw, 'negative WBC throws');
}

{
  let threw = false;
  try {
    absoluteNeutrophilCount(5, 80, 30);
  } catch {
    threw = true;
  }
  assert(threw, 'segs+bands > 100 throws');
}

{
  let threw = false;
  try {
    absoluteNeutrophilCount(5, 101, 0);
  } catch {
    threw = true;
  }
  assert(threw, 'segs > 100 throws');
}

{
  let threw = false;
  try {
    absoluteNeutrophilCount(5, 40, -0.1);
  } catch {
    threw = true;
  }
  assert(threw, 'negative bands throws');
}

{
  const v = validateAncAbsoluteNeutrophilCountInput(createDefaultInput());
  assert(v.result != null && v.result.absoluteCount == null, 'blank inputs');
}

{
  const v = validateAncAbsoluteNeutrophilCountInput({
    wbcText: '5',
    segsPercentText: '',
    bandsPercentText: '',
  });
  assert(v.result != null && v.result.absoluteCount == null, 'partial WBC');
}

{
  const v = validateAncAbsoluteNeutrophilCountInput({
    wbcText: '5',
    segsPercentText: '80',
    bandsPercentText: '30',
  });
  assert(v.errors.segsPercentText != null, 'sum > 100 error');
  assert(v.result == null, 'invalid null result');
}

{
  const r = calculateAncAbsoluteNeutrophilCount({
    wbcText: '5',
    segsPercentText: '40',
    bandsPercentText: '2',
  });
  assert(r.absoluteCount === 2.1, 'calc path 5 @ 40% segs + 2% bands');
  assert(r.absoluteCountPerLiter === 2.1, 'per-liter equiv');
}

console.log('anc-absolute-neutrophil-count calculation.test.ts: ok');