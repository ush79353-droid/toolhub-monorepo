import assert from 'node:assert/strict';
import {
  calculateBmi,
  calculateBmiForWomen,
  calculateBmiPrime,
  classifyWhoAdultBmi,
  heightToMeters,
  kgToWeight,
  metersToHeight,
  weightToKg,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
} from './types';
import { validateBmiForWomenInput } from './validation';

// Fixture: 80 kg / 2 m → BMI 20, Prime 0.80
{
  const bmi = calculateBmi(2, 80);
  assert.equal(Number(bmi.toFixed(2)), 20);
  assert.equal(Number(calculateBmiPrime(bmi).toFixed(2)), 0.8);
  assert.equal(classifyWhoAdultBmi(bmi).id, 'normal');
}

{
  const result = calculateBmiForWomen(createExampleInput());
  assert.ok(result);
  assert.equal(result!.formattedBmi, '20.00');
  assert.equal(result!.formattedBmiPrime, '0.80');
  assert.equal(result!.category?.id, 'normal');
  assert.equal(result!.ageInterpretation, 'adult');
  assert.ok(result!.pregnancyNote.includes('pregnancy'));
}

// Unit round-trip preserves physical height/weight
{
  const m = heightToMeters(165, 'cm');
  assert.ok(Math.abs(m - 1.65) < 1e-12);
  assert.ok(Math.abs(metersToHeight(m, 'cm') - 165) < 1e-9);
  const kg = weightToKg(132.28, 'lb');
  assert.ok(Math.abs(kgToWeight(kg, 'lb') - 132.28) < 1e-6);
}

// Under-age: BMI still computed; adult category withheld
{
  const result = calculateBmiForWomen({
    ...createExampleInput(),
    age: '17',
  });
  assert.ok(result);
  assert.equal(result!.formattedBmi, '20.00');
  assert.equal(result!.ageInterpretation, 'under_adult');
  assert.equal(result!.category, null);
  assert.equal(result!.formattedHealthyWeightRange, null);
}

// Empty / reset state
{
  const v = validateBmiForWomenInput(createDefaultInput());
  assert.equal(v.isValid, true);
  assert.equal(v.result, null);
  assert.deepEqual(v.errors, {});
  assert.deepEqual(createEmptyInput(), createDefaultInput());
}

// Partial fill errors
{
  const v = validateBmiForWomenInput({
    ...createDefaultInput(),
    height: '165',
  });
  assert.equal(v.isValid, false);
  assert.ok(v.errors.weight);
}

// Age validation ceiling
{
  const v = validateBmiForWomenInput({
    ...createExampleInput(),
    age: '121',
  });
  assert.equal(v.isValid, false);
  assert.ok(v.errors.age);
}

console.log('bmi-for-women calculation.test.ts: ok');
