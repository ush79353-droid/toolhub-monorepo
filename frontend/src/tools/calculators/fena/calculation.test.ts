/**
 * Run: cd frontend && npx tsx src/tools/calculators/fena/calculation.test.ts
 */
import {
  calculateFena,
  computeFenaPercent,
  interpretFenaBand,
} from './calculation';
import { createDefaultInput } from './types';
import { validateFenaInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  // Prompt fixture: SCr 2, SNa 140, UCr 100, UNa 70 → 1%
  const pct = computeFenaPercent(70, 2, 140, 100);
  assert(pct === 1, `fixture ${pct}`);
}

{
  const r = calculateFena({
    serumCreatinineText: '2',
    serumSodiumText: '140',
    urineCreatinineText: '100',
    urineSodiumText: '70',
  });
  assert(r.fenaPercent === 1, `calc ${r.fenaPercent}`);
  assert(r.bandLabel === '1–2%' || r.bandLabel === '<1%', `band ${r.bandLabel}`);
  // exactly 1% → 1–2% band (inclusive lower for <=2, <1 for less)
  assert(r.bandLabel === '1–2%', `exact 1% band ${r.bandLabel}`);
}

{
  const r = calculateFena({
    serumCreatinineText: '1',
    serumSodiumText: '140',
    urineCreatinineText: '100',
    urineSodiumText: '10',
  });
  // 100*(10*1)/(140*100) = 1000/14000 ≈ 0.0714 → <1%
  assert(r.fenaPercent != null && r.fenaPercent < 1, `low ${r.fenaPercent}`);
  assert(r.bandLabel === '<1%', `band ${r.bandLabel}`);
}

{
  const r = calculateFena({
    serumCreatinineText: '2',
    serumSodiumText: '140',
    urineCreatinineText: '50',
    urineSodiumText: '80',
  });
  // 100*(80*2)/(140*50) = 16000/7000 ≈ 2.286 → >2%
  assert(r.fenaPercent != null && r.fenaPercent > 2, `high ${r.fenaPercent}`);
  assert(r.bandLabel === '>2%', `band ${r.bandLabel}`);
}

{
  let threw = false;
  try {
    computeFenaPercent(70, 2, 0, 100);
  } catch {
    threw = true;
  }
  assert(threw, 'zero serum Na throws');
}

{
  const r = calculateFena({
    serumCreatinineText: '2',
    serumSodiumText: '0',
    urineCreatinineText: '100',
    urineSodiumText: '70',
  });
  assert(r.fenaPercent == null, 'zero denom undefined');
}

{
  const v = validateFenaInput(createDefaultInput());
  assert(v.result != null && v.result.fenaPercent == null, 'blank');
}

{
  const v = validateFenaInput({
    serumCreatinineText: '2',
    serumSodiumText: '0',
    urineCreatinineText: '100',
    urineSodiumText: '70',
  });
  assert(v.errors.serumSodiumText != null, 'zero sna error');
}

{
  const band = interpretFenaBand(0.5);
  assert(band.bandLabel === '<1%', 'interpret low');
}

console.log('fena calculation.test.ts: ok');
