import assert from 'node:assert/strict';
import {
  assessTargetSafety,
  calculateBmi,
  calculateBmiPrime,
  calculateBmiWeightLoss,
  deriveTargetFields,
  heightToMeters,
  resolveWeightChange,
  targetWeightFromBmi,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
} from './types';
import { validateBmiWeightLossInput } from './validation';

// Fixture: 85 kg / 1.75 m → BMI ≈ 27.76, Prime ≈ 1.11
{
  const bmi = calculateBmi(1.75, 85);
  assert.equal(Number(bmi.toFixed(2)), 27.76);
  assert.equal(Number(calculateBmiPrime(bmi).toFixed(2)), 1.11);
}

// Target weight from BMI
{
  const tw = targetWeightFromBmi(22, 1.75);
  assert.equal(Number(tw.toFixed(3)), 67.375);
  const wc = resolveWeightChange(85, tw);
  assert.equal(wc.kind, 'loss');
  assert.ok(Math.abs(wc.changeKg - 17.625) < 1e-9);
}

// Example input end-to-end
{
  const result = calculateBmiWeightLoss(createExampleInput());
  assert.ok(result);
  assert.equal(result!.formattedBmi, '27.76');
  assert.equal(result!.formattedBmiPrime, '1.11');
  assert.equal(result!.formattedTargetBmi, '22.00');
  assert.equal(result!.weightChangeKind, 'loss');
  assert.ok(result!.targetWeightKg != null);
  assert.ok(Math.abs(result!.targetWeightKg! - 67.375) < 1e-9);
}

// Bidirectional: target prime 0.88 → BMI 22
{
  const meters = heightToMeters(175, 'cm');
  const derived = deriveTargetFields(meters, {
    ...createDefaultInput(),
    height: '175',
    heightUnit: 'cm',
    lastTargetEdit: 'prime',
    targetPrime: '0.88',
  });
  assert.ok(derived.targetBmi != null);
  assert.equal(Number(derived.targetBmi!.toFixed(2)), 22);
  assert.ok(derived.targetWeightKg != null);
  assert.equal(Number(derived.targetWeightKg!.toFixed(3)), 67.375);
}

// Gain path: current below target
{
  const wc = resolveWeightChange(60, 67.375);
  assert.equal(wc.kind, 'gain');
}

// Unsafe severe thinness rejected
{
  const safety = assessTargetSafety(15);
  assert.equal(safety.safety, 'severe_thinness_reject');
  const v = validateBmiWeightLossInput({
    ...createExampleInput(),
    targetBmi: '15',
    targetPrime: '0.6',
    targetWeight: '',
    lastTargetEdit: 'bmi',
  });
  assert.equal(v.isValid, false);
  assert.ok(v.errors.targetBmi);
}

// Empty / reset
{
  const v = validateBmiWeightLossInput(createDefaultInput());
  assert.equal(v.isValid, true);
  assert.equal(v.result, null);
  assert.deepEqual(createEmptyInput(), createDefaultInput());
}

console.log('bmi-weight-loss calculation.test.ts: ok');
