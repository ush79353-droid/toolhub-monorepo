/**
 * Run: cd frontend && npx tsx src/tools/calculators/bai/calculation.test.ts
 */
import { calculateBai, calculateBaiPercent } from './calculation';
import { createDefaultInput } from './types';
import { validateBaiInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const bai = calculateBaiPercent(100, 1.75);
  const expected = 100 / Math.pow(1.75, 1.5) - 18;
  assert(Math.abs(bai - expected) < 1e-12, `bai ${bai}`);

  const r = calculateBai({
    heightText: '1.75',
    heightUnit: 'm',
    hipText: '100',
    hipUnit: 'cm',
  });
  assert(r.baiPercent != null && Math.abs(r.baiPercent - expected) < 1e-12, 'wired');
  assert(r.formattedBai.length > 0, 'fmt');
}

{
  // Unit parity: 175 cm = 1.75 m
  const a = calculateBai({
    heightText: '175',
    heightUnit: 'cm',
    hipText: '100',
    hipUnit: 'cm',
  });
  const b = calculateBai({
    heightText: '1.75',
    heightUnit: 'm',
    hipText: '100',
    hipUnit: 'cm',
  });
  assert(
    a.baiPercent != null &&
      b.baiPercent != null &&
      Math.abs(a.baiPercent - b.baiPercent) < 1e-12,
    'units',
  );
}

{
  let threw = false;
  try {
    calculateBaiPercent(100, 0);
  } catch {
    threw = true;
  }
  assert(threw, 'zero height');
}

{
  const v = validateBaiInput(createDefaultInput());
  assert(v.result != null && v.result.baiPercent == null, 'blank');
}

console.log('bai calculation.test.ts: ok');
