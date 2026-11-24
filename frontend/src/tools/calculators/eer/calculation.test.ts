/**
 * Run: npx tsx src/tools/calculators/eer/calculation.test.ts
 *
 * Fixtures cross-checked against IOM/FNB DRI EER tables for adults age 30
 * (Dietary Reference Intakes for Energy…, 2002/2005).
 */
import {
  ADULT_PA_COEFFICIENTS,
  adultEerKcalPerDay,
  adultPaCoefficient,
  calculateEerCalculator,
  formatEerKcal,
  heightToMeters,
  weightToKg,
} from './calculation';
import { PREGNANCY_LACTATION_OFFSETS, createDefaultInput } from './types';
import { validateEerCalculatorInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function nearly(a: number, b: number, tol = 1.5): void {
  assert(Math.abs(a - b) <= tol, `expected ${b}, got ${a} (tol ${tol})`);
}

// PA coefficients
{
  assert(adultPaCoefficient('male', 'sedentary') === 1.0, 'm sed');
  assert(adultPaCoefficient('female', 'sedentary') === 1.0, 'f sed');
  assert(adultPaCoefficient('male', 'low_active') === 1.11, 'm low');
  assert(adultPaCoefficient('female', 'low_active') === 1.12, 'f low');
  assert(adultPaCoefficient('male', 'active') === 1.25, 'm act');
  assert(adultPaCoefficient('female', 'active') === 1.27, 'f act');
  assert(adultPaCoefficient('male', 'very_active') === 1.48, 'm va');
  assert(adultPaCoefficient('female', 'very_active') === 1.45, 'f va');
  assert(ADULT_PA_COEFFICIENTS.low_active.male === 1.11, 'table');
}

// Independent male formula: 30y, 1.65 m, 68 kg, low active → table ~2,566
{
  const eer = adultEerKcalPerDay('male', 30, 1.65, 68, 'low_active');
  const expected = 662 - 9.53 * 30 + 1.11 * (15.91 * 68 + 539.6 * 1.65);
  nearly(eer, expected, 0.01);
  nearly(eer, 2566, 1.5);
}

// Independent female formula: 30y, 1.65 m, 68 kg, low active → table ~2,202
{
  const eer = adultEerKcalPerDay('female', 30, 1.65, 68, 'low_active');
  const expected = 354 - 6.91 * 30 + 1.12 * (9.36 * 68 + 726 * 1.65);
  nearly(eer, expected, 0.01);
  nearly(eer, 2202, 1.5);
}

// All activity categories — male sedentary/active/very active table BMI 24.99 @ 1.65 m
{
  nearly(adultEerKcalPerDay('male', 30, 1.65, 68, 'sedentary'), 2349, 2);
  nearly(adultEerKcalPerDay('male', 30, 1.65, 68, 'active'), 2842, 2);
  nearly(adultEerKcalPerDay('male', 30, 1.65, 68, 'very_active'), 3296, 2);
}

// Female sedentary / active / very active @ 1.65 m · 68 kg · 30 y
{
  nearly(adultEerKcalPerDay('female', 30, 1.65, 68, 'sedentary'), 1982, 2);
  nearly(adultEerKcalPerDay('female', 30, 1.65, 68, 'active'), 2477, 2);
  nearly(adultEerKcalPerDay('female', 30, 1.65, 68, 'very_active'), 2807, 2);
}

// Age boundary: each year below 30 adds ~10 kcal (men) / ~7 kcal (women)
{
  const m30 = adultEerKcalPerDay('male', 30, 1.8, 81, 'sedentary');
  const m29 = adultEerKcalPerDay('male', 29, 1.8, 81, 'sedentary');
  nearly(m29 - m30, 9.53, 0.01);
  const f30 = adultEerKcalPerDay('female', 30, 1.65, 68, 'sedentary');
  const f31 = adultEerKcalPerDay('female', 31, 1.65, 68, 'sedentary');
  nearly(f30 - f31, 6.91, 0.01);
}

// Unit conversion parity (cm/kg vs in/lb)
{
  const r1 = calculateEerCalculator({
    ...createDefaultInput(),
    sex: 'female',
    ageYearsText: '30',
    heightText: '165',
    heightUnit: 'cm',
    weightText: '68',
    weightUnit: 'kg',
    activity: 'low_active',
  });
  const r2 = calculateEerCalculator({
    ...createDefaultInput(),
    sex: 'female',
    ageYearsText: '30',
    heightText: String(165 / 2.54),
    heightUnit: 'in',
    weightText: String(68 / 0.45359237),
    weightUnit: 'lb',
    activity: 'low_active',
  });
  assert(r1.eerKcalPerDay != null && r2.eerKcalPerDay != null, 'unit results');
  nearly(r1.eerKcalPerDay!, r2.eerKcalPerDay!, 1);
  assert(heightToMeters(165, 'cm') === 1.65, 'cm→m');
  nearly(weightToKg(150, 'lb'), 68.0388555, 0.01);
}

// Pregnancy/lactation offsets stay separate and match screenshot/IOM
{
  assert(PREGNANCY_LACTATION_OFFSETS.trimester1Kcal === 0, 't1');
  assert(PREGNANCY_LACTATION_OFFSETS.trimester2Kcal === 340, 't2');
  assert(PREGNANCY_LACTATION_OFFSETS.trimester3Kcal === 452, 't3');
  assert(PREGNANCY_LACTATION_OFFSETS.lactation0to6Kcal === 330, 'lac06');
  assert(PREGNANCY_LACTATION_OFFSETS.lactation7to12Kcal === 400, 'lac712');
  const r = calculateEerCalculator({
    ...createDefaultInput(),
    sex: 'female',
    ageYearsText: '30',
    heightText: '165',
    weightText: '68',
    activity: 'low_active',
  });
  assert(r.eerKcalPerDay != null, 'baseline');
  assert(
    Math.abs(r.eerKcalPerDay! - 2202) < 2,
    'baseline excludes pregnancy offset',
  );
  assert(r.pregnancyLactation.trimester2Kcal === 340, 'note intact');
}

// Blank / invalid / age gate
{
  const blank = validateEerCalculatorInput(createDefaultInput());
  assert(blank.result != null && blank.result.eerKcalPerDay == null, 'blank');
  const young = validateEerCalculatorInput({
    ...createDefaultInput(),
    ageYearsText: '18',
    heightText: '165',
    weightText: '60',
  });
  assert(young.errors.ageYearsText != null, 'age 18 rejected');
  const ok = validateEerCalculatorInput({
    ...createDefaultInput(),
    ageYearsText: '19',
    heightText: '165',
    weightText: '60',
    activity: 'sedentary',
  });
  assert(ok.result?.eerKcalPerDay != null, 'age 19 ok');
  assert(formatEerKcal(2201.5) === '2,202', 'round display');
}

console.log('eer calculation.test.ts: ok');
