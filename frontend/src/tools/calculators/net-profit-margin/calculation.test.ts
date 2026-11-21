import assert from 'node:assert/strict';
import {
  calculateNetProfitMargin,
  formatNetProfitMarginPercent,
} from './calculation';
import { createDefaultInput } from './types';
import { validateNetProfitMarginInput } from './validation';

{
  const r = calculateNetProfitMargin({ netProfit: 25_000, totalRevenues: 100_000 });
  assert.ok(r);
  assert.equal(r.marginPercent, 25);
}

{
  const r = calculateNetProfitMargin({ netProfit: 0, totalRevenues: 50_000 });
  assert.ok(r);
  assert.equal(r.marginPercent, 0);
}

{
  const r = calculateNetProfitMargin({ netProfit: -10_000, totalRevenues: 80_000 });
  assert.ok(r);
  assert.equal(r.marginPercent, -12.5);
}

{
  assert.equal(calculateNetProfitMargin({ netProfit: 10, totalRevenues: 0 }), null);
  assert.equal(calculateNetProfitMargin({ netProfit: 10, totalRevenues: -1 }), null);
  assert.equal(calculateNetProfitMargin({ netProfit: Number.NaN, totalRevenues: 100 }), null);
}

{
  assert.equal(formatNetProfitMarginPercent(25), '25.00');
  assert.equal(formatNetProfitMarginPercent(-12.5), '-12.50');
}

{
  const validation = validateNetProfitMarginInput({
    ...createDefaultInput(),
    netProfit: '25000',
    totalRevenues: '100000',
  });
  assert.equal(validation.isValid, true);
  assert.ok(validation.result);
  assert.equal(validation.result.marginPercent, 25);
  assert.equal(validation.result.formattedMarginPercent, '25.00');
}

{
  const validation = validateNetProfitMarginInput({
    ...createDefaultInput(),
    netProfit: '100',
    totalRevenues: '0',
  });
  assert.equal(validation.isValid, false);
  assert.match(validation.errors.totalRevenues ?? '', /greater than zero/i);
}

{
  const validation = validateNetProfitMarginInput({
    ...createDefaultInput(),
    netProfit: '100',
    totalRevenues: '-50',
  });
  assert.equal(validation.isValid, false);
  assert.match(validation.errors.totalRevenues ?? '', /negative/i);
}

{
  // Cross-currency: 100 USD → PKR at USD=1, PKR=280 → 28,000 / 10,000 = 280%.
  const rates = {
    available: true,
    baseCurrency: 'USD',
    rates: { USD: 1, PKR: 280, EUR: 0.92 },
    fetchedAt: new Date().toISOString(),
    isStale: false,
    staleThresholdHours: 48,
    supportedCurrencies: ['USD', 'PKR', 'EUR'],
  };
  const validation = validateNetProfitMarginInput(
    {
      netProfit: '100',
      netProfitCurrency: 'USD',
      totalRevenues: '10000',
      totalRevenuesCurrency: 'PKR',
    },
    rates
  );
  assert.equal(validation.isValid, true);
  assert.ok(validation.result);
  assert.equal(validation.result.marginPercent, 280);
}

{
  const blocked = validateNetProfitMarginInput(
    {
      netProfit: '100',
      netProfitCurrency: 'USD',
      totalRevenues: '10000',
      totalRevenuesCurrency: 'PKR',
    },
    {
      available: false,
      baseCurrency: null,
      rates: {},
      fetchedAt: null,
      isStale: false,
      staleThresholdHours: 48,
      supportedCurrencies: [],
    }
  );
  assert.equal(blocked.isValid, false);
  assert.ok(blocked.errors.form);
}

console.log('net-profit-margin calculation.test.ts: all assertions passed');
