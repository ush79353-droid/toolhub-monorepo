/**
 * Run: npx --yes tsx src/tools/calculators/monthly-income-hourly/calculation.test.ts
 */
import assert from 'node:assert/strict';
import type { CurrencyRatesSnapshot } from '@/tools/shared/currency-rates';
import { calculateMonthlyIncomeHourly } from './calculation';
import { createDefaultInput } from './types';
import { validateMonthlyIncomeHourlyInput } from './validation';

const ratesOk: CurrencyRatesSnapshot = {
  available: true,
  baseCurrency: 'USD',
  rates: { USD: 1, PKR: 280 },
  fetchedAt: new Date().toISOString(),
  isStale: false,
  staleThresholdHours: 48,
  supportedCurrencies: ['USD', 'PKR'],
};

{
  const out = calculateMonthlyIncomeHourly({
    hoursPerWeek: 40,
    sourceField: 'monthly',
    sourceAmount: 100_000,
  });
  assert.ok(out);
  assert.ok(Math.abs(out.hourly - 100_000 * 12 / (40 * 52)) < 1e-9);
  assert.equal(out.annualHours, 2080);
}

{
  const hourly = 100_000 * 12 / (40 * 52);
  const out = calculateMonthlyIncomeHourly({
    hoursPerWeek: 40,
    sourceField: 'hourly',
    sourceAmount: hourly,
  });
  assert.ok(out);
  assert.ok(Math.abs(out.monthly - 100_000) < 1e-6);
}

{
  assert.equal(
    calculateMonthlyIncomeHourly({
      hoursPerWeek: 0,
      sourceField: 'monthly',
      sourceAmount: 1000,
    }),
    null
  );
}

{
  const input = createDefaultInput();
  input.monthly = '100000';
  const ok = validateMonthlyIncomeHourlyInput(input, ratesOk);
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.ok(Math.abs(ok.result.hourlyCanonical - 576.9230769230769) < 1e-9);
}

console.log('monthly-income-hourly calculation.test.ts: all assertions passed');
