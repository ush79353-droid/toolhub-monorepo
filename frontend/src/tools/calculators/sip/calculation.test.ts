import assert from 'node:assert/strict';
import { calculateSip } from './calculation';
import { validateSipInput } from './validation';
import { createDefaultInput } from './types';

{
  const out = calculateSip({
    monthlyAmount: 10_000,
    years: 10,
    annualReturnPercent: 12,
  });
  assert.ok(out);
  assert.equal(out.totalInvestment, 1_200_000);
  // FV ≈ 23,00,387.29 for classic SIP at 12% / 10y / 10k
  assert.ok(out.maturityAmount > 2_000_000 && out.maturityAmount < 2_500_000);
  assert.ok(out.multiplicationFactor > 1);
}

{
  const zero = calculateSip({
    monthlyAmount: 1_000,
    years: 5,
    annualReturnPercent: 0,
  });
  assert.ok(zero);
  assert.equal(zero.totalInvestment, 60_000);
  assert.equal(zero.maturityAmount, 60_000);
  assert.equal(zero.multiplicationFactor, 1);
}

{
  assert.equal(
    calculateSip({ monthlyAmount: -1, years: 1, annualReturnPercent: 10 }),
    null
  );
  assert.equal(
    calculateSip({ monthlyAmount: 100, years: 0, annualReturnPercent: 10 }),
    null
  );
}

{
  const ok = validateSipInput({
    ...createDefaultInput(),
    monthlyAmount: '10000',
    years: '10',
    annualReturnPercent: '12',
  });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.totalInvestmentCanonical, 1_200_000);
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
  const mixed = validateSipInput(
    {
      ...createDefaultInput(),
      monthlyAmount: '10',
      monthlyAmountCurrency: 'USD',
      years: '1',
      annualReturnPercent: '0',
      totalInvestmentCurrency: 'PKR',
      maturityCurrency: 'PKR',
    },
    rates
  );
  assert.equal(mixed.isValid, true);
  assert.ok(mixed.result);
  assert.equal(mixed.result.totalInvestmentCanonical, 120);
  assert.equal(mixed.result.totalInvestment, 33_600);
  assert.equal(mixed.result.maturityAmount, 33_600);
}

console.log('sip calculation.test.ts: ok');
