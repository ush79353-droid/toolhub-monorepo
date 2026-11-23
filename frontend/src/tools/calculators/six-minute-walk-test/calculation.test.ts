import assert from 'node:assert/strict';
import {
  convertHeight,
  convertWeight,
  percentOfExpected,
  predictSixMinuteWalkMeters,
} from './calculation';
import { createDefaultInput } from './types';
import { validateSixMinuteWalkTestInput } from './validation';

const maleArgs = {
  sex: 'male' as const,
  ageYears: 60,
  heightCm: 175,
  weightKg: 80,
};
// Male: 7.57*175 − 5.02*60 − 1.76*80 − 309 = 573.75
const malePred = predictSixMinuteWalkMeters(maleArgs);
assert.equal(malePred.domainOk, true);
assert.ok(malePred.meters != null);
assert.ok(Math.abs(malePred.meters! - 573.75) < 1e-9);

const femaleArgs = {
  sex: 'female' as const,
  ageYears: 55,
  heightCm: 165,
  weightKg: 65,
};
// Female: 2.11*165 − 2.29*65 − 5.78*55 + 667 = 548.4
const femalePred = predictSixMinuteWalkMeters(femaleArgs);
assert.equal(femalePred.domainOk, true);
assert.ok(femalePred.meters != null);
assert.ok(Math.abs(femalePred.meters! - 548.4) < 1e-9);

assert.equal(
  predictSixMinuteWalkMeters({ ...maleArgs, ageYears: 39 }).meters,
  null,
);
assert.equal(
  predictSixMinuteWalkMeters({ ...maleArgs, ageYears: 81 }).meters,
  null,
);

assert.equal(percentOfExpected(573.75, 573.75), 100);
assert.equal(percentOfExpected(0, 573.75), 0);
assert.ok(Math.abs(percentOfExpected(286.875, 573.75)! - 50) < 1e-9);

const h = convertHeight(175, 'cm', 'in');
assert.ok(h != null && Math.abs(h - 175 / 2.54) < 1e-9);
const w = convertWeight(80, 'kg', 'lb');
assert.ok(w != null && Math.abs(w - 80 / 0.45359237) < 1e-6);

const blank = validateSixMinuteWalkTestInput(createDefaultInput());
assert.equal(blank.isValid, false);
assert.equal(blank.result, null);

const ok = validateSixMinuteWalkTestInput({
  sex: 'male',
  ageYears: '60',
  heightValue: '175',
  heightUnit: 'cm',
  weightValue: '80',
  weightUnit: 'kg',
  predictedUnit: 'm',
  observedDistance: '573.75',
  observedUnit: 'm',
  comparisonOpen: true,
});
assert.equal(ok.isValid, true);
assert.ok(ok.result);
assert.ok(Math.abs(ok.result!.predictedMeters! - 573.75) < 1e-9);
assert.ok(Math.abs(ok.result!.percentOfExpected! - 100) < 1e-9);

const outOfDomain = validateSixMinuteWalkTestInput({
  sex: 'male',
  ageYears: '30',
  heightValue: '175',
  heightUnit: 'cm',
  weightValue: '80',
  weightUnit: 'kg',
  predictedUnit: 'm',
  observedDistance: '',
  observedUnit: 'm',
  comparisonOpen: true,
});
assert.equal(outOfDomain.isValid, false);
assert.ok(outOfDomain.result);
assert.equal(outOfDomain.result!.predictedMeters, null);
assert.equal(outOfDomain.result!.domainOk, false);

const femaleSwitch = validateSixMinuteWalkTestInput({
  sex: 'female',
  ageYears: '55',
  heightValue: '165',
  heightUnit: 'cm',
  weightValue: '65',
  weightUnit: 'kg',
  predictedUnit: 'm',
  observedDistance: '0',
  observedUnit: 'm',
  comparisonOpen: true,
});
assert.equal(femaleSwitch.isValid, true);
assert.equal(femaleSwitch.result?.percentOfExpected, 0);

console.log('six-minute-walk-test calculation.test.ts: ok');