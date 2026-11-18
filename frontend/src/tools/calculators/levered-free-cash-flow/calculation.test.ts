import assert from 'node:assert/strict';
import {
  calculateLeveredFreeCashFlow,
  formatLeveredFcfMoney,
} from './calculation';
import { validateLeveredFreeCashFlowInput } from './validation';
import { createDefaultInput } from './types';

// Basic identity: Levered FCF = EBITDA − CapEx − ΔWC − Debt repayments
{
  const fcf = calculateLeveredFreeCashFlow({
    ebitda: 500_000,
    capex: 120_000,
    changeInWc: 30_000,
    debtRepayments: 50_000,
  });
  assert.equal(fcf, 300_000);
}

// Zero result allowed
{
  const fcf = calculateLeveredFreeCashFlow({
    ebitda: 100_000,
    capex: 40_000,
    changeInWc: 30_000,
    debtRepayments: 30_000,
  });
  assert.equal(fcf, 0);
}

// Negative ΔWC (WC release) increases FCF
{
  const fcf = calculateLeveredFreeCashFlow({
    ebitda: 200_000,
    capex: 50_000,
    changeInWc: -20_000,
    debtRepayments: 10_000,
  });
  assert.equal(fcf, 160_000);
}

// Negative levered FCF allowed
{
  const fcf = calculateLeveredFreeCashFlow({
    ebitda: 100_000,
    capex: 80_000,
    changeInWc: 40_000,
    debtRepayments: 30_000,
  });
  assert.equal(fcf, -50_000);
}

// Reject non-finite inputs
{
  assert.equal(
    calculateLeveredFreeCashFlow({
      ebitda: Number.NaN,
      capex: 1,
      changeInWc: 1,
      debtRepayments: 1,
    }),
    null
  );
  assert.equal(
    calculateLeveredFreeCashFlow({
      ebitda: 1,
      capex: Number.POSITIVE_INFINITY,
      changeInWc: 1,
      debtRepayments: 1,
    }),
    null
  );
}

// Display formatting
{
  assert.equal(formatLeveredFcfMoney(300000, 'PKR'), '300,000.00');
  assert.equal(formatLeveredFcfMoney(-50000, 'PKR'), '-50,000.00');
}

// Validation: empty defaults → incomplete
{
  const empty = validateLeveredFreeCashFlowInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

// Validation: same-currency happy path + negative flag
{
  const ok = validateLeveredFreeCashFlowInput({
    ...createDefaultInput(),
    ebitda: '500000',
    capex: '120000',
    changeInWc: '30000',
    debtRepayments: '50000',
  });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.leveredFcf, 300_000);
  assert.equal(ok.result.isNegative, false);
  assert.equal(ok.result.formattedLeveredFcf, '300,000.00');

  const negative = validateLeveredFreeCashFlowInput({
    ...createDefaultInput(),
    ebitda: '100000',
    capex: '80000',
    changeInWc: '40000',
    debtRepayments: '30000',
  });
  assert.equal(negative.isValid, true);
  assert.ok(negative.result);
  assert.equal(negative.result.leveredFcf, -50_000);
  assert.equal(negative.result.isNegative, true);
}

// Validation: mixed currencies without rates → blocked (never 1:1)
{
  const mixed = validateLeveredFreeCashFlowInput(
    {
      ...createDefaultInput(),
      ebitda: '100',
      ebitdaCurrency: 'USD',
      capex: '10',
      capexCurrency: 'PKR',
      changeInWc: '5',
      changeInWcCurrency: 'PKR',
      debtRepayments: '5',
      debtRepaymentsCurrency: 'PKR',
      leveredFcfCurrency: 'PKR',
    },
    null
  );
  assert.equal(mixed.isValid, false);
  assert.equal(mixed.result, null);
  assert.ok(mixed.errors.form);
}

// Validation: mixed currencies with rates → normalize then compute
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
  const mixed = validateLeveredFreeCashFlowInput(
    {
      ...createDefaultInput(),
      ebitda: '100',
      ebitdaCurrency: 'USD',
      capex: '5600',
      capexCurrency: 'PKR',
      changeInWc: '2800',
      changeInWcCurrency: 'PKR',
      debtRepayments: '1400',
      debtRepaymentsCurrency: 'PKR',
      leveredFcfCurrency: 'PKR',
    },
    rates
  );
  assert.equal(mixed.isValid, true);
  assert.ok(mixed.result);
  // EBITDA = 100 USD → 28,000 PKR; CapEx 5,600; ΔWC 2,800; Debt 1,400 → 18,200
  assert.equal(mixed.result.leveredFcf, 18_200);
  assert.equal(mixed.result.currency, 'PKR');
}

console.log('levered-free-cash-flow calculation.test.ts: ok');
