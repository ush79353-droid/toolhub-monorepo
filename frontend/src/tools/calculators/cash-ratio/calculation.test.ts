/**
 * Run: npx --yes tsx src/tools/calculators/cash-ratio/calculation.test.ts
 */
import assert from 'node:assert/strict';
import { calculateCashRatio, formatCashRatioMultiple } from './calculation';
import { validateCashRatioInput } from './validation';
import { createDefaultInput } from './types';

assert.equal(calculateCashRatio(75_000, 100_000), 0.75);
assert.equal(calculateCashRatio(0, 50_000), 0);
assert.equal(calculateCashRatio(100_000, 0), null);
assert.equal(calculateCashRatio(-1, 10), null);
assert.equal(calculateCashRatio(10, -1), null);
assert.equal(formatCashRatioMultiple(0.75), '0.75');
assert.equal(formatCashRatioMultiple(0), '0');

const sameCurrency = validateCashRatioInput({
  ...createDefaultInput(),
  cashAndEquivalents: '75000',
  currentLiabilities: '100000',
});
assert.equal(sameCurrency.isValid, true);
assert.ok(sameCurrency.result);
assert.equal(sameCurrency.result.cashRatio, 0.75);
assert.equal(sameCurrency.result.formattedCashRatio, '0.75');

const zeroCash = validateCashRatioInput({
  ...createDefaultInput(),
  cashAndEquivalents: '0',
  currentLiabilities: '100000',
});
assert.equal(zeroCash.isValid, true);
assert.equal(zeroCash.result?.cashRatio, 0);

const zeroLiab = validateCashRatioInput({
  ...createDefaultInput(),
  cashAndEquivalents: '1000',
  currentLiabilities: '0',
});
assert.equal(zeroLiab.isValid, false);

const mixedNoRates = validateCashRatioInput(
  {
    ...createDefaultInput(),
    cashAndEquivalents: '100',
    cashCurrency: 'USD',
    currentLiabilities: '100',
    liabilitiesCurrency: 'PKR',
  },
  null
);
assert.equal(mixedNoRates.isValid, false);

console.log('cash-ratio calculation.test.ts: all assertions passed');
