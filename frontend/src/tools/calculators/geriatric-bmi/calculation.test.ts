import assert from 'node:assert/strict';
import {
  classifyGeriatricBmi,
  heightToMeters,
  queteletBmi,
  weightToKg,
} from './calculation';
import { validateGeriatricBmiInput } from './validation';

assert.equal(classifyGeriatricBmi(22.9), 'underweight');
assert.equal(classifyGeriatricBmi(23), 'normal');
assert.equal(classifyGeriatricBmi(29.9), 'normal');
assert.equal(classifyGeriatricBmi(30), 'overweight_obese');
assert.equal(classifyGeriatricBmi(30.1), 'overweight_obese');

// 70 kg / (1.75 m)^2 = 22.857...
const bmi = queteletBmi(70, 1.75);
assert.ok(bmi && Math.abs(bmi - 22.857142857) < 1e-6);
assert.equal(classifyGeriatricBmi(bmi!), 'underweight');

assert.equal(heightToMeters(175, 'cm'), 1.75);
assert.ok(Math.abs(weightToKg(154.3235835, 'lb')! - 70) < 0.001);

const ok = validateGeriatricBmiInput({
  ageYears: '70',
  weightValue: '70',
  weightUnit: 'kg',
  heightValue: '175',
  heightUnit: 'cm',
});
assert.equal(ok.isValid, true);
assert.equal(ok.result?.category, 'underweight');

const blank = validateGeriatricBmiInput({
  ageYears: '70',
  weightValue: '',
  weightUnit: 'kg',
  heightValue: '',
  heightUnit: 'cm',
});
assert.equal(blank.isValid, false);

console.log('geriatric-bmi calculation.test.ts: ok');
