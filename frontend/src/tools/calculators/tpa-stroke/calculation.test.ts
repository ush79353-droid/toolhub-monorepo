/**
 * tPA Stroke Dosing — assert-based engine check.
 * Run: npx tsx src/tools/calculators/tpa-stroke/calculation.test.ts
 *
 * Fixtures use FDA/DailyMed Activase AIS: 0.9 mg/kg ≤ 90 mg; 10% bolus.
 */
import {
  calculateTpaStroke,
  formatMg,
  weightToKg,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateTpaStrokeInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

{
  const r = calculateTpaStroke(createDefaultInput());
  assert(r.totalDoseMg === null, 'blank weight unscored total');
  assert(r.bolusMg === null && r.infusionMg === null, 'blank unscored split');
  assert(r.statusHeadline.includes('Enter weight'), 'blank headline');
}

{
  const r = calculateTpaStroke(createEmptyInput());
  assert(r.totalDoseMg === null, 'empty unscored');
}

{
  // 70 kg × 0.9 = 63 mg; bolus 6.3; infusion 56.7
  const r = calculateTpaStroke({
    weightText: '70',
    weightUnit: 'kg',
  });
  assert(r.totalDoseMg != null && approx(r.totalDoseMg, 63), '70 kg total');
  assert(r.bolusMg != null && approx(r.bolusMg, 6.3), '70 kg bolus');
  assert(r.infusionMg != null && approx(r.infusionMg, 56.7), '70 kg infusion');
  assert(r.cappedAtMax === false, '70 kg not capped');
}

{
  // 100 kg × 0.9 = 90 mg exactly — at labeled max, not over-cap
  const r = calculateTpaStroke({
    weightText: '100',
    weightUnit: 'kg',
  });
  assert(r.totalDoseMg === 90, '100 kg total 90');
  assert(r.bolusMg != null && approx(r.bolusMg, 9), '100 kg bolus');
  assert(r.infusionMg != null && approx(r.infusionMg, 81), '100 kg infusion');
  assert(r.cappedAtMax === false, 'exact 90 mg is not over-cap');
}

{
  // 101 kg × 0.9 = 90.9 → still 90
  const r = calculateTpaStroke({
    weightText: '101',
    weightUnit: 'kg',
  });
  assert(r.totalDoseMg === 90, '101 kg still capped at 90');
  assert(r.cappedAtMax === true, '101 kg capped');
}

{
  // Over cap: 100.1 kg × 0.9 = 90.09
  const r = calculateTpaStroke({
    weightText: '100.1',
    weightUnit: 'kg',
  });
  assert(r.totalDoseMg === 90, '100.1 kg capped');
  assert(r.cappedAtMax === true, '100.1 kg over flag');
}

{
  const kg = weightToKg(154.32358353, 'lb');
  assert(approx(kg, 70, 1e-6), 'lb → kg ≈ 70');
  const r = calculateTpaStroke({
    weightText: '154.32358353',
    weightUnit: 'lb',
  });
  assert(r.totalDoseMg != null && approx(r.totalDoseMg, 63, 1e-4), 'lb total');
}

{
  const v = validateTpaStrokeInput({
    weightText: '0',
    weightUnit: 'kg',
  });
  assert(v.errors.weightText, 'zero weight error');
  assert(v.result?.totalDoseMg === null, 'zero weight unscored');
}

{
  const v = validateTpaStrokeInput({
    weightText: 'abc',
    weightUnit: 'kg',
  });
  assert(v.errors.weightText, 'non-numeric weight');
  assert(v.result?.totalDoseMg === null, 'invalid unscored');
}

{
  assert(formatMg(63) === '63', 'format mg int');
  assert(formatMg(6.3) === '6.3', 'format mg decimal');
}

console.log('tpa-stroke calculation.test.ts: ok');
