import assert from 'node:assert/strict';
import {
  calculateMarginalRevenue,
  formatMarginalRevenueMoney,
  formatQuantityChange,
} from './calculation';
import { validateMarginalRevenueInput } from './validation';
import { createDefaultInput } from './types';

{
  const out = calculateMarginalRevenue({
    initialRevenue: 10_000,
    finalRevenue: 12_500,
    initialQuantity: 100,
    finalQuantity: 125,
  });
  assert.ok(out);
  assert.equal(out.changeRevenue, 2_500);
  assert.equal(out.changeQuantity, 25);
  assert.equal(out.marginalRevenue, 100);
  assert.equal(out.undefinedMarginalRevenue, false);
}

{
  const out = calculateMarginalRevenue({
    initialRevenue: 5_000,
    finalRevenue: 4_000,
    initialQuantity: 50,
    finalQuantity: 40,
  });
  assert.ok(out);
  assert.equal(out.changeRevenue, -1_000);
  assert.equal(out.changeQuantity, -10);
  assert.equal(out.marginalRevenue, 100);
}

{
  const out = calculateMarginalRevenue({
    initialRevenue: 100,
    finalRevenue: 200,
    initialQuantity: 10,
    finalQuantity: 10,
  });
  assert.ok(out);
  assert.equal(out.changeRevenue, 100);
  assert.equal(out.changeQuantity, 0);
  assert.equal(out.marginalRevenue, null);
  assert.equal(out.undefinedMarginalRevenue, true);
}

{
  assert.equal(
    calculateMarginalRevenue({
      initialRevenue: Number.NaN,
      finalRevenue: 1,
      initialQuantity: 1,
      finalQuantity: 2,
    }),
    null
  );
}

{
  assert.equal(formatMarginalRevenueMoney(100, 'PKR'), '100.00');
  assert.equal(formatQuantityChange(25), '25');
  assert.equal(formatQuantityChange(2.5), '2.5');
}

{
  const empty = validateMarginalRevenueInput(createDefaultInput());
  assert.equal(empty.isValid, false);
}

{
  const ok = validateMarginalRevenueInput({
    ...createDefaultInput(),
    initialRevenue: '10000',
    finalRevenue: '12500',
    initialQuantity: '100',
    finalQuantity: '125',
  });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.changeRevenueCanonical, 2_500);
  assert.equal(ok.result.changeQuantity, 25);
  assert.equal(ok.result.marginalRevenueCanonical, 100);
  assert.equal(ok.result.undefinedMarginalRevenue, false);
  assert.equal(ok.result.formattedMarginalRevenue, '100.00');
}

{
  const zeroQ = validateMarginalRevenueInput({
    ...createDefaultInput(),
    initialRevenue: '100',
    finalRevenue: '200',
    initialQuantity: '10',
    finalQuantity: '10',
  });
  assert.equal(zeroQ.isValid, true);
  assert.ok(zeroQ.result);
  assert.equal(zeroQ.result.undefinedMarginalRevenue, true);
  assert.equal(zeroQ.result.marginalRevenueCanonical, null);
}

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
  const mixed = validateMarginalRevenueInput(
    {
      ...createDefaultInput(),
      initialRevenue: '10',
      initialRevenueCurrency: 'USD',
      finalRevenue: '5600',
      finalRevenueCurrency: 'PKR',
      changeRevenueCurrency: 'PKR',
      marginalRevenueCurrency: 'PKR',
      initialQuantity: '1',
      finalQuantity: '2',
    },
    rates
  );
  assert.equal(mixed.isValid, true);
  assert.ok(mixed.result);
  // initial 10 USD → 2800 PKR; final 5600 PKR; ΔTR = 2800; ΔQ = 1; MR = 2800
  assert.equal(mixed.result.changeRevenueCanonical, 2_800);
  assert.equal(mixed.result.marginalRevenueCanonical, 2_800);
  assert.equal(mixed.result.changeRevenue, 2_800);
  assert.equal(mixed.result.marginalRevenue, 2_800);
}

{
  const blocked = validateMarginalRevenueInput(
    {
      ...createDefaultInput(),
      initialRevenue: '10',
      initialRevenueCurrency: 'USD',
      finalRevenue: '20',
      finalRevenueCurrency: 'PKR',
      initialQuantity: '1',
      finalQuantity: '2',
    },
    null
  );
  assert.equal(blocked.isValid, false);
  assert.ok(blocked.errors.form);
}

console.log('marginal-revenue calculation.test.ts: ok');
