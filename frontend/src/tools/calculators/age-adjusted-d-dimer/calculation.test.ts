/**
 * Run: cd frontend && npx tsx src/tools/calculators/age-adjusted-d-dimer/calculation.test.ts
 */
import {
  ageAdjustedCutoffMicrogPerLiter,
  calculateAgeAdjustedDDimer,
  microgPerLiterToMicrogPerMilliliter,
} from './calculation';
import { createDefaultInput } from './types';
import { validateAgeAdjustedDDimerInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const cut = ageAdjustedCutoffMicrogPerLiter(60, 'FEU');
  assert(cut === 600, `60 FEU ${cut}`);
  const ml = microgPerLiterToMicrogPerMilliliter(cut);
  assert(ml === 0.6, `0.6 µg/mL ${ml}`);
}

{
  assert(ageAdjustedCutoffMicrogPerLiter(40, 'FEU') === 500, 'young FEU');
  assert(ageAdjustedCutoffMicrogPerLiter(60, 'DDU') === 300, '60 DDU');
  assert(ageAdjustedCutoffMicrogPerLiter(40, 'DDU') === 250, 'young DDU');
}

{
  const r = calculateAgeAdjustedDDimer({ ageYearsText: '60', assayUnit: 'FEU' });
  assert(r.cutoffMicrogPerLiter === 600, 'calc 600');
  assert(r.cutoffMicrogPerMilliliter === 0.6, 'calc 0.6 ml');
}

{
  const v = validateAgeAdjustedDDimerInput(createDefaultInput());
  assert(v.result != null && v.result.cutoffMicrogPerLiter == null, 'blank age');
}

{
  const v = validateAgeAdjustedDDimerInput({ ageYearsText: '150', assayUnit: 'FEU' });
  assert(v.errors.ageYearsText != null, 'age too high');
}

{
  let threw = false;
  try {
    ageAdjustedCutoffMicrogPerLiter(-1, 'FEU');
  } catch {
    threw = true;
  }
  assert(threw, 'negative age throws');
}

console.log('age-adjusted-d-dimer calculation.test.ts: ok');