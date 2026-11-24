/**
 * Tylenol Overdose — assert-based engine check.
 * Run: npx tsx --tsconfig tsconfig.json src/tools/calculators/tylenol-overdose/calculation.test.ts
 */
import {
  ACETAMINOPHEN_MW_G_PER_MOL,
  NOMOGRAM_MAX_HOURS,
  NOMOGRAM_MIN_HOURS,
  PROBABLE_LINE_4H_UG_PER_ML,
  TREATMENT_LINE_4H_UG_PER_ML,
  calculateTylenolOverdose,
  lineConcentrationAtHours,
  mgPerLToUgPerMl,
  probableLineAtHours,
  treatmentLineAtHours,
  ugPerMlToMgPerL,
  ugPerMlToUmolPerL,
  umolPerLToUgPerMl,
  weightToKg,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateTylenolOverdoseInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

{
  assert(TREATMENT_LINE_4H_UG_PER_ML === 150, 'US treatment line @4h = 150');
  assert(PROBABLE_LINE_4H_UG_PER_ML === 200, 'probable line @4h = 200');
  assert(NOMOGRAM_MIN_HOURS === 4, 'min window 4h');
  assert(NOMOGRAM_MAX_HOURS === 24, 'max window 24h');
}

{
  assert(treatmentLineAtHours(4) === 150, 'treatment @4h');
  assert(probableLineAtHours(4) === 200, 'probable @4h');
  // Half-life 4 h → at 8 h concentrations are halved
  assert(approx(treatmentLineAtHours(8), 75), 'treatment @8h = 75');
  assert(approx(probableLineAtHours(8), 100), 'probable @8h = 100');
  assert(approx(lineConcentrationAtHours(12, 150), 37.5), 'treatment @12h');
}

{
  // Unit equivalence: µg/mL ≡ mg/L
  assert(ugPerMlToMgPerL(150) === 150, 'µg/mL → mg/L identity');
  assert(mgPerLToUgPerMl(150) === 150, 'mg/L → µg/mL identity');
  const umol = ugPerMlToUmolPerL(151.163);
  assert(approx(umol, 1000, 1e-6), '151.163 µg/mL → 1000 µmol/L');
  assert(
    approx(umolPerLToUgPerMl(1000), ACETAMINOPHEN_MW_G_PER_MOL, 1e-6),
    '1000 µmol/L → MW µg/mL',
  );
}

{
  const r = calculateTylenolOverdose(createDefaultInput());
  assert(r.pathway === 'incomplete', 'blank → incomplete');
  assert(r.emergencyReferralRequired === true, 'always refer');
  assert(r.treatmentLineUgPerMl === null, 'no plot when incomplete');
  assert(r.aboveTreatmentLine === null, 'no above/below when incomplete');
}

{
  const r = calculateTylenolOverdose(createEmptyInput());
  assert(r.pathway === 'incomplete', 'empty incomplete');
  assert(r.emergencyReferralRequired === true, 'empty still refers');
}

{
  const r = calculateTylenolOverdose({
    weightText: '70',
    weightUnit: 'kg',
    route: 'iv',
    hoursAfterIngestionText: '8',
    serumLevelText: '100',
  });
  assert(r.pathway === 'iv_ineligible', 'IV not plotted');
  assert(r.treatmentLineUgPerMl === null, 'IV no treatment line');
  assert(r.emergencyReferralRequired === true, 'IV refers');
}

{
  const r = calculateTylenolOverdose({
    weightText: '',
    weightUnit: 'kg',
    route: 'oral',
    hoursAfterIngestionText: '2',
    serumLevelText: '200',
  });
  assert(r.pathway === 'before_window', '2h before window');
  assert(r.treatmentLineUgPerMl === null, 'no plot before 4h');
}

{
  const r = calculateTylenolOverdose({
    weightText: '',
    weightUnit: 'kg',
    route: 'oral',
    hoursAfterIngestionText: '24.0001',
    serumLevelText: '10',
  });
  assert(r.pathway === 'after_window', 'just after 24h');
  assert(r.treatmentLineUgPerMl === null, 'no plot after 24h');
}

{
  // Boundary: exactly 4 h, level exactly on treatment line
  const r = calculateTylenolOverdose({
    weightText: '70',
    weightUnit: 'kg',
    route: 'oral',
    hoursAfterIngestionText: '4',
    serumLevelText: '150',
  });
  assert(r.pathway === 'nomogram_eligible', '4h eligible');
  assert(r.aboveTreatmentLine === true, '150 @4h on treatment line');
  assert(r.aboveProbableLine === false, '150 < 200 probable');
  assert(r.emergencyReferralRequired === true, 'still refers below probable');
  assert(
    !/safe to stay home|stay home/i.test(r.statusDetail),
    'never safe-at-home wording',
  );
}

{
  // Boundary: exactly 24 h — treatment line = 150 / 32 = 4.6875
  const r = calculateTylenolOverdose({
    weightText: '',
    weightUnit: 'kg',
    route: 'oral',
    hoursAfterIngestionText: '24',
    serumLevelText: '4.6875',
  });
  assert(r.pathway === 'nomogram_eligible', '24h eligible');
  assert(
    r.treatmentLineUgPerMl != null && approx(r.treatmentLineUgPerMl, 4.6875),
    'treatment @24h',
  );
  assert(r.aboveTreatmentLine === true, 'on treatment line @24h');
}

{
  // 8 h: treatment 75, probable 100 — below both
  const r = calculateTylenolOverdose({
    weightText: '154.323584',
    weightUnit: 'lb',
    route: 'oral',
    hoursAfterIngestionText: '8',
    serumLevelText: '50',
  });
  assert(r.pathway === 'nomogram_eligible', '8h eligible');
  assert(r.aboveTreatmentLine === false, '50 < 75');
  assert(r.aboveProbableLine === false, '50 < 100');
  assert(
    r.weightKg != null && approx(r.weightKg, 70, 1e-4),
    'lb → kg context only',
  );
  assert(approx(weightToKg(154.323584, 'lb'), 70, 1e-4), 'weight helper');
}

{
  // 8 h: above probable
  const r = calculateTylenolOverdose({
    weightText: '',
    weightUnit: 'kg',
    route: 'oral',
    hoursAfterIngestionText: '8',
    serumLevelText: '120',
  });
  assert(r.aboveProbableLine === true, '120 ≥ 100 probable @8h');
  assert(r.aboveTreatmentLine === true, 'also ≥ treatment');
}

{
  // mg/L numeric identity fixture via engine input still in µg/mL label
  const asUg = calculateTylenolOverdose({
    weightText: '',
    weightUnit: 'kg',
    route: 'oral',
    hoursAfterIngestionText: '4',
    serumLevelText: '200',
  });
  const asMgLValue = ugPerMlToMgPerL(200);
  assert(asMgLValue === 200, '200 µg/mL ≡ 200 mg/L');
  assert(asUg.aboveProbableLine === true, '200 @4h on probable line');
}

{
  const v = validateTylenolOverdoseInput({
    weightText: '0',
    weightUnit: 'kg',
    route: 'oral',
    hoursAfterIngestionText: '8',
    serumLevelText: '80',
  });
  assert(v.errors.weightText, 'zero weight error');
  assert(v.result?.pathway === 'nomogram_eligible', 'still scores timing');
}

{
  const v = validateTylenolOverdoseInput({
    weightText: '',
    weightUnit: 'kg',
    route: 'oral',
    hoursAfterIngestionText: 'abc',
    serumLevelText: '80',
  });
  assert(v.errors.hoursAfterIngestionText, 'non-numeric hours');
  assert(v.result?.pathway === 'incomplete', 'invalid hours unscored plot');
}

{
  const v = validateTylenolOverdoseInput({
    weightText: '',
    weightUnit: 'kg',
    route: 'oral',
    hoursAfterIngestionText: '8',
    serumLevelText: '-1',
  });
  assert(v.errors.serumLevelText, 'negative level error');
}

console.log('tylenol-overdose calculation.test.ts: ok');
