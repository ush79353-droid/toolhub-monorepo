/**
 * Army Body Fat Calculator — engine self-check (no test framework).
 * Run: npx --yes tsx src/tools/calculators/army-body-fat/calculation.test.ts
 */

import {
  computeArmyBodyFat,
  legacyFemalePercent,
  legacyMalePercent,
  maxAllowableBodyFat,
  oneSiteFemalePercent,
  oneSiteMalePercent,
  roundBodyFatPercent,
  toInches,
  toPounds,
} from './calculation';
import { validateArmyBodyFatInput } from './validation';
import { createDefaultInput } from './types';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

function nearly(a: number, b: number, eps = 1e-6): boolean {
  return Math.abs(a - b) <= eps;
}

// Official ALARACT sample — women: abdomen 30 in, weight 165 lb → 26%
{
  const raw = oneSiteFemalePercent(165, 30);
  assert(nearly(raw, 26.475, 1e-9), `one-site female raw got ${raw}`);
  assert(roundBodyFatPercent(raw) === 26, 'one-site female rounds to 26');
}

// Official ALARACT sample — men: abdomen 35 in, weight 210 lb → 17%
{
  const raw = oneSiteMalePercent(210, 35);
  assert(nearly(raw, 17.48, 1e-9), `one-site male raw got ${raw}`);
  assert(roundBodyFatPercent(raw) === 17, 'one-site male rounds to 17');
}

// Legacy AR 600-9 / DoDI sample — women
{
  const raw = legacyFemalePercent(42, 44, 15, 64);
  assert(raw != null && nearly(raw, 46.733, 1e-3), `legacy female got ${raw}`);
  assert(roundBodyFatPercent(raw!) === 47, 'legacy female rounds to 47');
}

// Legacy sample — men
{
  const raw = legacyMalePercent(49, 16, 69);
  assert(raw != null && nearly(raw, 38.61976, 1e-2), `legacy male got ${raw}`);
  assert(roundBodyFatPercent(raw!) === 39, 'legacy male rounds to 39');
}

// Unit conversion
assert(nearly(toInches(2.54, 'cm'), 1), 'cm→in');
assert(nearly(toPounds(1, 'kg'), 2.2046226218), 'kg→lb');

// Max standards Table B–2
assert(maxAllowableBodyFat('female', 25)?.maxPercent === 32, 'F 21–27');
assert(maxAllowableBodyFat('male', 40)?.maxPercent === 26, 'M 40+');
assert(maxAllowableBodyFat('male', 16) == null, 'under 17 no standard');

// computeArmyBodyFat one-site female fixture
{
  const r = computeArmyBodyFat({
    activeDuty: true,
    sex: 'female',
    ageYears: 25,
    weightLb: 165,
    abdomenIn: 30,
    heightIn: 0,
    neckIn: 0,
    waistIn: 0,
    hipIn: 0,
  });
  assert(r != null && r.bodyFatPercent === 26, 'compute one-site');
  assert(r!.withinStandard === true, '26 <= 32');
  assert(r!.model === 'one_site', 'model one_site');
}

// validation path with cm defaults
{
  const input = createDefaultInput();
  input.activeDuty = true;
  input.sex = 'male';
  input.ageYears = '30';
  input.weight = '210';
  input.weightUnit = 'lb';
  input.abdomen = String(35 * 2.54); // 35 in as cm
  input.abdomenUnit = 'cm';
  const v = validateArmyBodyFatInput(input);
  assert(v.isValid && v.result?.bodyFatPercent === 17, 'validate cm abdomen');
}

// Legacy female requires hip; male rejects hip requirement
{
  const input = createDefaultInput();
  input.activeDuty = false;
  input.sex = 'female';
  input.height = '64';
  input.heightUnit = 'in';
  input.neck = '15';
  input.neckUnit = 'in';
  input.waist = '42';
  input.waistUnit = 'in';
  input.hip = '44';
  input.hipUnit = 'in';
  const v = validateArmyBodyFatInput(input);
  assert(v.isValid && v.result?.bodyFatPercent === 47, 'legacy female validate');
}

// Invalid: male waist <= neck
{
  const input = createDefaultInput();
  input.activeDuty = false;
  input.sex = 'male';
  input.height = '69';
  input.heightUnit = 'in';
  input.neck = '16';
  input.neckUnit = 'in';
  input.waist = '16';
  input.waistUnit = 'in';
  const v = validateArmyBodyFatInput(input);
  assert(!v.isValid, 'male waist=neck invalid');
}

console.log('army-body-fat calculation.test.ts: ok');
