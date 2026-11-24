/**
 * Run: npx tsx src/tools/calculators/rmr/calculation.test.ts
 */
import { harrisBenedictBmrKcal } from '../dri/calculation';
import {
  calculateRmr,
  formatRmrKcal,
  heightToCm,
  rmrFromHarrisBenedictKcal,
  TEF_FACTOR,
  weightToKg,
} from './calculation';
import { createDefaultInput } from './types';
import { validateRmrInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Omni RMR fixture: male 30 y, 80 kg, 180 cm → ≈ 2,050 kcal/day (HB × 1.1)
{
  const bmr = harrisBenedictBmrKcal('male', 80, 180, 30);
  const expectedBmr = 66.473 + 13.7516 * 80 + 5.0033 * 180 - 6.755 * 30;
  assert(Math.abs(bmr - expectedBmr) < 0.01, `male HB coeffs ${bmr}`);
  const rmr = rmrFromHarrisBenedictKcal('male', 80, 180, 30);
  assert(Math.abs(rmr - bmr * TEF_FACTOR) < 1e-9, 'TEF wire');
  assert(Math.abs(rmr - 2051) < 1.5, `Omni ≈2050 got ${rmr}`);
  const r = calculateRmr({
    ...createDefaultInput(),
    sex: 'male',
    ageYearsText: '30',
    heightText: '180',
    weightText: '80',
  });
  assert(r.rmrKcalPerDay != null, 'male result');
  assert(Math.abs((r.rmrKcalPerDay ?? 0) - rmr) < 0.01, 'male calc wire');
  assert(r.rmrDisplay === formatRmrKcal(rmr), 'male display');
}

// Female independent case: 25 y, 165 cm, 60 kg
{
  const bmr = harrisBenedictBmrKcal('female', 60, 165, 25);
  const expectedBmr =
    655.0955 + 9.5634 * 60 + 1.8496 * 165 - 4.6756 * 25;
  assert(Math.abs(bmr - expectedBmr) < 0.01, `female HB ${bmr}`);
  const expectedRmr = bmr * TEF_FACTOR;
  const r = calculateRmr({
    ...createDefaultInput(),
    sex: 'female',
    ageYearsText: '25',
    heightText: '165',
    weightText: '60',
  });
  assert(r.rmrKcalPerDay != null, 'female result');
  assert(Math.abs((r.rmrKcalPerDay ?? 0) - expectedRmr) < 0.01, 'female calc');
}

// Unit conversion parity (180 cm / 80 kg ↔ in / lb)
{
  const rCm = calculateRmr({
    ...createDefaultInput(),
    ageYearsText: '30',
    heightText: '180',
    heightUnit: 'cm',
    weightText: '80',
    weightUnit: 'kg',
  });
  const rUs = calculateRmr({
    ...createDefaultInput(),
    ageYearsText: '30',
    heightText: String(180 / 2.54),
    heightUnit: 'in',
    weightText: String(80 / 0.45359237),
    weightUnit: 'lb',
  });
  assert(rCm.rmrKcalPerDay != null && rUs.rmrKcalPerDay != null, 'unit results');
  assert(
    Math.abs((rCm.rmrKcalPerDay ?? 0) - (rUs.rmrKcalPerDay ?? 0)) < 0.05,
    'unit switch parity',
  );
  assert(Math.abs(heightToCm(70, 'in') - 177.8) < 0.01, 'in→cm');
  assert(Math.abs(weightToKg(176.3698097, 'lb') - 80) < 0.01, 'lb→kg');
}

// Invalid / blank
{
  const blank = validateRmrInput(createDefaultInput());
  assert(blank.result != null && blank.result.rmrKcalPerDay == null, 'blank');

  const badAge = validateRmrInput({
    ...createDefaultInput(),
    ageYearsText: '10',
    heightText: '180',
    weightText: '80',
  });
  assert(badAge.errors.ageYearsText, 'age eligibility');

  const neg = calculateRmr({
    ...createDefaultInput(),
    ageYearsText: '30',
    heightText: '-1',
    weightText: '80',
  });
  assert(neg.rmrKcalPerDay == null, 'negative height');
}

// Shares DRI HB helper exactly (before TEF)
{
  const shared = harrisBenedictBmrKcal('male', 80, 180, 40);
  const r = calculateRmr({
    ...createDefaultInput(),
    ageYearsText: '40',
    heightText: '180',
    weightText: '80',
  });
  assert(
    Math.abs((r.rmrKcalPerDay ?? 0) - shared * TEF_FACTOR) < 1e-9,
    'shares DRI HB helper × TEF',
  );
}

console.log('rmr calculation.test.ts: ok');
