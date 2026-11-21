/**
 * Self-check for Weight Percentile (WHO WFA LMS).
 * Run: npx tsx src/tools/calculators/weight-percentile/calculation.test.ts
 */

import {
  WHO_WFA_LMS_BOYS,
  WHO_WFA_LMS_GIRLS,
} from './datasets';
import {
  calculateWeightPercentile,
  lookupWfaLms,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateWeightPercentileInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function nearly(a: number, b: number, tol = 1e-6): boolean {
  return Math.abs(a - b) <= tol;
}

assert(WHO_WFA_LMS_BOYS.length === 61, 'boys length');
assert(WHO_WFA_LMS_GIRLS.length === 61, 'girls length');

// Birth boy median
assert(nearly(WHO_WFA_LMS_BOYS[0]!.M, 3.3464), 'boy birth M');
assert(nearly(WHO_WFA_LMS_GIRLS[0]!.M, 3.2322), 'girl birth M');

// M → ~50th
const med = calculateWeightPercentile({
  ageMonths: 24,
  sex: 'girl',
  weightKg: WHO_WFA_LMS_GIRLS[24]!.M,
});
assert(nearly(med.percentile, 50, 0.2), `median ~50 got ${med.percentile}`);
assert(nearly(med.zScore, 0, 0.01), `z~0 got ${med.zScore}`);

const example = validateWeightPercentileInput(createExampleInput());
assert(example.isValid && example.result, 'example');
assert(nearly(example.result!.percentile, 50, 0.2), 'example ~50th');

const empty = validateWeightPercentileInput(createDefaultInput());
assert(empty.isValid && empty.result === null, 'empty');

const over = validateWeightPercentileInput({
  ...createDefaultInput(),
  age: '61',
  ageUnit: 'mos',
  weight: '10',
});
assert(!over.isValid && over.errors.age, 'age 61 rejected');

const missingAge = validateWeightPercentileInput({
  ...createDefaultInput(),
  weight: '10',
});
assert(!missingAge.isValid && missingAge.errors.age, 'missing age');

// Exact month lookup
const lms24 = lookupWfaLms(24, 'boy');
assert(nearly(lms24.M, WHO_WFA_LMS_BOYS[24]!.M), 'exact month');

// Unit parity: same kg via lb
const kg = validateWeightPercentileInput({
  age: '12',
  ageUnit: 'mos',
  sex: 'boy',
  weight: '9.6479',
  weightUnit: 'kg',
});
const lb = validateWeightPercentileInput({
  age: '12',
  ageUnit: 'mos',
  sex: 'boy',
  weight: String(9.6479 / 0.45359237),
  weightUnit: 'lb',
});
assert(kg.result && lb.result, 'unit results');
assert(
  nearly(kg.result!.percentile, lb.result!.percentile, 0.05),
  'kg/lb parity',
);

console.log('weight-percentile calculation.test.ts: ok');
