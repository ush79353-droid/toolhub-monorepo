import assert from 'node:assert/strict';
import {
  calculateMgToCc,
  massToVolumeCc,
  normalizeConcentration,
  normalizeDensity,
  resolveFactorMgPerMl,
  shareResultText,
  volumeToMassMg,
} from './calculation';
import { EMPTY_MG_TO_CC_INPUT, WATER_DENSITY_MG_PER_ML, type MgToCcInput } from './types';
import { validateMgToCc } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-12): void {
  assert.ok(Math.abs(actual - expected) <= eps, `expected ${expected}, got ${actual}`);
}

function base(overrides: Partial<MgToCcInput>): MgToCcInput {
  return {
    ...EMPTY_MG_TO_CC_INPUT,
    mode: 'medication',
    source: 'mass',
    concentrationValue: 50,
    concentrationUnit: 'mgPerMl',
    massMg: 200,
    ...overrides,
  };
}

assert.equal(massToVolumeCc(200, 50), 4);
assert.equal(massToVolumeCc(100, 20), 5);
assert.equal(massToVolumeCc(0, 50), 0);
assert.equal(volumeToMassMg(4, 50), 200);
assert.equal(volumeToMassMg(10, 20), 200);

assert.equal(normalizeConcentration(100, 'mgPer5Ml'), 20);
assert.equal(normalizeConcentration(50, 'mgPerMl'), 50);
assert.equal(normalizeConcentration(50, 'mgPerCc'), 50);
assert.equal(normalizeDensity(1, 'gPerMl'), 1000);
assert.equal(normalizeDensity(1000, 'kgPerM3'), 1000);
assert.equal(normalizeDensity(1, 'kgPerL'), 1000);

{
  const r = calculateMgToCc(base({ massMg: 200, concentrationValue: 50 }));
  assert.equal(r.volumeCc, 4);
  assert.equal(r.volumeMl, 4);
  assert.match(shareResultText(r), /mg to cc Conversion/);
}

{
  const r = calculateMgToCc(
    base({
      concentrationUnit: 'mgPer5Ml',
      concentrationValue: 100,
      massMg: 200,
    }),
  );
  assertClose(r.factorMgPerMl, 20);
  assert.equal(r.volumeCc, 10);
}

{
  const r = calculateMgToCc(
    base({
      mode: 'substance',
      substance: 'water',
      source: 'mass',
      massMg: 5000,
      concentrationValue: null,
    }),
  );
  assert.equal(r.volumeCc, 5);
  assertClose(r.factorMgPerMl, WATER_DENSITY_MG_PER_ML);
}

{
  const r = calculateMgToCc(
    base({
      mode: 'substance',
      substance: 'custom',
      densityValue: 0.92,
      densityUnit: 'gPerMl',
      source: 'mass',
      massMg: 920,
      concentrationValue: null,
    }),
  );
  assertClose(r.volumeCc, 1);
}

assert.throws(() => massToVolumeCc(-1, 50));
assert.throws(() => massToVolumeCc(10, 0));
assert.throws(() => volumeToMassMg(-1, 50));
assert.throws(() => normalizeConcentration(0, 'mgPerMl'));
assert.throws(() => normalizeDensity(-1, 'gPerMl'));

assert.ok(validateMgToCc(base({ massMg: 0 })).isValid);
assert.ok(!validateMgToCc(base({ massMg: -5 })).isValid);
assert.ok(!validateMgToCc(base({ concentrationValue: 0 })).isValid);
assert.ok(
  !validateMgToCc(
    base({
      mode: 'substance',
      substance: 'custom',
      densityValue: 0,
      concentrationValue: null,
    }),
  ).isValid,
);
assert.ok(
  !validateMgToCc(base({ concentrationValue: null, massMg: 100 })).isValid,
);
assert.equal(
  resolveFactorMgPerMl(base({ mode: 'medication', concentrationValue: null })),
  null,
);

console.log('mg-to-cc calculation.test.ts: ok');
