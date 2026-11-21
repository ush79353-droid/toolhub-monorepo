import {
  bmiLmsZScore,
  calculateBmi,
  calculateBmiKids,
  calculateBmiPrime,
  classifyCdcPercentile,
  interpolateLms,
  normalCdf,
  yearsToAgemos,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateBmiKidsInput } from './validation';

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, tol = 1e-6): boolean {
  return Math.abs(a - b) <= tol;
}

// Quetelet + Prime
assert(approx(calculateBmi(1.4, 32.7), 32.7 / (1.4 * 1.4), 1e-12), 'bmi');
assert(approx(calculateBmiPrime(20), 0.8, 1e-12), 'prime');

// LMS z at published male 120.5 mo median M → z ≈ 0 → ~50th
{
  const row = interpolateLms('male', 120.5);
  assert(row != null, 'lms row');
  const z = bmiLmsZScore(row!.M, row!.L, row!.M, row!.S);
  assert(approx(z, 0, 1e-9), `median z=${z}`);
  const pct = normalCdf(z) * 100;
  assert(approx(pct, 50, 1e-6), `median pct=${pct}`);
  assert(classifyCdcPercentile(pct).id === 'healthy_weight', 'median class');
}

// Example input path
{
  const result = calculateBmiKids(createExampleInput());
  assert(result != null, 'example result');
  assert(result!.healthStatus === 'classified', result!.healthStatus);
  assert(result!.category != null, 'category');
  assert(result!.percentile != null, 'percentile');
  // BMI Prime must not drive category — category comes from percentile bands.
  assert(result!.bmiPrime === result!.bmi / 25, 'prime formula');
  assert(
    result!.healthNote.includes('BMI Prime') &&
      result!.healthNote.includes('does not define'),
    'prime disclaimer in note',
  );
}

// Missing demographics when panel open
{
  const input = {
    ...createExampleInput(),
    ageYears: '',
  };
  const result = calculateBmiKids(input);
  assert(result?.healthStatus === 'needs_demographics', 'needs demo');
  assert(result?.category == null, 'no category without age');
}

// Collapsed panel: no classification
{
  const input = { ...createExampleInput(), healthOpen: false };
  const result = calculateBmiKids(input);
  assert(result?.healthStatus === 'collapsed', 'collapsed');
  assert(result?.category == null, 'no class collapsed');
}

// Adult age blocked (no WHO adult path in kids tool)
{
  const input = { ...createExampleInput(), ageYears: '25' };
  const result = calculateBmiKids(input);
  assert(result?.healthStatus === 'above_chart_age', 'adult blocked');
  assert(result?.category == null, 'no adult category');
}

// Under-2 blocked
{
  const input = { ...createExampleInput(), ageYears: '1.5' };
  const result = calculateBmiKids(input);
  assert(result?.healthStatus === 'below_chart_age', 'infant blocked');
}

// Blank defaults validate without throwing
{
  const v = validateBmiKidsInput(createDefaultInput());
  assert(!v.isValid && v.result == null, 'blank default');
}

// Agemos conversion
assert(yearsToAgemos(10) === 120, 'agemos');

// Category edges
assert(classifyCdcPercentile(4.9).id === 'underweight', 'uw');
assert(classifyCdcPercentile(5).id === 'healthy_weight', 'hw5');
assert(classifyCdcPercentile(84.9).id === 'healthy_weight', 'hw84');
assert(classifyCdcPercentile(85).id === 'overweight', 'ow');
assert(classifyCdcPercentile(94.9).id === 'overweight', 'ow94');
assert(classifyCdcPercentile(95).id === 'obesity', 'ob');

console.log('bmi-kids calculation.test.ts: ok');
