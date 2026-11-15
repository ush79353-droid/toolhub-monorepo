import assert from 'node:assert/strict';
import { calculateMcgToMg, formatMass, mcgToMg, mgToMcg } from './calculation';
import {
  DEFAULT_MCG_TO_MG_INPUT,
  MICROGRAMS_PER_MILLIGRAM,
  MILLIGRAMS_PER_CENTIGRAM,
  MILLIGRAMS_PER_DECIGRAM,
  MILLIGRAMS_PER_GRAM,
  NANOGRAMS_PER_MICROGRAM,
} from './types';
import { validateMcgToMg } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-12): void {
  assert.ok(Math.abs(actual - expected) < eps, `expected ${expected}, got ${actual}`);
}

assert.equal(MICROGRAMS_PER_MILLIGRAM, 1000);
assert.equal(NANOGRAMS_PER_MICROGRAM, 1000);
assert.equal(MILLIGRAMS_PER_CENTIGRAM, 10);
assert.equal(MILLIGRAMS_PER_DECIGRAM, 100);
assert.equal(MILLIGRAMS_PER_GRAM, 1000);

const cases: readonly [number, number][] = [
  [0, 0],
  [1, 0.001],
  [5, 0.005],
  [10, 0.01],
  [25, 0.025],
  [50, 0.05],
  [75, 0.075],
  [100, 0.1],
  [125, 0.125],
  [250, 0.25],
  [500, 0.5],
  [750, 0.75],
  [1000, 1],
  [1500, 1.5],
  [2500, 2.5],
  [5000, 5],
  [10_000, 10],
  [100_000, 100],
];

for (const [mcg, mg] of cases) {
  assert.equal(mcgToMg(mcg), mg);
  assert.equal(mgToMcg(mg), mcg);
  assert.equal(calculateMcgToMg({ source: 'mcg', mcg, mg: null }).mg, mg);
  assert.equal(calculateMcgToMg({ source: 'mg', mcg: null, mg }).mcg, mcg);
}

{
  assertClose(mcgToMg(0.1), 0.0001);
  assertClose(mcgToMg(0.01), 0.00001);
  assertClose(mcgToMg(0.001), 0.000001);
  assertClose(mgToMcg(0.0005), 0.5);
  assertClose(mgToMcg(0.000001), 0.001);
}

{
  const result = calculateMcgToMg(DEFAULT_MCG_TO_MG_INPUT);
  assert.equal(result.mcg, 250);
  assert.equal(result.mg, 0.25);
  const ng = result.otherUnits.find((row) => row.unit === 'ng');
  assert.equal(ng?.value, 250_000);
  const cg = result.otherUnits.find((row) => row.unit === 'cg');
  assertClose(cg?.value ?? NaN, 0.025);
  const dg = result.otherUnits.find((row) => row.unit === 'dg');
  assertClose(dg?.value ?? NaN, 0.0025);
  const g = result.otherUnits.find((row) => row.unit === 'g');
  assertClose(g?.value ?? NaN, 0.00025);
  const kg = result.otherUnits.find((row) => row.unit === 'kg');
  assertClose(kg?.value ?? NaN, 0.00000025);
}

{
  let mg = 0.125;
  for (let i = 0; i < 20; i += 1) {
    const mcg = mgToMcg(mg);
    mg = mcgToMg(mcg);
  }
  assert.equal(mg, 0.125);
}

{
  assert.equal(formatMass(0), '0');
  assert.equal(formatMass(0.25), '0.25');
  assert.equal(formatMass(0.0001), '0.0001');
  assert.notEqual(formatMass(0.001), '0');
}

{
  const ok = validateMcgToMg({ source: 'mcg', mcg: 100, mg: null });
  assert.equal(ok.isValid, true);

  const blank = validateMcgToMg({ source: 'mg', mcg: null, mg: null });
  assert.equal(blank.isValid, false);

  const neg = validateMcgToMg({ source: 'mcg', mcg: -1, mg: null });
  assert.equal(neg.isValid, false);
  assert.ok(neg.errors.mcg);
}

console.log('mcg-to-mg calculation.test.ts: ok');
