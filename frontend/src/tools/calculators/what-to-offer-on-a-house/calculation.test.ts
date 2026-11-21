import assert from 'node:assert/strict';
import {
  calculateDesiredDiscountAmount,
  calculateOfferAmount,
  calculateOfferToValueRatio,
  calculateTotalOfferDeductions,
  calculateTotalOfferReductionPercentage,
  validateOfferScenario,
} from './calculation';
import { createDefaultInput } from './types';
import { validateWhatToOfferInput } from './validation';

assert.equal(calculateOfferAmount(300_000, 20_000, 10_000, 30_000), 240_000);
assert.equal(calculateOfferAmount(250_000, 0, 10_000, 15_000), 225_000);
assert.equal(calculateOfferAmount(200_000, 15_000, 0, 0), 185_000);
assert.equal(calculateOfferAmount(300_000, 0, 0, 0), 300_000);

assert.equal(calculateDesiredDiscountAmount(300_000, 5, 'percentage'), 15_000);
assert.equal(calculateDesiredDiscountAmount(300_000, 10_000, 'amount'), 10_000);
assert.equal(
  calculateOfferAmount(300_000, 20_000, 15_000, 30_000),
  235_000
);

assert.equal(calculateTotalOfferDeductions(20_000, 10_000, 30_000), 60_000);
assert.equal(calculateOfferToValueRatio(240_000, 300_000), 80);
assert.equal(calculateTotalOfferReductionPercentage(300_000, 240_000), 20);

const neg = calculateOfferAmount(200_000, 100_000, 50_000, 75_000);
assert.equal(neg, -25_000);
const negScenario = validateOfferScenario(neg!);
assert.equal(negScenario.status, 'negativeOffer');
assert.equal(negScenario.actionableOfferAmount, null);

const zeroScenario = validateOfferScenario(0);
assert.equal(zeroScenario.status, 'zeroOffer');
assert.equal(zeroScenario.actionableOfferAmount, null);

assert.equal(calculateOfferAmount(-1, 0, 0, 0), null);
assert.equal(calculateOfferAmount(100_000, -1, 0, 0), null);

const standard = validateWhatToOfferInput({
  ...createDefaultInput(),
  currency: 'USD',
  fairMarketValue: '300000',
  renovationCost: '20000',
  desiredDiscount: '10000',
  desiredProfit: '30000',
});
assert.equal(standard.isValid, true);
assert.equal(standard.result?.rawOfferAmount, 240_000);
assert.equal(standard.result?.status, 'valid');
assert.equal(standard.result?.offerToValuePercentage, 80);

const pct = validateWhatToOfferInput({
  ...createDefaultInput(),
  currency: 'USD',
  fairMarketValue: '300000',
  renovationCost: '20000',
  discountMode: 'percentage',
  desiredDiscount: '5',
  desiredProfit: '30000',
});
assert.equal(pct.result?.discountAmount, 15_000);
assert.equal(pct.result?.rawOfferAmount, 235_000);

const over = validateWhatToOfferInput({
  ...createDefaultInput(),
  fairMarketValue: '200000',
  renovationCost: '100000',
  desiredDiscount: '50000',
  desiredProfit: '75000',
});
assert.equal(over.result?.rawOfferAmount, -25_000);
assert.equal(over.result?.status, 'negativeOffer');
assert.equal(over.result?.actionableOfferAmount, null);

const blank = validateWhatToOfferInput(createDefaultInput());
assert.equal(blank.result, null);

const negFmv = validateWhatToOfferInput({
  ...createDefaultInput(),
  fairMarketValue: '-10',
});
assert.ok(negFmv.errors.fairMarketValue);

const zeroOffer = validateWhatToOfferInput({
  ...createDefaultInput(),
  fairMarketValue: '100000',
  renovationCost: '100000',
});
assert.equal(zeroOffer.result?.rawOfferAmount, 0);
assert.equal(zeroOffer.result?.status, 'zeroOffer');

console.log('what-to-offer-on-a-house/calculation.test.ts: all assertions passed');
