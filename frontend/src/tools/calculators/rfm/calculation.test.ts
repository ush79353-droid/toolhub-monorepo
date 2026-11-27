/**
 * Run: cd frontend && npx tsx src/tools/calculators/rfm/calculation.test.ts
 */
import { calculateRfm, calculateRfmPercent } from './calculation';
import { createDefaultInput } from './types';
import { validateRfmInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  assert(Math.abs(calculateRfmPercent(180, 90, 'male') - 24) < 1e-12, 'male');
  assert(Math.abs(calculateRfmPercent(180, 90, 'female') - 36) < 1e-12, 'female');
}

{
  const m = calculateRfm({
    sex: 'male',
    heightText: '180',
    heightUnit: 'cm',
    waistText: '90',
    waistUnit: 'cm',
  });
  assert(m.rfmPercent === 24 && m.formattedRfm === '24', 'wired m');
  const f = calculateRfm({
    sex: 'female',
    heightText: '1.8',
    heightUnit: 'm',
    waistText: '90',
    waistUnit: 'cm',
  });
  assert(f.rfmPercent != null && Math.abs(f.rfmPercent - 36) < 1e-12, 'wired f');
}

{
  const v = validateRfmInput(createDefaultInput());
  assert(v.result != null && v.result.rfmPercent == null, 'blank');
}

console.log('rfm calculation.test.ts: ok');
