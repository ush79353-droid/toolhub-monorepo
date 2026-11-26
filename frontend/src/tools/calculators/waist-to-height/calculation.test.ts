/**
 * Run: cd frontend && npx tsx src/tools/calculators/waist-to-height/calculation.test.ts
 */
import { calculateWhtr, calculateWhtrRatio } from './calculation';
import { createDefaultInput } from './types';
import { validateWhtrInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const r = calculateWhtrRatio(80, 160);
  assert(Math.abs(r - 0.5) < 1e-12, `ratio ${r}`);

  const wired = calculateWhtr({
    waistText: '80',
    waistUnit: 'cm',
    heightText: '160',
    heightUnit: 'cm',
  });
  assert(wired.ratio != null && Math.abs(wired.ratio - 0.5) < 1e-12, 'wired');
  assert(wired.formattedRatio === '0.5', `fmt ${wired.formattedRatio}`);
}

{
  // Height in metres: 1.6 m = 160 cm
  const a = calculateWhtr({
    waistText: '80',
    waistUnit: 'cm',
    heightText: '1.6',
    heightUnit: 'm',
  });
  assert(a.ratio != null && Math.abs(a.ratio - 0.5) < 1e-12, 'metres');
}

{
  let threw = false;
  try {
    calculateWhtrRatio(80, 0);
  } catch {
    threw = true;
  }
  assert(threw, 'zero height');
}

{
  const v = validateWhtrInput(createDefaultInput());
  assert(v.result != null && v.result.ratio == null, 'blank');
}

console.log('waist-to-height calculation.test.ts: ok');
