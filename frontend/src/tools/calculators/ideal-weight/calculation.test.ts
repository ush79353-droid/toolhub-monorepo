/**
 * Run: cd frontend && npx tsx src/tools/calculators/ideal-weight/calculation.test.ts
 */
import {
  calculateIdealWeight,
  ibwKg,
  inchesOverFiveFeet,
  metersToInches,
  heightToMeters,
} from './calculation';
import { createDefaultInput } from './types';
import { validateIdealWeightInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

const femaleDevine = {
  id: 'devine' as const,
  label: 'Devine',
  maleBase: 50,
  malePerInch: 2.3,
  femaleBase: 45.5,
  femalePerInch: 2.3,
};

{
  // Female 167 cm → Devine ≈ 58.73 kg (matches tidal-volume fixture)
  const inches = metersToInches(heightToMeters(167, 'cm'));
  const delta = inchesOverFiveFeet(inches);
  const kg = ibwKg(femaleDevine, 'female', delta);
  // 167 cm → 167/2.54 in; Devine ♀ 45.5 + 2.3×(in−60) ≈ 58.7205 kg
  assert(Math.abs(kg - 58.72047244094488) < 1e-9, `devine ${kg}`);

  const r = calculateIdealWeight({
    sex: 'female',
    heightText: '167',
    heightUnit: 'cm',
    weightText: '',
    weightUnit: 'kg',
  });
  const d = r.estimates.find((e) => e.id === 'devine');
  assert(d != null && Math.abs(d.kg - kg) < 1e-12, 'wired');
  assert(r.estimates.length === 4, 'four formulas');
}

{
  // Current weight does not change IBW kg
  const a = calculateIdealWeight({
    sex: 'male',
    heightText: '180',
    heightUnit: 'cm',
    weightText: '',
    weightUnit: 'kg',
  });
  const b = calculateIdealWeight({
    sex: 'male',
    heightText: '180',
    heightUnit: 'cm',
    weightText: '120',
    weightUnit: 'kg',
  });
  assert(
    a.estimates.every(
      (e, i) => Math.abs(e.kg - b.estimates[i]!.kg) < 1e-12,
    ),
    'weight invariant',
  );
  assert(b.estimates[0]!.formattedDisplay.includes('vs current'), 'compare');
}

{
  // Below 5 ft still computes with flag
  const r = calculateIdealWeight({
    sex: 'female',
    heightText: '140',
    heightUnit: 'cm',
    weightText: '',
    weightUnit: 'kg',
  });
  assert(r.belowFiveFeet, 'below');
  assert(r.estimates.length === 4, 'extrapolated');
}

{
  const v = validateIdealWeightInput(createDefaultInput());
  assert(v.result != null && v.result.estimates.length === 0, 'blank');
}

console.log('ideal-weight calculation.test.ts: ok');
