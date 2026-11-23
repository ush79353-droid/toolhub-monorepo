import assert from 'node:assert/strict';
import {
  convertHeight,
  convertWeight,
  percentOfExpected,
  predictedSixMinuteWalkMeters,
} from './calculation';
import { createDefaultInput } from './types';
import { validateSixMinuteWalkInput } from './validation';

// Male: 7.57*175 − 5.02*60 − 1.76*80 − 309 = 1324.75 − 301.2 − 140.8 − 309 = 573.75
const malePred = predictedSixMinuteWalkMeters('male', 60, 175, 80);
assert.ok(malePred != null);
assert.ok(Math.abs(malePred! - 573.75) < 1e-9);

// Female: 2.11*165 − 2.29*65 − 5.78*55 + 667 = 348.15 − 148.85 − 317.9 + 667 = 548.4
const femalePred = predictedSixMinuteWalkMeters('female', 55, 165, 65);
assert.ok(femalePred != null);
assert.ok(Math.abs(femalePred! - 548.4) < 1e-9);

assert.equal(predictedSixMinuteWalkMeters('male', 39, 175, 80), null);
assert.equal(predictedSixMinuteWalkMeters('male', 81, 175, 80), null);

assert.equal(percentOfExpected(573.75, 573.75), 100);
assert.equal(percentOfExpected(0, 573.75), 0);
assert.ok(Math.abs(percentOfExpected(286.875, 573.75)! - 50) < 1e-9);

const h = convertHeight(175, 'cm', 'in');
assert.ok(h != null && Math.abs(h - 175 / 2.54) < 1e-9);
const w = convertWeight(80, 'kg', 'lb');
assert.ok(w != null && Math.abs(w - 80 / 0.45359237) < 1e-6);

const blank = validateSixMinuteWalkInput(createDefaultInput());
assert.equal(blank.isValid, false);
assert.equal(blank.result, null);

const ok = validateSixMinuteWalkInput({
  sex: 'male',
  ageYears: '60',
  heightValue: '175',
  heightUnit: 'cm',
  weightValue: '80',
  weightUnit: 'kg',
  predictedUnit: 'm',
  observedValue: '573.75',
  observedUnit: 'm',
});
assert.equal(ok.isValid, true);
assert.ok(ok.result);
assert.ok(Math.abs(ok.result!.predictedMeters - 573.75) < 1e-9);
assert.ok(Math.abs(ok.result!.percentOfExpected! - 100) < 1e-9);

const outOfDomain = validateSixMinuteWalkInput({
  sex: 'male',
  ageYears: '30',
  heightValue: '175',
  heightUnit: 'cm',
  weightValue: '80',
  weightUnit: 'kg',
  predictedUnit: 'm',
  observedValue: '',
  observedUnit: 'm',
});
assert.equal(outOfDomain.isValid, false);
assert.equal(outOfDomain.result, null);
assert.ok(outOfDomain.errors.ageYears);

const femaleSwitch = validateSixMinuteWalkInput({
  sex: 'female',
  ageYears: '55',
  heightValue: '165',
  heightUnit: 'cm',
  weightValue: '65',
  weightUnit: 'kg',
  predictedUnit: 'm',
  observedValue: '0',
  observedUnit: 'm',
});
assert.equal(femaleSwitch.isValid, true);
assert.equal(femaleSwitch.result?.percentOfExpected, 0);

console.log('six-minute-walk-test calculation.test.ts: ok');
