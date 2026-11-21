import assert from 'node:assert/strict';
import { calculateHourlyWage, formatHourlyWageMoney } from './calculation';
import { validateHourlyWageInput } from './validation';
import { createDefaultInput } from './types';

function approxEqual(actual: number, expected: number, eps = 1e-9) {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

// Example: 500/hr · 40 h/wk
{
  const out = calculateHourlyWage({ hourlyWage: 500, hoursPerWeek: 40 });
  assert.ok(out);
  approxEqual(out.perSecond, 500 / 3600);
  approxEqual(out.perMinute, 500 / 60);
  assert.equal(out.daily, 4_000);
  assert.equal(out.weekly, 20_000);
  assert.equal(out.biweekly, 40_000);
  approxEqual(out.monthly, 20_000 * 52 / 12);
  assert.equal(out.annual, 1_040_000);
}

// Zero hourly wage allowed
{
  const out = calculateHourlyWage({ hourlyWage: 0, hoursPerWeek: 40 });
  assert.ok(out);
  assert.equal(out.weekly, 0);
  assert.equal(out.annual, 0);
}

// Reject negative hourly / non-positive hours
{
  assert.equal(
    calculateHourlyWage({ hourlyWage: -1, hoursPerWeek: 40 }),
    null
  );
  assert.equal(
    calculateHourlyWage({ hourlyWage: 10, hoursPerWeek: 0 }),
    null
  );
}

// Display formatting
{
  assert.equal(formatHourlyWageMoney(1040000, 'PKR'), '1,040,000.00');
}

// Validation incomplete without hourly
{
  const empty = validateHourlyWageInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

// Validation same-currency happy path
{
  const ok = validateHourlyWageInput({
    ...createDefaultInput(),
    hourlyWage: '500',
    hoursPerWeek: '40',
  });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.weeklyCanonical, 20_000);
  assert.equal(ok.result.annualCanonical, 1_040_000);
  assert.equal(ok.result.formattedAnnual, '1,040,000.00');
}

// Mixed currencies without rates → blocked
{
  const mixed = validateHourlyWageInput(
    {
      ...createDefaultInput(),
      hourlyWage: '10',
      hourlyWageCurrency: 'USD',
      hoursPerWeek: '40',
      annualCurrency: 'PKR',
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
  const mixed = validateHourlyWageInput(
    {
      ...createDefaultInput(),
      hourlyWage: '10',
      hourlyWageCurrency: 'USD',
      hoursPerWeek: '40',
      annualCurrency: 'PKR',
      weeklyCurrency: 'PKR',
    },
    rates
  );
  assert.equal(mixed.isValid, true);
  assert.ok(mixed.result);
  // Weekly 400 USD → 112,000 PKR; Annual 20,800 USD → 5,824,000 PKR
  approxEqual(mixed.result.weeklyCanonical, 400);
  approxEqual(mixed.result.weekly, 112_000);
  approxEqual(mixed.result.annualCanonical, 20_800);
  approxEqual(mixed.result.annual, 5_824_000);
}

console.log('hourly-wage calculation.test.ts: ok');
