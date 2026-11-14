import assert from 'node:assert/strict';
import {
  calculateMeshToMicron,
  customOpeningUm,
  equivalentsFromUm,
  formatLength,
  lookupSieve,
  nearestSieve,
  pitchMm,
} from './calculation';
import { ASTM_E11_SIEVES, DEFAULT_MESH_TO_MICRON_INPUT } from './types';
import { validateMeshToMicron } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(Math.abs(actual - expected) < eps, `expected ${expected}, got ${actual}`);
}

const expected: Record<string, number> = {
  '4': 4750,
  '6': 3350,
  '8': 2360,
  '10': 2000,
  '20': 850,
  '40': 425,
  '60': 250,
  '100': 150,
  '200': 75,
  '325': 45,
  '400': 38,
};

for (const [des, um] of Object.entries(expected)) {
  assert.equal(lookupSieve(des)?.openingUm, um);
}

assert.equal(ASTM_E11_SIEVES.length, 29);

{
  const result = calculateMeshToMicron(DEFAULT_MESH_TO_MICRON_INPUT);
  assert.equal(result.mode, 'standard');
  assert.equal(result.sieveLabel, 'No. 100');
  assert.equal(result.openingUm, 150);
  assertClose(result.equivalents.mm, 0.15);
}

assertClose(pitchMm(100), 0.254);
assertClose(customOpeningUm(100, 0.1), 154);
assertClose(customOpeningUm(50, 0.2), 308);
assertClose(customOpeningUm(200, 0.05), 77);

{
  const result = calculateMeshToMicron({
    mode: 'custom',
    sieveDesignation: '100',
    meshCount: 100,
    wireDiameter: 0.1,
    wireUnit: 'mm',
    reverseUm: null,
  });
  assertClose(result.openingUm, 154);
  assertClose(result.pitchMm!, 0.254);
}

{
  const exact = nearestSieve(150);
  assert.equal(exact.exact, true);
  assert.equal(exact.sieve.designation, '100');
  assert.equal(exact.differenceUm, 0);

  const exact200 = nearestSieve(75);
  assert.equal(exact200.exact, true);
  assert.equal(exact200.sieve.designation, '200');

  const approx = nearestSieve(160);
  assert.equal(approx.exact, false);
  assert.equal(approx.sieve.designation, '100');
  assertClose(approx.differenceUm, 10);
}

{
  const eq = equivalentsFromUm(150);
  assertClose(eq.mm, 0.15);
  assertClose(eq.cm, 0.015);
  assertClose(eq.in, 150 / 25400);
  assertClose(eq.mil, 150 / 25.4);
}

{
  assert.equal(
    validateMeshToMicron(DEFAULT_MESH_TO_MICRON_INPUT).isValid,
    true
  );
  const badMesh = validateMeshToMicron({
    mode: 'custom',
    sieveDesignation: '100',
    meshCount: 0,
    wireDiameter: 0.1,
    wireUnit: 'mm',
    reverseUm: null,
  });
  assert.equal(badMesh.isValid, false);
  assert.match(badMesh.errors.meshCount ?? '', /greater than zero/i);

  const fatWire = validateMeshToMicron({
    mode: 'custom',
    sieveDesignation: '100',
    meshCount: 100,
    wireDiameter: 1,
    wireUnit: 'mm',
    reverseUm: null,
  });
  assert.equal(fatWire.isValid, false);
  assert.match(fatWire.errors.wireDiameter ?? '', /pitch/i);

  const neg = validateMeshToMicron({
    mode: 'reverse',
    sieveDesignation: '100',
    meshCount: null,
    wireDiameter: null,
    wireUnit: 'mm',
    reverseUm: -1,
  });
  assert.equal(neg.isValid, false);
}

assert.equal(formatLength(0), '0');
assert.equal(formatLength(150), '150');

console.log('mesh-to-micron calculation.test.ts: ok');
