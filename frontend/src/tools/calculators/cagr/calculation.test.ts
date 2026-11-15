import assert from 'node:assert/strict';
import {
  solveCagr,
  solveCagrSystem,
  solveFinal,
  solveInitial,
  solvePeriods,
} from './calculation';

const cagr = solveCagr(10_000, 15_000, 5);
assert.ok(cagr);
assert.ok(Math.abs(cagr - 8.447) < 0.01);

assert.equal(solveCagr(10_000, 15_000, 0), null);
assert.equal(solveFinal(10_000, -101, 5), null);

const final = solveFinal(10_000, cagr, 5);
assert.ok(final);
assert.ok(Math.abs(final - 15_000) < 0.02);

const initial = solveInitial(15_000, cagr, 5);
assert.ok(initial);
assert.ok(Math.abs(initial - 10_000) < 0.02);

const periods = solvePeriods(10_000, 15_000, cagr);
assert.ok(periods);
assert.ok(Math.abs(periods - 5) < 1e-6);

assert.equal(solvePeriods(10_000, 10_000, 0), null); // ambiguous
assert.equal(solvePeriods(10_000, 10_000, 5), null); // impossible

const system = solveCagrSystem({
  cagrPercent: null,
  periods: 5,
  initialValue: 10_000,
  finalValue: 15_000,
  target: 'cagrPercent',
});
assert.ok(system);
assert.equal(system.solvedField, 'cagrPercent');
assert.ok(Math.abs(system.cagrPercent - 8.447) < 0.01);

console.log('cagr/calculation.test.ts: ok');
