import assert from 'node:assert/strict';
import {
  calculateAnorexicBmi,
  calculateBmi,
  formatBmi,
  heightToMeters,
  isAdultReferenceAge,
  usHeightToMeters,
  weightToKg,
} from './calculation';
import { validateAnorexicBmiInput } from './validation';
import { createDefaultInput, createEmptyInput } from './types';

// Screenshot fixture: 180 cm, 60 kg → 18.52
{
  const bmi = calculateBmi(1.8, 60);
  assert.ok(Math.abs(bmi - 18.5185185185) < 1e-9);
  assert.equal(formatBmi(bmi), '18.52');
}

{
  const result = calculateAnorexicBmi({
    age: 20,
    sex: 'female',
    heightMeters: 1.8,
    weightKg: 60,
  });
  assert.equal(result.formattedBmi, '18.52');
  assert.equal(result.adultReferenceApplicable, true);
  assert.ok(result.healthyRangeLabel?.includes('18.5'));
  assert.ok(result.disclaimer.toLowerCase().includes('cannot diagnose'));
}

{
  const teen = calculateAnorexicBmi({
    age: 16,
    sex: 'male',
    heightMeters: 1.7,
    weightKg: 55,
  });
  assert.equal(teen.adultReferenceApplicable, false);
  assert.equal(teen.healthyRangeLabel, null);
}

assert.equal(isAdultReferenceAge(20), true);
assert.equal(isAdultReferenceAge(19), false);
assert.equal(heightToMeters(180, 'cm'), 1.8);
assert.ok(Math.abs(weightToKg(132.277, 'lb') - 60) < 0.01);
assert.ok(Math.abs(usHeightToMeters(5, 10.866) - 1.8) < 0.001);

{
  const v = validateAnorexicBmiInput(createDefaultInput());
  assert.equal(v.isValid, true);
  assert.equal(v.result?.formattedBmi, '18.52');
}

{
  const v = validateAnorexicBmiInput(createEmptyInput());
  assert.equal(v.isValid, false);
  assert.ok(v.errors.age || v.errors.height || v.errors.weight);
}

{
  const v = validateAnorexicBmiInput({
    ...createDefaultInput(),
    heightCm: '0',
  });
  assert.equal(v.isValid, false);
  assert.ok(v.errors.height);
}

{
  // 5 ft + 10.866 in ≈ 1.80 m; 60 kg in lb
  const v = validateAnorexicBmiInput({
    ...createDefaultInput(),
    unitSystem: 'us',
    heightFt: '5',
    heightIn: '10.8661417323',
    weightLb: String(60 / 0.45359237),
  });
  assert.equal(v.isValid, true);
  assert.ok(v.result && Math.abs(v.result.bmi - 18.5185185185) < 1e-6);
}

console.log('anorexic-bmi calculation.test.ts: ok');
