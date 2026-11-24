/**
 * Run: npx tsx calculation.test.ts
 */
import {
  calculateIsotretinoinDose,
  durationToDays,
  weightToKg,
} from './calculation';
import { MEAN_CUMULATIVE_MG_PER_KG, createDefaultInput } from './types';
import { validateIsotretinoinDoseInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(MEAN_CUMULATIVE_MG_PER_KG === 135, 'screenshot mean 135');
assert(Math.abs(weightToKg(220.46226218, 'lb') - 100) < 1e-6, 'lb to kg');
assert(durationToDays(2, 'weeks') === 14, 'weeks to days');

{
  const r = calculateIsotretinoinDose({
    ...createDefaultInput(),
    weightText: '70',
    dailyDoseMgText: '70',
  });
  // 70 kg × 135 = 9450 mg; 9450/70 = 135 days
  assert(r.totalCumulativeMg === 9450, 'total mass');
  assert(r.durationDays === 135, 'duration days');
}

{
  const r = calculateIsotretinoinDose({
    ...createDefaultInput(),
    weightText: '70',
    solveFor: 'daily_dose',
    durationValueText: '135',
    durationUnit: 'days',
  });
  assert(r.dailyDoseMg === 70, 'inverse daily');
}

{
  const v = validateIsotretinoinDoseInput({
    ...createDefaultInput(),
    weightText: '70',
    dailyDoseMgText: '0',
  });
  assert(v.errors.dailyDoseMgText, 'zero daily guarded');
}

console.log('isotretinoin-dose calculation.test.ts: ok');
