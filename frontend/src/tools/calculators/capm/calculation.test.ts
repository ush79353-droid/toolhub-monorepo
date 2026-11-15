import assert from 'node:assert/strict';
import { calculateCapm } from './calculation';

// Example: Rf 4%, Rm 12%, β 1.2 → asset premium 9.6%, R 13.6%
{
  const r = calculateCapm({
    riskFreeRatePercent: 4,
    marketReturnPercent: 12,
    beta: 1.2,
  });
  assert.ok(r);
  assert.equal(r.assetRiskPremiumPercent, 9.6);
  assert.equal(r.expectedReturnPercent, 13.6);
  assert.equal(r.formattedAssetRiskPremium, '9.6');
  assert.equal(r.formattedExpectedReturn, '13.6');
}

// Zero beta → expected return = Rf
{
  const r = calculateCapm({
    riskFreeRatePercent: 4,
    marketReturnPercent: 12,
    beta: 0,
  });
  assert.ok(r);
  assert.equal(r.assetRiskPremiumPercent, 0);
  assert.equal(r.expectedReturnPercent, 4);
}

// Negative beta
{
  const r = calculateCapm({
    riskFreeRatePercent: 4,
    marketReturnPercent: 12,
    beta: -0.5,
  });
  assert.ok(r);
  assert.equal(r.assetRiskPremiumPercent, -4);
  assert.equal(r.expectedReturnPercent, 0);
}

// Rm below Rf → negative premiums
{
  const r = calculateCapm({
    riskFreeRatePercent: 10,
    marketReturnPercent: 6,
    beta: 1.5,
  });
  assert.ok(r);
  assert.equal(r.assetRiskPremiumPercent, -6);
  assert.equal(r.expectedReturnPercent, 4);
}

// Non-finite rejected
assert.equal(
  calculateCapm({
    riskFreeRatePercent: Number.NaN,
    marketReturnPercent: 12,
    beta: 1,
  }),
  null
);

console.log('capm calculation.test.ts: ok');
