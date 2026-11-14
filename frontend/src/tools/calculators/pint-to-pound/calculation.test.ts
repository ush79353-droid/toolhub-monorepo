import assert from 'node:assert/strict';
import {
  calculatePintToPound,
  densityToGPerMl,
  gPerMlToDensity,
  gramsToMass,
  massToGrams,
  mlToVolume,
  volumeToMl,
} from './calculation';
import {
  DEFAULT_PINT_TO_POUND_INPUT,
  GRAMS_PER_POUND,
  ML_PER_CUBIC_FOOT,
  ML_PER_IMPERIAL_PINT,
  ML_PER_US_DRY_PINT,
  ML_PER_US_LIQUID_PINT,
  type PintToPoundInput,
} from './types';
import { validatePintToPound } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-8): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

function base(overrides: Partial<PintToPoundInput> = {}): PintToPoundInput {
  return { ...DEFAULT_PINT_TO_POUND_INPUT, ...overrides };
}

{
  assertClose(ML_PER_US_LIQUID_PINT, 473.176473);
  assertClose(ML_PER_IMPERIAL_PINT, 568.26125);
  assertClose(ML_PER_US_DRY_PINT, 550.6104713575);
  assertClose(GRAMS_PER_POUND, 453.59237);
  assertClose(volumeToMl(1, 'usLiquidPt'), 473.176473);
  assertClose(volumeToMl(1, 'imperialPt'), 568.26125);
  assertClose(volumeToMl(1, 'usDryPt'), 550.6104713575);
}

{
  assertClose(densityToGPerMl(1, 'gPerMl'), 1);
  assertClose(densityToGPerMl(1, 'kgPerL'), 1);
  assertClose(densityToGPerMl(1, 'gPerCm3'), 1);
  assertClose(densityToGPerMl(1000, 'kgPerM3'), 1);
  assertClose(densityToGPerMl(1, 'lbPerUsLiquidPt'), GRAMS_PER_POUND / ML_PER_US_LIQUID_PINT);
  assertClose(densityToGPerMl(1, 'lbPerFt3'), GRAMS_PER_POUND / ML_PER_CUBIC_FOOT);
  assertClose(gPerMlToDensity(1, 'kgPerM3'), 1000);
}

{
  const cases: readonly [number, number][] = [
    [0, 0],
    [0.5, 0.5 * ML_PER_US_LIQUID_PINT / GRAMS_PER_POUND],
    [1, ML_PER_US_LIQUID_PINT / GRAMS_PER_POUND],
    [2, 2 * ML_PER_US_LIQUID_PINT / GRAMS_PER_POUND],
    [3, 3 * ML_PER_US_LIQUID_PINT / GRAMS_PER_POUND],
    [4, 4 * ML_PER_US_LIQUID_PINT / GRAMS_PER_POUND],
  ];
  for (const [pt, lb] of cases) {
    const r = calculatePintToPound(
      base({ source: 'volume', volume: pt, densityValue: 1, massUnit: 'lb' })
    );
    assertClose(r.mass, lb, 1e-6);
  }
  assertClose(
    calculatePintToPound(base({ volume: 1, densityValue: 1 })).mass,
    1.043175556,
    1e-6
  );
  assertClose(
    calculatePintToPound(base({ volume: 2, densityValue: 1 })).mass,
    2.086351112,
    1e-6
  );
}

{
  const r = calculatePintToPound(
    base({ source: 'volume', volume: 2, densityValue: 0.8, massUnit: 'lb' })
  );
  assertClose(r.volumeMl, 946.352946);
  assertClose(r.massG, 757.0823568);
  assertClose(r.mass, 1.66908089, 1e-6);
}

{
  const r = calculatePintToPound(
    base({
      source: 'mass',
      mass: 1,
      massUnit: 'lb',
      densityValue: 1,
      volume: null,
      volumeUnit: 'usLiquidPt',
    })
  );
  assertClose(r.massG, 453.59237);
  assertClose(r.volumeMl, 453.59237);
  assertClose(r.volume, 453.59237 / ML_PER_US_LIQUID_PINT, 1e-8);
  assertClose(r.volume, 0.9586114185, 1e-6);
}

{
  const r = calculatePintToPound(
    base({
      source: 'mass',
      mass: 2,
      massUnit: 'lb',
      densityValue: 1,
      volumeUnit: 'usLiquidPt',
    })
  );
  assertClose(r.volume, 1.917222837, 1e-6);
}

{
  const imperial = calculatePintToPound(
    base({
      source: 'volume',
      volume: 1,
      volumeUnit: 'imperialPt',
      pintStandard: 'imperial',
      densityValue: 1,
    })
  );
  assertClose(imperial.mass, ML_PER_IMPERIAL_PINT / GRAMS_PER_POUND, 1e-8);

  const dry = calculatePintToPound(
    base({
      source: 'volume',
      volume: 1,
      volumeUnit: 'usDryPt',
      pintStandard: 'usDry',
      densityValue: 1,
    })
  );
  assertClose(dry.mass, ML_PER_US_DRY_PINT / GRAMS_PER_POUND, 1e-8);
}

{
  assertClose(massToGrams(1, 'lb'), 453.59237);
  assertClose(gramsToMass(453.59237, 'lb'), 1);
  assertClose(mlToVolume(473.176473, 'usLiquidPt'), 1);
  assertClose(volumeToMl(1, 'L'), 1000);
}

{
  const v = validatePintToPound(base({ densityValue: 0 }));
  assert.equal(v.isValid, false);
  assert.ok(v.errors.densityValue);

  const neg = validatePintToPound(base({ volume: -1 }));
  assert.equal(neg.isValid, false);
  assert.ok(neg.errors.volume);

  const blank = validatePintToPound(base({ volume: null, mass: null }));
  assert.equal(blank.isValid, false);

  const ok = validatePintToPound(base());
  assert.equal(ok.isValid, true);
}

{
  // Density change preserves volume source: 2 pt @ 1 → 2 pt @ 0.8
  const dense = calculatePintToPound(
    base({ source: 'volume', volume: 2, densityValue: 0.8 })
  );
  assertClose(dense.volume, 2);
  assertClose(dense.mass, 1.66908089, 1e-6);
}

{
  const def = calculatePintToPound(DEFAULT_PINT_TO_POUND_INPUT);
  assertClose(def.mass, ML_PER_US_LIQUID_PINT / GRAMS_PER_POUND, 1e-8);
  assert.equal(def.otherVolumeUnits.length > 0, true);
  assert.equal(def.otherMassUnits.length > 0, true);
}

console.log('pint-to-pound calculation.test.ts: ok');
