/**
 * Absolute Eosinophil Count — assert-based engine check.
 * Run: npx tsx src/tools/calculators/absolute-eosinophil-count/calculation.test.ts
 */
import {
  absoluteEosinophilCount,
  calculateAbsoluteEosinophilCount,
  formatAec,
} from './calculation';
import { createDefaultInput } from './types';
import { validateAbsoluteEosinophilCountInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Independent fixture: WBC 8 ×10³/µL, eosinophils 5% → AEC 0.4 ×10³/µL
{
  const aec = absoluteEosinophilCount(8, 5);
  assert(aec === 0.4, `fixture AEC ${aec}`);
  assert(formatAec(aec) === '0.4', `fmt ${formatAec(aec)}`);
}

{
  const aec = absoluteEosinophilCount(10, 0);
  assert(aec === 0, 'zero eos %');
}

{
  const aec = absoluteEosinophilCount(4.5, 100);
  assert(aec === 4.5, '100% eos');
}

{
  let threw = false;
  try {
    absoluteEosinophilCount(-1, 5);
  } catch {
    threw = true;
  }
  assert(threw, 'negative WBC throws');
}

{
  let threw = false;
  try {
    absoluteEosinophilCount(8, 101);
  } catch {
    threw = true;
  }
  assert(threw, 'eos > 100 throws');
}

{
  let threw = false;
  try {
    absoluteEosinophilCount(8, -0.1);
  } catch {
    threw = true;
  }
  assert(threw, 'negative eos throws');
}

{
  const v = validateAbsoluteEosinophilCountInput(createDefaultInput());
  assert(v.result != null && v.result.absoluteCount == null, 'blank inputs');
}

{
  const v = validateAbsoluteEosinophilCountInput({
    wbcText: '8',
    eosinophilPercentText: '',
  });
  assert(v.result != null && v.result.absoluteCount == null, 'partial WBC');
}

{
  const v = validateAbsoluteEosinophilCountInput({
    wbcText: '8',
    eosinophilPercentText: '150',
  });
  assert(v.errors.eosinophilPercentText != null, 'eos > 100 error');
  assert(v.result == null, 'invalid null result');
}

{
  const r = calculateAbsoluteEosinophilCount({
    wbcText: '8',
    eosinophilPercentText: '5',
  });
  assert(r.absoluteCount === 0.4, 'calc path 8 @ 5%');
  assert(r.absoluteCountPerLiter === 0.4, 'per-liter equiv');
}

console.log('absolute-eosinophil-count calculation.test.ts: ok');