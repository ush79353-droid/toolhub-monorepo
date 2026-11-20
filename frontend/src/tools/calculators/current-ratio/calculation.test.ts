import assert from 'node:assert/strict';
import {
  calculateCurrentAssets,
  calculateCurrentLiabilities,
  calculateCurrentRatio,
  calculateWorkingCapital,
} from './calculation';
import { createDefaultInput } from './types';
import { validateCurrentRatioInput } from './validation';

assert.equal(calculateCurrentRatio(400_000, 200_000), 2);
assert.equal(calculateCurrentRatio(150_000, 200_000), 0.75);
assert.equal(calculateCurrentRatio(200_000, 200_000), 1);
assert.equal(calculateCurrentRatio(600_000, 150_000), 4);
assert.equal(calculateCurrentRatio(0, 100_000), 0);
assert.equal(calculateCurrentRatio(100_000, 0), null);
assert.equal(calculateCurrentRatio(0, 0), null);
assert.equal(calculateCurrentRatio(-1, 100), null);

assert.equal(calculateWorkingCapital(400_000, 200_000), 200_000);
assert.equal(calculateWorkingCapital(150_000, 200_000), -50_000);
assert.equal(calculateCurrentAssets(2.5, 100_000), 250_000);
assert.equal(calculateCurrentLiabilities(300_000, 1.5), 200_000);
assert.equal(calculateCurrentLiabilities(300_000, 0), null);

const standard = validateCurrentRatioInput({
  ...createDefaultInput(),
  currency: 'USD',
  currentAssets: '400000',
  currentLiabilities: '200000',
});
assert.equal(standard.isValid, true);
assert.equal(standard.result?.currentRatio, 2);
assert.equal(standard.result?.workingCapital, 200_000);
assert.equal(standard.result?.formattedCurrentRatio, '2.00');

const belowOne = validateCurrentRatioInput({
  ...createDefaultInput(),
  currentAssets: '150000',
  currentLiabilities: '200000',
});
assert.equal(belowOne.result?.currentRatio, 0.75);
assert.equal(belowOne.result?.workingCapital, -50_000);

const zeroLiab = validateCurrentRatioInput({
  ...createDefaultInput(),
  currentAssets: '100000',
  currentLiabilities: '0',
});
assert.equal(zeroLiab.result, null);
assert.ok(zeroLiab.errors.currentLiabilities);

const bothZero = validateCurrentRatioInput({
  ...createDefaultInput(),
  currentAssets: '0',
  currentLiabilities: '0',
});
assert.equal(bothZero.result, null);

const zeroAssets = validateCurrentRatioInput({
  ...createDefaultInput(),
  currentAssets: '0',
  currentLiabilities: '100000',
});
assert.equal(zeroAssets.result?.currentRatio, 0);

const reverseAssets = validateCurrentRatioInput({
  ...createDefaultInput(),
  mode: 'currentAssets',
  currentRatio: '2.5',
  currentLiabilities: '100000',
});
assert.equal(reverseAssets.result?.currentAssets, 250_000);

const reverseLiab = validateCurrentRatioInput({
  ...createDefaultInput(),
  mode: 'currentLiabilities',
  currentAssets: '300000',
  currentRatio: '1.5',
});
assert.equal(reverseLiab.result?.currentLiabilities, 200_000);

const nonUnique = validateCurrentRatioInput({
  ...createDefaultInput(),
  mode: 'currentLiabilities',
  currentAssets: '0',
  currentRatio: '0',
});
assert.equal(nonUnique.result, null);
assert.ok(nonUnique.errors.form);

const zeroRatio = validateCurrentRatioInput({
  ...createDefaultInput(),
  mode: 'currentLiabilities',
  currentAssets: '100000',
  currentRatio: '0',
});
assert.equal(zeroRatio.result, null);
assert.ok(zeroRatio.errors.currentRatio);

const negative = validateCurrentRatioInput({
  ...createDefaultInput(),
  currentAssets: '-1',
  currentLiabilities: '100',
});
assert.ok(negative.errors.currentAssets);

const faq = validateCurrentRatioInput({
  ...createDefaultInput(),
  currentAssets: '300000',
  currentLiabilities: '150000',
});
assert.equal(faq.result?.currentRatio, 2);

const blank = validateCurrentRatioInput(createDefaultInput());
assert.equal(blank.result, null);

console.log('current-ratio/calculation.test.ts: all assertions passed');
