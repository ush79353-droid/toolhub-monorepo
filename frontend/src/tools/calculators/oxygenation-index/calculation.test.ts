/**
 * Run: cd frontend && npx tsx src/tools/calculators/oxygenation-index/calculation.test.ts
 */
import {
  calculateOxygenationIndex,
  fio2FractionFromPercent,
  pao2ToMmHg,
} from './calculation';
import { createEmptyInput, createExampleInput } from './types';
import { validateOxygenationIndexInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  assert(fio2FractionFromPercent(50) === 0.5, 'fio2 fraction');
  assert(pao2ToMmHg(100, 'mmHg') === 100, 'pao2 mmHg');
}

{
  const r = calculateOxygenationIndex(createExampleInput());
  assert(r.pfRatio === 200, `pf ${r.pfRatio}`);
  assert(r.oi === 5, `oi ${r.oi}`);
  assert(r.formattedPf === '200', 'fmt pf');
  assert(r.formattedOi === '5', 'fmt oi');
}

{
  const v = validateOxygenationIndexInput(createEmptyInput());
  assert(v.result === null, 'blank → no result');
  assert(v.errors.fio2Percent, 'fio2 required');
}

{
  const v = validateOxygenationIndexInput({
    ...createExampleInput(),
    pao2: 0,
  });
  assert(v.result === null, 'zero pao2');
  assert(v.errors.pao2, 'pao2 error');
}

{
  // Avoid double percent: 50 must mean 0.50 fraction, not 50/10000
  const r = calculateOxygenationIndex({
    fio2Percent: 50,
    map: 10,
    mapUnit: 'cmH2O',
    pao2: 100,
    pao2Unit: 'mmHg',
  });
  assert(r.oi === 5, 'no double conversion');
  assert(r.pfRatio === 200, 'pf no double');
}

console.log('oxygenation-index calculation.test.ts: ok');
