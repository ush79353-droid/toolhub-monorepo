/**
 * Run: npx tsx calculation.test.ts
 */
import {
  RETINOPATHY_THRESHOLD_MG_PER_KG_ABW,
  calculateHydroxychloroquineDose,
  doseToMg,
  weightToKg,
} from './calculation';
import { createDefaultInput } from './types';
import { validateHydroxychloroquineDoseInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(RETINOPATHY_THRESHOLD_MG_PER_KG_ABW === 5, 'FDA threshold 5 mg/kg ABW');
assert(Math.abs(weightToKg(220.46226218, 'lb') - 100) < 1e-6, 'lb → kg');
assert(doseToMg(0.4, 'g') === 400, 'g → mg');

{
  const r = calculateHydroxychloroquineDose(createDefaultInput());
  assert(r.band === 'incomplete', 'blank incomplete');
  assert(r.mgPerKgPerDay === null, 'no invented mg/kg');
}

{
  const r = calculateHydroxychloroquineDose({
    ...createDefaultInput(),
    weightText: '80',
  });
  assert(r.band === 'incomplete', 'weight alone incomplete');
  assert(r.mgPerKgPerDay === null, 'no prescription from weight');
  assert(/custom daily dose/i.test(r.statusHeadline), 'asks for dose');
}

{
  const r = calculateHydroxychloroquineDose({
    ...createDefaultInput(),
    dailyDoseText: '400',
  });
  assert(r.band === 'incomplete', 'dose alone incomplete');
  assert(r.mgPerKgPerDay === null, 'needs weight');
}

{
  // 80 kg · 400 mg → 5.0 mg/kg/day → at threshold
  const r = calculateHydroxychloroquineDose({
    ...createDefaultInput(),
    weightText: '80',
    dailyDoseText: '400',
  });
  assert(r.mgPerKgPerDay === 5, '400/80 = 5');
  assert(r.band === 'at_or_above_threshold', 'at threshold band');
}

{
  // 80 kg · 200 mg → 2.5 mg/kg/day → below
  const r = calculateHydroxychloroquineDose({
    ...createDefaultInput(),
    weightText: '80',
    dailyDoseText: '200',
  });
  assert(r.mgPerKgPerDay === 2.5, '200/80 = 2.5');
  assert(r.band === 'below_threshold', 'below band');
}

{
  // Unit conversions: 176.369809744 lb ≈ 80 kg; 0.4 g = 400 mg → 5 mg/kg/day
  const r = calculateHydroxychloroquineDose({
    ...createDefaultInput(),
    weightText: '176.369809744',
    weightUnit: 'lb',
    dailyDoseText: '0.4',
    doseUnit: 'g',
  });
  assert(r.weightKg != null && Math.abs(r.weightKg - 80) < 1e-6, 'lb weight');
  assert(r.dailyDoseMg === 400, 'g dose');
  assert(r.mgPerKgPerDay != null && Math.abs(r.mgPerKgPerDay - 5) < 1e-6, 'converted = 5');
  assert(r.band === 'at_or_above_threshold', 'converted at threshold');
}

{
  const v = validateHydroxychloroquineDoseInput({
    ...createDefaultInput(),
    weightText: '0',
    dailyDoseText: '200',
  });
  assert(v.errors.weightText, 'zero weight guarded');
}

{
  const v = validateHydroxychloroquineDoseInput({
    ...createDefaultInput(),
    weightText: '70',
    dailyDoseText: '0',
  });
  assert(v.errors.dailyDoseText, 'zero dose guarded');
}

console.log('hydroxychloroquine-dose calculation.test.ts: ok');
