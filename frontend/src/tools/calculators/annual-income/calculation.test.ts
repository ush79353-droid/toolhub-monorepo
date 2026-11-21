import assert from 'node:assert/strict';
import {
  calculateAnnualIncome,
  formatAnnualIncomeMoney,
} from './calculation';
import { validateAnnualIncomeInput } from './validation';
import { createDefaultInput } from './types';

// Basic: Annual = Hourly × Hours × Weeks; Net = × (1 − Tax/100)
{
  const out = calculateAnnualIncome({
    hourlyWage: 500,
    hoursPerWeek: 40,
    weeksPerYear: 52,
    taxPercent: 12,
  });
  assert.ok(out);
  assert.equal(out.annualIncome, 1_040_000);
  assert.equal(out.netHourly, 440);
  assert.equal(out.netAnnual, 915_200);
}

// Zero wage, zero tax, zero weeks allowed
{
  const out = calculateAnnualIncome({
    hourlyWage: 0,
    hoursPerWeek: 40,
    weeksPerYear: 0,
    taxPercent: 0,
  });
  assert.ok(out);
  assert.equal(out.annualIncome, 0);
  assert.equal(out.netHourly, 0);
  assert.equal(out.netAnnual, 0);
}

// 100% tax → net 0
{
  const out = calculateAnnualIncome({
    hourlyWage: 20,
    hoursPerWeek: 40,
    weeksPerYear: 52,
    taxPercent: 100,
  });
  assert.ok(out);
  assert.equal(out.annualIncome, 41_600);
  assert.equal(out.netHourly, 0);
  assert.equal(out.netAnnual, 0);
}

// Reject negatives / weeks > 52 / out-of-range tax / non-finite
{
  assert.equal(
    calculateAnnualIncome({
      hourlyWage: -1,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      taxPercent: 12,
    }),
    null
  );
  assert.equal(
    calculateAnnualIncome({
      hourlyWage: 10,
      hoursPerWeek: -1,
      weeksPerYear: 52,
      taxPercent: 12,
    }),
    null
  );
  assert.equal(
    calculateAnnualIncome({
      hourlyWage: 10,
      hoursPerWeek: 40,
      weeksPerYear: 53,
      taxPercent: 12,
    }),
    null
  );
  assert.equal(
    calculateAnnualIncome({
      hourlyWage: 10,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      taxPercent: 101,
    }),
    null
  );
  assert.equal(
    calculateAnnualIncome({
      hourlyWage: Number.NaN,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      taxPercent: 12,
    }),
    null
  );
  assert.equal(
    calculateAnnualIncome({
      hourlyWage: 10,
      hoursPerWeek: 40,
      weeksPerYear: Number.POSITIVE_INFINITY,
      taxPercent: 12,
    }),
    null
  );
}

// Display formatting
{
  assert.equal(formatAnnualIncomeMoney(1_040_000, 'PKR'), '1,040,000.00');
  assert.equal(formatAnnualIncomeMoney(0, 'PKR'), '0.00');
}

// Validation: empty hourly → incomplete
{
  const empty = validateAnnualIncomeInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

// Validation: same-currency happy path
{
  const ok = validateAnnualIncomeInput({
    ...createDefaultInput(),
    hourlyWage: '500',
  });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.annualIncomeCanonical, 1_040_000);
  assert.equal(ok.result.netHourlyCanonical, 440);
  assert.equal(ok.result.netAnnualCanonical, 915_200);
  assert.equal(ok.result.formattedAnnualIncome, '1,040,000.00');
  assert.equal(ok.result.formattedNetHourly, '440.00');
  assert.equal(ok.result.formattedNetAnnual, '915,200.00');
  assert.equal(ok.result.taxPercent, 12);
}

// Validation: reject weeks > 52, wage < 0, tax outside 0–100
{
  const weeks = validateAnnualIncomeInput({
    ...createDefaultInput(),
    hourlyWage: '10',
    weeksPerYear: '53',
  });
  assert.equal(weeks.isValid, false);
  assert.ok(weeks.errors.weeksPerYear);

  const neg = validateAnnualIncomeInput({
    ...createDefaultInput(),
    hourlyWage: '-1',
  });
  assert.equal(neg.isValid, false);
  assert.ok(neg.errors.hourlyWage);

  const over = validateAnnualIncomeInput({
    ...createDefaultInput(),
    hourlyWage: '10',
    taxPercent: '150',
  });
  assert.equal(over.isValid, false);
  assert.ok(over.errors.taxPercent);
}

// Validation: mixed result currencies without rates → blocked
{
  const mixed = validateAnnualIncomeInput(
    {
      ...createDefaultInput(),
      hourlyWage: '10',
      hourlyWageCurrency: 'USD',
      annualIncomeCurrency: 'PKR',
      netHourlyCurrency: 'PKR',
      netAnnualCurrency: 'PKR',
    },
    null
  );
  assert.equal(mixed.isValid, false);
  assert.equal(mixed.result, null);
  assert.ok(mixed.errors.form);
}

// Validation: mixed currencies with rates → convert results only
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
  const mixed = validateAnnualIncomeInput(
    {
      ...createDefaultInput(),
      hourlyWage: '10',
      hoursPerWeek: '40',
      weeksPerYear: '52',
      taxPercent: '10',
      hourlyWageCurrency: 'USD',
      annualIncomeCurrency: 'PKR',
      netHourlyCurrency: 'PKR',
      netAnnualCurrency: 'PKR',
    },
    rates
  );
  assert.equal(mixed.isValid, true);
  assert.ok(mixed.result);
  // Annual = 10 × 40 × 52 = 20,800 USD → 5,824,000 PKR
  // Net hourly = 9 USD → 2,520 PKR
  // Net annual = 18,720 USD → 5,241,600 PKR
  assert.equal(mixed.result.annualIncomeCanonical, 20_800);
  assert.equal(mixed.result.netHourlyCanonical, 9);
  assert.equal(mixed.result.netAnnualCanonical, 18_720);
  assert.equal(mixed.result.annualIncome, 5_824_000);
  assert.equal(mixed.result.netHourly, 2_520);
  assert.equal(mixed.result.netAnnual, 5_241_600);
  assert.equal(mixed.result.annualIncomeCurrency, 'PKR');
}

console.log('annual-income calculation.test.ts: ok');
