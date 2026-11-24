/**
 * Run: npx tsx src/tools/calculators/harris-benedict/calculation.test.ts
 */
import { revisedHarrisBenedictBeeKcalPerDay } from '../bee-calculator/calculation';
import {
  calculateHarrisBenedict,
  formatBmrKcal,
  heightToCm,
  weightToKg,
} from './calculation';
import { createDefaultInput } from './types';
import { validateHarrisBenedictInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Prompt fixture: male 30 y, 70 kg, 175 cm → ≈ 1,696 kcal/day (revised)
{
  const bmr = revisedHarrisBenedictBeeKcalPerDay('male', 30, 175, 70);
  const expected = 88.362 + 13.397 * 70 + 4.799 * 175 - 5.677 * 30;
  assert(Math.abs(bmr - expected) < 0.01, `male coeffs ${bmr} vs ${expected}`);
  assert(Math.abs(bmr - 1695.667) < 0.01, `male fixture ~1696 got ${bmr}`);
  const r = calculateHarrisBenedict({
    ...createDefaultInput(),
    sex: 'male',
    ageYearsText: '30',
    heightText: '175',
    weightText: '70',
  });
  assert(r.bmrKcalPerDay != null, 'male result');
  assert(Math.abs((r.bmrKcalPerDay ?? 0) - expected) < 0.01, 'male calc wire');
  assert(r.bmrDisplay === formatBmrKcal(expected), 'male display');
}

// Female independent case: 25 y, 165 cm, 60 kg
{
  const expected = 447.593 + 9.247 * 60 + 3.098 * 165 - 4.33 * 25;
  const bmr = revisedHarrisBenedictBeeKcalPerDay('female', 25, 165, 60);
  assert(Math.abs(bmr - expected) < 0.01, `female coeffs ${bmr} vs ${expected}`);
  const r = calculateHarrisBenedict({
    ...createDefaultInput(),
    sex: 'female',
    ageYearsText: '25',
    heightText: '165',
    weightText: '60',
  });
  assert(r.bmrKcalPerDay != null, 'female result');
  assert(Math.abs((r.bmrKcalPerDay ?? 0) - expected) < 0.01, 'female calc');
}

// Unit conversion parity (≈70 in / ≈154.3 lb ≈ 177.8 cm / 70 kg)
{
  const rCm = calculateHarrisBenedict({
    ...createDefaultInput(),
    ageYearsText: '30',
    heightText: '175',
    heightUnit: 'cm',
    weightText: '70',
    weightUnit: 'kg',
  });
  const rUs = calculateHarrisBenedict({
    ...createDefaultInput(),
    ageYearsText: '30',
    heightText: String(175 / 2.54),
    heightUnit: 'in',
    weightText: String(70 / 0.45359237),
    weightUnit: 'lb',
  });
  assert(rCm.bmrKcalPerDay != null && rUs.bmrKcalPerDay != null, 'unit results');
  assert(
    Math.abs((rCm.bmrKcalPerDay ?? 0) - (rUs.bmrKcalPerDay ?? 0)) < 0.05,
    'unit switch parity',
  );
  assert(Math.abs(heightToCm(70, 'in') - 177.8) < 0.01, 'in→cm');
  assert(Math.abs(weightToKg(154.3235835, 'lb') - 70) < 0.01, 'lb→kg');
}

// Invalid / blank
{
  const blank = validateHarrisBenedictInput(createDefaultInput());
  assert(blank.result != null && blank.result.bmrKcalPerDay == null, 'blank');

  const badAge = validateHarrisBenedictInput({
    ...createDefaultInput(),
    ageYearsText: '10',
    heightText: '175',
    weightText: '70',
  });
  assert(badAge.errors.ageYearsText, 'age eligibility');

  const neg = calculateHarrisBenedict({
    ...createDefaultInput(),
    ageYearsText: '30',
    heightText: '-1',
    weightText: '70',
  });
  assert(neg.bmrKcalPerDay == null, 'negative height');
}

// Shares BEE basal helper exactly
{
  const shared = revisedHarrisBenedictBeeKcalPerDay('male', 40, 180, 80);
  const r = calculateHarrisBenedict({
    ...createDefaultInput(),
    ageYearsText: '40',
    heightText: '180',
    weightText: '80',
  });
  assert(Math.abs((r.bmrKcalPerDay ?? 0) - shared) < 1e-9, 'shares BEE helper');
}

console.log('harris-benedict calculation.test.ts: ok');
