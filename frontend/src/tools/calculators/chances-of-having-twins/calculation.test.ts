/**
 * Chances of Having Twins — assert-based engine check.
 * Run: cd frontend && npx tsx src/tools/calculators/chances-of-having-twins/calculation.test.ts
 */
import {
  AGE_BAND_RATES,
  OVERALL_US_TWIN_RATE_2024,
  RACE_RATES,
  calculateTwinBirthRate,
  resolveAgeBand,
  twinRateToOneInN,
  twinRateToPercent,
} from './calculation';
import { createEmptyInput, createExampleInput } from './types';
import { validateTwinsInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function assertClose(actual: number, expected: number, tol = 0.001): void {
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tol) {
    throw new Error(`expected ~${expected}, got ${actual}`);
  }
}

// Age band boundaries
assert(resolveAgeBand(19) === 'under_20', 'age 19');
assert(resolveAgeBand(20) === '20_24', 'age 20');
assert(resolveAgeBand(32) === '30_34', 'age 32');
assert(resolveAgeBand(40) === '40_plus', 'age 40');
assert(resolveAgeBand(55) === '40_plus', 'age 55');
assert(resolveAgeBand(11) === null, 'age 11 invalid');
assert(resolveAgeBand(56) === null, 'age 56 invalid');

// Published age rates
assertClose(AGE_BAND_RATES['30_34'].rate, 33.2);
assertClose(AGE_BAND_RATES.under_20.rate, 16.1);
assertClose(AGE_BAND_RATES['40_plus'].rate, 35.6);

// Example age 32
{
  const r = calculateTwinBirthRate({ stratumMode: 'by_age', motherAgeYears: 32 });
  assert(r != null, 'age 32 result');
  assertClose(r!.twinBirthsPerThousand, 33.2);
  assertClose(r!.percentTwinBirths, 3.32);
  assert(r!.oneInN === 30, `1 in N for 33.2, got ${r!.oneInN}`);
  assert(r!.formattedOneInN === 'about 1 in 30', r!.formattedOneInN);
}

assertClose(twinRateToPercent(33.2), 3.32);
assert(twinRateToOneInN(33.2) === 30, 'round 1000/33.2');

// Overall US reference
assertClose(OVERALL_US_TWIN_RATE_2024, 30.1);

// Race stratum — NH Black highest listed
{
  const r = calculateTwinBirthRate({
    stratumMode: 'by_race',
    raceEthnicity: 'nh_black',
  });
  assert(r != null, 'nh black');
  assertClose(r!.twinBirthsPerThousand, 42.0);
  assert(twinRateToOneInN(42.0) === 24, '1 in 24 for 42');
}

for (const [key, rate] of Object.entries(RACE_RATES)) {
  const r = calculateTwinBirthRate({
    stratumMode: 'by_race',
    raceEthnicity: key as keyof typeof RACE_RATES,
  });
  assert(r != null && r.twinBirthsPerThousand === rate, `race ${key}`);
}

// validateTwinsInput — example
{
  const v = validateTwinsInput(createExampleInput());
  assert(v.isValid && v.result != null, 'example valid');
  assertClose(v.result!.twinBirthsPerThousand, 33.2);
  assert(v.result!.oneInN === 30, 'example one in N');
}

// blank inactive
{
  const v = validateTwinsInput(createEmptyInput());
  assert(!v.isValid && v.result == null, 'blank inactive');
}

// by_race requires selection
{
  const v = validateTwinsInput({
    ...createEmptyInput(),
    stratumMode: 'by_race',
  });
  assert(!v.isValid && v.result == null, 'race mode no selection');
}

{
  const v = validateTwinsInput({
    stratumMode: 'by_race',
    motherAgeYears: '',
    raceEthnicity: 'hispanic',
  });
  assert(v.isValid && v.result != null, 'hispanic');
  assertClose(v.result!.twinBirthsPerThousand, 23.4);
}

console.log('chances-of-having-twins calculation ok');