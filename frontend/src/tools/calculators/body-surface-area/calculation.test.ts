/**
 * Runnable self-check: npx tsx src/tools/calculators/body-surface-area/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  calculateBodySurfaceArea,
  mostellerBsaM2,
  weightToKg,
  LB_TO_KG,
} from './calculation';
import { createDefaultInput } from './types';
import { validateBodySurfaceAreaInput } from './validation';

function approx(actual: number, expected: number, tol = 0.01) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`,
  );
}

const kg = weightToKg(155, 'lb');
approx(kg, 70.3068, 0.0001);
assert.equal(LB_TO_KG, 0.45359237);

const heightCm = (5 * 12 + 9) * 2.54;
approx(heightCm, 175.26, 0.001);
approx(mostellerBsaM2(kg, heightCm), 1.85, 0.005);

const input = createDefaultInput();
const result = calculateBodySurfaceArea(input);
assert.ok(result);
approx(result.weightKg, 70.3068, 0.0001);
approx(result.heightCm, 175.26, 0.001);
approx(result.methods.mosteller, 1.85, 0.005);
assert.equal(result.formatted.mosteller, '1.85');

const v = validateBodySurfaceAreaInput(input, { requireComplete: true });
assert.equal(Object.keys(v.errors).length, 0);
assert.ok(v.result);

const bad = validateBodySurfaceAreaInput(
  { ...input, weightText: '' },
  { requireComplete: true },
);
assert.ok(bad.errors.weight);

const metric = validateBodySurfaceAreaInput(
  {
    ...input,
    heightSource: 'metric',
    heightCm: '175.26',
    heightFt: '',
    heightIn: '',
  },
  { requireComplete: true },
);
assert.ok(metric.result);
approx(metric.result!.methods.mosteller, 1.85, 0.005);

console.log('body-surface-area calculation.test.ts: ok');
