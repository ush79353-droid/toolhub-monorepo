import assert from 'node:assert/strict';
import {
  calculateStockAverage,
  formatStockAverageMoney,
  formatStockAveragePercent,
  formatStockAverageShares,
} from './calculation';
import { validateStockAverageInput } from './validation';
import { createDefaultInput } from './types';

function approxEqual(actual: number, expected: number, eps = 1e-9) {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

// Weighted average: 100@50 + 50@60 → avg 53.333…
{
  const out = calculateStockAverage({
    firstBuyShares: 100,
    firstBuyPrice: 50,
    secondBuyShares: 50,
    secondBuyPrice: 60,
    currentPrice: null,
  });
  assert.ok(out);
  assert.equal(out.totalShares, 150);
  assert.equal(out.totalCost, 8_000);
  approxEqual(out.averagePrice, 8_000 / 150);
  assert.equal(out.marketValue, null);
  assert.equal(out.profitLoss, null);
  assert.equal(out.returnPercent, null);
}

// With market price → value, P/L, return %
{
  const out = calculateStockAverage({
    firstBuyShares: 100,
    firstBuyPrice: 50,
    secondBuyShares: 50,
    secondBuyPrice: 60,
    currentPrice: 55,
  });
  assert.ok(out);
  assert.equal(out.marketValue, 8_250);
  assert.equal(out.profitLoss, 250);
  approxEqual(out.returnPercent!, (250 / 8_000) * 100);
}

// Not a simple average of prices (would be 55)
{
  const out = calculateStockAverage({
    firstBuyShares: 10,
    firstBuyPrice: 100,
    secondBuyShares: 90,
    secondBuyPrice: 10,
    currentPrice: null,
  });
  assert.ok(out);
  assert.equal(out.totalCost, 1_900);
  approxEqual(out.averagePrice, 19);
}

// Zero-cost purchases: average 0; return undefined with market price
{
  const out = calculateStockAverage({
    firstBuyShares: 5,
    firstBuyPrice: 0,
    secondBuyShares: 5,
    secondBuyPrice: 0,
    currentPrice: 10,
  });
  assert.ok(out);
  assert.equal(out.totalCost, 0);
  assert.equal(out.averagePrice, 0);
  assert.equal(out.marketValue, 100);
  assert.equal(out.profitLoss, 100);
  assert.equal(out.returnPercent, null);
}

// Reject non-positive shares / negative prices
{
  assert.equal(
    calculateStockAverage({
      firstBuyShares: 0,
      firstBuyPrice: 10,
      secondBuyShares: 5,
      secondBuyPrice: 10,
      currentPrice: null,
    }),
    null
  );
  assert.equal(
    calculateStockAverage({
      firstBuyShares: 5,
      firstBuyPrice: -1,
      secondBuyShares: 5,
      secondBuyPrice: 10,
      currentPrice: null,
    }),
    null
  );
  assert.equal(
    calculateStockAverage({
      firstBuyShares: 5,
      firstBuyPrice: 10,
      secondBuyShares: 5,
      secondBuyPrice: 10,
      currentPrice: -1,
    }),
    null
  );
}

// Display formatting
{
  assert.equal(formatStockAverageMoney(8000, 'PKR'), '8,000.00');
  assert.equal(formatStockAverageShares(150), '150');
  assert.equal(formatStockAveragePercent(3.125), '3.125');
}

// Validation incomplete
{
  const empty = validateStockAverageInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

// Validation same-currency happy path
{
  const ok = validateStockAverageInput({
    ...createDefaultInput(),
    firstBuyShares: '100',
    firstBuyPrice: '50',
    secondBuyShares: '50',
    secondBuyPrice: '60',
    currentPrice: '55',
  });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.totalShares, 150);
  approxEqual(ok.result.totalCostCanonical, 8_000);
  approxEqual(ok.result.averagePriceCanonical, 8_000 / 150);
  approxEqual(ok.result.marketValueCanonical!, 8_250);
  approxEqual(ok.result.profitLossCanonical!, 250);
  approxEqual(ok.result.returnPercent!, 3.125);
}

// Mixed currencies without rates → blocked
{
  const mixed = validateStockAverageInput(
    {
      ...createDefaultInput(),
      firstBuyShares: '100',
      firstBuyPrice: '50',
      firstBuyPriceCurrency: 'USD',
      secondBuyShares: '50',
      secondBuyPrice: '60',
      secondBuyPriceCurrency: 'PKR',
    },
    null
  );
  assert.equal(mixed.isValid, false);
  assert.ok(mixed.errors.form);
}

// Mixed currencies with rates → normalize into 1st buy currency
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
  const mixed = validateStockAverageInput(
    {
      ...createDefaultInput(),
      firstBuyShares: '10',
      firstBuyPrice: '10',
      firstBuyPriceCurrency: 'USD',
      secondBuyShares: '10',
      secondBuyPrice: '2800',
      secondBuyPriceCurrency: 'PKR',
      currentPrice: '12',
      currentPriceCurrency: 'USD',
    },
    rates
  );
  assert.equal(mixed.isValid, true);
  assert.ok(mixed.result);
  // P2 2800 PKR → 10 USD; total cost 100+100=200; avg 10; MV 240; P/L 40; return 20%
  approxEqual(mixed.result.totalCostCanonical, 200);
  approxEqual(mixed.result.averagePriceCanonical, 10);
  approxEqual(mixed.result.marketValueCanonical!, 240);
  approxEqual(mixed.result.profitLossCanonical!, 40);
  approxEqual(mixed.result.returnPercent!, 20);
  assert.equal(mixed.result.resultCurrency, 'USD');
}

console.log('stock-average calculation.test.ts: ok');
