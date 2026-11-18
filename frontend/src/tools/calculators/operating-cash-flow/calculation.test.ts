import assert from 'node:assert/strict';
import {
  calculateOperatingCashFlow,
  calculateWorkingCapitalCashAdjustment,
  formatOcfMoney,
} from './calculation';
import { validateOperatingCashFlowInput } from './validation';
import { createDefaultInput } from './types';

// WC adj = −ΔInv −ΔAR +ΔAP +ΔTax
{
  const adj = calculateWorkingCapitalCashAdjustment({
    changeInInventories: 8_000,
    changeInAr: 4_000,
    changeInAp: 6_000,
    changeInIncomeTaxPayable: 1_000,
  });
  assert.equal(adj, -5_000);
}

// OCF = NI + Dep + Amort + WC adj + Other
{
  const ocf = calculateOperatingCashFlow({
    netIncome: 100_000,
    depreciation: 20_000,
    amortization: 5_000,
    workingCapitalCashAdjustment: -5_000,
    netOtherCashFlows: 2_000,
  });
  assert.equal(ocf, 122_000);
}

// Zero WC change → OCF = NI + D&A + Other
{
  const adj = calculateWorkingCapitalCashAdjustment({
    changeInInventories: 0,
    changeInAr: 0,
    changeInAp: 0,
    changeInIncomeTaxPayable: 0,
  });
  assert.equal(adj, 0);
  const ocf = calculateOperatingCashFlow({
    netIncome: 50_000,
    depreciation: 10_000,
    amortization: 0,
    workingCapitalCashAdjustment: 0,
    netOtherCashFlows: 0,
  });
  assert.equal(ocf, 60_000);
}

// Negative OCF allowed
{
  const ocf = calculateOperatingCashFlow({
    netIncome: 10_000,
    depreciation: 1_000,
    amortization: 0,
    workingCapitalCashAdjustment: -20_000,
    netOtherCashFlows: 0,
  });
  assert.equal(ocf, -9_000);
}

// Inventory decrease (negative ΔInv) increases cash
{
  const adj = calculateWorkingCapitalCashAdjustment({
    changeInInventories: -3_000,
    changeInAr: 0,
    changeInAp: 0,
    changeInIncomeTaxPayable: 0,
  });
  assert.equal(adj, 3_000);
}

// Reject non-finite
{
  assert.equal(
    calculateWorkingCapitalCashAdjustment({
      changeInInventories: Number.NaN,
      changeInAr: 0,
      changeInAp: 0,
      changeInIncomeTaxPayable: 0,
    }),
    null
  );
  assert.equal(
    calculateOperatingCashFlow({
      netIncome: Number.POSITIVE_INFINITY,
      depreciation: 0,
      amortization: 0,
      workingCapitalCashAdjustment: 0,
      netOtherCashFlows: 0,
    }),
    null
  );
}

// Display formatting
{
  assert.equal(formatOcfMoney(122000, 'PKR'), '122,000.00');
  assert.equal(formatOcfMoney(-9000, 'PKR'), '-9,000.00');
}

// Validation: empty defaults → incomplete
{
  const empty = validateOperatingCashFlowInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

// Validation: same-currency happy path
{
  const ok = validateOperatingCashFlowInput({
    ...createDefaultInput(),
    netIncome: '100000',
    depreciation: '20000',
    amortization: '5000',
    changeInInventories: '8000',
    changeInAr: '4000',
    changeInAp: '6000',
    incomeTaxPayable: '1000',
    netOtherCashFlows: '2000',
  });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.workingCapitalCashAdjustment, -5_000);
  assert.equal(ok.result.changeInOperatingWc, -5_000);
  assert.equal(ok.result.operatingCashFlow, 122_000);
  assert.equal(ok.result.isNegativeOcf, false);
  assert.equal(ok.result.formattedOperatingCashFlow, '122,000.00');
}

// Validation: negative OCF flag
{
  const negative = validateOperatingCashFlowInput({
    ...createDefaultInput(),
    netIncome: '10000',
    depreciation: '1000',
    amortization: '0',
    changeInInventories: '20000',
    changeInAr: '0',
    changeInAp: '0',
    incomeTaxPayable: '0',
    netOtherCashFlows: '0',
  });
  assert.equal(negative.isValid, true);
  assert.ok(negative.result);
  assert.equal(negative.result.operatingCashFlow, -9_000);
  assert.equal(negative.result.isNegativeOcf, true);
}

// Validation: mixed currencies without rates → blocked (never 1:1)
{
  const mixed = validateOperatingCashFlowInput(
    {
      ...createDefaultInput(),
      netIncome: '100',
      netIncomeCurrency: 'USD',
      depreciation: '10',
      depreciationCurrency: 'PKR',
      amortization: '0',
      changeInInventories: '0',
      changeInAr: '0',
      changeInAp: '0',
      incomeTaxPayable: '0',
      netOtherCashFlows: '0',
      operatingCashFlowCurrency: 'PKR',
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
  const mixed = validateOperatingCashFlowInput(
    {
      ...createDefaultInput(),
      netIncome: '100',
      netIncomeCurrency: 'USD',
      depreciation: '2800',
      depreciationCurrency: 'PKR',
      amortization: '0',
      amortizationCurrency: 'PKR',
      changeInInventories: '0',
      changeInInventoriesCurrency: 'PKR',
      changeInAr: '0',
      changeInArCurrency: 'PKR',
      changeInAp: '0',
      changeInApCurrency: 'PKR',
      incomeTaxPayable: '0',
      incomeTaxPayableCurrency: 'PKR',
      netOtherCashFlows: '0',
      netOtherCashFlowsCurrency: 'PKR',
      changeInOperatingWcCurrency: 'PKR',
      operatingCashFlowCurrency: 'PKR',
    },
    rates
  );
  assert.equal(mixed.isValid, true);
  assert.ok(mixed.result);
  // NI 100 USD → 28,000 PKR + Dep 2,800 → OCF 30,800
  assert.equal(mixed.result.operatingCashFlow, 30_800);
  assert.equal(mixed.result.operatingCashFlowCurrency, 'PKR');
}

console.log('operating-cash-flow calculation.test.ts: ok');
