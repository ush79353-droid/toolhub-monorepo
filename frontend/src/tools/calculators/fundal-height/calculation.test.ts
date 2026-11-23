/**
 * Fundal Height — assert-based INTERGROWTH check.
 * Run: npx tsx src/tools/calculators/fundal-height/calculation.test.ts
 */
import {
  gestationalAgeFromSfhCm,
  intergrowthMedianSfhCm,
  intergrowthSdSfhCm,
  johnsonFetalWeightG,
  percentileFromZ,
  exactGestationalWeeks,
} from './calculation';
import { createDefaultInput } from './types';
import { validateFundalHeightInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

const med16 = intergrowthMedianSfhCm(16);
const sd16 = intergrowthSdSfhCm(16);
assert(Math.abs(med16 - 15.810294588532479) < 1e-9, `median16 ${med16}`);
assert(Math.abs(sd16 - 1.4052059) < 1e-9, `sd16 ${sd16}`);

assert(exactGestationalWeeks(16, 0) === 16, '16+0');
assert(Math.abs(exactGestationalWeeks(16, 1) - (16 + 1 / 7)) < 1e-12, '16+1');

// z=0 → ~50th
assert(Math.abs(percentileFromZ(0) - 50) < 0.01, 'Φ(0)');

const ga = gestationalAgeFromSfhCm(med16);
assert(ga > 15 && ga < 17, `dating near 16 got ${ga}`);

assert(johnsonFetalWeightG(30, false, 'above') === (30 - 12) * 155, 'Johnson');

{
  const v = validateFundalHeightInput(createDefaultInput());
  assert(v.result != null, 'default result');
  assert(v.result!.expectedSfhCm != null, 'expected shown');
  assert(v.result!.percentile == null, 'no pct without measured');
  assert(v.result!.chart.length >= 20, 'chart points');
}

{
  const v = validateFundalHeightInput({
    ...createDefaultInput(),
    measuredSfhText: String(med16),
  });
  assert(v.result!.percentile != null, 'pct');
  assert(Math.abs(v.result!.percentile! - 50) < 0.2, 'near 50th');
}

console.log('fundal-height calculation.test.ts: ok');
