/**
 * Run: npx --yes tsx src/tools/calculators/cash-flow-to-debt-ratio/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  calculateCashFlowToDebtPercent,
  calculateDebtToCashFlowRatio,
  sumDebtComponents,
} from './calculation';
import { validateCashFlowToDebtRatioInput } from './validation';
import { createDefaultInput } from './types';

assert.equal(calculateCashFlowToDebtPercent(50_000, 200_000), 25);
assert.equal(calculateCashFlowToDebtPercent(-10_000, 100_000), -10);
assert.equal(calculateCashFlowToDebtPercent(10_000, 0), null);
assert.equal(calculateCashFlowToDebtPercent(10_000, -1), null);

assert.equal(calculateDebtToCashFlowRatio(200_000, 50_000), 4);
assert.equal(calculateDebtToCashFlowRatio(100_000, 0), null);
assert.equal(calculateDebtToCashFlowRatio(100_000, -50_000), -2);

assert.equal(sumDebtComponents(40_000, 60_000), 100_000);
assert.equal(sumDebtComponents(-1, 10), null);

const ok = validateCashFlowToDebtRatioInput({
  ...createDefaultInput(),
  operatingCashFlow: '50000',
  totalDebt: '200000',
});
assert.equal(ok.isValid, true);
assert.equal(ok.result?.cashFlowToDebtPercent, 25);
assert.equal(ok.result?.debtToCashFlowRatio, 4);
assert.equal(ok.result?.formattedCashFlowToDebtPercent, '25');
assert.equal(ok.result?.formattedDebtToCashFlowRatio, '4');

const zeroDebt = validateCashFlowToDebtRatioInput({
  ...createDefaultInput(),
  operatingCashFlow: '1000',
  totalDebt: '0',
});
assert.equal(zeroDebt.isValid, true);
assert.equal(zeroDebt.result?.cashFlowToDebtPercent, null);
assert.equal(zeroDebt.result?.formattedCashFlowToDebtPercent, 'undefined');

const zeroOcf = validateCashFlowToDebtRatioInput({
  ...createDefaultInput(),
  operatingCashFlow: '0',
  totalDebt: '1000',
});
assert.equal(zeroOcf.isValid, true);
assert.equal(zeroOcf.result?.debtToCashFlowRatio, null);
assert.equal(zeroOcf.result?.cashFlowToDebtPercent, 0);

const components = validateCashFlowToDebtRatioInput({
  ...createDefaultInput(),
  operatingCashFlow: '25000',
  debtComponentsOpen: true,
  shortTermDebt: '30000',
  longTermDebt: '70000',
});
assert.equal(components.isValid, true);
assert.equal(components.result?.totalDebtNormalized, 100_000);
assert.equal(components.result?.cashFlowToDebtPercent, 25);

console.log('cash-flow-to-debt-ratio calculation.test.ts: all assertions passed');
