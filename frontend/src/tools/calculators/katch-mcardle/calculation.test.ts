/**
 * Run: npx tsx src/tools/calculators/katch-mcardle/calculation.test.ts
 */
import {
  boerLeanBodyMassKg,
  calculateKatchMcardle,
  formatBmrKcal,
  heightToCm,
  katchMcardleBmrKcalPerDay,
  leanMassFromBodyFatKg,
  weightToKg,
} from './calculation';
import { createDefaultInput } from './types';
import { validateKatchMcardleInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Prompt fixture: LBM 50 kg → BMR 1450 kcal/day
{
  const bmr = katchMcardleBmrKcalPerDay(50);
  assert(bmr === 370 + 21.6 * 50, `coeffs ${bmr}`);
  assert(bmr === 1450, `LBM 50 → 1450 got ${bmr}`);
  const r = calculateKatchMcardle({
    ...createDefaultInput(),
    lbmMode: 'known_lbm',
    leanMassText: '50',
    leanMassUnit: 'kg',
  });
  assert(r.bmrKcalPerDay === 1450, 'known LBM wire');
  assert(r.bmrDisplay === formatBmrKcal(1450), 'display');
  assert(r.lbmKg === 50, 'lbm pass-through');
}

// Body-fat path: 80 kg @ 25% → LBM 60 → BMR 1666
{
  const lbm = leanMassFromBodyFatKg(80, 25);
  assert(lbm === 60, `fat LBM ${lbm}`);
  const expected = 370 + 21.6 * 60;
  assert(expected === 1666, `expected ${expected}`);
  const r = calculateKatchMcardle({
    ...createDefaultInput(),
    lbmMode: 'body_fat',
    weightText: '80',
    weightUnit: 'kg',
    bodyFatText: '25',
  });
  assert(r.lbmKg === 60, 'body-fat lbm');
  assert(r.bmrKcalPerDay === 1666, 'body-fat bmr');
}

// Boer unknown path: male 70 kg / 175 cm
{
  const expectedLbm = 0.407 * 70 + 0.267 * 175 - 19.2;
  const lbm = boerLeanBodyMassKg('male', 70, 175);
  assert(Math.abs(lbm - expectedLbm) < 1e-12, `boer male ${lbm}`);
  const expectedBmr = 370 + 21.6 * expectedLbm;
  const r = calculateKatchMcardle({
    ...createDefaultInput(),
    lbmMode: 'unknown',
    sex: 'male',
    weightText: '70',
    heightText: '175',
  });
  assert(r.lbmKg != null, 'boer result');
  assert(Math.abs((r.lbmKg ?? 0) - expectedLbm) < 1e-9, 'boer lbm wire');
  assert(Math.abs((r.bmrKcalPerDay ?? 0) - expectedBmr) < 1e-9, 'boer bmr');
}

// Boer female independent case: 60 kg / 165 cm
{
  const expectedLbm = 0.252 * 60 + 0.473 * 165 - 48.3;
  const lbm = boerLeanBodyMassKg('female', 60, 165);
  assert(Math.abs(lbm - expectedLbm) < 1e-12, `boer female ${lbm}`);
  const r = calculateKatchMcardle({
    ...createDefaultInput(),
    lbmMode: 'unknown',
    sex: 'female',
    weightText: '60',
    heightText: '165',
  });
  assert(Math.abs((r.lbmKg ?? 0) - expectedLbm) < 1e-9, 'female boer wire');
}

// Unit conversion parity (known LBM lb ↔ kg)
{
  const rKg = calculateKatchMcardle({
    ...createDefaultInput(),
    lbmMode: 'known_lbm',
    leanMassText: '50',
    leanMassUnit: 'kg',
  });
  const rLb = calculateKatchMcardle({
    ...createDefaultInput(),
    lbmMode: 'known_lbm',
    leanMassText: String(50 / 0.45359237),
    leanMassUnit: 'lb',
  });
  assert(rKg.bmrKcalPerDay != null && rLb.bmrKcalPerDay != null, 'unit results');
  assert(
    Math.abs((rKg.bmrKcalPerDay ?? 0) - (rLb.bmrKcalPerDay ?? 0)) < 0.05,
    'LBM unit switch parity',
  );
  assert(Math.abs(heightToCm(70, 'in') - 177.8) < 0.01, 'in→cm');
  assert(Math.abs(weightToKg(154.3235835, 'lb') - 70) < 0.01, 'lb→kg');
}

// Invalid / blank
{
  const blank = validateKatchMcardleInput(createDefaultInput());
  assert(blank.result != null && blank.result.bmrKcalPerDay == null, 'blank');

  const badFat = validateKatchMcardleInput({
    ...createDefaultInput(),
    lbmMode: 'body_fat',
    weightText: '80',
    bodyFatText: '100',
  });
  assert(badFat.errors.bodyFatText, 'fat range');

  const neg = calculateKatchMcardle({
    ...createDefaultInput(),
    lbmMode: 'known_lbm',
    leanMassText: '-1',
  });
  assert(neg.bmrKcalPerDay == null, 'negative LBM');
}

console.log('katch-mcardle calculation.test.ts: ok');
