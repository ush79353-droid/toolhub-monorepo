import assert from 'node:assert/strict';
import {
  calculateMgToMl,
  concentrationFromLabel,
  densityToMgPerMl,
  formatMeasure,
  massToVolume,
  mgPerMlToDensity,
  resolveFactorMgPerMl,
  volumeToMass,
} from './calculation';
import {
  DEFAULT_MG_TO_ML_INPUT,
  WATER_DENSITY_MG_PER_ML,
  type MgToMlInput,
} from './types';
import { validateMgToMl } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-12): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

function base(overrides: Partial<MgToMlInput>): MgToMlInput {
  return { ...DEFAULT_MG_TO_ML_INPUT, ...overrides };
}

{
  // Density: 1000 mg @ 1000 mg/mL → 1 mL
  const r = calculateMgToMl(
    base({
      mode: 'density',
      substance: 'water',
      source: 'mass',
      massMg: 1000,
      volumeMl: null,
    })
  );
  assertClose(r.volumeMl, 1);
  assertClose(r.factorMgPerMl, WATER_DENSITY_MG_PER_ML);
}

{
  const r = calculateMgToMl(
    base({
      mode: 'density',
      substance: 'water',
      source: 'mass',
      massMg: 500,
    })
  );
  assertClose(r.volumeMl, 0.5);
}

{
  const r = calculateMgToMl(
    base({
      mode: 'density',
      substance: 'water',
      source: 'volume',
      massMg: null,
      volumeMl: 2,
    })
  );
  assertClose(r.massMg, 2000);
}

{
  const r = calculateMgToMl(
    base({
      mode: 'density',
      substance: 'custom',
      densityValue: 800,
      densityUnit: 'mgPerMl',
      source: 'mass',
      massMg: 800,
    })
  );
  assertClose(r.volumeMl, 1);
}

{
  // Medication examples
  const r = calculateMgToMl(
    base({
      mode: 'medication',
      concentrationFormat: 'mgPerMl',
      concentrationMgPerMl: 10,
      source: 'mass',
      massMg: 25,
    })
  );
  assertClose(r.volumeMl, 2.5);
}

{
  const r = calculateMgToMl(
    base({
      mode: 'medication',
      concentrationFormat: 'mgPerMl',
      concentrationMgPerMl: 20,
      source: 'mass',
      massMg: 100,
    })
  );
  assertClose(r.volumeMl, 5);
}

{
  const r = calculateMgToMl(
    base({
      mode: 'medication',
      concentrationFormat: 'mgPerMl',
      concentrationMgPerMl: 25,
      source: 'volume',
      massMg: null,
      volumeMl: 4,
    })
  );
  assertClose(r.massMg, 100);
}

{
  assertClose(concentrationFromLabel(100, 5), 20);
  assertClose(concentrationFromLabel(120, 5), 24);
  assertClose(concentrationFromLabel(50, 2), 25);
  assertClose(concentrationFromLabel(250, 10), 25);

  const fromLabel = calculateMgToMl(
    base({
      mode: 'medication',
      concentrationFormat: 'mgPerVolume',
      labelMassMg: 100,
      labelVolumeMl: 5,
      source: 'mass',
      massMg: 100,
    })
  );
  assertClose(fromLabel.factorMgPerMl, 20);
  assertClose(fromLabel.volumeMl, 5);
}

{
  assertClose(densityToMgPerMl(1, 'gPerMl'), 1000);
  assertClose(densityToMgPerMl(1, 'kgPerM3'), 1);
  assertClose(densityToMgPerMl(1, 'gPerCm3'), 1000);
  assertClose(mgPerMlToDensity(1000, 'gPerMl'), 1);
  assertClose(massToVolume(0.5, 10), 0.05);
  assertClose(volumeToMass(5, 20), 100);
}

{
  const r = calculateMgToMl(DEFAULT_MG_TO_ML_INPUT);
  assertClose(r.massMg, 100);
  assertClose(r.volumeMl, 5);
  assert.equal(r.mode, 'medication');
  assert.ok(r.otherMassUnits.some((row) => row.unit === 'mcg' && row.value === 100_000));
  assert.ok(r.otherVolumeUnits.some((row) => row.unit === 'µL' && row.value === 5000));
}

{
  // Missing density / concentration must not invent a volume
  const noDensity = validateMgToMl(
    base({
      mode: 'density',
      substance: 'custom',
      densityValue: null,
      source: 'mass',
      massMg: 100,
    })
  );
  assert.equal(noDensity.isValid, false);

  const noConc = validateMgToMl(
    base({
      mode: 'medication',
      concentrationFormat: 'mgPerMl',
      concentrationMgPerMl: null,
      source: 'mass',
      massMg: 100,
    })
  );
  assert.equal(noConc.isValid, false);

  const zeroDensity = validateMgToMl(
    base({
      mode: 'density',
      substance: 'custom',
      densityValue: 0,
      source: 'mass',
      massMg: 100,
    })
  );
  assert.equal(zeroDensity.isValid, false);

  const zeroConc = validateMgToMl(
    base({
      mode: 'medication',
      concentrationMgPerMl: 0,
      source: 'mass',
      massMg: 100,
    })
  );
  assert.equal(zeroConc.isValid, false);

  const neg = validateMgToMl(
    base({
      mode: 'medication',
      concentrationMgPerMl: 20,
      source: 'mass',
      massMg: -1,
    })
  );
  assert.equal(neg.isValid, false);

  assert.equal(
    resolveFactorMgPerMl(
      base({
        mode: 'density',
        substance: 'custom',
        densityValue: null,
      })
    ),
    null
  );
}

{
  assert.equal(formatMeasure(0.05), '0.05');
  assert.equal(formatMeasure(0), '0');
  const tiny = calculateMgToMl(
    base({
      mode: 'medication',
      concentrationMgPerMl: 10,
      source: 'mass',
      massMg: 0.5,
    })
  );
  assertClose(tiny.volumeMl, 0.05);
  assert.notEqual(formatMeasure(tiny.volumeMl), '0');
}

{
  // Modes stay separate: water density factor ≠ medication concentration when both set
  const dens = resolveFactorMgPerMl(
    base({
      mode: 'density',
      substance: 'water',
      concentrationMgPerMl: 20,
    })
  );
  const med = resolveFactorMgPerMl(
    base({
      mode: 'medication',
      concentrationMgPerMl: 20,
      substance: 'water',
    })
  );
  assertClose(dens!, 1000);
  assertClose(med!, 20);
}

console.log('mg-to-ml calculation.test.ts: ok');
