import assert from 'node:assert/strict';
import { calculateSharpeRatio } from './calculation';

// Example: 12% return, 4% Rf, 8% σ → premium 8%, Sharpe 1.00
{
  const r = calculateSharpeRatio({
    investmentReturnPercent: 12,
    riskFreeReturnPercent: 4,
    standardDeviationPercent: 8,
  });
  assert.ok(r);
  assert.equal(r.riskPremiumPercent, 8);
  assert.equal(r.sharpeRatio, 1);
  assert.equal(r.formattedSharpeRatio, '1');
}

// Negative Sharpe when return < Rf
{
  const r = calculateSharpeRatio({
    investmentReturnPercent: 2,
    riskFreeReturnPercent: 5,
    standardDeviationPercent: 10,
  });
  assert.ok(r);
  assert.equal(r.riskPremiumPercent, -3);
  assert.equal(r.sharpeRatio, -0.3);
}

// σ ≤ 0 rejected
assert.equal(
  calculateSharpeRatio({
    investmentReturnPercent: 12,
    riskFreeReturnPercent: 4,
    standardDeviationPercent: 0,
  }),
  null
);

console.log('sharpe-ratio calculation.test.ts: ok');
