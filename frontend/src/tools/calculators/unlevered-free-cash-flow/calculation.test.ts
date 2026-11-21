import assert from 'node:assert/strict';
import {
  calculateUnleveredFreeCashFlow,
  formatUfcfMoney,
} from './calculation';
import { validateUnleveredFreeCashFlowInput } from './validation';
import { createDefaultInput } from './types';

// Basic: NOPAT = EBIT×(1−ETR/100); UFCF = NOPAT + DA − CapEx − ΔWC
{
  const out = calculateUnleveredFreeCashFlow({
    ebit: 400_000,
    etrPercent: 25,
    da: 50_000,
    capex: 80_000,
    changeInWc: 20_000,
  });
  assert.ok(out);
  assert.equal(out.nopat, 300_000);
  assert.equal(out.ufcf, 250_000);
}

// Zero ETR → NOPAT = EBIT
{
  const out = calculateUnleveredFreeCashFlow({
    ebit: 100_000,
    etrPercent: 0,
    da: 10_000,
    capex: 5_000,
    changeInWc: 5_000,
  });
  assert.ok(out);
  assert.equal(out.nopat, 100_000);
  assert.equal(out.ufcf, 100_000);
}

// Negative ΔWC increases UFCF
{
  const out = calculateUnleveredFreeCashFlow({
    ebit: 200_000,
    etrPercent: 20,
    da: 30_000,
    capex: 40_000,
    changeInWc: -10_000,
  });
  assert.ok(out);
  assert.equal(out.nopat, 160_000);
  assert.equal(out.ufcf, 160_000);
}

// Negative EBIT allowed → negative NOPAT/UFCF possible
{
  const out = calculateUnleveredFreeCashFlow({
    ebit: -100_000,
    etrPercent: 25,
    da: 10_000,
    capex: 5_000,
    changeInWc: 5_000,
  });
  assert.ok(out);
  assert.equal(out.nopat, -75_000);
  assert.equal(out.ufcf, -75_000);
}

// Negative UFCF with positive EBIT
{
  const out = calculateUnleveredFreeCashFlow({
    ebit: 100_000,
    etrPercent: 20,
    da: 5_000,
    capex: 90_000,
    changeInWc: 20_000,
  });
  assert.ok(out);
  assert.equal(out.nopat, 80_000);
  assert.equal(out.ufcf, -25_000);
}

// Reject ETR outside 0–100
{
  assert.equal(
    calculateUnleveredFreeCashFlow({
      ebit: 1,
      etrPercent: -1,
      da: 0,
      capex: 0,
      changeInWc: 0,
    }),
    null
  );
  assert.equal(
    calculateUnleveredFreeCashFlow({
      ebit: 1,
      etrPercent: 101,
      da: 0,
      capex: 0,
      changeInWc: 0,
    }),
    null
  );
}

// Reject non-finite inputs
{
  assert.equal(
    calculateUnleveredFreeCashFlow({
      ebit: Number.NaN,
      etrPercent: 25,
      da: 1,
      capex: 1,
      changeInWc: 1,
    }),
    null
  );
  assert.equal(
    calculateUnleveredFreeCashFlow({
      ebit: 1,
      etrPercent: 25,
      da: Number.POSITIVE_INFINITY,
      capex: 1,
      changeInWc: 1,
    }),
    null
  );
}

// Display formatting
{
  assert.equal(formatUfcfMoney(250000, 'PKR'), '250,000.00');
  assert.equal(formatUfcfMoney(-25000, 'PKR'), '-25,000.00');
}

// Validation: empty defaults → incomplete
{
  const empty = validateUnleveredFreeCashFlowInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

// Validation: same-currency happy path + negative flag
{
  const ok = validateUnleveredFreeCashFlowInput({
    ...createDefaultInput(),
    ebit: '400000',
    etr: '25',
    da: '50000',
    capex: '80000',
    changeInWc: '20000',
  });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.nopat, 300_000);
  assert.equal(ok.result.ufcf, 250_000);
  assert.equal(ok.result.isNegative, false);
  assert.equal(ok.result.formattedUfcf, '250,000.00');

  const negative = validateUnleveredFreeCashFlowInput({
    ...createDefaultInput(),
    ebit: '100000',
    etr: '20',
    da: '5000',
    capex: '90000',
    changeInWc: '20000',
  });
  assert.equal(negative.isValid, true);
  assert.ok(negative.result);
  assert.equal(negative.result.ufcf, -25_000);
  assert.equal(negative.result.isNegative, true);
}

// Validation: ETR out of range
{
  const bad = validateUnleveredFreeCashFlowInput({
    ...createDefaultInput(),
    ebit: '100',
    etr: '150',
    da: '0',
    capex: '0',
    changeInWc: '0',
  });
  assert.equal(bad.isValid, false);
  assert.ok(bad.errors.etr);
}

// Validation: mixed currencies without rates → blocked (never 1:1)
{
  const mixed = validateUnleveredFreeCashFlowInput(
    {
      ...createDefaultInput(),
      ebit: '100',
      ebitCurrency: 'USD',
      etr: '25',
      da: '10',
      daCurrency: 'PKR',
      capex: '5',
      capexCurrency: 'PKR',
      changeInWc: '5',
      changeInWcCurrency: 'PKR',
      ufcfCurrency: 'PKR',
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
  const mixed = validateUnleveredFreeCashFlowInput(
    {
      ...createDefaultInput(),
      ebit: '100',
      ebitCurrency: 'USD',
      etr: '25',
      da: '2800',
      daCurrency: 'PKR',
      capex: '5600',
      capexCurrency: 'PKR',
      changeInWc: '1400',
      changeInWcCurrency: 'PKR',
      ufcfCurrency: 'PKR',
    },
    rates
  );
  assert.equal(mixed.isValid, true);
  assert.ok(mixed.result);
  // EBIT 100 USD → 28,000 PKR; NOPAT = 21,000; +2,800 −5,600 −1,400 = 16,800
  assert.equal(mixed.result.nopat, 21_000);
  assert.equal(mixed.result.ufcf, 16_800);
  assert.equal(mixed.result.currency, 'PKR');
}

console.log('unlevered-free-cash-flow calculation.test.ts: ok');
