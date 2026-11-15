import assert from 'node:assert/strict';
import {
  calculateDecagramToGram,
  dagToGrams,
  formatMass,
  gramsToDag,
} from './calculation';
import {
  DEFAULT_DECAGRAM_TO_GRAM_INPUT,
  GRAMS_PER_DECAGRAM,
} from './types';
import { validateDecagramToGram } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-12): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

{
  assert.equal(GRAMS_PER_DECAGRAM, 10);
  const dagCases = [0, 0.01, 0.1, 0.25, 0.5, 1, 2, 3, 5, 7, 7.5, 10, 15, 25, 50, 100, 250, 1000];
  for (const dag of dagCases) {
    assertClose(dagToGrams(dag), dag * 10);
  }
}

{
  const gCases = [
    [1, 0.1],
    [5, 0.5],
    [10, 1],
    [25, 2.5],
    [50, 5],
    [75, 7.5],
    [100, 10],
    [125, 12.5],
    [250, 25],
    [500, 50],
    [1000, 100],
  ] as const;
  for (const [g, dag] of gCases) {
    assertClose(gramsToDag(g), dag);
  }
}

{
  assertClose(dagToGrams(0.1), 1);
  assertClose(dagToGrams(0.01), 0.1);
  assertClose(dagToGrams(0.001), 0.01);
  assertClose(dagToGrams(0.0001), 0.001);
  assertClose(gramsToDag(0.01), 0.001);
  assertClose(gramsToDag(0.001), 0.0001);
}

{
  const r = calculateDecagramToGram({ source: 'dag', dag: 5, g: null });
  assertClose(r.g, 50);
  assertClose(r.otherUnits.find((row) => row.unit === 'mg')!.value, 50_000);
  assertClose(r.otherUnits.find((row) => row.unit === 'cg')!.value, 5000);
  assertClose(r.otherUnits.find((row) => row.unit === 'dg')!.value, 500);
  assertClose(r.otherUnits.find((row) => row.unit === 'hg')!.value, 0.5);
  assertClose(r.otherUnits.find((row) => row.unit === 'kg')!.value, 0.05);
  assertClose(r.otherUnits.find((row) => row.unit === 't')!.value, 0.00005);
  assertClose(r.otherUnits.find((row) => row.unit === 'µg')!.value, 50_000_000);
}

{
  assertClose(calculateDecagramToGram(DEFAULT_DECAGRAM_TO_GRAM_INPUT).g, 30);
  assertClose(
    calculateDecagramToGram({ source: 'g', dag: null, g: 125 }).dag,
    12.5
  );
}

{
  const ok = validateDecagramToGram(DEFAULT_DECAGRAM_TO_GRAM_INPUT);
  assert.equal(ok.isValid, true);
  const blank = validateDecagramToGram({ source: 'dag', dag: null, g: null });
  assert.equal(blank.isValid, false);
  const neg = validateDecagramToGram({ source: 'dag', dag: -1, g: null });
  assert.equal(neg.isValid, false);
}

{
  assert.equal(formatMass(0), '0');
  assert.equal(formatMass(0.001), '0.001');
}

console.log('decagram-to-gram calculation.test.ts: ok');
