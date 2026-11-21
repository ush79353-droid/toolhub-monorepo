import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  amortizedAnnualWithdrawal,
  futureValueOrdinaryAnnuity,
  rothContributionFromTraditional,
  traditionalContributionFromRoth,
} from './calculation';
import { IRA_BASE_LIMIT_USD, IRA_CATCH_UP_USD, iraAnnualLimitUsd } from './ira-limits';

describe('ira calculator', () => {
  it('Test 1: FV ordinary annuity reference 7500 @ 7% × 35y', () => {
    const fv = futureValueOrdinaryAnnuity(7500, 0.07, 35);
    assert.ok(fv != null);
    const expected = (7500 * (Math.pow(1.07, 35) - 1)) / 0.07;
    assert.ok(Math.abs(fv - expected) < 1e-6);
  });

  it('Test 2: zero return → C × n', () => {
    assert.equal(futureValueOrdinaryAnnuity(1000, 0, 10), 10000);
  });

  it('Test 3: amortized withdrawal identity recovers balance at r=0', () => {
    assert.equal(amortizedAnnualWithdrawal(100000, 0, 20), 5000);
  });

  it('Test 4: Roth after-tax from traditional at 24%', () => {
    const roth = rothContributionFromTraditional(7500, 24);
    assert.ok(roth != null);
    assert.ok(Math.abs(roth - 5700) < 1e-9);
    const back = traditionalContributionFromRoth(roth, 24);
    assert.ok(back != null);
    assert.ok(Math.abs(back - 7500) < 1e-9);
  });

  it('Test 5: IRS 2026 limits', () => {
    assert.equal(iraAnnualLimitUsd(49), IRA_BASE_LIMIT_USD);
    assert.equal(iraAnnualLimitUsd(50), IRA_BASE_LIMIT_USD + IRA_CATCH_UP_USD);
  });

  it('Test 6: reject invalid return ≤ −100%', () => {
    assert.equal(futureValueOrdinaryAnnuity(1000, -1, 5), null);
  });

  it('Test 7: withdrawal years must be positive', () => {
    assert.equal(amortizedAnnualWithdrawal(1000, 0.05, 0), null);
  });
});
