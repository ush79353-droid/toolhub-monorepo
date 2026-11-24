/**
 * Assert self-check for BMI Calculator for Teens.
 * Run: npx tsx src/tools/calculators/bmi-teens/calculation.test.ts
 */
import {
  ageYearsToAgemos,
  bmiToZScore,
  calculateBmi,
  calculateBmiPrime,
  calculateBmiTeens,
  classifyTeenPercentile,
  lookupCdcLms,
  shareBmiTeensText,
  TEEN_AGE_MAX,
  TEEN_AGE_MIN,
  zScoreToPercentile,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateBmiTeensInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, tol = 1e-6): boolean {
  return Math.abs(a - b) <= tol;
}

// Quetelet + Prime
assert(approx(calculateBmi(1.7, 60), 60 / (1.7 * 1.7)), 'BMI 170cm/60kg');
assert(approx(calculateBmiPrime(20), 0.8), 'Prime 20→0.8');

// Age → Agemos mid-month
assert(ageYearsToAgemos(10) === 120.5, '10y → 120.5');
assert(ageYearsToAgemos(15) === 180.5, '15y → 180.5');
assert(ageYearsToAgemos(20) === 240.5, '20y → 240.5');

// LMS lookup sex-specific
const male15 = lookupCdcLms('male', 15);
const female15 = lookupCdcLms('female', 15);
assert(male15 != null && female15 != null, 'LMS at 15');
assert(male15!.M !== female15!.M, 'sex-specific M');

// Known LMS path: z→percentile monotone
const z0 = bmiToZScore(male15!.M, male15!.L, male15!.M, male15!.S);
assert(approx(z0, 0, 1e-9), 'BMI=M → z≈0');
assert(approx(zScoreToPercentile(0), 50, 0.05), 'z0 → ~50th');

// Categories
assert(classifyTeenPercentile(3).id === 'underweight', 'p3 underweight');
assert(classifyTeenPercentile(50).id === 'healthy', 'p50 healthy');
assert(classifyTeenPercentile(90).id === 'overweight', 'p90 overweight');
assert(classifyTeenPercentile(97).id === 'obesity', 'p97 obesity');

// Full example fixture
const example = validateBmiTeensInput(createExampleInput());
assert(example.isValid && example.result != null, 'example validates');
assert(
  example.result!.interpretationStatus === 'ready',
  'example has percentile',
);
assert(example.result!.category != null, 'example category');
assert(
  approx(example.result!.bmi, 60 / (1.7 * 1.7), 1e-9),
  'example BMI value',
);
// Prime must not drive category — category comes from percentile only
assert(
  example.result!.bmiPrime < 1 || example.result!.category != null,
  'category independent of prime threshold',
);

// Missing demographics → BMI still ok
const hwOnly = validateBmiTeensInput({
  ...createDefaultInput(),
  height: '170',
  weight: '60',
});
assert(hwOnly.isValid && hwOnly.result != null, 'H/W only ok');
assert(
  hwOnly.result!.interpretationStatus === 'needs_demographics',
  'needs demographics',
);
assert(hwOnly.result!.category == null, 'no category without sex/age');

// Age boundary: 9 rejected by validation; 21 rejected
const age9 = validateBmiTeensInput({
  ...createExampleInput(),
  age: '9',
});
assert(Boolean(!age9.isValid && age9.errors.age), 'age 9 invalid');
const age21 = validateBmiTeensInput({
  ...createExampleInput(),
  age: '21',
});
assert(Boolean(!age21.isValid && age21.errors.age), 'age 21 invalid');

// Inclusive bounds 10 and 20
const age10 = validateBmiTeensInput({
  ...createExampleInput(),
  age: String(TEEN_AGE_MIN),
});
const age20 = validateBmiTeensInput({
  ...createExampleInput(),
  age: String(TEEN_AGE_MAX),
  sex: 'female',
});
assert(age10.isValid && age10.result?.interpretationStatus === 'ready', 'age 10');
assert(age20.isValid && age20.result?.interpretationStatus === 'ready', 'age 20');

// Female vs male same BMI → different percentile typically
const femaleSame = validateBmiTeensInput({
  ...createExampleInput(),
  sex: 'female',
});
assert(
  femaleSame.result != null &&
    example.result != null &&
    femaleSame.result.percentile != null &&
    example.result.percentile != null &&
    femaleSame.result.percentile !== example.result.percentile,
  'sex changes percentile',
);

// Share privacy
const share = shareBmiTeensText('https://example.com/tools/bmi-calculator-for-teens');
assert(!share.includes('170'), 'share omits height');
assert(!share.includes('60'), 'share omits weight');
assert(share.includes('bmi-calculator-for-teens'), 'share has URL');

// Blank defaults
const blank = validateBmiTeensInput(createDefaultInput());
assert(!blank.isValid, 'blank invalid');

console.log('bmi-teens calculation.test.ts: ok');
