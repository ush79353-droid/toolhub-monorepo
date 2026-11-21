import assert from 'node:assert/strict';
import {
  calculatePercentageDiscount,
  formatPercentageDiscountMoney,
} from './calculation';
import { validatePercentageDiscountInput } from './validation';
import {
  createDefaultInput,
  EXAMPLE_NEW_BED,
  EXAMPLE_NEW_DRESS,
} from './types';

// Basic: Discount = Price × Rate / 100; After = Price − Amount; Save = Amount
{
  const out = calculatePercentageDiscount({
    priceBefore: 5_000,
    discountPercent: 20,
  });
  assert.ok(out);
  assert.equal(out.discountAmount, 1_000);
  assert.equal(out.priceAfter, 4_000);
}

// Example 2: bed 25,000 × 15%
{
  const out = calculatePercentageDiscount({
    priceBefore: 25_000,
    discountPercent: 15,
  });
  assert.ok(out);
  assert.equal(out.discountAmount, 3_750);
  assert.equal(out.priceAfter, 21_250);
}

// Zero discount allowed
{
  const out = calculatePercentageDiscount({
    priceBefore: 500,
    discountPercent: 0,
  });
  assert.ok(out);
  assert.equal(out.discountAmount, 0);
  assert.equal(out.priceAfter, 500);
}

// 100% off → pay 0
{
  const out = calculatePercentageDiscount({
    priceBefore: 1_000,
    discountPercent: 100,
  });
  assert.ok(out);
  assert.equal(out.discountAmount, 1_000);
  assert.equal(out.priceAfter, 0);
}

// Reject negative price / out-of-range rate / non-finite
{
  assert.equal(
    calculatePercentageDiscount({ priceBefore: -1, discountPercent: 10 }),
    null
  );
  assert.equal(
    calculatePercentageDiscount({ priceBefore: 100, discountPercent: -1 }),
    null
  );
  assert.equal(
    calculatePercentageDiscount({ priceBefore: 100, discountPercent: 101 }),
    null
  );
  assert.equal(
    calculatePercentageDiscount({
      priceBefore: Number.NaN,
      discountPercent: 10,
    }),
    null
  );
  assert.equal(
    calculatePercentageDiscount({
      priceBefore: 100,
      discountPercent: Number.POSITIVE_INFINITY,
    }),
    null
  );
}

// Display formatting
{
  assert.equal(formatPercentageDiscountMoney(4000, 'PKR'), '4,000.00');
  assert.equal(formatPercentageDiscountMoney(0, 'PKR'), '0.00');
}

// Validation: empty defaults → incomplete
{
  const empty = validatePercentageDiscountInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

// Validation: Example 1 dress happy path
{
  const dress = validatePercentageDiscountInput(EXAMPLE_NEW_DRESS);
  assert.equal(dress.isValid, true);
  assert.ok(dress.result);
  assert.equal(dress.result.priceAfterCanonical, 4_000);
  assert.equal(dress.result.youSaveCanonical, 1_000);
  assert.equal(dress.result.formattedPriceAfter, '4,000.00');
  assert.equal(dress.result.formattedYouSave, '1,000.00');
}

// Validation: Example 2 bed
{
  const bed = validatePercentageDiscountInput(EXAMPLE_NEW_BED);
  assert.equal(bed.isValid, true);
  assert.ok(bed.result);
  assert.equal(bed.result.priceAfterCanonical, 21_250);
  assert.equal(bed.result.youSaveCanonical, 3_750);
}

// Validation: reject price < 0 and rate outside 0–100
{
  const neg = validatePercentageDiscountInput({
    ...createDefaultInput(),
    priceBefore: '-1',
    discountPercent: '10',
  });
  assert.equal(neg.isValid, false);
  assert.ok(neg.errors.priceBefore);

  const over = validatePercentageDiscountInput({
    ...createDefaultInput(),
    priceBefore: '100',
    discountPercent: '150',
  });
  assert.equal(over.isValid, false);
  assert.ok(over.errors.discountPercent);
}

// Validation: mixed result currencies without rates → blocked (never 1:1)
{
  const mixed = validatePercentageDiscountInput(
    {
      ...createDefaultInput(),
      priceBefore: '1000',
      priceBeforeCurrency: 'USD',
      discountPercent: '10',
      priceAfterCurrency: 'PKR',
      youSaveCurrency: 'PKR',
    },
    null
  );
  assert.equal(mixed.isValid, false);
  assert.equal(mixed.result, null);
  assert.ok(mixed.errors.form);
}

// Validation: mixed currencies with rates → convert results only
{
  const rates = {
    available: true,
    baseCurrency: 'USD',
    rates: { USD: 1, PKR: 280 },
    fetchedAt: new Date().toISOString(),
    isStale: false,
    staleThresholdHours: 48,
    supportedCurrencies: ['USD', 'PKR'],
  };
  const mixed = validatePercentageDiscountInput(
    {
      ...createDefaultInput(),
      priceBefore: '1000',
      priceBeforeCurrency: 'USD',
      discountPercent: '10',
      priceAfterCurrency: 'PKR',
      youSaveCurrency: 'PKR',
    },
    rates
  );
  assert.equal(mixed.isValid, true);
  assert.ok(mixed.result);
  // Save = 100 USD → 28,000 PKR; After = 900 USD → 252,000 PKR
  assert.equal(mixed.result.youSaveCanonical, 100);
  assert.equal(mixed.result.priceAfterCanonical, 900);
  assert.equal(mixed.result.youSave, 28_000);
  assert.equal(mixed.result.priceAfter, 252_000);
  assert.equal(mixed.result.priceAfterCurrency, 'PKR');
  assert.equal(mixed.result.youSaveCurrency, 'PKR');
}

console.log('percentage-discount calculation.test.ts: ok');
