/**
 * Arterial Age — assert-based engine check (no test framework).
 * Run: npx tsx src/tools/calculators/arterial-age/calculation.test.ts
 */
import {
  INTERCEPT,
  SLOPE,
  computeArterialAgeYears,
  formatArterialAge,
  lookupTable1Ci,
  roundArterialAge,
} from './calculation';
import { createEmptyInput, createExampleInput } from './types';
import { validateArterialAgeInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 1e-6): boolean {
  return Math.abs(a - b) <= eps;
}

// Formula fixtures
assert(approx(computeArterialAgeYears(0)!, INTERCEPT), 'CAC 0 → 39.1');
{
  const a100 = computeArterialAgeYears(100)!;
  assert(approx(a100, INTERCEPT + SLOPE * Math.log(101)), 'CAC 100 formula');
  assert(roundArterialAge(a100) === 73, `CAC 100 round got ${roundArterialAge(a100)}`);
}
{
  const a10 = computeArterialAgeYears(10)!;
  assert(roundArterialAge(a10) === 56, `CAC 10 → 56 got ${roundArterialAge(a10)}`);
}
{
  const a400 = computeArterialAgeYears(400)!;
  assert(roundArterialAge(a400) === 83, `CAC 400 → 83 got ${roundArterialAge(a400)}`);
}

assert(computeArterialAgeYears(-1) === null, 'negative CAC null');
assert(formatArterialAge(INTERCEPT) === '39', 'format 39.1 → 39');

// Table 1 CI exact rows
assert(lookupTable1Ci(0)?.low === 32 && lookupTable1Ci(0)?.high === 46, 'CI 0');
assert(lookupTable1Ci(100)?.low === 71 && lookupTable1Ci(100)?.high === 74, 'CI 100');
assert(lookupTable1Ci(150) === null, 'non-table CAC no invented CI');

// Validation: blank → inactive
{
  const v = validateArterialAgeInput(createEmptyInput());
  assert(!v.isValid && v.result == null, 'blank inactive');
}

// Example CAC 0 + age 55
{
  const v = validateArterialAgeInput(createExampleInput());
  assert(v.isValid && v.result != null, 'example valid');
  assert(v.result!.formattedArterialAge === '39', 'example age 39');
  assert(v.result!.ciExactTable, 'example CI table');
  assert(v.result!.ageDeltaYears != null && v.result!.ageDeltaYears < 0, 'younger than 55');
}

// Invalid negative CAC
{
  const v = validateArterialAgeInput({ calciumScore: '-5', ageYears: '' });
  assert(!v.isValid && v.errors.calciumScore, 'reject negative');
}

// Age alone without CAC → inactive
{
  const v = validateArterialAgeInput({ calciumScore: '', ageYears: '60' });
  assert(!v.isValid && v.result == null, 'age alone inactive');
}

// Chronologic age above arterial estimate
{
  const v = validateArterialAgeInput({ calciumScore: '0', ageYears: '70' });
  assert(v.isValid && v.result != null, '70 vs CAC0 valid');
  assert(v.result!.ageDeltaYears! < 0, 'arterial younger than 70');
}

// Chronologic age below arterial estimate
{
  const v = validateArterialAgeInput({ calciumScore: '400', ageYears: '50' });
  assert(v.isValid && v.result != null, '50 vs CAC400 valid');
  assert(v.result!.formattedArterialAge === '83', '400 → 83');
  assert(v.result!.ageDeltaYears! > 0, 'arterial older than 50');
}

console.log('arterial-age calculation.test.ts: ok');
