/**
 * Fresh Frozen Plasma Dose — assert-based engine check.
 * Run: npx tsx src/tools/calculators/fresh-frozen-plasma-dose/calculation.test.ts
 */
import {
  AABB_STANDARD_DOSE_ML_PER_KG,
  AABB_TYPICAL_UNIT_VOLUME_ML,
  calculateFreshFrozenPlasmaDose,
  equivalentUnitsFromVolume,
  totalPlasmaDoseMl,
  weightToKg,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateFreshFrozenPlasmaDoseInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

{
  assert(AABB_STANDARD_DOSE_ML_PER_KG === 15, 'AABB standard dose constant');
  assert(AABB_TYPICAL_UNIT_VOLUME_ML.min === 200, 'AABB typical unit min');
  assert(AABB_TYPICAL_UNIT_VOLUME_ML.max === 250, 'AABB typical unit max');
}

{
  assert(approx(totalPlasmaDoseMl(70, 15), 1050), '70 kg × 15 mL/kg = 1050 mL');
  assert(approx(equivalentUnitsFromVolume(1050, 200), 5.25), '1050/200 = 5.25 units');
  assert(approx(equivalentUnitsFromVolume(1050, 250), 4.2), '1050/250 = 4.2 units');
}

{
  let threw = false;
  try {
    equivalentUnitsFromVolume(1050, 0);
  } catch {
    threw = true;
  }
  assert(threw, 'zero unit volume must throw');
}

{
  let threw = false;
  try {
    equivalentUnitsFromVolume(100, -200);
  } catch {
    threw = true;
  }
  assert(threw, 'negative unit volume must throw');
}

{
  const r = calculateFreshFrozenPlasmaDose(createDefaultInput());
  assert(r.totalPlasmaDoseMl === null, 'blank weight → no total');
  assert(r.equivalentUnits === null, 'blank weight → no units');
  assert(r.statusHeadline.includes('weight'), 'prompt for weight');
}

{
  const r = calculateFreshFrozenPlasmaDose({
    ...createDefaultInput(),
    weightText: '70',
  });
  assert(approx(r.totalPlasmaDoseMl!, 1050), 'fixture total 1050');
  assert(approx(r.equivalentUnits!, 5.25), 'fixture units 5.25 fractional');
  assert(r.equivalentUnits !== Math.ceil(r.equivalentUnits!), 'not silently ceiled');
  assert(r.equivalentUnits !== Math.round(r.equivalentUnits!), 'not silently rounded');
}

{
  // Source-specific bag sizes: apheresis-scale 400–600 mL
  const r400 = calculateFreshFrozenPlasmaDose({
    weightText: '70',
    weightUnit: 'kg',
    unitVolumeText: '400',
    volumeUnit: 'mL',
    doseMlPerKgText: '15',
  });
  assert(approx(r400.equivalentUnits!, 2.625), '400 mL bag → 2.625 units');

  const r600 = calculateFreshFrozenPlasmaDose({
    weightText: '70',
    weightUnit: 'kg',
    unitVolumeText: '600',
    volumeUnit: 'mL',
    doseMlPerKgText: '15',
  });
  assert(approx(r600.equivalentUnits!, 1.75), '600 mL bag → 1.75 units');
}

{
  // Pediatric 10 mL/kg at 200 mL bag
  const r = calculateFreshFrozenPlasmaDose({
    weightText: '20',
    weightUnit: 'kg',
    unitVolumeText: '200',
    volumeUnit: 'mL',
    doseMlPerKgText: '10',
  });
  assert(approx(r.totalPlasmaDoseMl!, 200), '20×10 = 200 mL');
  assert(approx(r.equivalentUnits!, 1), 'exactly 1 unit');
}

{
  const r = calculateFreshFrozenPlasmaDose({
    weightText: '154.323584',
    weightUnit: 'lb',
    unitVolumeText: '200',
    volumeUnit: 'mL',
    doseMlPerKgText: '15',
  });
  const kg = weightToKg(154.323584, 'lb');
  assert(approx(kg, 70, 1e-4), 'lb→kg ≈ 70');
  assert(approx(r.totalPlasmaDoseMl!, kg * 15, 1e-3), 'lb weight total');
}

{
  const r = calculateFreshFrozenPlasmaDose({
    ...createDefaultInput(),
    weightText: '70',
    unitVolumeText: '0',
  });
  assert(r.totalPlasmaDoseMl === null, 'zero volume → no total shown');
  assert(r.equivalentUnits === null, 'zero volume → no units');
  assert(r.statusHeadline.toLowerCase().includes('unit volume'), 'zero volume headline');
}

{
  const v = validateFreshFrozenPlasmaDoseInput({
    ...createDefaultInput(),
    unitVolumeText: '0',
    weightText: '70',
  });
  assert(v.errors.unitVolumeText, 'validation flags zero volume');
  assert(v.result === null, 'blocking zero volume clears result');
}

{
  const v = validateFreshFrozenPlasmaDoseInput(createEmptyInput());
  assert(!v.errors.weightText, 'blank weight is allowed (empty state)');
  assert(v.result?.totalPlasmaDoseMl === null, 'empty → null total');
}

{
  const v = validateFreshFrozenPlasmaDoseInput({
    ...createDefaultInput(),
    weightText: '70',
    doseMlPerKgText: '',
  });
  assert(v.errors.doseMlPerKgText, 'missing dose flagged');
}

console.log('fresh-frozen-plasma-dose calculation.test.ts: all assertions passed');
