/**
 * Run: npx tsx src/tools/calculators/gastric-sleeve-weight-loss/calculation.test.ts
 */
import {
  SLEEVE_YEAR1_OBS_EWL_PERCENT,
  bmiKgM2,
  calculateGastricSleeveWeightLoss,
  heightToCm,
  referenceWeightKgAtBmi25,
  weightToKg,
} from './calculation';
import { createDefaultInput } from './types';
import { validateGastricSleeveWeightLossInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, tol = 1e-6): boolean {
  return Math.abs(a - b) <= tol;
}

// Unit conversions
{
  assert(approx(heightToCm(70, 'in'), 177.8), '70 in → cm');
  assert(approx(weightToKg(220, 'lb'), 99.7903214, 1e-6), '220 lb → kg');
}

// BMI = weight_kg / height_m²
{
  const bmi = bmiKgM2(100, 170);
  assert(approx(bmi, 100 / (1.7 * 1.7), 1e-9), `bmi ${bmi}`);
}

// Reference weight at BMI 25
{
  const ref = referenceWeightKgAtBmi25(170);
  assert(approx(ref, 25 * 1.7 * 1.7, 1e-9), `ref ${ref}`);
}

// Happy path: 170 cm, 120 kg → excess = 120 − 72.25; loss = excess × 0.5149
{
  const r = calculateGastricSleeveWeightLoss({
    ...createDefaultInput(),
    heightText: '170',
    weightText: '120',
  });
  assert(r.ready, 'ready');
  assert(r.excessWeightKg != null && approx(r.excessWeightKg, 47.75, 1e-6), 'excess');
  const expectedLoss = 47.75 * (SLEEVE_YEAR1_OBS_EWL_PERCENT / 100);
  assert(
    r.estimatedLossKg != null && approx(r.estimatedLossKg, expectedLoss, 1e-6),
    `loss ${r.estimatedLossKg}`,
  );
  assert(
    r.predictedWeightKg != null &&
      approx(r.predictedWeightKg, 120 - expectedLoss, 1e-6),
    `predicted ${r.predictedWeightKg}`,
  );
  assert(
    r.percentTwlImplied != null &&
      approx(r.percentTwlImplied, (expectedLoss / 120) * 100, 1e-6),
    'implied %TWL',
  );
  assert(r.metricLabel === '%EWL', 'metric is %EWL');
}

// Missing height
{
  const r = calculateGastricSleeveWeightLoss({
    ...createDefaultInput(),
    weightText: '100',
  });
  assert(!r.ready && /height/i.test(r.statusHeadline), 'missing height');
}

// Unsupported procedure (cast through unknown for test)
{
  const r = calculateGastricSleeveWeightLoss({
    ...createDefaultInput(),
    heightText: '170',
    weightText: '120',
    surgeryType: 'gastric_bypass' as unknown as 'gastric_sleeve',
  });
  assert(!r.ready && /unsupported/i.test(r.statusHeadline), 'unsupported');
}

// Nonpositive excess weight (BMI ≤ 25)
{
  const r = calculateGastricSleeveWeightLoss({
    ...createDefaultInput(),
    heightText: '170',
    weightText: '70', // BMI ≈ 24.2
  });
  assert(!r.ready && /nonpositive/i.test(r.statusHeadline), 'nonpositive excess');
}

// Validation blank defaults
{
  const v = validateGastricSleeveWeightLossInput(createDefaultInput());
  assert(v.result != null && !v.result.ready, 'blank not ready');
}

// Validation rejects bad height
{
  const v = validateGastricSleeveWeightLossInput({
    ...createDefaultInput(),
    heightText: 'abc',
    weightText: '100',
  });
  assert(v.errors.heightText && v.result === null, 'bad height');
}

console.log('gastric-sleeve-weight-loss calculation.test.ts: ok');
