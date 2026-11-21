import assert from 'node:assert/strict';
import {
  calculateReturnOnSales,
  formatReturnOnSalesPercent,
} from './calculation';
import { createDefaultInput } from './types';
import { validateReturnOnSalesInput } from './validation';

{
  const r = calculateReturnOnSales({ operatingProfit: 25_000, netSales: 100_000 });
  assert.ok(r);
  assert.equal(r.rosPercent, 25);
}

{
  const r = calculateReturnOnSales({ operatingProfit: 0, netSales: 50_000 });
  assert.ok(r);
  assert.equal(r.rosPercent, 0);
}

{
  const r = calculateReturnOnSales({ operatingProfit: -10_000, netSales: 80_000 });
  assert.ok(r);
  assert.equal(r.rosPercent, -12.5);
}

{
  assert.equal(calculateReturnOnSales({ operatingProfit: 10, netSales: 0 }), null);
  assert.equal(calculateReturnOnSales({ operatingProfit: 10, netSales: -1 }), null);
  assert.equal(calculateReturnOnSales({ operatingProfit: Number.NaN, netSales: 100 }), null);
}

{
  assert.equal(formatReturnOnSalesPercent(25), '25.00');
  assert.equal(formatReturnOnSalesPercent(-12.5), '-12.50');
}

{
  const validation = validateReturnOnSalesInput({
    ...createDefaultInput(),
    operatingProfit: '25000',
    netSales: '100000',
  });
  assert.equal(validation.isValid, true);
  assert.ok(validation.result);
  assert.equal(validation.result.rosPercent, 25);
  assert.equal(validation.result.formattedRosPercent, '25.00');
}

{
  const validation = validateReturnOnSalesInput({
    ...createDefaultInput(),
    operatingProfit: '100',
    netSales: '0',
  });
  assert.equal(validation.isValid, false);
  assert.match(validation.errors.netSales ?? '', /greater than zero/i);
}

{
  const validation = validateReturnOnSalesInput({
    ...createDefaultInput(),
    operatingProfit: '100',
    netSales: '-50',
  });
  assert.equal(validation.isValid, false);
  assert.match(validation.errors.netSales ?? '', /negative/i);
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
  const validation = validateReturnOnSalesInput(
    {
      operatingProfit: '100',
      operatingProfitCurrency: 'USD',
      netSales: '10000',
      netSalesCurrency: 'PKR',
    },
    rates
  );
  assert.equal(validation.isValid, true);
  assert.ok(validation.result);
  assert.equal(validation.result.rosPercent, 280);
}

{
  const blocked = validateReturnOnSalesInput(
    {
      operatingProfit: '100',
      operatingProfitCurrency: 'USD',
      netSales: '10000',
      netSalesCurrency: 'PKR',
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

console.log('return-on-sales calculation.test.ts: all assertions passed');
