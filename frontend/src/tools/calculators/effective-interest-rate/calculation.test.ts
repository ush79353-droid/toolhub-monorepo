import assert from 'node:assert/strict';
import { calculateEffectiveInterestRate, roundRate4 } from './calculation';

// Example: 12% monthly → periodic 1%, EIR ≈ 12.6825%
{
  const r = calculateEffectiveInterestRate({
    annualInterestRatePercent: 12,
    compounding: 'monthly',
  });
  assert.ok(r);
  assert.equal(r.periodicRatePercent, 1);
  assert.equal(r.eirPercent, 12.6825);
}

// Zero rate
{
  const r = calculateEffectiveInterestRate({
    annualInterestRatePercent: 0,
    compounding: 'monthly',
  });
  assert.ok(r);
  assert.equal(r.periodicRatePercent, 0);
  assert.equal(r.eirPercent, 0);
}

// Negative rate still finite when base > 0
{
  const r = calculateEffectiveInterestRate({
    annualInterestRatePercent: -6,
    compounding: 'monthly',
  });
  assert.ok(r);
  assert.equal(r.periodicRatePercent, -0.5);
  assert.ok(Number.isFinite(r.eirPercent));
}

// Extreme negative that would make base ≤ 0 → null
assert.equal(
  calculateEffectiveInterestRate({
    annualInterestRatePercent: -1200,
    compounding: 'annually',
  }),
  null,
);

assert.equal(roundRate4(12.682503013), 12.6825);

console.log('effective-interest-rate/calculation.test.ts: ok');
