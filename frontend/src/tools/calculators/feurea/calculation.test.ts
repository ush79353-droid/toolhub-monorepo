/**
 * Run: cd frontend && npx tsx src/tools/calculators/feurea/calculation.test.ts
 */
import {
  calculateFeurea,
  computeFeureaPercent,
  interpretFeureaBand,
  ureaToMgDl,
} from './calculation';
import { createDefaultInput } from './types';
import { validateFeureaInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  // Prompt fixture: urea 120/20 and creatinine 100/2 (urine/serum) → 12%
  const pct = computeFeureaPercent(120, 2, 20, 100);
  assert(pct === 12, `fixture ${pct}`);
}

{
  const r = calculateFeurea({
    ...createDefaultInput(),
    serumCreatinineText: '2',
    serumUreaText: '20',
    urineCreatinineText: '100',
    urineUreaText: '120',
  });
  assert(r.feureaPercent === 12, `calc ${r.feureaPercent}`);
  assert(r.bandLabel === '≤35%', `band ${r.bandLabel}`);
}

{
  // Same physical urea when both sides are BUN (factor cancels)
  const r = calculateFeurea({
    ...createDefaultInput(),
    serumCreatinineText: '2',
    serumUreaText: '20',
    serumUreaUnit: 'mg_dl_bun',
    urineCreatinineText: '100',
    urineUreaText: '120',
    urineUreaUnit: 'mg_dl_bun',
  });
  assert(r.feureaPercent === 12, `bun/bun ${r.feureaPercent}`);
}

{
  // Mixed BUN serum + urea urine: normalize before ratio
  // serum BUN 20 → urea 42.8; urine urea 120; Cr 2/100
  // 100*(120*2)/(42.8*100) ≈ 5.607 → 5.61
  const serumUrea = ureaToMgDl(20, 'mg_dl_bun');
  assert(Math.abs(serumUrea - 42.8) < 1e-9, `bun convert ${serumUrea}`);
  const r = calculateFeurea({
    ...createDefaultInput(),
    serumCreatinineText: '2',
    serumUreaText: '20',
    serumUreaUnit: 'mg_dl_bun',
    urineCreatinineText: '100',
    urineUreaText: '120',
    urineUreaUnit: 'mg_dl_urea',
  });
  assert(r.feureaPercent === 5.61, `mixed ${r.feureaPercent}`);
}

{
  const r = calculateFeurea({
    ...createDefaultInput(),
    serumCreatinineText: '2',
    serumUreaText: '10',
    urineCreatinineText: '50',
    urineUreaText: '200',
  });
  // 100*(200*2)/(10*50) = 80 → >50%
  assert(r.feureaPercent === 80, `high ${r.feureaPercent}`);
  assert(r.bandLabel === '>50%', `band ${r.bandLabel}`);
}

{
  const r = calculateFeurea({
    ...createDefaultInput(),
    serumCreatinineText: '2',
    serumUreaText: '20',
    urineCreatinineText: '100',
    urineUreaText: '160',
  });
  // 100*(160*2)/(20*100) = 16 → ≤35%
  assert(r.feureaPercent === 16, `low ${r.feureaPercent}`);
}

{
  const r = calculateFeurea({
    ...createDefaultInput(),
    serumCreatinineText: '2',
    serumUreaText: '20',
    urineCreatinineText: '100',
    urineUreaText: '400',
  });
  // 100*(400*2)/(20*100) = 40 → 35–50%
  assert(r.feureaPercent === 40, `mid ${r.feureaPercent}`);
  assert(r.bandLabel === '35–50%', `band ${r.bandLabel}`);
}

{
  let threw = false;
  try {
    computeFeureaPercent(120, 2, 0, 100);
  } catch {
    threw = true;
  }
  assert(threw, 'zero serum urea throws');
}

{
  const r = calculateFeurea({
    ...createDefaultInput(),
    serumCreatinineText: '2',
    serumUreaText: '0',
    urineCreatinineText: '100',
    urineUreaText: '120',
  });
  assert(r.feureaPercent == null, 'zero denom undefined');
}

{
  const v = validateFeureaInput(createDefaultInput());
  assert(v.result != null && v.result.feureaPercent == null, 'blank');
}

{
  const v = validateFeureaInput({
    ...createDefaultInput(),
    serumCreatinineText: '2',
    serumUreaText: '0',
    urineCreatinineText: '100',
    urineUreaText: '120',
  });
  assert(v.errors.serumUreaText != null, 'zero surea error');
}

{
  const band = interpretFeureaBand(30);
  assert(band.bandLabel === '≤35%', 'interpret low');
}

console.log('feurea calculation.test.ts: ok');
