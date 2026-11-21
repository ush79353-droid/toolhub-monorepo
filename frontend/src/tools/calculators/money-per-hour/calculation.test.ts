/**
 * Assert self-check for Money per Hour Calculator.
 * Run: npx --yes tsx src/tools/calculators/money-per-hour/calculation.test.ts
 */
import assert from 'node:assert/strict';
import type { CurrencyRatesSnapshot } from '@/tools/shared/currency-rates';
import { calculateMoneyPerHour } from './calculation';
import { createDefaultInput } from './types';
import { validateMoneyPerHourInput } from './validation';

const ratesOk: CurrencyRatesSnapshot = {
  available: true,
  baseCurrency: 'USD',
  rates: { USD: 1, PKR: 280 },
  fetchedAt: new Date().toISOString(),
  isStale: false,
  staleThresholdHours: 48,
  supportedCurrencies: ['USD', 'PKR'],
};

// Annual 1,040,000 · 40h → hourly 500; weekly 20,000; daily 4,000; biweekly 40,000
{
  const out = calculateMoneyPerHour({
    hoursPerWeek: 40,
    sourceField: 'annual',
    sourceAmount: 1_040_000,
  });
  assert.ok(out);
  assert.equal(out.hourly, 500);
  assert.equal(out.weekly, 20_000);
  assert.equal(out.annual, 1_040_000);
  assert.equal(out.biweekly, 40_000);
  assert.equal(out.daily, 4_000);
  assert.equal(out.monthly, 1_040_000 / 12);
  assert.equal(out.annualHours, 2080);
}

// Monthly source reverses to same hourly
{
  const out = calculateMoneyPerHour({
    hoursPerWeek: 40,
    sourceField: 'monthly',
    sourceAmount: 1_040_000 / 12,
  });
  assert.ok(out);
  assert.ok(Math.abs(out.hourly - 500) < 1e-9);
}

// Weekly / biweekly / daily sources
{
  const weekly = calculateMoneyPerHour({
    hoursPerWeek: 40,
    sourceField: 'weekly',
    sourceAmount: 20_000,
  });
  assert.ok(weekly);
  assert.equal(weekly.hourly, 500);

  const biweekly = calculateMoneyPerHour({
    hoursPerWeek: 40,
    sourceField: 'biweekly',
    sourceAmount: 40_000,
  });
  assert.ok(biweekly);
  assert.equal(biweekly.hourly, 500);

  const daily = calculateMoneyPerHour({
    hoursPerWeek: 40,
    sourceField: 'daily',
    sourceAmount: 4_000,
  });
  assert.ok(daily);
  assert.equal(daily.hourly, 500);
}

// Zero wage allowed
{
  const out = calculateMoneyPerHour({
    hoursPerWeek: 40,
    sourceField: 'annual',
    sourceAmount: 0,
  });
  assert.ok(out);
  assert.equal(out.hourly, 0);
}

// Invalid hours / negative wage
{
  assert.equal(
    calculateMoneyPerHour({
      hoursPerWeek: 0,
      sourceField: 'annual',
      sourceAmount: 1000,
    }),
    null
  );
  assert.equal(
    calculateMoneyPerHour({
      hoursPerWeek: 40,
      sourceField: 'annual',
      sourceAmount: -1,
    }),
    null
  );
}

// Validation incomplete when blank
{
  const blank = validateMoneyPerHourInput(createDefaultInput(), ratesOk);
  assert.equal(blank.isValid, false);
  assert.equal(blank.result, null);
}

// Same-currency validation path
{
  const input = createDefaultInput();
  input.annual = '1040000';
  input.sourceField = 'annual';
  const ok = validateMoneyPerHourInput(input, ratesOk);
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.hourlyCanonical, 500);
  assert.equal(ok.result.formattedHourly, '500.00');
}

console.log('money-per-hour calculation.test.ts: all assertions passed');
