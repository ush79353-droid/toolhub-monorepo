import assert from 'node:assert/strict';
import {
  calculateTripleDiscount,
  formatEffectiveDiscountPercent,
  formatTripleDiscountMoney,
} from './calculation';
import { validateTripleDiscountInput } from './validation';
import { createDefaultInput } from './types';

function approxEqual(actual: number, expected: number, eps = 1e-9) {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

// Example: three 20% discounts → 48.8% effective, not 60%
{
  const out = calculateTripleDiscount({
    originalPrice: 10_000,
    firstDiscountPercent: 20,
    secondDiscountPercent: 20,
    thirdDiscountPercent: 20,
  });
  assert.ok(out);
  // 10000×0.8³ has binary float noise; keep full precision in engine
  approxEqual(out.finalPrice, 5_120);
  approxEqual(out.priceDifference, 4_880);
  approxEqual(out.effectiveDiscountPercent, 48.8);
}

// Zero discounts allowed (incl. defaults)
{
  const out = calculateTripleDiscount({
    originalPrice: 500,
    firstDiscountPercent: 0,
    secondDiscountPercent: 0,
    thirdDiscountPercent: 0,
  });
  assert.ok(out);
  assert.equal(out.finalPrice, 500);
  assert.equal(out.priceDifference, 0);
  assert.equal(out.effectiveDiscountPercent, 0);
}

// 100% then anything → final 0
{
  const out = calculateTripleDiscount({
    originalPrice: 1_000,
    firstDiscountPercent: 100,
    secondDiscountPercent: 50,
    thirdDiscountPercent: 25,
  });
  assert.ok(out);
  assert.equal(out.finalPrice, 0);
  assert.equal(out.priceDifference, 1_000);
  assert.equal(out.effectiveDiscountPercent, 100);
}

// Only first discount (2nd/3rd zero) matches single percent-off
{
  const out = calculateTripleDiscount({
    originalPrice: 200,
    firstDiscountPercent: 10,
    secondDiscountPercent: 0,
    thirdDiscountPercent: 0,
  });
  assert.ok(out);
  approxEqual(out.finalPrice, 180);
  approxEqual(out.priceDifference, 20);
  approxEqual(out.effectiveDiscountPercent, 10);
}

// Reject negative price / out-of-range rates / non-finite
{
  assert.equal(
    calculateTripleDiscount({
      originalPrice: -1,
      firstDiscountPercent: 10,
      secondDiscountPercent: 10,
      thirdDiscountPercent: 10,
    }),
    null
  );
  assert.equal(
    calculateTripleDiscount({
      originalPrice: 100,
      firstDiscountPercent: -1,
      secondDiscountPercent: 10,
      thirdDiscountPercent: 10,
    }),
    null
  );
  assert.equal(
    calculateTripleDiscount({
      originalPrice: 100,
      firstDiscountPercent: 10,
      secondDiscountPercent: 10,
      thirdDiscountPercent: 101,
    }),
    null
  );
  assert.equal(
    calculateTripleDiscount({
      originalPrice: Number.NaN,
      firstDiscountPercent: 10,
      secondDiscountPercent: 10,
      thirdDiscountPercent: 10,
    }),
    null
  );
  assert.equal(
    calculateTripleDiscount({
      originalPrice: 100,
      firstDiscountPercent: 10,
      secondDiscountPercent: Number.POSITIVE_INFINITY,
      thirdDiscountPercent: 10,
    }),
    null
  );
}

// Display formatting
{
  assert.equal(formatTripleDiscountMoney(5120, 'PKR'), '5,120.00');
  assert.equal(formatEffectiveDiscountPercent(48.8), '48.8');
  assert.equal(formatEffectiveDiscountPercent(48.12345), '48.1235');
}

// Validation: empty original/1st with default 0/0 → incomplete
{
  const empty = validateTripleDiscountInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

// Validation: same-currency happy path
{
  const ok = validateTripleDiscountInput({
    ...createDefaultInput(),
    originalPrice: '10000',
    firstDiscountPercent: '20',
    secondDiscountPercent: '20',
    thirdDiscountPercent: '20',
  });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  approxEqual(ok.result.finalPriceCanonical, 5_120);
  approxEqual(ok.result.priceDifferenceCanonical, 4_880);
  approxEqual(ok.result.effectiveDiscountPercent, 48.8);
  assert.equal(ok.result.formattedFinalPrice, '5,120.00');
  assert.equal(ok.result.formattedPriceDifference, '4,880.00');
  assert.equal(ok.result.formattedEffectiveDiscountPercent, '48.8');
}

// Validation: reject price < 0 and rates outside 0–100
{
  const neg = validateTripleDiscountInput({
    ...createDefaultInput(),
    originalPrice: '-1',
    firstDiscountPercent: '10',
    secondDiscountPercent: '10',
    thirdDiscountPercent: '10',
  });
  assert.equal(neg.isValid, false);
  assert.ok(neg.errors.originalPrice);

  const over = validateTripleDiscountInput({
    ...createDefaultInput(),
    originalPrice: '100',
    firstDiscountPercent: '10',
    secondDiscountPercent: '10',
    thirdDiscountPercent: '150',
  });
  assert.equal(over.isValid, false);
  assert.ok(over.errors.thirdDiscountPercent);
}

// Validation: mixed result currencies without rates → blocked
{
  const mixed = validateTripleDiscountInput(
    {
      ...createDefaultInput(),
      originalPrice: '1000',
      originalPriceCurrency: 'USD',
      firstDiscountPercent: '10',
      secondDiscountPercent: '10',
      thirdDiscountPercent: '10',
      finalPriceCurrency: 'PKR',
      priceDifferenceCurrency: 'PKR',
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
  const mixed = validateTripleDiscountInput(
    {
      ...createDefaultInput(),
      originalPrice: '1000',
      originalPriceCurrency: 'USD',
      firstDiscountPercent: '10',
      secondDiscountPercent: '10',
      thirdDiscountPercent: '10',
      finalPriceCurrency: 'PKR',
      priceDifferenceCurrency: 'PKR',
    },
    rates
  );
  assert.equal(mixed.isValid, true);
  assert.ok(mixed.result);
  // Final = 1000 × 0.9 × 0.9 × 0.9 = 729 USD → 204,120 PKR
  // Diff = 271 USD → 75,880 PKR
  // Effective = [1 − 0.729] × 100 = 27.1%
  approxEqual(mixed.result.finalPriceCanonical, 729);
  approxEqual(mixed.result.priceDifferenceCanonical, 271);
  approxEqual(mixed.result.effectiveDiscountPercent, 27.1);
  approxEqual(mixed.result.finalPrice, 204_120);
  approxEqual(mixed.result.priceDifference, 75_880);
  assert.equal(mixed.result.finalPriceCurrency, 'PKR');
  assert.equal(mixed.result.priceDifferenceCurrency, 'PKR');
}

console.log('triple-discount calculation.test.ts: ok');
