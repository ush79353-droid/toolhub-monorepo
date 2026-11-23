/**
 * LV Calculator — assert-based engine check.
 * Run: npx tsx src/tools/calculators/lv/calculation.test.ts
 */
import {
  aseLvMassG,
  calculateLv,
  mostellerBsaM2,
  relativeWallThickness,
  toCm,
} from './calculation';
import { validateLvInput } from './validation';
import { createExampleInput } from './types';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(toCm(45, 'mm') === 4.5, '45 mm → 4.5 cm');
assert(Math.abs(mostellerBsaM2(170, 70) - Math.sqrt((170 * 70) / 3600)) < 1e-12, 'Mosteller');

{
  // LVEDD 4.5, IVSd 0.9, PWd 0.9 cm
  const mass = aseLvMassG(4.5, 0.9, 0.9);
  const expected =
    0.8 * 1.04 * (Math.pow(4.5 + 0.9 + 0.9, 3) - Math.pow(4.5, 3)) + 0.6;
  assert(Math.abs(mass - expected) < 1e-9, 'ASE mass');
  assert(Math.abs(relativeWallThickness(0.9, 4.5) - 0.4) < 1e-12, 'RWT 0.4');
}

{
  const r = calculateLv({
    sex: 'female',
    bsaM2: 1.7,
    lveddCm: 4.5,
    ivsdCm: 0.9,
    pwdCm: 0.9,
  });
  assert(r.lvMassG > 0 && r.lvmiGPerM2 > 0, 'positive outputs');
  assert(r.rwt === 0.4, `RWT ${r.rwt}`);
}

{
  const v = validateLvInput(createExampleInput());
  assert(v.isValid && v.result, 'example ok');
  const mm = v.result!.lvMassG;
  const cmInput = {
    ...createExampleInput(),
    dimensionUnit: 'cm' as const,
    lvedd: '4.5',
    ivsd: '0.9',
    pwd: '0.9',
  };
  const v2 = validateLvInput(cmInput);
  assert(v2.isValid && v2.result!.lvMassG === mm, 'mm/cm equivalence');
}

{
  const v = validateLvInput({
    ...createExampleInput(),
    knowBsa: 'no',
    bsaM2: '',
    heightCm: '170',
    weightKg: '70',
  });
  assert(v.isValid && v.result, 'Mosteller path');
}

console.log('lv calculation.test.ts: ok');
