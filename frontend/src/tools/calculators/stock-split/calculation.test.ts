import assert from 'node:assert/strict';
import {
  calculateStockSplit,
  formatShareCount,
  formatStockSplitMoney,
} from './calculation';
import { validateStockSplitInput } from './validation';
import { createDefaultInput } from './types';

function approxEqual(actual: number, expected: number, eps = 1e-9) {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

// Forward 2-for-1
{
  const out = calculateStockSplit({
    sharesBefore: 100,
    sharePriceBefore: 50,
    ratioA: 2,
    ratioB: 1,
  });
  assert.ok(out);
  assert.equal(out.sharesAfter, 200);
  assert.equal(out.sharePriceAfter, 25);
  assert.equal(out.portfolioValueBefore, 5_000);
  assert.equal(out.portfolioValueAfter, 5_000);
  assert.equal(out.isForwardSplit, true);
  assert.equal(out.isReverseSplit, false);
}

// Forward 3-for-1
{
  const out = calculateStockSplit({
    sharesBefore: 90,
    sharePriceBefore: 30,
    ratioA: 3,
    ratioB: 1,
  });
  assert.ok(out);
  assert.equal(out.sharesAfter, 270);
  assert.equal(out.sharePriceAfter, 10);
  assert.equal(out.portfolioValueBefore, 2_700);
  assert.equal(out.portfolioValueAfter, 2_700);
}

// Reverse 1-for-5
{
  const out = calculateStockSplit({
    sharesBefore: 100,
    sharePriceBefore: 10,
    ratioA: 1,
    ratioB: 5,
  });
  assert.ok(out);
  assert.equal(out.sharesAfter, 20);
  assert.equal(out.sharePriceAfter, 50);
  assert.equal(out.portfolioValueBefore, 1_000);
  assert.equal(out.portfolioValueAfter, 1_000);
  assert.equal(out.isForwardSplit, false);
  assert.equal(out.isReverseSplit, true);
}

// Reverse 1-for-10
{
  const out = calculateStockSplit({
    sharesBefore: 250,
    sharePriceBefore: 4,
    ratioA: 1,
    ratioB: 10,
  });
  assert.ok(out);
  assert.equal(out.sharesAfter, 25);
  assert.equal(out.sharePriceAfter, 40);
  assert.equal(out.portfolioValueBefore, 1_000);
  assert.equal(out.portfolioValueAfter, 1_000);
}

// Fractional shares preserved
{
  const out = calculateStockSplit({
    sharesBefore: 100,
    sharePriceBefore: 15,
    ratioA: 3,
    ratioB: 2,
  });
  assert.ok(out);
  approxEqual(out.sharesAfter, 150);
  approxEqual(out.sharePriceAfter, 10);
  approxEqual(out.portfolioValueBefore, 1_500);
  approxEqual(out.portfolioValueAfter, 1_500);
}

// Zero price allowed; portfolio stays 0
{
  const out = calculateStockSplit({
    sharesBefore: 40,
    sharePriceBefore: 0,
    ratioA: 2,
    ratioB: 1,
  });
  assert.ok(out);
  assert.equal(out.sharesAfter, 80);
  assert.equal(out.sharePriceAfter, 0);
  assert.equal(out.portfolioValueBefore, 0);
  assert.equal(out.portfolioValueAfter, 0);
}

// Rejects
{
  assert.equal(
    calculateStockSplit({
      sharesBefore: 0,
      sharePriceBefore: 10,
      ratioA: 2,
      ratioB: 1,
    }),
    null
  );
  assert.equal(
    calculateStockSplit({
      sharesBefore: -1,
      sharePriceBefore: 10,
      ratioA: 2,
      ratioB: 1,
    }),
    null
  );
  assert.equal(
    calculateStockSplit({
      sharesBefore: 10,
      sharePriceBefore: -1,
      ratioA: 2,
      ratioB: 1,
    }),
    null
  );
  assert.equal(
    calculateStockSplit({
      sharesBefore: 10,
      sharePriceBefore: 5,
      ratioA: 0,
      ratioB: 1,
    }),
    null
  );
  assert.equal(
    calculateStockSplit({
      sharesBefore: 10,
      sharePriceBefore: 5,
      ratioA: 2,
      ratioB: 0,
    }),
    null
  );
  assert.equal(
    calculateStockSplit({
      sharesBefore: Number.NaN,
      sharePriceBefore: 5,
      ratioA: 2,
      ratioB: 1,
    }),
    null
  );
  assert.equal(
    calculateStockSplit({
      sharesBefore: 10,
      sharePriceBefore: 5,
      ratioA: Number.POSITIVE_INFINITY,
      ratioB: 1,
    }),
    null
  );
}

// Display formatting
{
  assert.equal(formatStockSplitMoney(25, 'PKR'), '25.00');
  assert.equal(formatShareCount(200), '200');
  assert.equal(formatShareCount(33.33333333), '33.33333333');
}

// Validation incomplete defaults
{
  const empty = validateStockSplitInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

// Validation same-currency happy path
{
  const ok = validateStockSplitInput({
    ...createDefaultInput(),
    sharesBefore: '100',
    sharePriceBefore: '50',
    ratioA: '2',
    ratioB: '1',
  });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.sharesAfter, 200);
  assert.equal(ok.result.sharePriceAfterCanonical, 25);
  assert.equal(ok.result.portfolioValueBeforeCanonical, 5_000);
  assert.equal(ok.result.portfolioValueAfterCanonical, 5_000);
  assert.equal(ok.result.formattedSharesAfter, '200');
  assert.equal(ok.result.formattedSharePriceAfter, '25.00');
}

// Validation rejects nonpositive shares / nonpositive ratio
{
  const badShares = validateStockSplitInput({
    ...createDefaultInput(),
    sharesBefore: '0',
    sharePriceBefore: '10',
    ratioA: '2',
    ratioB: '1',
  });
  assert.equal(badShares.isValid, false);
  assert.ok(badShares.errors.sharesBefore);

  const badRatio = validateStockSplitInput({
    ...createDefaultInput(),
    sharesBefore: '10',
    sharePriceBefore: '10',
    ratioA: '0',
    ratioB: '1',
  });
  assert.equal(badRatio.isValid, false);
  assert.ok(badRatio.errors.ratioA);
}

// Mixed currencies without rates → blocked
{
  const mixed = validateStockSplitInput(
    {
      ...createDefaultInput(),
      sharesBefore: '100',
      sharePriceBefore: '50',
      sharePriceBeforeCurrency: 'USD',
      ratioA: '2',
      ratioB: '1',
      sharePriceAfterCurrency: 'PKR',
      portfolioValueCurrency: 'PKR',
    },
    null
  );
  assert.equal(mixed.isValid, false);
  assert.equal(mixed.result, null);
  assert.ok(mixed.errors.form);
}

// Mixed currencies with rates → convert price/portfolio only
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
  const mixed = validateStockSplitInput(
    {
      ...createDefaultInput(),
      sharesBefore: '100',
      sharePriceBefore: '50',
      sharePriceBeforeCurrency: 'USD',
      ratioA: '2',
      ratioB: '1',
      sharePriceAfterCurrency: 'PKR',
      portfolioValueCurrency: 'PKR',
    },
    rates
  );
  assert.equal(mixed.isValid, true);
  assert.ok(mixed.result);
  assert.equal(mixed.result.sharesAfter, 200);
  approxEqual(mixed.result.sharePriceAfterCanonical, 25);
  approxEqual(mixed.result.sharePriceAfter, 7_000);
  approxEqual(mixed.result.portfolioValueBeforeCanonical, 5_000);
  approxEqual(mixed.result.portfolioValueBefore, 1_400_000);
  approxEqual(mixed.result.portfolioValueAfter, 1_400_000);
  assert.equal(mixed.result.sharePriceAfterCurrency, 'PKR');
  assert.equal(mixed.result.portfolioValueCurrency, 'PKR');
}

console.log('stock-split calculation.test.ts: ok');
