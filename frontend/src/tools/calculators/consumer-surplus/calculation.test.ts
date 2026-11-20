import assert from 'node:assert/strict';
import {
  calculateActualPrice,
  calculateConsumerSurplus,
  calculateSurplusPercentage,
  calculateWillingnessToPay,
} from './calculation';
import { createDefaultInput } from './types';
import { validateConsumerSurplusInput } from './validation';

assert.equal(calculateConsumerSurplus(150, 100), 50);
assert.equal(calculateConsumerSurplus(100, 100), 0);
assert.equal(calculateConsumerSurplus(100, 0), 100);
assert.equal(calculateConsumerSurplus(0, 0), 0);
assert.equal(calculateConsumerSurplus(100, 150), -50);
assert.ok(
  Math.abs((calculateConsumerSurplus(25.5, 19.99) ?? NaN) - 5.51) < 1e-9
);
assert.equal(calculateConsumerSurplus(-1, 10), null);
assert.equal(calculateConsumerSurplus(10, -1), null);

assert.equal(calculateWillingnessToPay(80, 40), 120);
assert.equal(calculateActualPrice(150, 50), 100);
assert.equal(calculateSurplusPercentage(200, 150), 25);
assert.equal(calculateSurplusPercentage(0, 0), null);

const basic = validateConsumerSurplusInput({
  ...createDefaultInput(),
  currency: 'USD',
  actualPrice: '100',
  willingPrice: '150',
});
assert.equal(basic.isValid, true);
assert.equal(basic.result?.consumerSurplus, 50);
assert.equal(basic.result?.status, 'valid');
assert.equal(basic.result?.formattedSavingsPercentage, '33.33');

const zero = validateConsumerSurplusInput({
  ...createDefaultInput(),
  actualPrice: '100',
  willingPrice: '100',
});
assert.equal(zero.result?.consumerSurplus, 0);
assert.equal(zero.result?.status, 'zeroSurplus');

const exceeds = validateConsumerSurplusInput({
  ...createDefaultInput(),
  actualPrice: '150',
  willingPrice: '100',
});
assert.equal(exceeds.result?.signedPriceDifference, -50);
assert.equal(exceeds.result?.consumerSurplus, null);
assert.equal(exceeds.result?.status, 'priceExceedsWillingness');
assert.ok(exceeds.result?.warningMessage);

const reverseWtp = validateConsumerSurplusInput({
  ...createDefaultInput(),
  mode: 'willingPrice',
  actualPrice: '80',
  consumerSurplus: '40',
});
assert.equal(reverseWtp.result?.willingPrice, 120);

const reverseP = validateConsumerSurplusInput({
  ...createDefaultInput(),
  mode: 'actualPrice',
  willingPrice: '150',
  consumerSurplus: '50',
});
assert.equal(reverseP.result?.actualPrice, 100);

const negativeActual = validateConsumerSurplusInput({
  ...createDefaultInput(),
  actualPrice: '-1',
  willingPrice: '100',
});
assert.ok(negativeActual.errors.actualPrice);

const negativeWtp = validateConsumerSurplusInput({
  ...createDefaultInput(),
  actualPrice: '100',
  willingPrice: '-1',
});
assert.ok(negativeWtp.errors.willingPrice);

const missing = validateConsumerSurplusInput({
  ...createDefaultInput(),
  actualPrice: '100',
});
assert.equal(missing.result, null);

const blank = validateConsumerSurplusInput(createDefaultInput());
assert.equal(blank.result, null);

const savings = validateConsumerSurplusInput({
  ...createDefaultInput(),
  actualPrice: '150',
  willingPrice: '200',
});
assert.equal(savings.result?.savingsPercentage, 25);

console.log('consumer-surplus/calculation.test.ts: all assertions passed');
