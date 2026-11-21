import assert from 'node:assert/strict';
import {
  calculatePercentOffDiscount,
  formatDiscountMoney,
} from './calculation';
import { validateDiscountInput } from './validation';
import { createDefaultInput } from './types';

// Basic: Discount = Price × Rate / 100; Final = Price − Discount; Savings = Discount
{
  const out = calculatePercentOffDiscount({
    originalPrice: 10_000,
    discountPercent: 20,
  });
  assert.ok(out);
  assert.equal(out.discountAmount, 2_000);
  assert.equal(out.finalPrice, 8_000);
}

// Zero discount allowed
{
  const out = calculatePercentOffDiscount({
    originalPrice: 500,
    discountPercent: 0,
  });
  assert.ok(out);
  assert.equal(out.discountAmount, 0);
  assert.equal(out.finalPrice, 500);
}

// 100% off → pay 0
{
  const out = calculatePercentOffDiscount({
    originalPrice: 1_000,
    discountPercent: 100,
  });
  assert.ok(out);
  assert.equal(out.discountAmount, 1_000);
  assert.equal(out.finalPrice, 0);
}

// Reject negative price / out-of-range rate / non-finite
{
  assert.equal(
    calculatePercentOffDiscount({ originalPrice: -1, discountPercent: 10 }),
    null
  );
  assert.equal(
    calculatePercentOffDiscount({ originalPrice: 100, discountPercent: -1 }),
    null
  );
  assert.equal(
    calculatePercentOffDiscount({ originalPrice: 100, discountPercent: 101 }),
    null
  );
  assert.equal(
    calculatePercentOffDiscount({
      originalPrice: Number.NaN,
      discountPercent: 10,
    }),
    null
  );
  assert.equal(
    calculatePercentOffDiscount({
      originalPrice: 100,
      discountPercent: Number.POSITIVE_INFINITY,
    }),
    null
  );
}

// Display formatting
{
  assert.equal(formatDiscountMoney(8000, 'PKR'), '8,000.00');
  assert.equal(formatDiscountMoney(0, 'PKR'), '0.00');
}

// Validation: empty defaults → incomplete
{
  const empty = validateDiscountInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

// Validation: same-currency happy path; taxIncluded does not change math
{
  const yes = validateDiscountInput({
    ...createDefaultInput(),
    originalPrice: '10000',
    discountPercent: '20',
    taxIncluded: 'yes',
  });
  assert.equal(yes.isValid, true);
  assert.ok(yes.result);
  assert.equal(yes.result.youPayCanonical, 8_000);
  assert.equal(yes.result.youSaveCanonical, 2_000);
  assert.equal(yes.result.formattedYouPay, '8,000.00');
  assert.equal(yes.result.formattedYouSave, '2,000.00');
  assert.equal(yes.result.taxIncluded, 'yes');

  const no = validateDiscountInput({
    ...createDefaultInput(),
    originalPrice: '10000',
    discountPercent: '20',
    taxIncluded: 'no',
  });
  assert.equal(no.isValid, true);
  assert.ok(no.result);
  assert.equal(no.result.youPayCanonical, yes.result.youPayCanonical);
  assert.equal(no.result.youSaveCanonical, yes.result.youSaveCanonical);
  assert.equal(no.result.taxIncluded, 'no');
}

// Validation: reject price < 0 and rate outside 0–100
{
  const neg = validateDiscountInput({
    ...createDefaultInput(),
    originalPrice: '-1',
    discountPercent: '10',
  });
  assert.equal(neg.isValid, false);
  assert.ok(neg.errors.originalPrice);

  const over = validateDiscountInput({
    ...createDefaultInput(),
    originalPrice: '100',
    discountPercent: '150',
  });
  assert.equal(over.isValid, false);
  assert.ok(over.errors.discountPercent);
}

// Validation: mixed result currencies without rates → blocked (never 1:1)
{
  const mixed = validateDiscountInput(
    {
      ...createDefaultInput(),
      originalPrice: '1000',
      originalPriceCurrency: 'USD',
      discountPercent: '10',
      youPayCurrency: 'PKR',
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
  const mixed = validateDiscountInput(
    {
      ...createDefaultInput(),
      originalPrice: '1000',
      originalPriceCurrency: 'USD',
      discountPercent: '10',
      youPayCurrency: 'PKR',
      youSaveCurrency: 'PKR',
    },
    rates
  );
  assert.equal(mixed.isValid, true);
  assert.ok(mixed.result);
  // Save = 100 USD → 28,000 PKR; Pay = 900 USD → 252,000 PKR
  assert.equal(mixed.result.youSaveCanonical, 100);
  assert.equal(mixed.result.youPayCanonical, 900);
  assert.equal(mixed.result.youSave, 28_000);
  assert.equal(mixed.result.youPay, 252_000);
  assert.equal(mixed.result.youPayCurrency, 'PKR');
  assert.equal(mixed.result.youSaveCurrency, 'PKR');
}

console.log('discount calculation.test.ts: ok');
