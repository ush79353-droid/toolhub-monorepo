/**
 * Run: cd frontend && npx tsx src/tools/calculators/urr/calculation.test.ts
 */
import {
  calculateUrr,
  computeUrrPercent,
  ureaToMgDl,
} from './calculation';
import { createDefaultInput } from './types';
import { validateUrrInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  // Prompt fixture: 60 → 18 → 70%
  const pct = computeUrrPercent(60, 18);
  assert(pct === 70, `fixture ${pct}`);
}

{
  const r = calculateUrr({
    preUreaText: '60',
    postUreaText: '18',
    preUnit: 'mg_dl',
    postUnit: 'mg_dl',
  });
  assert(r.urrPercent === 70, `calc ${r.urrPercent}`);
  assert(r.formattedUrr === '70', `fmt ${r.formattedUrr}`);
}

{
  const r = calculateUrr({
    preUreaText: '60',
    postUreaText: '60',
    preUnit: 'mg_dl',
    postUnit: 'mg_dl',
  });
  assert(r.urrPercent === 0, `equal ${r.urrPercent}`);
}

{
  const r = calculateUrr({
    preUreaText: '0',
    postUreaText: '18',
    preUnit: 'mg_dl',
    postUnit: 'mg_dl',
  });
  assert(r.urrPercent == null, 'pre zero undefined');
}

{
  const v = validateUrrInput({
    preUreaText: '0',
    postUreaText: '18',
    preUnit: 'mg_dl',
    postUnit: 'mg_dl',
  });
  assert(v.errors.preUreaText != null, 'pre zero error');
}

{
  // mmol/L path: 10 mmol/L ≈ 60.06 mg/dL; post 3 mmol/L ≈ 18.018 → ~70%
  const pre = ureaToMgDl(10, 'mmol_l');
  const post = ureaToMgDl(3, 'mmol_l');
  const pct = computeUrrPercent(pre, post);
  assert(Math.abs(pct - 70) < 0.01, `mmol ${pct}`);
}

{
  const v = validateUrrInput(createDefaultInput());
  assert(v.result != null && v.result.urrPercent == null, 'blank');
}

{
  let threw = false;
  try {
    computeUrrPercent(0, 18);
  } catch {
    threw = true;
  }
  assert(threw, 'zero pre throws');
}

console.log('urr calculation.test.ts: ok');
