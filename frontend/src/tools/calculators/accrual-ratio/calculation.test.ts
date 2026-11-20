import assert from 'node:assert/strict';
import {
  calculateAverageNetOperatingAssets,
  calculateBalanceSheetAccrualRatio,
  calculateCashFlowAccrualRatio,
  calculateCashFlowAccruals,
  calculateChangeInNetOperatingAssets,
  calculateNetOperatingAssets,
  validateAccrualRatioDenominator,
} from './calculation';
import { createDefaultInput } from './types';
import { validateAccrualRatioInput } from './validation';

assert.equal(calculateNetOperatingAssets(5_000_000, 2_000_000), 3_000_000);
assert.equal(calculateNetOperatingAssets(5_800_000, 2_300_000), 3_500_000);
assert.equal(calculateAverageNetOperatingAssets(3_000_000, 3_500_000), 3_250_000);
assert.equal(calculateChangeInNetOperatingAssets(3_000_000, 3_500_000), 500_000);

const bsRatio = calculateBalanceSheetAccrualRatio(500_000, 3_250_000);
assert.ok(bsRatio !== null);
assert.ok(Math.abs(bsRatio! - 500_000 / 3_250_000) < 1e-12);
assert.ok(Math.abs(bsRatio! * 100 - 15.3846153846) < 1e-8);

assert.equal(calculateCashFlowAccruals(800_000, 600_000), 200_000);
const cfRatio = calculateCashFlowAccrualRatio(200_000, 3_250_000);
assert.ok(cfRatio !== null);
assert.ok(Math.abs(cfRatio! - 200_000 / 3_250_000) < 1e-12);
assert.ok(Math.abs(cfRatio! * 100 - 6.1538461538) < 1e-8);

assert.equal(calculateBalanceSheetAccrualRatio(0, 1_000_000), 0);

const negChange = calculateChangeInNetOperatingAssets(2_000_000, 1_500_000);
assert.equal(negChange, -500_000);
const negRatio = calculateBalanceSheetAccrualRatio(-500_000, 1_750_000);
assert.ok(negRatio !== null);
assert.ok(Math.abs(negRatio! * 100 - -500_000 / 1_750_000 * 100) < 1e-8);

const zeroDenom = validateAccrualRatioDenominator(0, 'USD');
assert.equal(zeroDenom.status, 'zeroDenominator');

const negDenom = validateAccrualRatioDenominator(-400_000, 'USD');
assert.equal(negDenom.status, 'negativeDenominator');

assert.equal(calculateCashFlowAccruals(-100_000, 50_000), -150_000);
assert.equal(calculateCashFlowAccruals(100_000, -50_000), 150_000);

const standard = validateAccrualRatioInput({
  ...createDefaultInput(),
  currency: 'USD',
  beginningOperatingAssets: '5000000',
  beginningOperatingLiabilities: '2000000',
  endingOperatingAssets: '5800000',
  endingOperatingLiabilities: '2300000',
});
assert.equal(standard.isValid, true);
assert.equal(standard.result?.beginningNOA, 3_000_000);
assert.equal(standard.result?.endingNOA, 3_500_000);
assert.equal(standard.result?.averageNOA, 3_250_000);
assert.ok(standard.result?.formattedAccrualRatioPercent === '15.38');

const cashFlow = validateAccrualRatioInput({
  ...createDefaultInput(),
  currency: 'USD',
  method: 'cashFlow',
  beginningOperatingAssets: '5000000',
  beginningOperatingLiabilities: '2000000',
  endingOperatingAssets: '5800000',
  endingOperatingLiabilities: '2300000',
  netIncome: '800000',
  operatingCashFlow: '600000',
});
assert.equal(cashFlow.result?.cashFlowAccruals, 200_000);
assert.ok(cashFlow.result?.formattedAccrualRatioPercent === '6.15');

const zeroAvg = validateAccrualRatioInput({
  ...createDefaultInput(),
  beginningOperatingAssets: '1000000',
  beginningOperatingLiabilities: '0',
  endingOperatingAssets: '0',
  endingOperatingLiabilities: '1000000',
});
assert.equal(zeroAvg.result?.averageNOA, 0);
assert.equal(zeroAvg.result?.status, 'zeroDenominator');
assert.equal(zeroAvg.result?.accrualRatio, null);

const blank = validateAccrualRatioInput(createDefaultInput());
assert.equal(blank.result, null);

const switchMode = validateAccrualRatioInput({
  ...createDefaultInput(),
  method: 'cashFlow',
  beginningOperatingAssets: '5000000',
  beginningOperatingLiabilities: '2000000',
  endingOperatingAssets: '5800000',
  endingOperatingLiabilities: '2300000',
});
assert.equal(switchMode.result, null);

console.log('accrual-ratio/calculation.test.ts: all assertions passed');
