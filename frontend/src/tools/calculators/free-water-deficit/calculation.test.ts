/**
 * Run: cd frontend && npx tsx src/tools/calculators/free-water-deficit/calculation.test.ts
 */
import {
  calculateFreeWaterDeficit,
  freeWaterDeficitL,
  TBW_FRACTION,
  weightToKg,
} from './calculation';
import { createDefaultInput } from './types';
import { validateFreeWaterDeficitInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  assert(TBW_FRACTION.child === 0.6, 'child');
  assert(TBW_FRACTION.adult_male === 0.6, 'am');
  assert(TBW_FRACTION.adult_female === 0.5, 'af');
  assert(TBW_FRACTION.elderly_male === 0.5, 'em');
  assert(TBW_FRACTION.elderly_female === 0.45, 'ef');
}

{
  // Omni FAQ: 70 kg adult man, Na 147, desired 140 → 2.1 L
  const d = freeWaterDeficitL(70, 0.6, 147, 140);
  assert(Math.abs(d - 2.1) < 1e-9, `omni 2.1 got ${d}`);
  const r = calculateFreeWaterDeficit({
    category: 'adult_male',
    weightText: '70',
    weightUnit: 'kg',
    sodiumText: '147',
    desiredSodiumText: '140',
    resultUnit: 'L',
  });
  assert(r.deficitDisplay === 2.1, `display ${r.deficitDisplay}`);
  assert(r.formattedDeficit === '2.1', `fmt ${r.formattedDeficit}`);
}

{
  // Equality → zero
  const r = calculateFreeWaterDeficit({
    category: 'adult_female',
    weightText: '60',
    weightUnit: 'kg',
    sodiumText: '140',
    desiredSodiumText: '140',
    resultUnit: 'L',
  });
  assert(r.deficitDisplay === 0, `eq ${r.deficitDisplay}`);
}

{
  // Low sodium → negative (excess)
  const r = calculateFreeWaterDeficit({
    category: 'adult_female',
    weightText: '60',
    weightUnit: 'kg',
    sodiumText: '130',
    desiredSodiumText: '140',
    resultUnit: 'L',
  });
  // TBW=30; 30*((130/140)-1)=30*(-1/14)≈-2.142857 → -2.14
  assert(r.deficitDisplay === -2.14, `low Na ${r.deficitDisplay}`);
  assert(r.statusHeadline.includes('excess'), 'excess headline');
}

{
  // Elderly female coefficient 0.45 vs adult female 0.5
  const ef = freeWaterDeficitL(70, 0.45, 160, 140);
  const af = freeWaterDeficitL(70, 0.5, 160, 140);
  assert(Math.abs(ef - 4.5) < 1e-9, `ef ${ef}`);
  assert(Math.abs(af - 5) < 1e-9, `af ${af}`);
  assert(ef < af, 'elderly female smaller TBW');
}

{
  // lb parity: 70 kg ≈ 154.3235838 lb
  const lb = 70 / 0.45359237;
  assert(Math.abs(weightToKg(lb, 'lb') - 70) < 1e-9, 'lb→kg');
  const r = calculateFreeWaterDeficit({
    category: 'adult_male',
    weightText: String(lb),
    weightUnit: 'lb',
    sodiumText: '147',
    desiredSodiumText: '140',
    resultUnit: 'L',
  });
  assert(r.deficitDisplay === 2.1, `lb ${r.deficitDisplay}`);
}

{
  const v = validateFreeWaterDeficitInput(createDefaultInput());
  assert(v.result != null && v.result.deficitDisplay == null, 'blank');
}

{
  const v = validateFreeWaterDeficitInput({
    ...createDefaultInput(),
    weightText: '0',
    sodiumText: '140',
  });
  assert(v.errors.weightText != null, 'zero weight');
}

{
  const v = validateFreeWaterDeficitInput({
    ...createDefaultInput(),
    weightText: '70',
    sodiumText: '0',
  });
  assert(v.errors.sodiumText != null, 'zero sodium');
}

console.log('free-water-deficit calculation.test.ts: ok');
