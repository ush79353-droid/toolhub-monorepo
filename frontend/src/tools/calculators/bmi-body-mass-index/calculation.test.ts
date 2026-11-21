/**
 * BMI Calculator – Body Mass Index — engine self-check.
 * Run: npx tsx src/tools/calculators/bmi-body-mass-index/calculation.test.ts
 */

import {
  calculateBmi,
  calculateBmiBodyMassIndex,
  calculateBmiPrime,
  classifyWhoAdultBmi,
  formatBmi,
  formatBmiPrime,
  healthyWeightRangeKg,
  heightToMeters,
  resolvePercentileStatus,
  weightToKg,
} from './calculation';
import { createExampleInput, createEmptyInput } from './types';
import { validateBmiBodyMassIndexInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

// Prompt fixture: 80 kg / 2 m → BMI 20, Prime 0.80
const bmi = calculateBmi(2, 80);
assert(bmi === 20, `expected BMI 20, got ${bmi}`);
assert(calculateBmiPrime(bmi) === 0.8, 'prime 0.80');
assert(formatBmi(bmi) === '20.00', 'format BMI');
assert(formatBmiPrime(0.8) === '0.80', 'format prime');

const example = calculateBmiBodyMassIndex(createExampleInput());
assert(example != null, 'example result');
assert(example!.formattedBmi === '20.00', `ex bmi ${example!.formattedBmi}`);
assert(
  example!.formattedBmiPrime === '0.80',
  `ex prime ${example!.formattedBmiPrime}`,
);
assert(example!.category.id === 'normal', 'WHO normal');

const empty = validateBmiBodyMassIndexInput(createEmptyInput());
assert(!empty.isValid && empty.result == null, 'empty invalid');

// cm / kg path: 180 cm, 60 kg → BMI ≈ 18.5185
const metric = calculateBmiBodyMassIndex({
  ...createEmptyInput(),
  height: '180',
  heightUnit: 'cm',
  weight: '60',
  weightUnit: 'kg',
});
assert(metric != null, 'metric');
assert(
  Math.abs(metric!.bmi - 60 / (1.8 * 1.8)) < 1e-12,
  `metric bmi ${metric!.bmi}`,
);

assert(heightToMeters(100, 'cm') === 1, '100 cm = 1 m');
assert(Math.abs(weightToKg(1, 'lb') - 0.45359237) < 1e-12, 'lb');
assert(Math.abs(weightToKg(1, 'st') - 6.35029318) < 1e-12, 'st');

assert(classifyWhoAdultBmi(15.9).id === 'severe_thinness', 'severe');
assert(classifyWhoAdultBmi(16).id === 'moderate_thinness', 'moderate');
assert(classifyWhoAdultBmi(17).id === 'mild_thinness', 'mild');
assert(classifyWhoAdultBmi(18.5).id === 'normal', 'normal low');
assert(classifyWhoAdultBmi(24.99).id === 'normal', 'normal high');
assert(classifyWhoAdultBmi(25).id === 'overweight', 'ow');
assert(classifyWhoAdultBmi(30).id === 'obese_i', 'obi');
assert(classifyWhoAdultBmi(35).id === 'obese_ii', 'obii');
assert(classifyWhoAdultBmi(40).id === 'obese_iii', 'obiii');

const range = healthyWeightRangeKg(2);
assert(Math.abs(range.minKg - 18.5 * 4) < 1e-12, 'healthy min');
assert(Math.abs(range.maxKg - 24.9 * 4) < 1e-12, 'healthy max');

assert(
  resolvePercentileStatus('', null).status === 'needs_age',
  'needs age',
);
assert(
  resolvePercentileStatus('1', 1).status === 'below_chart_age',
  'below 2',
);
assert(
  resolvePercentileStatus('10', 10).status === 'child_lms_unavailable',
  'child gated',
);
assert(
  resolvePercentileStatus('25', 25).status === 'adult_who_path',
  'adult path',
);

const athlete = calculateBmiBodyMassIndex({
  ...createExampleInput(),
  athlete: true,
  advancedOpen: true,
  age: '30',
});
assert(athlete?.athleteNote != null, 'athlete note');
assert(athlete?.percentileStatus === 'adult_who_path', 'adult age');

// Unit switch preserves physical value helpers
const meters = heightToMeters(72, 'in');
assert(Math.abs(meters - 1.8288) < 1e-12, '72 in');

console.log('bmi-body-mass-index calculation.test.ts: all asserts passed');
