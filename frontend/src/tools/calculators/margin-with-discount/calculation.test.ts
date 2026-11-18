import assert from 'node:assert/strict';
import {
  calculateMarginWithDiscount,
  formatMoneyAmount,
  formatPercentValue,
  marginFromMarkupPercent,
  markupFromMarginPercent,
} from './calculation';
import { validateMarginWithDiscountInput } from './validation';
import { createDefaultInput } from './types';

// Example: cost 100, margin 25%, discount 10%
{
  const out = calculateMarginWithDiscount({
    cost: 100,
    baseMarginPercent: 25,
    baseMarkupPercent: null,
    baseRevenue: null,
    driver: 'margin',
    discountPercent: 10,
  });
  assert.ok(out);
  assert.ok(Math.abs(out.baseRevenue - 100 / 0.75) < 1e-10);
  assert.equal(out.baseMarginPercent, 25);
  assert.ok(Math.abs(out.baseMarkupPercent - 100 / 3) < 1e-10);
  assert.ok(Math.abs(out.priceAfterDiscount - (100 / 0.75) * 0.9) < 1e-10);
  assert.ok(Math.abs(out.profit - ((100 / 0.75) * 0.9 - 100)) < 1e-10);
  assert.ok(Math.abs(out.trueMarginPercent - (20 / 120) * 100) < 1e-8);
  assert.ok(Math.abs(out.trueMarkupPercent - 20) < 1e-8);
}

// Markup driver: cost 100, markup 50% → revenue 150; no discount
{
  const out = calculateMarginWithDiscount({
    cost: 100,
    baseMarginPercent: null,
    baseMarkupPercent: 50,
    baseRevenue: null,
    driver: 'markup',
    discountPercent: 0,
  });
  assert.ok(out);
  assert.equal(out.baseRevenue, 150);
  assert.ok(Math.abs(out.baseMarginPercent - (50 / 150) * 100) < 1e-10);
  assert.equal(out.baseMarkupPercent, 50);
  assert.equal(out.priceAfterDiscount, 150);
  assert.equal(out.profit, 50);
  assert.ok(Math.abs(out.trueMarginPercent - (50 / 150) * 100) < 1e-10);
  assert.equal(out.trueMarkupPercent, 50);
}

// Revenue driver: cost 80, revenue 100 → margin 20%, markup 25%; discount 20%
{
  const out = calculateMarginWithDiscount({
    cost: 80,
    baseMarginPercent: null,
    baseMarkupPercent: null,
    baseRevenue: 100,
    driver: 'revenue',
    discountPercent: 20,
  });
  assert.ok(out);
  assert.equal(out.baseRevenue, 100);
  assert.equal(out.baseMarginPercent, 20);
  assert.equal(out.baseMarkupPercent, 25);
  assert.equal(out.priceAfterDiscount, 80);
  assert.equal(out.profit, 0);
  assert.equal(out.trueMarginPercent, 0);
  assert.equal(out.trueMarkupPercent, 0);
}

// Margin ↔ markup sync helpers
{
  const markup = markupFromMarginPercent(25);
  assert.ok(markup);
  assert.ok(Math.abs(markup - 100 / 3) < 1e-10);
  const margin = marginFromMarkupPercent(markup);
  assert.ok(margin);
  assert.ok(Math.abs(margin - 25) < 1e-10);
}

// Reject: negative cost, discount > 100, margin ≥ 100
{
  assert.equal(
    calculateMarginWithDiscount({
      cost: -1,
      baseMarginPercent: 20,
      baseMarkupPercent: null,
      baseRevenue: null,
      driver: 'margin',
      discountPercent: 10,
    }),
    null
  );
  assert.equal(
    calculateMarginWithDiscount({
      cost: 100,
      baseMarginPercent: 20,
      baseMarkupPercent: null,
      baseRevenue: null,
      driver: 'margin',
      discountPercent: 101,
    }),
    null
  );
  assert.equal(
    calculateMarginWithDiscount({
      cost: 100,
      baseMarginPercent: 100,
      baseMarkupPercent: null,
      baseRevenue: null,
      driver: 'margin',
      discountPercent: 0,
    }),
    null
  );
  assert.equal(
    calculateMarginWithDiscount({
      cost: Number.NaN,
      baseMarginPercent: 20,
      baseMarkupPercent: null,
      baseRevenue: null,
      driver: 'margin',
      discountPercent: 0,
    }),
    null
  );
}

// Zero cost + zero profit after discount allowed via markup 0
{
  const out = calculateMarginWithDiscount({
    cost: 0,
    baseMarginPercent: null,
    baseMarkupPercent: 0,
    baseRevenue: null,
    driver: 'markup',
    discountPercent: 0,
  });
  assert.ok(out);
  assert.equal(out.baseRevenue, 0);
  assert.equal(out.profit, 0);
  assert.equal(out.trueMarginPercent, 0);
  assert.equal(out.trueMarkupPercent, 0);
}

// Display formatting
{
  assert.equal(formatMoneyAmount(120, 'PKR'), '120.00');
  assert.equal(formatPercentValue(25), '25');
  assert.ok(formatPercentValue(100 / 3).startsWith('33.333'));
}

// Validation: empty defaults → incomplete
{
  const empty = validateMarginWithDiscountInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

// Validation: margin driver happy path + synced markup/revenue
{
  const ok = validateMarginWithDiscountInput({
    ...createDefaultInput(),
    cost: '100',
    baseMargin: '25',
    discountPercent: '10',
    driver: 'margin',
  });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.ok(Math.abs(ok.result.baseRevenueCanonical - 100 / 0.75) < 1e-10);
  assert.ok(Math.abs(ok.result.trueMarkupPercent - 20) < 1e-8);
  assert.ok(ok.synced?.baseMarkup);
  assert.ok(ok.synced?.baseRevenue);
}

// Validation: reject margin ≥ 100 and discount out of range
{
  const badMargin = validateMarginWithDiscountInput({
    ...createDefaultInput(),
    cost: '100',
    baseMargin: '100',
    discountPercent: '0',
    driver: 'margin',
  });
  assert.equal(badMargin.isValid, false);
  assert.ok(badMargin.errors.baseMargin);

  const badDiscount = validateMarginWithDiscountInput({
    ...createDefaultInput(),
    cost: '100',
    baseMargin: '20',
    discountPercent: '150',
    driver: 'margin',
  });
  assert.equal(badDiscount.isValid, false);
  assert.ok(badDiscount.errors.discountPercent);
}

// Validation: mixed result currencies without rates → blocked
{
  const mixed = validateMarginWithDiscountInput(
    {
      ...createDefaultInput(),
      cost: '100',
      costCurrency: 'USD',
      baseMargin: '25',
      discountPercent: '10',
      driver: 'margin',
      priceAfterDiscountCurrency: 'PKR',
      profitCurrency: 'PKR',
    },
    null
  );
  assert.equal(mixed.isValid, false);
  assert.equal(mixed.result, null);
  assert.ok(mixed.errors.form);
}

// Validation: mixed currencies with rates → convert money results only
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
  const mixed = validateMarginWithDiscountInput(
    {
      ...createDefaultInput(),
      cost: '100',
      costCurrency: 'USD',
      baseMargin: '25',
      discountPercent: '10',
      driver: 'margin',
      baseRevenueCurrency: 'PKR',
      priceAfterDiscountCurrency: 'PKR',
      profitCurrency: 'PKR',
    },
    rates
  );
  assert.equal(mixed.isValid, true);
  assert.ok(mixed.result);
  // Revenue ≈ 133.3333 USD → ×280 PKR; price ≈ 120 USD → 33,600 PKR; profit 20 → 5,600
  assert.ok(Math.abs(mixed.result.baseRevenueCanonical - 100 / 0.75) < 1e-10);
  assert.ok(Math.abs(mixed.result.priceAfterDiscount - 33_600) < 1e-6);
  assert.ok(Math.abs(mixed.result.profit - 5_600) < 1e-6);
  assert.ok(
    Math.abs(mixed.result.trueMarginPercent - (20 / 120) * 100) < 1e-8
  );
  assert.ok(Math.abs(mixed.result.trueMarkupPercent - 20) < 1e-8);
}

console.log('margin-with-discount calculation.test.ts: ok');
