import assert from 'node:assert/strict';
import { calculateBusinessValuation, dcfAnnuityValue } from './calculation';
import { createDefaultInput } from './types';

assert.equal(dcfAnnuityValue(100, 5, 0), 500);

{
  const input = createDefaultInput();
  input.method = 'dcf';
  input.cashFlow = 100;
  input.cashFlowScale = 'thousand';
  input.projectionYears = 5;
  input.discountRatePercent = 0;
  const result = calculateBusinessValuation(input);
  assert.ok(result);
  assert.equal(result.value, 500_000);
}

{
  const input = createDefaultInput();
  input.method = 'asset-based';
  input.totalAssets = 200_000;
  input.totalLiabilities = 50_000;
  const result = calculateBusinessValuation(input);
  assert.ok(result);
  assert.equal(result.value, 150_000);
}

{
  const input = createDefaultInput();
  input.method = 'market-cap';
  input.sharePrice = 25;
  input.sharesOutstanding = 1_000;
  const result = calculateBusinessValuation(input);
  assert.ok(result);
  assert.equal(result.value, 25_000);
}

{
  const input = createDefaultInput();
  input.method = 'multiples';
  input.financialMetric = 10_000;
  input.valuationMultiple = 8;
  const result = calculateBusinessValuation(input);
  assert.ok(result);
  assert.equal(result.value, 80_000);
}

console.log('business-valuation calculation.test.ts: ok');
