/**
 * Self-check for Navy Body Fat Calculator.
 * Run: npx tsx src/tools/calculators/navy-body-fat/calculation.test.ts
 */

import { navyFemalePercent, navyMalePercent } from '../body-fat/calculation';
import {
  calculateNavyBodyFat,
  formatBodyFatPercent,
  toCm,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateNavyBodyFatInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function nearly(a: number, b: number, tol = 1e-6): boolean {
  return Math.abs(a - b) <= tol;
}

assert(nearly(toCm(1, 'in'), 2.54), 'in→cm');
assert(nearly(toCm(180, 'cm'), 180), 'cm identity');

const navyM = navyMalePercent(180, 85, 38);
assert(navyM != null && navyM > 5 && navyM < 40, `male shared ${navyM}`);

const example = createExampleInput();
const r = calculateNavyBodyFat(example);
assert(r, 'example result');
assert(nearly(r.bodyFatPercent, navyM!, 1e-9), 'matches shared navy male');
assert(r.formattedBodyFatPercent === formatBodyFatPercent(navyM!), 'format');

const female = calculateNavyBodyFat({
  ...createDefaultInput(),
  sex: 'female',
  age: '30',
  height: '165',
  neck: '32',
  waist: '70',
  hip: '95',
});
const navyF = navyFemalePercent(165, 70, 95, 32);
assert(female && navyF != null, 'female');
assert(nearly(female!.bodyFatPercent, navyF!, 1e-9), 'female match');

// Reject waist ≤ neck
const bad = validateNavyBodyFatInput({
  ...example,
  waist: '30',
  neck: '38',
});
assert(!bad.isValid && bad.errors.waist, 'waist<=neck rejected');

// Female missing hip
const noHip = validateNavyBodyFatInput({
  ...createDefaultInput(),
  sex: 'female',
  height: '165',
  neck: '32',
  waist: '70',
  hip: '',
});
assert(!noHip.isValid && noHip.errors.hip, 'hip required');

// Empty defaults
const empty = validateNavyBodyFatInput(createDefaultInput());
assert(empty.isValid && empty.result === null, 'empty ok');

// Inch equivalence: 180 cm male vs inches
const inches = calculateNavyBodyFat({
  ...example,
  height: String(180 / 2.54),
  heightUnit: 'in',
  neck: String(38 / 2.54),
  neckUnit: 'in',
  waist: String(85 / 2.54),
  waistUnit: 'in',
});
assert(
  inches && nearly(inches.bodyFatPercent, navyM!, 0.05),
  'inch equivalence',
);

console.log('navy-body-fat calculation.test.ts: ok');
