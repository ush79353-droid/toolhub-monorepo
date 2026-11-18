import assert from 'node:assert/strict';
import {
  calculateDoubleDiscount,
  formatDoubleDiscountMoney,
  formatEffectiveDiscountPercent,
} from './calculation';
import { validateDoubleDiscountInput } from './validation';
import { createDefaultInput } from './types';

// Example: two 20% discounts → 36% effective, not 40%
{
  const out = calculateDoubleDiscount({
    originalPrice: 10_000,
    firstDiscountPercent: 20,
    secondDiscountPercent: 20,
  });
  assert.ok(out);
  assert.equal(out.finalPrice, 6_400);
  assert.equal(out.totalSavings, 3_600);
  assert.equal(out.effectiveDiscountPercent, 36);
}

// Zero discounts allowed
{
  const out = calculateDoubleDiscount({
    originalPrice: 500,
    firstDiscountPercent: 0,
    secondDiscountPercent: 0,
  });
  assert.ok(out);
  assert.equal(out.finalPrice, 500);
  assert.equal(out.totalSavings, 0);
  assert.equal(out.effectiveDiscountPercent, 0);
}

// 100% then anything → final 0
{
  const out = calculateDoubleDiscount({
    originalPrice: 1_000,
    firstDiscountPercent: 100,
    secondDiscountPercent: 50,
  });
  assert.ok(out);
  assert.equal(out.finalPrice, 0);
  assert.equal(out.totalSavings, 1_000);
  assert.equal(out.effectiveDiscountPercent, 100);
}

// Reject negative price / out-of-range rates / non-finite
{
  assert.equal(
    calculateDoubleDiscount({
      originalPrice: -1,
      firstDiscountPercent: 10,
      secondDiscountPercent: 10,
    }),
    null
  );
  assert.equal(
    calculateDoubleDiscount({
      originalPrice: 100,
      firstDiscountPercent: -1,
      secondDiscountPercent: 10,
    }),
    null
  );
  assert.equal(
    calculateDoubleDiscount({
      originalPrice: 100,
      firstDiscountPercent: 10,
      secondDiscountPercent: 101,
    }),
    null
  );
  assert.equal(
    calculateDoubleDiscount({
      originalPrice: Number.NaN,
      firstDiscountPercent: 10,
      secondDiscountPercent: 10,
    }),
    null
  );
  assert.equal(
    calculateDoubleDiscount({
      originalPrice: 100,
      firstDiscountPercent: Number.POSITIVE_INFINITY,
      secondDiscountPercent: 10,
    }),
    null
  );
}

// Display formatting
{
  assert.equal(formatDoubleDiscountMoney(6400, 'PKR'), '6,400.00');
  assert.equal(formatEffectiveDiscountPercent(36), '36');
  assert.equal(formatEffectiveDiscountPercent(36.12345), '36.1235');
}

// Validation: empty defaults → incomplete
{
  const empty = validateDoubleDiscountInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

// Validation: same-currency happy path
{
  const ok = validateDoubleDiscountInput({
    ...createDefaultInput(),
    originalPrice: '10000',
    firstDiscountPercent: '20',
    secondDiscountPercent: '20',
  });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.finalPriceCanonical, 6_400);
  assert.equal(ok.result.totalSavingsCanonical, 3_600);
  assert.equal(ok.result.effectiveDiscountPercent, 36);
  assert.equal(ok.result.formattedFinalPrice, '6,400.00');
  assert.equal(ok.result.formattedTotalSavings, '3,600.00');
  assert.equal(ok.result.formattedEffectiveDiscountPercent, '36');
}

// Validation: reject price < 0 and rates outside 0–100
{
  const neg = validateDoubleDiscountInput({
    ...createDefaultInput(),
    originalPrice: '-1',
    firstDiscountPercent: '10',
    secondDiscountPercent: '10',
  });
  assert.equal(neg.isValid, false);
  assert.ok(neg.errors.originalPrice);

  const over = validateDoubleDiscountInput({
    ...createDefaultInput(),
    originalPrice: '100',
    firstDiscountPercent: '10',
    secondDiscountPercent: '150',
  });
  assert.equal(over.isValid, false);
  assert.ok(over.errors.secondDiscountPercent);
}

// Validation: mixed result currencies without rates → blocked
{
  const mixed = validateDoubleDiscountInput(
    {
      ...createDefaultInput(),
      originalPrice: '1000',
      originalPriceCurrency: 'USD',
      firstDiscountPercent: '10',
      secondDiscountPercent: '10',
      finalPriceCurrency: 'PKR',
      totalSavingsCurrency: 'PKR',
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
  const mixed = validateDoubleDiscountInput(
    {
      ...createDefaultInput(),
      originalPrice: '1000',
      originalPriceCurrency: 'USD',
      firstDiscountPercent: '10',
      secondDiscountPercent: '10',
      finalPriceCurrency: 'PKR',
      totalSavingsCurrency: 'PKR',
    },
    rates
  );
  assert.equal(mixed.isValid, true);
  assert.ok(mixed.result);
  // Final = 1000 × 0.9 × 0.9 = 810 USD → 226,800 PKR
  // Save = 190 USD → 53,200 PKR
  // Effective = 10+10-(10×10/100) = 19%
  assert.equal(mixed.result.finalPriceCanonical, 810);
  assert.equal(mixed.result.totalSavingsCanonical, 190);
  assert.equal(mixed.result.effectiveDiscountPercent, 19);
  assert.equal(mixed.result.finalPrice, 226_800);
  assert.equal(mixed.result.totalSavings, 53_200);
  assert.equal(mixed.result.finalPriceCurrency, 'PKR');
  assert.equal(mixed.result.totalSavingsCurrency, 'PKR');
}

console.log('double-discount calculation.test.ts: ok');
