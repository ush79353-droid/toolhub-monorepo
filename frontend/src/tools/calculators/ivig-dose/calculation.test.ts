/**
 * IVIG Dose Calculator — assert-based engine check.
 * Run: npx tsx src/tools/calculators/ivig-dose/calculation.test.ts
 */
import {
  aabbRhigVials,
  DEFAULT_IVIG_G_PER_KG,
  calculateIvigDose,
  devineIdealBodyWeightKg,
  ivigDoseGrams,
  rhigVialsRaw,
  selectIvigDosingWeightKg,
  weightToKg,
} from './calculation';
import { createDefaultInput } from './types';
import { validateIvigDoseInput } from './validation';
import { nadlerBloodVolumeMl } from '../blood-volume/calculation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 1e-6): boolean {
  return Math.abs(a - b) <= eps;
}

{
  assert(DEFAULT_IVIG_G_PER_KG === 1, 'Privigen-style default intensity');
  assert(approx(weightToKg(220.46226218, 'lb'), 100, 1e-4), 'lb→kg');
}

{
  // Female 165 cm Devine IBW ≈ 45.5 + 2.3×(64.9606−60) ≈ 56.91 kg
  const ibw = devineIdealBodyWeightKg('female', 165);
  assert(approx(ibw, 56.909, 0.01), `female 165 cm IBW got ${ibw}`);
}

{
  // Non-obese female above IBW → ideal basis
  const s = selectIvigDosingWeightKg('female', 70, 165);
  assert(s.weightBasis === 'ideal', '70 kg / 165 cm → ideal');
  assert(approx(s.dosingWeightKg, s.idealBodyWeightKg!, 1e-9), 'dose = IBW');
  assert(approx(ivigDoseGrams(s.dosingWeightKg, 1), s.dosingWeightKg), '1 g/kg');
}

{
  // Actual below IBW → actual
  const s = selectIvigDosingWeightKg('female', 50, 165);
  assert(s.weightBasis === 'actual', 'below IBW uses actual');
  assert(approx(s.dosingWeightKg, 50), 'dosing = 50');
}

{
  // Obese BMI ≥ 30 → adjusted
  // 165 cm, 90 kg → BMI ≈ 33.06
  const s = selectIvigDosingWeightKg('female', 90, 165);
  assert(s.weightBasis === 'adjusted', 'BMI≥30 adjusted');
  const expected = s.idealBodyWeightKg! + 0.5 * (90 - s.idealBodyWeightKg!);
  assert(approx(s.dosingWeightKg, expected), 'AdjBW formula');
}

{
  // Short patient → actual only
  const s = selectIvigDosingWeightKg('female', 60, 140);
  assert(s.weightBasis === 'actual_below_ibw_eligibility', 'short → actual');
  assert(approx(s.dosingWeightKg, 60), 'dosing = actual');
}

{
  const r = calculateIvigDose(createDefaultInput());
  assert(r.ivigDoseGrams === null, 'blank anthropometrics → no grams');
  assert(r.product === 'ivig', 'general product');
}

{
  const r = calculateIvigDose({
    ...createDefaultInput(),
    weightText: '70',
    heightText: '165',
    dosingText: '1',
  });
  assert(r.ivigDoseGrams != null, 'grams computed');
  assert(r.weightBasis === 'ideal', 'fixture ideal basis');
  assert(approx(r.ivigDoseGrams!, r.dosingWeightKg!), '1 g/kg × DW');
}

{
  // AABB example: 0.3% fetal cells × 5000 mL / 30 = 0.5 → round up + 1 = 2
  assert(aabbRhigVials(0.5) === 2, 'AABB 0.5 → 2 vials');
  assert(aabbRhigVials(0.4) === 1, 'AABB 0.4 → 1 vial');
  assert(aabbRhigVials(4.33) === 5, 'AABB 4.33 → 5 vials');
  assert(aabbRhigVials(4.83) === 6, 'AABB 4.83 → 6 vials');
}

{
  const tbv = nadlerBloodVolumeMl('female', 165, 70);
  const raw = rhigVialsRaw(0.3, tbv);
  const vials = aabbRhigVials(raw);
  const r = calculateIvigDose({
    calculationType: 'pregnancy_hemorrhage',
    sex: 'female',
    weightText: '70',
    weightUnit: 'kg',
    heightText: '165',
    heightUnit: 'cm',
    dosingText: '1',
    dosingUnit: 'g/kg',
    fetalCellsPercentText: '0.3',
  });
  assert(r.product === 'rhig', 'obstetric product is RhIG');
  assert(r.ivigDoseGrams === null, 'suppress IVIG grams on obstetric branch');
  assert(r.rhigVials === vials, 'AABB vials match');
  assert(approx(r.rhigVialsRaw!, raw), 'raw vials match');
}

{
  const v = validateIvigDoseInput({
    ...createDefaultInput(),
    weightText: '70',
    heightText: '165',
  });
  assert(v.result?.ivigDoseGrams != null, 'validation computes general');
  assert(!v.errors.weightText, 'no weight error');
}

{
  const v = validateIvigDoseInput({
    ...createDefaultInput(),
    dosingText: '',
    weightText: '70',
    heightText: '165',
  });
  assert(v.errors.dosingText, 'blank dosing flagged');
}

console.log('ivig-dose calculation.test.ts: ok');
