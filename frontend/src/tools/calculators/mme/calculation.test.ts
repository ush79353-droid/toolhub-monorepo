/**
 * MME Calculator — assert-based engine check (CDC 2022 factors only).
 * Run: npx tsx src/tools/calculators/mme/calculation.test.ts
 */
import {
  CDC_2022_MME_FACTORS,
  calculateMme,
  formatMme,
  mmeForDose,
  toCanonicalDose,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateMmeInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

{
  assert(CDC_2022_MME_FACTORS.codeine === 0.15, 'codeine factor');
  assert(CDC_2022_MME_FACTORS.fentanyl_td === 2.4, 'fentanyl TD factor');
  assert(CDC_2022_MME_FACTORS.hydrocodone === 1.0, 'hydrocodone factor');
  assert(CDC_2022_MME_FACTORS.hydromorphone === 5.0, 'hydromorphone 5.0 (2022)');
  assert(CDC_2022_MME_FACTORS.methadone === 4.7, 'methadone 4.7 (2022)');
  assert(CDC_2022_MME_FACTORS.morphine === 1.0, 'morphine factor');
  assert(CDC_2022_MME_FACTORS.oxycodone === 1.5, 'oxycodone factor');
  assert(CDC_2022_MME_FACTORS.oxymorphone === 3.0, 'oxymorphone factor');
  assert(CDC_2022_MME_FACTORS.tapentadol === 0.4, 'tapentadol factor');
  assert(CDC_2022_MME_FACTORS.tramadol === 0.2, 'tramadol factor');
  assert(
    !('buprenorphine' in CDC_2022_MME_FACTORS),
    'no invented buprenorphine factor',
  );
}

{
  const r = calculateMme(createDefaultInput());
  assert(r.mme === null, 'blank dose unscored');
  assert(r.statusHeadline.includes('Enter dose'), 'blank headline');
}

{
  const r = calculateMme(createEmptyInput());
  assert(r.mme === null, 'empty unscored');
}

{
  // CDC worked example: hydrocodone 5 mg × 4/day = 20 mg → 20 MME
  const r = calculateMme({
    opioidId: 'hydrocodone',
    doseText: '20',
    doseUnit: 'mg',
  });
  assert(r.mme != null && approx(r.mme, 20), 'hydrocodone 20 → 20 MME');
}

{
  // CDC worked example: oxycodone 10 mg × 2/day = 20 mg → 30 MME
  const r = calculateMme({
    opioidId: 'oxycodone',
    doseText: '20',
    doseUnit: 'mg',
  });
  assert(r.mme != null && approx(r.mme, 30), 'oxycodone 20 → 30 MME');
}

{
  // Screenshot opioid: codeine 100 mg/day → 15 MME
  const r = calculateMme({
    opioidId: 'codeine',
    doseText: '100',
    doseUnit: 'mg',
  });
  assert(r.mme != null && approx(r.mme, 15), 'codeine 100 → 15 MME');
}

{
  const r = calculateMme({
    opioidId: 'hydromorphone',
    doseText: '4',
    doseUnit: 'mg',
  });
  assert(r.mme != null && approx(r.mme, 20), 'hydromorphone 4 → 20 MME');
}

{
  const r = calculateMme({
    opioidId: 'methadone',
    doseText: '10',
    doseUnit: 'mg',
  });
  assert(r.mme != null && approx(r.mme, 47), 'methadone 10 → 47 MME');
}

{
  const r = calculateMme({
    opioidId: 'fentanyl_td',
    doseText: '25',
    doseUnit: 'mcg_hr',
  });
  assert(r.mme != null && approx(r.mme, 60), 'fentanyl 25 mcg/hr → 60 MME');
}

{
  const r = calculateMme({
    opioidId: 'tapentadol',
    doseText: '100',
    doseUnit: 'mg',
  });
  assert(r.mme != null && approx(r.mme, 40), 'tapentadol 100 → 40 MME');
}

{
  const r = calculateMme({
    opioidId: 'tramadol',
    doseText: '100',
    doseUnit: 'mg',
  });
  assert(r.mme != null && approx(r.mme, 20), 'tramadol 100 → 20 MME');
}

{
  // mcg → mg: 100_000 mcg codeine = 100 mg → 15 MME
  assert(approx(toCanonicalDose(100_000, 'mcg', 'codeine'), 100), 'mcg→mg');
  const r = calculateMme({
    opioidId: 'codeine',
    doseText: '100000',
    doseUnit: 'mcg',
  });
  assert(r.mme != null && approx(r.mme, 15), 'codeine mcg path');
}

{
  let threw = false;
  try {
    toCanonicalDose(25, 'mg', 'fentanyl_td');
  } catch {
    threw = true;
  }
  assert(threw, 'fentanyl rejects mg/day unit');
}

{
  let threw = false;
  try {
    toCanonicalDose(10, 'mcg_hr', 'morphine');
  } catch {
    threw = true;
  }
  assert(threw, 'oral opioid rejects mcg/hr');
}

{
  assert(approx(mmeForDose('morphine', 30), 30), 'morphine identity');
  assert(approx(mmeForDose('oxymorphone', 10), 30), 'oxymorphone 10 → 30');
}

{
  const r = calculateMme({
    opioidId: 'codeine',
    doseText: '0',
    doseUnit: 'mg',
  });
  assert(r.mme === 0, 'zero dose → 0 MME');
}

{
  const v = validateMmeInput({
    opioidId: 'codeine',
    doseText: '-1',
    doseUnit: 'mg',
  });
  assert(v.errors.doseText, 'negative dose error');
  assert(v.result?.mme === null, 'negative unscored');
}

{
  const v = validateMmeInput({
    opioidId: 'codeine',
    doseText: 'abc',
    doseUnit: 'mg',
  });
  assert(v.errors.doseText, 'non-numeric dose');
  assert(v.result?.mme === null, 'invalid unscored');
}

{
  const v = validateMmeInput({
    opioidId: 'fentanyl_td',
    doseText: '25',
    doseUnit: 'mg',
  });
  assert(v.errors.doseUnit, 'fentanyl wrong unit');
  assert(v.result?.mme === null, 'fentanyl wrong unit unscored');
}

{
  assert(formatMme(15) === '15', 'format int');
  assert(formatMme(47) === '47', 'format methadone');
  assert(formatMme(0.15) === '0.15', 'format fraction');
}

console.log('mme calculation.test.ts: ok');
