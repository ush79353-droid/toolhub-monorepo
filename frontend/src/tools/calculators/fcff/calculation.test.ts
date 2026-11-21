import assert from 'node:assert/strict';
import {
  calculateFcff,
  formatFcffMoney,
  formulaLabelForSource,
} from './calculation';
import { validateFcffInput } from './validation';
import { createDefaultInput } from './types';

// NI: FCFF = NI + D&A + Interest×(1−T) − CapEx − ΔNWC
{
  const fcff = calculateFcff({
    source: 'net_income',
    sourceValue: 100_000,
    depreciation: 20_000,
    interest: 10_000,
    taxRate: 0.25,
    capex: 30_000,
    nwc: 5_000,
  });
  // 100000 + 20000 + 7500 − 30000 − 5000 = 92500
  assert.equal(fcff, 92_500);
}

// EBITDA: FCFF = EBITDA×(1−T) + D&A×T − CapEx − ΔNWC
{
  const fcff = calculateFcff({
    source: 'ebitda',
    sourceValue: 200_000,
    depreciation: 40_000,
    interest: 0,
    taxRate: 0.25,
    capex: 50_000,
    nwc: 10_000,
  });
  // 200000×0.75 + 40000×0.25 − 50000 − 10000 = 150000 + 10000 − 60000 = 100000
  assert.equal(fcff, 100_000);
}

// EBIT: FCFF = EBIT×(1−T) + D&A − CapEx − ΔNWC
{
  const fcff = calculateFcff({
    source: 'ebit',
    sourceValue: 160_000,
    depreciation: 40_000,
    interest: 0,
    taxRate: 0.25,
    capex: 50_000,
    nwc: 10_000,
  });
  // 160000×0.75 + 40000 − 50000 − 10000 = 120000 + 40000 − 60000 = 100000
  assert.equal(fcff, 100_000);
}

// CFO: FCFF = CFO + Interest×(1−T) − CapEx  (no ΔNWC)
{
  const fcff = calculateFcff({
    source: 'cfo',
    sourceValue: 80_000,
    depreciation: 0,
    interest: 10_000,
    taxRate: 0.25,
    capex: 30_000,
    nwc: 999_999,
  });
  // 80000 + 7500 − 30000 = 57500; nwc ignored
  assert.equal(fcff, 57_500);
}

// Negative FCFF allowed
{
  const fcff = calculateFcff({
    source: 'net_income',
    sourceValue: 10_000,
    depreciation: 0,
    interest: 0,
    taxRate: 0,
    capex: 50_000,
    nwc: 0,
  });
  assert.equal(fcff, -40_000);
}

// Negative ΔNWC (working-capital release) increases FCFF
{
  const fcff = calculateFcff({
    source: 'net_income',
    sourceValue: 100_000,
    depreciation: 0,
    interest: 0,
    taxRate: 0,
    capex: 0,
    nwc: -5_000,
  });
  assert.equal(fcff, 105_000);
}

// Reject non-finite / invalid tax
{
  assert.equal(
    calculateFcff({
      source: 'net_income',
      sourceValue: Number.NaN,
      depreciation: 0,
      interest: 0,
      taxRate: 0.2,
      capex: 0,
      nwc: 0,
    }),
    null
  );
  assert.equal(
    calculateFcff({
      source: 'net_income',
      sourceValue: 1,
      depreciation: 0,
      interest: 0,
      taxRate: 1.5,
      capex: 0,
      nwc: 0,
    }),
    null
  );
}

// Display formatting
{
  assert.equal(formatFcffMoney(92500, 'PKR'), '92,500.00');
  assert.equal(formatFcffMoney(-40000, 'PKR'), '-40,000.00');
  assert.ok(formulaLabelForSource('cfo').includes('CFO'));
}

// Validation: empty defaults → incomplete
{
  const empty = validateFcffInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

// Validation: NI happy path
{
  const ok = validateFcffInput({
    ...createDefaultInput(),
    source: 'net_income',
    sourceValue: '100000',
    depreciation: '20000',
    interest: '10000',
    taxRatePercent: '25',
    capex: '30000',
    nwc: '5000',
  });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.fcff, 92_500);
  assert.equal(ok.result.formattedFcff, '92,500.00');
}

// Validation: tax out of range
{
  const bad = validateFcffInput({
    ...createDefaultInput(),
    sourceValue: '100',
    depreciation: '0',
    interest: '0',
    taxRatePercent: '150',
    capex: '0',
    nwc: '0',
  });
  assert.equal(bad.isValid, false);
  assert.ok(bad.errors.taxRatePercent);
}

// Validation: CFO does not require ΔNWC
{
  const cfo = validateFcffInput({
    ...createDefaultInput(),
    source: 'cfo',
    sourceValue: '80000',
    interest: '10000',
    taxRatePercent: '25',
    capex: '30000',
    nwc: '',
  });
  assert.equal(cfo.isValid, true);
  assert.ok(cfo.result);
  assert.equal(cfo.result.fcff, 57_500);
}

// Validation: EBITDA does not require interest
{
  const ebitda = validateFcffInput({
    ...createDefaultInput(),
    source: 'ebitda',
    sourceValue: '200000',
    depreciation: '40000',
    interest: '',
    taxRatePercent: '25',
    capex: '50000',
    nwc: '10000',
  });
  assert.equal(ebitda.isValid, true);
  assert.ok(ebitda.result);
  assert.equal(ebitda.result.fcff, 100_000);
}

// Validation: mixed currencies without rates → blocked
{
  const mixed = validateFcffInput(
    {
      ...createDefaultInput(),
      sourceValue: '100',
      sourceValueCurrency: 'USD',
      depreciation: '10',
      interest: '5',
      taxRatePercent: '20',
      capex: '10',
      nwc: '5',
      fcffCurrency: 'PKR',
    },
    null
  );
  assert.equal(mixed.isValid, false);
  assert.equal(mixed.result, null);
  assert.ok(mixed.errors.form);
}

// Validation: mixed currencies with rates → normalize then FCFF
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
  const mixed = validateFcffInput(
    {
      ...createDefaultInput(),
      source: 'net_income',
      sourceValue: '100',
      sourceValueCurrency: 'USD',
      depreciation: '0',
      depreciationCurrency: 'PKR',
      interest: '0',
      interestCurrency: 'PKR',
      taxRatePercent: '0',
      capex: '0',
      capexCurrency: 'PKR',
      nwc: '0',
      nwcCurrency: 'PKR',
      fcffCurrency: 'PKR',
    },
    rates
  );
  assert.equal(mixed.isValid, true);
  assert.ok(mixed.result);
  // 100 USD → 28,000 PKR
  assert.equal(mixed.result.fcff, 28_000);
  assert.equal(mixed.result.currency, 'PKR');
}

console.log('fcff calculation.test.ts: ok');
