/**
 * Run: npx tsx src/tools/calculators/bee-calculator/calculation.test.ts
 */
import {
  revisedHarrisBenedictBeeKcalPerDay,
  teeKcalFromBee,
  ACTIVITY_FACTORS,
  STRESS_FACTORS,
  TEMPERATURE_FACTORS,
  calculateBeeCalculator,
} from './calculation';
import { createDefaultInput } from './types';
import { validateBeeCalculatorInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Neutral multipliers leave TEE = BEE
{
  const bee = revisedHarrisBenedictBeeKcalPerDay('male', 30, 180, 80);
  const tee = teeKcalFromBee(bee, 'light_sedentary', 'none', 'normal');
  assert(Math.abs(tee - bee * 1.2) < 0.01, 'tee activity');
  const beeOnly = teeKcalFromBee(bee, 'bed_rest', 'none', 'normal');
  assert(Math.abs(beeOnly - bee) < 0.001, 'neutral factors');
}

// Male independent case: 30y, 180cm, 80kg
{
  const bee = revisedHarrisBenedictBeeKcalPerDay('male', 30, 180, 80);
  const expected = 88.362 + 13.397 * 80 + 4.799 * 180 - 5.677 * 30;
  assert(Math.abs(bee - expected) < 0.01, `male bee ${bee} vs ${expected}`);
}

// Female independent case: 25y, 165cm, 60kg
{
  const bee = revisedHarrisBenedictBeeKcalPerDay('female', 25, 165, 60);
  const expected = 447.593 + 9.247 * 60 + 3.098 * 165 - 4.330 * 25;
  assert(Math.abs(bee - expected) < 0.01, `female bee ${bee} vs ${expected}`);
}

{
  assert(ACTIVITY_FACTORS.light_sedentary === 1.2, 'activity');
  assert(STRESS_FACTORS.none === 1.0, 'stress none');
  assert(TEMPERATURE_FACTORS.normal === 1.0, 'temp none');
}

{
  const r = calculateBeeCalculator({
    ...createDefaultInput(),
    sex: 'female',
    ageYearsText: '25',
    heightText: '165',
    weightText: '60',
    activity: 'bed_rest',
    stress: 'none',
    temperature: 'normal',
  });
  assert(r.beeKcalPerDay != null && r.teeKcalPerDay != null, 'full calc');
  assert(
    Math.abs((r.beeKcalPerDay ?? 0) - (r.teeKcalPerDay ?? 0)) < 0.01,
    'tee equals bee at neutral',
  );
}

{
  const r1 = calculateBeeCalculator({
    ...createDefaultInput(),
    ageYearsText: '30',
    heightText: '70',
    heightUnit: 'in',
    weightText: '176',
    weightUnit: 'lb',
  });
  const r2 = calculateBeeCalculator({
    ...createDefaultInput(),
    ageYearsText: '30',
    heightText: '177.8',
    heightUnit: 'cm',
    weightText: '79.83',
    weightUnit: 'kg',
  });
  assert(
    Math.abs((r1.beeKcalPerDay ?? 0) - (r2.beeKcalPerDay ?? 0)) < 2,
    'unit switch',
  );
}

{
  const v = validateBeeCalculatorInput(createDefaultInput());
  assert(v.result != null && v.result.beeKcalPerDay == null, 'blank');
}

console.log('bee-calculator calculation.test.ts: ok');