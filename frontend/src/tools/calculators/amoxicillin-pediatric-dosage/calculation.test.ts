/**
 * Runnable self-check: npx tsx src/tools/calculators/amoxicillin-pediatric-dosage/calculation.test.ts
 */
import {
  calculateAmoxicillinPediatricDosage,
  doseMgFromRequirement,
  mgPerMl,
  suggestRegimen,
  volumeMlFromDoseMg,
} from './calculation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

// Omni-style example: 10 kg · 125 mg/5 mL · 15 mg/kg/dose → 150 mg · 6 mL
assert(doseMgFromRequirement(10, 15) === 150, '10×15=150 mg');
assert(mgPerMl(125) === 25, '125/5=25 mg/mL');
assert(volumeMlFromDoseMg(150, 125) === 6, '150/25=6 mL');

const oralGeneral = suggestRegimen('general', 'oral', 10);
assert(oralGeneral.available, 'general oral available');
assert(oralGeneral.requirementMgPerKg === 15, 'general oral starts at 15');
assert(oralGeneral.maxDoseMg === 500, 'general oral max 500');

const calc = calculateAmoxicillinPediatricDosage({
  ageMonths: 24,
  weightKg: 10,
  strength: 125,
  indication: 'general',
  route: 'oral',
  clinicianRequirement: null,
  clinicianDoseMg: null,
  mode: 'suggest',
  doseUnit: 'mg',
});
assert(calc.doseMg === 150, `expected 150 got ${calc.doseMg}`);
assert(calc.doseMl === 6, `expected 6 mL got ${calc.doseMl}`);

const strepLight = suggestRegimen('strep_a', 'oral', 12);
assert(strepLight.requirementMgPerKg === 50, 'strep <15 kg uses 50 mg/kg');
const strepMid = suggestRegimen('strep_a', 'oral', 20);
assert(strepMid.fixedDoseMg === 750, 'strep 15–29.9 kg fixed 750');
const strepHeavy = suggestRegimen('strep_a', 'oral', 35);
assert(strepHeavy.fixedDoseMg === 1000, 'strep ≥30 kg fixed 1000');

const ieIv = suggestRegimen('endocarditis', 'iv', 20);
assert(!ieIv.available, 'IE IV amoxicillin unavailable (AHA uses ampicillin)');

const ieOral = calculateAmoxicillinPediatricDosage({
  ageMonths: 60,
  weightKg: 20,
  strength: 400,
  indication: 'endocarditis',
  route: 'oral',
  clinicianRequirement: null,
  clinicianDoseMg: null,
  mode: 'suggest',
  doseUnit: 'mg',
});
assert(ieOral.doseMg === 1000, `IE 20×50=1000 got ${ieOral.doseMg}`);
assert(
  approx(ieOral.doseMl ?? NaN, 1000 / 80),
  `IE mL at 400 mg/5 mL`
);

const capped = calculateAmoxicillinPediatricDosage({
  ageMonths: 120,
  weightKg: 50,
  strength: 400,
  indication: 'endocarditis',
  route: 'oral',
  clinicianRequirement: null,
  clinicianDoseMg: null,
  mode: 'suggest',
  doseUnit: 'mg',
});
assert(capped.doseMg === 2000, 'IE max 2 g');
assert(capped.cappedToMax, 'IE should cap');

const fromReq = calculateAmoxicillinPediatricDosage({
  ageMonths: 24,
  weightKg: 10,
  strength: 200,
  indication: 'general',
  route: 'oral',
  clinicianRequirement: 20,
  clinicianDoseMg: null,
  mode: 'from_requirement',
  doseUnit: 'mg',
});
assert(fromReq.doseMg === 200, 'clinician 20 mg/kg → 200 mg');
assert(approx(fromReq.doseMl ?? NaN, 200 / 40), '200 mg at 200/5 → 5 mL');

console.log('amoxicillin-pediatric-dosage calculation.test.ts: ok');
