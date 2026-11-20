import assert from 'node:assert/strict';
import {
  calculateGiftOfEquity,
  calculateMarketValueFromGift,
  calculateSalesPriceFromGift,
} from './calculation';
import { createDefaultInput } from './types';
import { validateGiftOfEquityInput } from './validation';

// Test 1: Standard Gift of Equity
{
  assert.equal(calculateGiftOfEquity(600_000, 500_000), 100_000);
}

// Test 2: Reference Example
{
  assert.equal(calculateGiftOfEquity(600_000, 550_000), 50_000);
}

// Test 3: Zero Gift
{
  assert.equal(calculateGiftOfEquity(500_000, 500_000), 0);
}

// Test 4: Negative Difference
{
  assert.equal(calculateGiftOfEquity(500_000, 550_000), -50_000);
  const v = validateGiftOfEquityInput({
    ...createDefaultInput(),
    marketValue: '500000',
    salesPrice: '550000',
  });
  assert.equal(v.result?.giftOfEquity, -50_000);
  assert.equal(v.result?.isNegativeDifference, true);
}

// Test 5: Reverse Sales Price
{
  assert.equal(calculateSalesPriceFromGift(600_000, 100_000), 500_000);
}

// Test 6: Reverse Market Value
{
  assert.equal(calculateMarketValueFromGift(500_000, 100_000), 600_000);
}

// Test 7: Decimal Values
{
  assert.equal(calculateGiftOfEquity(600_000.5, 550_000.25), 50_000.25);
}

// Test 8: Negative Market Value
{
  assert.equal(calculateGiftOfEquity(-100_000, 50_000), null);
  const v = validateGiftOfEquityInput({
    ...createDefaultInput(),
    marketValue: '-100000',
    salesPrice: '50000',
  });
  assert.ok(v.errors.marketValue);
  assert.equal(v.result, null);
}

// Test 9: Negative Sales Price
{
  assert.equal(calculateGiftOfEquity(100_000, -50_000), null);
  const v = validateGiftOfEquityInput({
    ...createDefaultInput(),
    marketValue: '100000',
    salesPrice: '-50000',
  });
  assert.ok(v.errors.salesPrice);
}

// Test 10: Missing Input
{
  const v = validateGiftOfEquityInput({
    ...createDefaultInput(),
    marketValue: '600000',
    salesPrice: '',
  });
  assert.equal(v.isValid, false);
  assert.equal(v.result, null);
}

// Test 11: Input Clearing
{
  const full = validateGiftOfEquityInput({
    ...createDefaultInput(),
    marketValue: '600000',
    salesPrice: '500000',
  });
  assert.equal(full.result?.giftOfEquity, 100_000);
  const cleared = validateGiftOfEquityInput({
    ...createDefaultInput(),
    marketValue: '',
    salesPrice: '500000',
  });
  assert.equal(cleared.result, null);
}

// Test 12: Reset defaults
{
  const d = createDefaultInput();
  assert.equal(d.mode, 'gift');
  assert.equal(d.currency, 'PKR');
  assert.equal(validateGiftOfEquityInput(d).result, null);
}

// Test 13: Large numbers
{
  const v = validateGiftOfEquityInput({
    ...createDefaultInput(),
    marketValue: '50000000',
    salesPrice: '40000000',
  });
  assert.equal(v.result?.giftOfEquity, 10_000_000);
  assert.ok(v.result!.formattedGiftOfEquity.includes(','));
}

// Test 14 / 15: Mode switching
{
  const gift = validateGiftOfEquityInput({
    ...createDefaultInput(),
    mode: 'gift',
    marketValue: '600000',
    salesPrice: '500000',
  });
  assert.equal(gift.result?.giftOfEquity, 100_000);

  const sales = validateGiftOfEquityInput({
    ...createDefaultInput(),
    mode: 'salesPrice',
    marketValue: '600000',
    giftOfEquity: '100000',
  });
  assert.equal(sales.result?.salesPrice, 500_000);

  const market = validateGiftOfEquityInput({
    ...createDefaultInput(),
    mode: 'marketValue',
    salesPrice: '500000',
    giftOfEquity: '100000',
  });
  assert.equal(market.result?.marketValue, 600_000);

  const invalidSales = validateGiftOfEquityInput({
    ...createDefaultInput(),
    mode: 'salesPrice',
    marketValue: '100000',
    giftOfEquity: '150000',
  });
  assert.ok(invalidSales.errors.giftOfEquity);
  assert.equal(invalidSales.result, null);
}

console.log('gift-of-equity/calculation.test.ts: all assertions passed');
