import assert from 'node:assert/strict';
import { averageAccountsReceivable, calculateAverageCollectionPeriod } from './calculation';
import { createDefaultInput } from './types';

// Average AR helper
assert.equal(averageAccountsReceivable(40_000, 60_000), 50_000);

// Average AR method: (50_000 / 500_000) × 365 = 36.5
{
  const input = createDefaultInput();
  input.averageReceivable = 50_000;
  input.totalCreditSales = 500_000;
  input.durationDays = 365;
  const result = calculateAverageCollectionPeriod(input);
  assert.equal(result.defined, true);
  assert.equal(result.collectionPeriodDays, 36.5);
}

// Turnover method: 365 / 10 = 36.5
{
  const input = createDefaultInput();
  input.method = 'turnover-ratio';
  input.receivablesTurnoverRatio = 10;
  input.durationDays = 365;
  const result = calculateAverageCollectionPeriod(input);
  assert.equal(result.defined, true);
  assert.equal(result.collectionPeriodDays, 36.5);
}

// Zero sales is undefined
{
  const input = createDefaultInput();
  input.averageReceivable = 10_000;
  input.totalCreditSales = 0;
  const result = calculateAverageCollectionPeriod(input);
  assert.equal(result.defined, false);
}

console.log('average-collection-period calculation.test.ts: ok');
