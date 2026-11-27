/**
 * Run: cd frontend && npx tsx src/tools/calculators/lean-body-mass/calculation.test.ts
 */
import { boerLeanKg, calculateLeanBodyMass } from './calculation';
import { createDefaultInput } from './types';
import { validateLbmInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const lean = boerLeanKg('male', 75, 180);
  assert(Math.abs(lean - 59.385) < 1e-12, `male ${lean}`);
}

{
  const r = calculateLeanBodyMass({
    sex: 'male',
    weightText: '75',
    weightUnit: 'kg',
    heightText: '180',
    heightUnit: 'cm',
    resultUnit: 'kg',
  });
  assert(r.leanKg != null && Math.abs(r.leanKg - 59.385) < 1e-12, 'wired');
  assert(r.formattedLean === '59.385', `fmt ${r.formattedLean}`);
}

{
  const r = calculateLeanBodyMass({
    sex: 'male',
    weightText: String(75 / 0.45359237),
    weightUnit: 'lb',
    heightText: '180',
    heightUnit: 'cm',
    resultUnit: 'kg',
  });
  assert(r.leanKg != null && Math.abs(r.leanKg - 59.385) < 1e-6, 'lb parity');
}

{
  const v = validateLbmInput(createDefaultInput());
  assert(v.result != null && v.result.leanKg == null, 'blank');
}

console.log('lean-body-mass calculation.test.ts: ok');
