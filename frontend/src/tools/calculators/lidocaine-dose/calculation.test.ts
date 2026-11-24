/**
 * Lidocaine Dose — assert-based engine check.
 * Run: npx tsx src/tools/calculators/lidocaine-dose/calculation.test.ts
 */
import {
  calculateLidocaineDose,
  concentrationToMgPerMl,
  formatMg,
  formatMl,
  weightToKg,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateLidocaineDoseInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

{
  assert(concentrationToMgPerMl(0.25) === 2.5, '0.25% = 2.5 mg/mL');
  assert(concentrationToMgPerMl(1) === 10, '1% = 10 mg/mL');
  assert(concentrationToMgPerMl(2) === 20, '2% = 20 mg/mL');
}

{
  const r = calculateLidocaineDose(createDefaultInput());
  assert(r.maxDoseMg === null, 'blank weight unscored mg');
  assert(r.maxDoseMl === null, 'blank weight unscored mL');
  assert(r.statusHeadline.includes('Enter weight'), 'blank headline');
}

{
  const r = calculateLidocaineDose(createEmptyInput());
  assert(r.maxDoseMg === null && r.maxDoseMl === null, 'empty unscored');
}

{
  // 50 kg × 4.5 = 225 mg (< 300); 0.25% → 2.5 mg/mL → 90 mL
  const r = calculateLidocaineDose({
    weightText: '50',
    weightUnit: 'kg',
    concentrationPercent: '0.25',
  });
  assert(r.maxDoseMg === 225, '50 kg plain max mg');
  assert(r.mgPerMl === 2.5, '0.25% mg/mL');
  assert(r.maxDoseMl != null && approx(r.maxDoseMl, 90), '50 kg → 90 mL');
}

{
  // 70 kg × 4.5 = 315 → absolute cap 300 mg; 0.25% → 120 mL
  const r = calculateLidocaineDose({
    weightText: '70',
    weightUnit: 'kg',
    concentrationPercent: '0.25',
  });
  assert(r.maxDoseMg === 300, '70 kg capped at 300 mg');
  assert(r.maxDoseMl != null && approx(r.maxDoseMl, 120), '70 kg → 120 mL');
}

{
  // 50 kg · 1% → 225 mg / 10 mg/mL = 22.5 mL
  const r = calculateLidocaineDose({
    weightText: '50',
    weightUnit: 'kg',
    concentrationPercent: '1',
  });
  assert(r.maxDoseMg === 225, '1% same mass ceiling');
  assert(r.maxDoseMl != null && approx(r.maxDoseMl, 22.5), '1% volume');
}

{
  const kg = weightToKg(110.23113109, 'lb');
  assert(approx(kg, 50, 1e-6), 'lb → kg');
  const r = calculateLidocaineDose({
    weightText: '110.23113109',
    weightUnit: 'lb',
    concentrationPercent: '0.25',
  });
  assert(r.maxDoseMg != null && approx(r.maxDoseMg, 225, 1e-4), 'lb mass');
}

{
  const v = validateLidocaineDoseInput({
    weightText: '0',
    weightUnit: 'kg',
    concentrationPercent: '0.25',
  });
  assert(v.errors.weightText, 'zero weight error');
  assert(v.result?.maxDoseMg === null, 'zero weight unscored');
}

{
  const v = validateLidocaineDoseInput({
    weightText: 'abc',
    weightUnit: 'kg',
    concentrationPercent: '0.25',
  });
  assert(v.errors.weightText, 'non-numeric weight');
  assert(v.result?.maxDoseMl === null, 'invalid unscored');
}

{
  assert(formatMl(90) === '90', 'format ml');
  assert(formatMg(225) === '225', 'format mg');
  assert(formatMl(22.5) === '22.5', 'format ml decimal');
}

console.log('lidocaine-dose calculation.test.ts: ok');
