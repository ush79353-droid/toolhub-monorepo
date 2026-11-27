/**
 * Run: cd frontend && npx tsx src/tools/calculators/plasma-volume/calculation.test.ts
 */
import {
  calculatePlasmaVolume,
  plasmaFromTbvMl,
  weightOnlyTbvMl,
  nadlerTbvMl,
} from './calculation';
import { createDefaultInput } from './types';
import { validatePlasmaVolumeInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const tbv = weightOnlyTbvMl(70, 'male');
  assert(tbv === 4900, `male tbv ${tbv}`);
  const pv = plasmaFromTbvMl(tbv, 40);
  assert(Math.abs(pv - 2940) < 1e-9, `40% → 60% ${pv}`);
}

{
  const r = calculatePlasmaVolume({
    ...createDefaultInput(),
    weightText: '70',
    hematocritText: '40',
  });
  assert(r.femaleWeightOnlyMl != null && Math.abs(r.femaleWeightOnlyMl - 2730) < 1e-9, 'F');
  assert(r.maleWeightOnlyMl != null && Math.abs(r.maleWeightOnlyMl - 2940) < 1e-9, 'M');
  assert(!r.hasHeightMethods, 'no height');
}

{
  // Nadler male 1.75 m, 70 kg
  const tbvL =
    0.3669 * 1.75 ** 3 + 0.03219 * 70 + 0.6041;
  assert(Math.abs(nadlerTbvMl('male', 1.75, 70) - tbvL * 1000) < 1e-6, 'nadler');
  const r = calculatePlasmaVolume({
    ...createDefaultInput(),
    weightText: '70',
    hematocritText: '40',
    heightText: '175',
    heightUnit: 'cm',
  });
  assert(r.hasHeightMethods && r.maleNadlerMl != null, 'height methods');
  assert(Math.abs(r.maleNadlerMl! - plasmaFromTbvMl(tbvL * 1000, 40)) < 1e-6, 'nadler pv');
}

{
  const v = validatePlasmaVolumeInput(createDefaultInput());
  assert(v.result != null && v.result.femaleWeightOnlyMl == null, 'blank');
}

console.log('plasma-volume calculation.test.ts: ok');
