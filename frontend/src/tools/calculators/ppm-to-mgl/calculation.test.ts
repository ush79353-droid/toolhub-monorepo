import assert from 'node:assert/strict';
import {
  densityToKgM3,
  mgLToMolL,
  mgLToPpm,
  molLToMgL,
  ppmToMgL,
  shareResultText,
} from './calculation';
import { parsePositive, parsePpm } from './validation';

function approx(actual: number, expected: number, rel = 1e-12): void {
  const scale = Math.max(1, Math.abs(expected));
  assert.ok(
    Math.abs(actual - expected) <= rel * scale,
    `expected ${expected}, got ${actual}`,
  );
}

const ppmCases: Array<[number, number, number]> = [
  [0, 1000, 0],
  [1, 1000, 1],
  [10, 1000, 10],
  [50, 1000, 50],
  [100, 1000, 100],
  [100, 1200, 120],
  [200, 800, 160],
  [0.5, 1000, 0.5],
  [1000, 1000, 1000],
];
for (const [ppm, dens, mgL] of ppmCases) {
  approx(ppmToMgL(ppm, dens), mgL);
  approx(mgLToPpm(mgL, dens), ppm);
}

approx(mgLToPpm(250, 1250), 200);
approx(mgLToPpm(120, 1200), 100);
approx(mgLToPpm(80, 800), 100);

approx(mgLToMolL(1000, 58.44), 1000 / (1000 * 58.44), 1e-10);
approx(mgLToMolL(1000, 100), 0.01);
approx(mgLToMolL(500, 50), 0.01);
approx(mgLToMolL(0, 58.44), 0);
approx(molLToMgL(0.01, 100), 1000);

approx(densityToKgM3(1, 'kg_L'), 1000);
approx(densityToKgM3(1, 'g_mL'), 1000);
approx(densityToKgM3(1, 'g_cm3'), 1000);
approx(densityToKgM3(1000, 'g_L'), 1000);

assert.equal(parsePpm('').blank, true);
assert.equal(parsePpm('0').value, 0);
assert.ok(parsePpm('-1').error);
assert.ok(parsePpm('2000000').error);
assert.ok(parsePositive('0', 'Solution density').error);
assert.ok(parsePositive('-1', 'Molar mass').error);
assert.equal(parsePositive('58.44', 'Molar mass').value, 58.44);

{
  const share = shareResultText({
    ppm: 100,
    densityKgM3: 1000,
    densityUnit: 'kg_m3',
    densityDisplay: 1000,
    mgL: 100,
    molarMassGMol: 58.44,
    molarMassDisplay: 58.44,
    molarMassUnit: 'g_mol',
    molL: mgLToMolL(100, 58.44),
    molarConcDisplay: mgLToMolL(100, 58.44),
    molarConcUnit: 'mol_L',
  });
  assert.match(share, /PPM to mg\/L Converter/);
  assert.match(share, /100 ppm/);
  assert.match(share, /100 mg\/L/);
}

console.log('ppm-to-mgl calculation.test.ts: ok');
