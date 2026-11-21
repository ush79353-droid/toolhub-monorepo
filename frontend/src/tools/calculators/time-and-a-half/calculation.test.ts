/**
 * Assert self-check for Time and a Half Calculator.
 * Run: npx --yes tsx src/tools/calculators/time-and-a-half/calculation.test.ts
 */
import assert from 'node:assert/strict';
import type { CurrencyRatesSnapshot } from '@/tools/shared/currency-rates';
import { calculateTimeAndAHalf } from './calculation';
import { createDefaultInput } from './types';
import { validateTimeAndAHalfInput } from './validation';

const ratesOk: CurrencyRatesSnapshot = {
  available: true,
  baseCurrency: 'USD',
  rates: { USD: 1, PKR: 280 },
  fetchedAt: new Date().toISOString(),
  isStale: false,
  staleThresholdHours: 48,
  supportedCurrencies: ['USD', 'PKR'],
};

// Prompt example: 1000 · 40 / 5 / 2 / 0 → total 51,500
{
  const out = calculateTimeAndAHalf({
    standardRate: 1000,
    standardHours: 40,
    timeAndHalfHours: 5,
    doubleTimeHours: 2,
    tripleTimeHours: 0,
  });
  assert.ok(out);
  assert.equal(out.timeAndHalfRate, 1500);
  assert.equal(out.doubleTimeRate, 2000);
  assert.equal(out.tripleTimeRate, 3000);
  assert.equal(out.standardPay, 40_000);
  assert.equal(out.timeAndHalfPay, 7_500);
  assert.equal(out.doubleTimePay, 4_000);
  assert.equal(out.tripleTimePay, 0);
  assert.equal(out.totalPay, 51_500);
}

// Zero rate / hours allowed
{
  const out = calculateTimeAndAHalf({
    standardRate: 0,
    standardHours: 40,
    timeAndHalfHours: 0,
    doubleTimeHours: 0,
    tripleTimeHours: 0,
  });
  assert.ok(out);
  assert.equal(out.totalPay, 0);
}

// Negative rejected
{
  assert.equal(
    calculateTimeAndAHalf({
      standardRate: -1,
      standardHours: 1,
      timeAndHalfHours: 0,
      doubleTimeHours: 0,
      tripleTimeHours: 0,
    }),
    null
  );
}

// Validation path
{
  const input = createDefaultInput();
  input.standardRate = '1000';
  input.standardHours = '40';
  input.timeAndHalfHours = '5';
  input.doubleTimeHours = '2';
  const ok = validateTimeAndAHalfInput(input, ratesOk);
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.totalPayCanonical, 51_500);
  assert.equal(ok.result.formattedTotalPay, '51,500.00');
}

{
  const blank = validateTimeAndAHalfInput(createDefaultInput(), ratesOk);
  assert.equal(blank.isValid, false);
}

console.log('time-and-a-half calculation.test.ts: all assertions passed');
