import assert from 'node:assert/strict';
import {
  calculateDepreciation,
  decliningBalanceYear,
  formatDepreciationMoney,
  straightLineYear,
  sumOfYearsDigitsYear,
} from './calculation';
import { createDefaultInput, suggestedDecliningBalanceRatePercent } from './types';
import { validateDepreciationInput } from './validation';

assert.equal(suggestedDecliningBalanceRatePercent(5), 40);

// Straight line: 10,000 / 5 / after 2 → expense 2,000 · book 6,000
{
  const year = straightLineYear(10_000, 0, 5, 2);
  assert.ok(year);
  assert.equal(year!.expense, 2_000);
  assert.equal(year!.endBook, 6_000);
  assert.equal(year!.accumulated, 4_000);
}

{
  const result = calculateDepreciation({
    method: 'straight-line',
    originalCost: 10_000,
    salvageValue: 0,
    lifetimeYears: 5,
    endBookAfterYears: 2,
    decliningBalanceRate: null,
  });
  assert.ok(result);
  assert.equal(result!.depreciationExpense, 2_000);
  assert.equal(result!.endBookValue, 6_000);
}

// SYD: cost 10k salvage 0 life 5 year 1 → 5/15 × 10k = 3333.333...
{
  const year = sumOfYearsDigitsYear(10_000, 0, 5, 1);
  assert.ok(year);
  assert.ok(Math.abs(year!.expense - 10_000 * (5 / 15)) < 1e-9);
}

{
  const year = sumOfYearsDigitsYear(10_000, 0, 5, 2);
  assert.ok(year);
  assert.ok(Math.abs(year!.expense - 10_000 * (4 / 15)) < 1e-9);
  assert.ok(Math.abs(year!.accumulated - 10_000 * (9 / 15)) < 1e-9);
}

// Declining balance 40% (DDB for 5y): year 1 = 4000, book 6000
{
  const year = decliningBalanceYear(10_000, 0, 5, 1, 0.4);
  assert.ok(year);
  assert.equal(year!.expense, 4_000);
  assert.equal(year!.endBook, 6_000);
}

{
  const year = decliningBalanceYear(10_000, 0, 5, 2, 0.4);
  assert.ok(year);
  assert.equal(year!.expense, 2_400);
  assert.equal(year!.endBook, 3_600);
}

// Salvage floor
{
  const year = decliningBalanceYear(10_000, 5_000, 5, 5, 0.4);
  assert.ok(year);
  assert.ok(year!.endBook >= 5_000 - 1e-9);
}

// Rejects
{
  assert.equal(
    calculateDepreciation({
      method: 'straight-line',
      originalCost: 100,
      salvageValue: 200,
      lifetimeYears: 5,
      endBookAfterYears: 2,
      decliningBalanceRate: null,
    }),
    null
  );
  assert.equal(
    calculateDepreciation({
      method: 'declining-balance',
      originalCost: 100,
      salvageValue: 0,
      lifetimeYears: 5,
      endBookAfterYears: 2,
      decliningBalanceRate: null,
    }),
    null
  );
  assert.equal(
    calculateDepreciation({
      method: 'straight-line',
      originalCost: 100,
      salvageValue: 0,
      lifetimeYears: 5,
      endBookAfterYears: 6,
      decliningBalanceRate: null,
    }),
    null
  );
}

{
  assert.equal(formatDepreciationMoney(2000, 'PKR'), '2,000.00');
}

// Validation with same-currency inputs (no FX needed)
{
  const input = createDefaultInput();
  input.originalCost = '10000';
  input.salvageValue = '0';
  input.method = 'straight-line';
  const validation = validateDepreciationInput(input, null);
  assert.equal(validation.isValid, true);
  assert.equal(validation.result?.depreciationExpenseCanonical, 2_000);
  assert.equal(validation.result?.endBookValueCanonical, 6_000);
}

// Declining balance requires explicit rate
{
  const input = createDefaultInput();
  input.method = 'declining-balance';
  input.originalCost = '10000';
  input.salvageValue = '0';
  input.decliningBalanceRatePercent = '';
  const validation = validateDepreciationInput(input, null);
  assert.equal(validation.isValid, false);
  assert.ok(validation.errors.decliningBalanceRatePercent);
}

console.log('depreciation calculation.test.ts: ok');
