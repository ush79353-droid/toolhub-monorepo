/**
 * Overweight Calculator — assert-based engine check.
 * Run: npx tsx src/tools/calculators/overweight/calculation.test.ts
 */
import {
  adultPonderalIndex,
  calculateBmi,
  calculateOverweight,
  classifyWhoBmi,
} from './calculation';
import { createDefaultInput } from './types';
import { validateOverweightInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const bmi = calculateBmi(80, 1.75);
  assert(Math.abs(bmi - 80 / (1.75 * 1.75)) < 1e-9, `bmi ${bmi}`);
  assert(classifyWhoBmi(bmi).id === 'overweight', 'WHO overweight');
}

{
  const pi = adultPonderalIndex(80, 2);
  assert(pi === 10, `ponderal ${pi}`);
}

{
  const r = calculateOverweight({
    ...createDefaultInput(),
    weightText: '80',
    heightText: '1.75',
  });
  assert(r.bmi != null && Math.abs(r.bmi - 26.122448979591837) < 1e-6, 'adult bmi');
  assert(r.category?.id === 'overweight', 'adult cat');
  assert(r.percentile === null, 'no pct adult');
}

{
  const r = calculateOverweight({
    ...createDefaultInput(),
    childMode: true,
    weightText: '50',
    heightText: '1.5',
    weightUnit: 'kg',
    heightUnit: 'm',
    sex: 'male',
    ageText: '15',
  });
  assert(r.bmi != null, 'child bmi');
  assert(r.category != null, 'child category with demographics');
  assert(r.percentile != null, 'child percentile');
}

{
  const r = calculateOverweight({
    ...createDefaultInput(),
    childMode: true,
    weightText: '50',
    heightText: '1.5',
    sex: '',
    ageText: '',
  });
  assert(r.bmi != null && r.category === null, 'child missing demos');
}

{
  const v = validateOverweightInput(createDefaultInput());
  assert(v.result != null && v.result.bmi == null, 'blank');
}

console.log('overweight calculation.test.ts: ok');
