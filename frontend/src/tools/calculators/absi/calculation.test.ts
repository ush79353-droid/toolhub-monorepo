/**
 * Run: cd frontend && npx tsx src/tools/calculators/absi/calculation.test.ts
 */
import {
  calculateAbsi,
  calculateAbsiIndex,
  calculateAbsiZScore,
  heightToMeters,
  lookupAbsiReference,
  waistToMeters,
  weightToKg,
} from './calculation';
import { createDefaultInput } from './types';
import { validateAbsiInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  // Female 30y · 170 cm · 65 kg · waist 80 cm
  const h = heightToMeters(170, 'cm');
  const w = weightToKg(65, 'kg');
  const waist = waistToMeters(80, 'cm');
  const absi = calculateAbsiIndex(waist, h, w);
  // Independent: BMI=65/1.7²; ABSI=0.8/(BMI^(2/3)·√1.7) ≈ 0.0770055
  assert(Math.abs(absi - 0.07700551866729807) < 1e-12, `absi ${absi}`);

  const ref = lookupAbsiReference(30, 'female');
  assert(ref != null, 'ref');
  assert(Math.abs(ref.mean - 0.07743) < 1e-9, `mean ${ref.mean}`);
  assert(Math.abs(ref.sd - 0.0044) < 1e-9, `sd ${ref.sd}`);

  const z = calculateAbsiZScore(absi, ref);
  assert(Math.abs(z - (absi - ref.mean) / ref.sd) < 1e-12, `z ${z}`);

  const r = calculateAbsi({
    sex: 'female',
    ageText: '30',
    heightText: '170',
    heightUnit: 'cm',
    weightText: '65',
    weightUnit: 'kg',
    waistText: '80',
    waistUnit: 'cm',
  });
  assert(r.absi != null && Math.abs(r.absi - absi) < 1e-12, 'wired absi');
  assert(r.absiZScore != null, 'z present');
  assert(r.formattedAbsi.length > 0, 'fmt absi');
  assert(r.formattedZScore.length > 0, 'fmt z');
}

{
  // Reference mean → z ≈ 0
  const ref = lookupAbsiReference(40, 'male');
  assert(ref != null, 'male40');
  const z0 = calculateAbsiZScore(ref.mean, ref);
  assert(Math.abs(z0) < 1e-12, `z0 ${z0}`);
}

{
  // Unit conversion parity: 170 cm = 1.7 m; 80 cm = 0.8 m; 65 kg = 143.3005… lb
  const a = calculateAbsiIndex(
    waistToMeters(80, 'cm'),
    heightToMeters(170, 'cm'),
    weightToKg(65, 'kg'),
  );
  const b = calculateAbsiIndex(
    waistToMeters(0.8, 'm'),
    heightToMeters(1.7, 'm'),
    weightToKg(65 / 0.45359237, 'lb'),
  );
  assert(Math.abs(a - b) < 1e-10, `unit parity ${a} vs ${b}`);
}

{
  // Raw ABSI without age; no z-score
  const r = calculateAbsi({
    sex: 'female',
    ageText: '',
    heightText: '170',
    heightUnit: 'cm',
    weightText: '65',
    weightUnit: 'kg',
    waistText: '80',
    waistUnit: 'cm',
  });
  assert(r.absi != null, 'absi without age');
  assert(r.absiZScore == null, 'no z without age');
}

{
  const v = validateAbsiInput(createDefaultInput());
  assert(v.result != null && v.result.absi == null, 'blank');
}

{
  const v = validateAbsiInput({
    ...createDefaultInput(),
    heightText: '-1',
  });
  assert(v.errors.heightText, 'neg height');
  assert(v.result == null, 'no result on error');
}

{
  // Age ≥85 uses age-85 row
  const a = lookupAbsiReference(90, 'female');
  const b = lookupAbsiReference(85, 'female');
  assert(a != null && b != null, '85+');
  assert(a.mean === b.mean && a.sd === b.sd, '85+ same row');
}

console.log('absi calculation.test.ts: ok');
