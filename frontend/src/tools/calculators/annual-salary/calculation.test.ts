import assert from 'node:assert/strict';
import {
  calculateAnnualSalary,
  formatAnnualSalaryMoney,
} from './calculation';
import { validateAnnualSalaryInput } from './validation';
import { createDefaultInput } from './types';

// Basic: Annual = Hourly × Hours × Weeks; Net = × (1 − Tax/100)
{
  const out = calculateAnnualSalary({
    hourlyWage: 500,
    hoursPerWeek: 40,
    weeksPerYear: 52,
    taxPercent: 12,
  });
  assert.ok(out);
  assert.equal(out.annualSalary, 1_040_000);
  assert.equal(out.netHourly, 440);
  assert.equal(out.netAnnual, 915_200);
}

// Zero wage and zero tax allowed
{
  const out = calculateAnnualSalary({
    hourlyWage: 0,
    hoursPerWeek: 40,
    weeksPerYear: 52,
    taxPercent: 0,
  });
  assert.ok(out);
  assert.equal(out.annualSalary, 0);
  assert.equal(out.netHourly, 0);
  assert.equal(out.netAnnual, 0);
}

// 100% tax → net 0
{
  const out = calculateAnnualSalary({
    hourlyWage: 20,
    hoursPerWeek: 40,
    weeksPerYear: 52,
    taxPercent: 100,
  });
  assert.ok(out);
  assert.equal(out.annualSalary, 41_600);
  assert.equal(out.netHourly, 0);
  assert.equal(out.netAnnual, 0);
}

// Reject negatives / out-of-range tax / non-finite
{
  assert.equal(
    calculateAnnualSalary({
      hourlyWage: -1,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      taxPercent: 12,
    }),
    null
  );
  assert.equal(
    calculateAnnualSalary({
      hourlyWage: 10,
      hoursPerWeek: -1,
      weeksPerYear: 52,
      taxPercent: 12,
    }),
    null
  );
  assert.equal(
    calculateAnnualSalary({
      hourlyWage: 10,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      taxPercent: 101,
    }),
    null
  );
  assert.equal(
    calculateAnnualSalary({
      hourlyWage: Number.NaN,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      taxPercent: 12,
    }),
    null
  );
  assert.equal(
    calculateAnnualSalary({
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
  assert.equal(formatAnnualSalaryMoney(1_040_000, 'PKR'), '1,040,000.00');
  assert.equal(formatAnnualSalaryMoney(0, 'PKR'), '0.00');
}

// Validation: empty hourly → incomplete (defaults fill hours/weeks/tax)
{
  const empty = validateAnnualSalaryInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

// Validation: same-currency happy path
{
  const ok = validateAnnualSalaryInput({
    ...createDefaultInput(),
    hourlyWage: '500',
  });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.annualSalaryCanonical, 1_040_000);
  assert.equal(ok.result.netHourlyCanonical, 440);
  assert.equal(ok.result.netAnnualCanonical, 915_200);
  assert.equal(ok.result.formattedAnnualSalary, '1,040,000.00');
  assert.equal(ok.result.formattedNetHourly, '440.00');
  assert.equal(ok.result.formattedNetAnnual, '915,200.00');
  assert.equal(ok.result.taxPercent, 12);
}

// Validation: reject wage < 0 and tax outside 0–100
{
  const neg = validateAnnualSalaryInput({
    ...createDefaultInput(),
    hourlyWage: '-1',
  });
  assert.equal(neg.isValid, false);
  assert.ok(neg.errors.hourlyWage);

  const over = validateAnnualSalaryInput({
    ...createDefaultInput(),
    hourlyWage: '10',
    taxPercent: '150',
  });
  assert.equal(over.isValid, false);
  assert.ok(over.errors.taxPercent);
}

// Validation: mixed result currencies without rates → blocked
{
  const mixed = validateAnnualSalaryInput(
    {
      ...createDefaultInput(),
      hourlyWage: '10',
      hourlyWageCurrency: 'USD',
      annualSalaryCurrency: 'PKR',
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
  const mixed = validateAnnualSalaryInput(
    {
      ...createDefaultInput(),
      hourlyWage: '10',
      hoursPerWeek: '40',
      weeksPerYear: '52',
      taxPercent: '10',
      hourlyWageCurrency: 'USD',
      annualSalaryCurrency: 'PKR',
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
  assert.equal(mixed.result.annualSalaryCanonical, 20_800);
  assert.equal(mixed.result.netHourlyCanonical, 9);
  assert.equal(mixed.result.netAnnualCanonical, 18_720);
  assert.equal(mixed.result.annualSalary, 5_824_000);
  assert.equal(mixed.result.netHourly, 2_520);
  assert.equal(mixed.result.netAnnual, 5_241_600);
  assert.equal(mixed.result.annualSalaryCurrency, 'PKR');
}

console.log('annual-salary calculation.test.ts: ok');
