import assert from 'node:assert/strict';
import {
  calculateCubicYardsToTons,
  cubicMetersToVolume,
  densityToKgPerM3,
  kilogramsToMass,
  massToKilograms,
  volumeToCubicMeters,
} from './calculation';
import {
  CUBIC_FEET_PER_CUBIC_YARD,
  CUBIC_METERS_PER_CUBIC_FOOT,
  CUBIC_METERS_PER_CUBIC_YARD,
  DEFAULT_CUBIC_YARDS_TO_TONS_INPUT,
  KILOGRAMS_PER_IMPERIAL_LONG_TON,
  KILOGRAMS_PER_METRIC_TONNE,
  KILOGRAMS_PER_US_SHORT_TON,
  type CubicYardsToTonsInput,
} from './types';
import { validateCubicYardsToTons } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-10): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

function base(overrides: Partial<CubicYardsToTonsInput> = {}): CubicYardsToTonsInput {
  return { ...DEFAULT_CUBIC_YARDS_TO_TONS_INPUT, ...overrides };
}

{
  assertClose(CUBIC_METERS_PER_CUBIC_YARD, 0.764554857984);
  assertClose(CUBIC_METERS_PER_CUBIC_FOOT, 0.028316846592);
  assert.equal(CUBIC_FEET_PER_CUBIC_YARD, 27);
  assertClose(volumeToCubicMeters(1, 'yd3'), 0.764554857984);
  assertClose(volumeToCubicMeters(1, 'yd3') / CUBIC_METERS_PER_CUBIC_FOOT, 27);
}

{
  assertClose(KILOGRAMS_PER_METRIC_TONNE, 1000);
  assertClose(KILOGRAMS_PER_US_SHORT_TON, 907.18474);
  assertClose(KILOGRAMS_PER_IMPERIAL_LONG_TON, 1016.0469088);
}

{
  assertClose(densityToKgPerM3(1, 'gPerCm3'), 1000);
  assertClose(densityToKgPerM3(1, 'gPerMl'), 1000);
  assertClose(densityToKgPerM3(1, 'kgPerL'), 1000);
}

{
  const r = calculateCubicYardsToTons(base({ volume: 1, densityValue: 1000 }));
  assertClose(r.massKg, 764.554857984);
  assertClose(r.mass, 0.764554857984);
  assertClose(kilogramsToMass(r.massKg, 'usTon'), 764.554857984 / 907.18474);
  assertClose(kilogramsToMass(r.massKg, 'longTon'), 764.554857984 / 1016.0469088);
}

{
  const cases: readonly [number, number][] = [
    [0, 0],
    [0.5, 0.382277428992],
    [1, 0.764554857984],
    [2, 1.529109715968],
    [3, 2.293664573952],
    [5, 3.82277428992],
    [10, 7.64554857984],
    [20, 15.29109715968],
    [50, 38.2277428992],
    [100, 76.4554857984],
  ];
  for (const [yd3, tonnes] of cases) {
    const r = calculateCubicYardsToTons(
      base({ source: 'volume', volume: yd3, densityValue: 1000, massUnit: 't' })
    );
    assertClose(r.mass, tonnes);
  }
}

{
  const r1 = calculateCubicYardsToTons(
    base({ volume: 1, densityValue: 1600, massUnit: 't' })
  );
  assertClose(r1.mass, 1.2232877727744);
  const r5 = calculateCubicYardsToTons(
    base({ volume: 5, densityValue: 1600, massUnit: 't' })
  );
  assertClose(r5.mass, 6.116438863872);
  const r10 = calculateCubicYardsToTons(
    base({ volume: 10, densityValue: 1600, massUnit: 't' })
  );
  assertClose(r10.mass, 12.232877727744);
}

{
  // Reverse: 1000 kg @ 1000 kg/m³ → 1 m³ → ≈ 1.30795 yd³
  const r = calculateCubicYardsToTons(
    base({
      source: 'mass',
      mass: 1000,
      massUnit: 'kg',
      densityValue: 1000,
      volume: null,
      volumeUnit: 'yd3',
    })
  );
  assertClose(r.volumeCubicMeters, 1);
  assertClose(r.volume, 1 / CUBIC_METERS_PER_CUBIC_YARD);
}

{
  const r = calculateCubicYardsToTons(
    base({
      source: 'mass',
      mass: 5,
      massUnit: 't',
      densityValue: 1000,
      volumeUnit: 'yd3',
    })
  );
  assertClose(r.volumeCubicMeters, 5);
  assertClose(r.volume, 5 / CUBIC_METERS_PER_CUBIC_YARD);
}

{
  const ok = validateCubicYardsToTons(DEFAULT_CUBIC_YARDS_TO_TONS_INPUT);
  assert.equal(ok.isValid, true);

  const noDensity = validateCubicYardsToTons(base({ densityValue: null }));
  assert.equal(noDensity.isValid, false);

  const zeroDensity = validateCubicYardsToTons(base({ densityValue: 0 }));
  assert.equal(zeroDensity.isValid, false);

  const negVol = validateCubicYardsToTons(base({ volume: -1 }));
  assert.equal(negVol.isValid, false);

  const blank = validateCubicYardsToTons(base({ volume: null }));
  assert.equal(blank.isValid, false);
}

{
  // Unit round-trip: 1 yd³ → ft³ → yd³
  const m3 = volumeToCubicMeters(1, 'yd3');
  const ft3 = cubicMetersToVolume(m3, 'ft3');
  assertClose(ft3, 27);
  assertClose(cubicMetersToVolume(volumeToCubicMeters(ft3, 'ft3'), 'yd3'), 1);

  // Mass unit round-trip
  assertClose(kilogramsToMass(massToKilograms(1, 'usTon'), 'usTon'), 1);
  assertClose(kilogramsToMass(massToKilograms(1, 'longTon'), 'longTon'), 1);
  assertClose(kilogramsToMass(massToKilograms(1, 't'), 't'), 1);
}

{
  const def = calculateCubicYardsToTons(DEFAULT_CUBIC_YARDS_TO_TONS_INPUT);
  assertClose(def.mass, 0.764554857984);
  assert.equal(def.materialName, 'Water');
  assert.ok(def.otherVolumeUnits.some((row) => row.unit === 'ft³'));
  assert.ok(def.otherMassUnits.some((row) => row.unit === 'US ton'));
}

console.log('cubic-yards-to-tons calculation.test.ts: ok');
