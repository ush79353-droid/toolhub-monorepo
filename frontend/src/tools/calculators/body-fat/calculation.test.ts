/**
 * Focused engine self-check for Body Fat Calculator.
 * Run: npx tsx src/tools/calculators/body-fat/calculation.test.ts
 */
import {
  adaCunBaePercent,
  computeBmi,
  computeBodyFat,
  deurenbergBmiPercent,
  navyFemalePercent,
  navyMalePercent,
} from './calculation';
import { validateBodyFatInput } from './validation';
import type { BodyFatInput } from './types';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, tol = 0.05): boolean {
  return Math.abs(a - b) <= tol;
}

// BMI fixture: 180 cm, 60 kg → BMI = 18.5185…
const bmi = computeBmi(60, 180);
assert(approx(bmi, 18.5185, 0.001), `bmi got ${bmi}`);

// Deurenberg female age 30
const dF = deurenbergBmiPercent(bmi, 30, 'female');
assert(approx(dF, 1.2 * bmi + 0.23 * 30 - 5.4, 1e-9), 'deurenberg female');

// Deurenberg male age 30
const dM = deurenbergBmiPercent(bmi, 30, 'male');
assert(approx(dM, 1.2 * bmi + 0.23 * 30 - 16.2, 1e-9), 'deurenberg male');

// CUN-BAE female age 30 @ BMI≈18.5185
const ada = adaCunBaePercent(bmi, 30, 'female');
assert(approx(ada, 23.302, 0.02), `ada cun-bae got ${ada}`);

// Navy male metric sample: height 180, waist 85, neck 38
const navyM = navyMalePercent(180, 85, 38);
assert(navyM != null && Number.isFinite(navyM) && navyM > 5 && navyM < 40, `navy male got ${navyM}`);

// Navy female: height 165, waist 70, hip 95, neck 32
const navyF = navyFemalePercent(165, 70, 95, 32);
assert(navyF != null && Number.isFinite(navyF) && navyF > 5 && navyF < 50, `navy female got ${navyF}`);

const adaInput: BodyFatInput = {
  sex: 'female',
  method: 'ada',
  age: '30',
  height: '180',
  heightUnit: 'cm',
  weight: '60',
  weightUnit: 'kg',
  neck: '',
  waist: '',
  hip: '',
  circumferenceUnit: 'cm',
};

const adaResult = computeBodyFat(adaInput);
assert(adaResult != null, 'ada compute');
assert(approx(adaResult!.bodyFatPercent, ada, 1e-9), 'ada percent match');
assert(
  approx(adaResult!.fatMassKg, 60 * (ada / 100), 1e-6),
  'fat mass',
);
assert(
  approx(adaResult!.leanMassKg, 60 - adaResult!.fatMassKg, 1e-6),
  'lean mass',
);

const bmiMode = computeBodyFat({ ...adaInput, method: 'bmi' });
assert(bmiMode != null && approx(bmiMode!.bodyFatPercent, dF, 1e-9), 'bmi mode');

const navyInput: BodyFatInput = {
  sex: 'male',
  method: 'navy',
  age: '25',
  height: '180',
  heightUnit: 'cm',
  weight: '75',
  weightUnit: 'kg',
  neck: '38',
  waist: '85',
  hip: '',
  circumferenceUnit: 'cm',
};
const navyVal = validateBodyFatInput(navyInput);
assert(navyVal.isValid && navyVal.result != null, 'navy validate');
assert(approx(navyVal.result!.bodyFatPercent, navyM!, 0.05), 'navy validate pct');

// Reject blank age
const blank = validateBodyFatInput({ ...adaInput, age: '' });
assert(!blank.isValid && blank.errors.age, 'blank age');

// Reject waist ≤ neck
const badNavy = validateBodyFatInput({
  ...navyInput,
  waist: '30',
  neck: '38',
});
assert(!badNavy.isValid, 'waist<=neck rejected');

// Age under 18 blocked for ADA
const young = validateBodyFatInput({ ...adaInput, age: '16' });
assert(!young.isValid && young.errors.age, 'age 16 ada');

console.log('body-fat calculation.test.ts: ok');
