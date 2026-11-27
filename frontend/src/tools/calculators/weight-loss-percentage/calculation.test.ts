/**
 * Run: cd frontend && npx tsx src/tools/calculators/weight-loss-percentage/calculation.test.ts
 */
import { calculateWeightLoss } from './calculation';
import { createDefaultInput } from './types';
import { validateWlpInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const r = calculateWeightLoss({
    pastText: '80',
    pastUnit: 'kg',
    currentText: '72',
    currentUnit: 'kg',
  });
  assert(r.lossKg != null && Math.abs(r.lossKg - 8) < 1e-12, `loss ${r.lossKg}`);
  assert(r.percent != null && Math.abs(r.percent - 10) < 1e-12, `pct ${r.percent}`);
  assert(r.formattedLoss === '8', `fmtLoss ${r.formattedLoss}`);
  assert(r.formattedPercent === '10', `fmtPct ${r.formattedPercent}`);
}

{
  const r = calculateWeightLoss({
    pastText: '80',
    pastUnit: 'kg',
    currentText: '80',
    currentUnit: 'kg',
  });
  assert(r.lossKg === 0 && r.percent === 0, 'equal');
}

{
  const r = calculateWeightLoss({
    pastText: '80',
    pastUnit: 'kg',
    currentText: '85',
    currentUnit: 'kg',
  });
  assert(r.lossKg != null && r.lossKg < 0, 'gain');
  assert(r.statusHeadline.includes('gain'), 'gain copy');
}

{
  const r = calculateWeightLoss({
    pastText: '0',
    pastUnit: 'kg',
    currentText: '72',
    currentUnit: 'kg',
  });
  assert(r.percent == null, 'zero baseline');
}

{
  const v = validateWlpInput(createDefaultInput());
  assert(v.result != null && v.result.percent == null, 'blank');
}

console.log('weight-loss-percentage calculation.test.ts: ok');
