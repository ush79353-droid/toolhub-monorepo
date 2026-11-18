/**
 * Runnable self-check for Dividend Yield Calculator formulas.
 * Run: npx --yes tsx src/tools/calculators/dividend-yield/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  calculateDividendYield,
  paymentsPerYearForFrequency,
} from './calculation';
import { createDefaultInput } from './types';
import { validateDividendYieldInput } from './validation';

assert.equal(paymentsPerYearForFrequency(''), null);
assert.equal(paymentsPerYearForFrequency('annually'), 1);
assert.equal(paymentsPerYearForFrequency('semiannually'), 2);
assert.equal(paymentsPerYearForFrequency('quarterly'), 4);
assert.equal(paymentsPerYearForFrequency('monthly'), 12);

{
  const r = calculateDividendYield({
    dividendsPerPeriod: 2.5,
    paymentsPerYear: 4,
    sharePrice: 100,
  });
  assert.ok(r);
  assert.equal(r.annualDividends, 10);
  assert.equal(r.dividendYieldPercent, 10);
}

{
  const r = calculateDividendYield({
    dividendsPerPeriod: 0,
    paymentsPerYear: 12,
    sharePrice: 50,
  });
  assert.ok(r);
  assert.equal(r.annualDividends, 0);
  assert.equal(r.dividendYieldPercent, 0);
}

{
  const r = calculateDividendYield({
    dividendsPerPeriod: 5,
    paymentsPerYear: 2,
  });
  assert.ok(r);
  assert.equal(r.annualDividends, 10);
  assert.equal(r.dividendYieldPercent, null);
}

assert.equal(
  calculateDividendYield({
    dividendsPerPeriod: 1,
    paymentsPerYear: 4,
    sharePrice: 0,
  }),
  null
);

assert.equal(
  calculateDividendYield({
    dividendsPerPeriod: -1,
    paymentsPerYear: 4,
    sharePrice: 100,
  }),
  null
);

{
  const empty = validateDividendYieldInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

{
  const noFreq = validateDividendYieldInput({
    ...createDefaultInput(),
    dividendsPerPeriod: '2.5',
  });
  assert.equal(noFreq.isValid, false);
  assert.ok(noFreq.errors.frequency);
}

{
  const annualOnly = validateDividendYieldInput({
    ...createDefaultInput(),
    dividendsPerPeriod: '2.5',
    frequency: 'quarterly',
  });
  assert.equal(annualOnly.isValid, true);
  assert.ok(annualOnly.result);
  assert.equal(annualOnly.result.annualDividendsInPeriodCurrency, 10);
  assert.equal(annualOnly.result.dividendYieldPercent, null);
}

{
  const full = validateDividendYieldInput({
    ...createDefaultInput(),
    dividendsPerPeriod: '2.5',
    frequency: 'quarterly',
    sharePrice: '100',
  });
  assert.equal(full.isValid, true);
  assert.ok(full.result);
  assert.equal(full.result.annualDividendsInPeriodCurrency, 10);
  assert.equal(full.result.dividendYieldPercent, 10);
  assert.equal(full.result.formattedDividendYieldPercent, '10.00');
}

{
  const zeroPrice = validateDividendYieldInput({
    ...createDefaultInput(),
    dividendsPerPeriod: '1',
    frequency: 'annually',
    sharePrice: '0',
  });
  assert.equal(zeroPrice.isValid, true);
  assert.ok(zeroPrice.errors.sharePrice);
  assert.ok(zeroPrice.result);
  assert.equal(zeroPrice.result.annualDividendsInPeriodCurrency, 1);
  assert.equal(zeroPrice.result.dividendYieldPercent, null);
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
  const fx = validateDividendYieldInput(
    {
      ...createDefaultInput(),
      dividendsPerPeriod: '1',
      dividendsPerPeriodCurrency: 'USD',
      frequency: 'annually',
      annualDividendsCurrency: 'PKR',
      sharePrice: '280',
      sharePriceCurrency: 'PKR',
    },
    rates
  );
  assert.equal(fx.isValid, true);
  assert.ok(fx.result);
  // 280 PKR → 1 USD share; annual 1 USD → yield 100%; annual display 280 PKR
  assert.equal(fx.result.dividendYieldPercent, 100);
  assert.equal(fx.result.annualDividends, 280);
}

console.log('dividend-yield calculation.test.ts: all assertions passed');
