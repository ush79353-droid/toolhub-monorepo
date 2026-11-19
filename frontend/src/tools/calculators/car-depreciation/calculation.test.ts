import assert from 'node:assert/strict';
import { CAR_DEPRECIATION_ANNUAL_RATE } from './content';
import {
  ONE_MINUTE_IN_YEARS,
  calculateCarDepreciation,
  formatCarDepreciationMoney,
} from './calculation';
import { validateCarDepreciationInput } from './validation';
import { createDefaultInput } from './types';

function approxEqual(actual: number, expected: number, eps = 1e-9) {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

// Example: 1,000,000 · age 2 · 15% → reduced 722,500
{
  const out = calculateCarDepreciation({
    initialValue: 1_000_000,
    carAgeYears: 2,
  });
  assert.ok(out);
  approxEqual(out.reducedValue, 722_500);
  approxEqual(out.after1Year, 722_500 * 0.85);
  approxEqual(out.after5Years, 722_500 * Math.pow(0.85, 5));
  approxEqual(out.totalDepreciationToDate, 277_500);
  assert.equal(out.annualRate, CAR_DEPRECIATION_ANNUAL_RATE);
}

// Age 0 → reduced equals initial; 1 year ahead = initial × 0.85
{
  const out = calculateCarDepreciation({
    initialValue: 50_000,
    carAgeYears: 0,
  });
  assert.ok(out);
  assert.equal(out.reducedValue, 50_000);
  approxEqual(out.after1Year, 42_500);
}

// 1-minute fractional year consistency
{
  const out = calculateCarDepreciation({
    initialValue: 100_000,
    carAgeYears: 0,
  });
  assert.ok(out);
  const expected = 100_000 * Math.pow(0.85, ONE_MINUTE_IN_YEARS);
  approxEqual(out.after1Minute, expected);
  assert.ok(out.after1Minute < 100_000);
  assert.ok(out.after1Minute > 99_999);
}

// 100% rate → reduced 0 for age > 0
{
  const out = calculateCarDepreciation({
    initialValue: 10_000,
    carAgeYears: 1,
    annualRate: 1,
  });
  assert.ok(out);
  assert.equal(out.reducedValue, 0);
  assert.equal(out.after1Year, 0);
}

// Reject negatives / invalid rates
{
  assert.equal(
    calculateCarDepreciation({ initialValue: -1, carAgeYears: 1 }),
    null
  );
  assert.equal(
    calculateCarDepreciation({ initialValue: 100, carAgeYears: -0.1 }),
    null
  );
  assert.equal(
    calculateCarDepreciation({
      initialValue: 100,
      carAgeYears: 1,
      annualRate: 1.1,
    }),
    null
  );
}

// Display formatting
{
  assert.equal(formatCarDepreciationMoney(722500, 'PKR'), '722,500.00');
}

// Validation incomplete
{
  const empty = validateCarDepreciationInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

// Validation same-currency happy path
{
  const ok = validateCarDepreciationInput({
    ...createDefaultInput(),
    initialValue: '1000000',
    carAgeYears: '2',
  });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  approxEqual(ok.result.reducedValueCanonical, 722_500);
  assert.equal(ok.result.formattedReducedValue, '722,500.00');
}

// Mixed currencies without rates → blocked
{
  const mixed = validateCarDepreciationInput(
    {
      ...createDefaultInput(),
      initialValue: '1000',
      initialValueCurrency: 'USD',
      carAgeYears: '1',
      reducedValueCurrency: 'PKR',
    },
    null
  );
  assert.equal(mixed.isValid, false);
  assert.ok(mixed.errors.form);
}

// Mixed currencies with rates → convert display only
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
  const mixed = validateCarDepreciationInput(
    {
      ...createDefaultInput(),
      initialValue: '1000',
      initialValueCurrency: 'USD',
      carAgeYears: '1',
      reducedValueCurrency: 'PKR',
      after1YearCurrency: 'PKR',
    },
    rates
  );
  assert.equal(mixed.isValid, true);
  assert.ok(mixed.result);
  // Reduced = 1000 × 0.85 = 850 USD → 238,000 PKR
  approxEqual(mixed.result.reducedValueCanonical, 850);
  approxEqual(mixed.result.reducedValue, 238_000);
  approxEqual(mixed.result.after1YearCanonical, 850 * 0.85);
  approxEqual(mixed.result.after1Year, 850 * 0.85 * 280);
}

console.log('car-depreciation calculation.test.ts: ok');
