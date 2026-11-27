/**
 * Run: cd frontend && npx tsx src/tools/calculators/total-body-water/calculation.test.ts
 */
import {
  calculateTotalBodyWater,
  watsonTbwLiters,
} from './calculation';
import { createDefaultInput } from './types';
import { validateTotalBodyWaterInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const female = watsonTbwLiters('female', 30, 170, 65);
  const expected = -2.097 + 0.1069 * 170 + 0.2466 * 65;
  assert(Math.abs(female - expected) < 1e-12, `female ${female}`);

  const femaleAgeChange = watsonTbwLiters('female', 80, 170, 65);
  assert(
    Math.abs(femaleAgeChange - female) < 1e-12,
    'female age must not change TBW',
  );
}

{
  const male = watsonTbwLiters('male', 30, 170, 65);
  const expected = 2.447 - 0.09516 * 30 + 0.1074 * 170 + 0.3362 * 65;
  assert(Math.abs(male - expected) < 1e-12, `male ${male}`);
}

{
  const r = calculateTotalBodyWater({
    ...createDefaultInput(),
    sex: 'female',
    ageText: '30',
    heightText: '170',
    weightText: '65',
  });
  assert(r.tbwLiters != null && Math.abs(r.tbwLiters - 32.105) < 0.001, 'vol');
  assert(r.tbwKg != null && Math.abs(r.tbwKg - 32.105) < 0.001, 'mass');
  assert(
    r.percentBodyWeight != null &&
      Math.abs(r.percentBodyWeight - (100 * 32.105) / 65) < 0.05,
    'pct',
  );
  assert(r.formattedVolume === '32.11' || r.formattedVolume === '32.10', `fmtV ${r.formattedVolume}`);
}

{
  const a = calculateTotalBodyWater({
    ...createDefaultInput(),
    sex: 'female',
    ageText: '25',
    heightText: '170',
    weightText: '65',
  });
  const b = calculateTotalBodyWater({
    ...createDefaultInput(),
    sex: 'female',
    ageText: '55',
    heightText: '170',
    weightText: '65',
  });
  assert(
    a.tbwLiters != null &&
      b.tbwLiters != null &&
      Math.abs(a.tbwLiters - b.tbwLiters) < 1e-12,
    'wired female age invariant',
  );
}

{
  const r = calculateTotalBodyWater({
    ...createDefaultInput(),
    ageText: '0',
    heightText: '170',
    weightText: '65',
  });
  assert(r.tbwLiters == null, 'reject zero age');
}

{
  const v = validateTotalBodyWaterInput(createDefaultInput());
  assert(v.result != null && v.result.tbwLiters == null, 'blank');
}

console.log('total-body-water calculation.test.ts: ok');
