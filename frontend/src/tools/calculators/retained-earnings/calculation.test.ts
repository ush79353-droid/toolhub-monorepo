import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateDividendsDistributed,
  calculateRetainedEarnings,
  calculateRetainedEarningsPerShare,
  calculateRetentionRatioPercent,
} from './calculation';
import { validateRetainedEarningsInput } from './validation';
import { createDefaultInput } from './types';

const TOL = 1e-9;

describe('retained earnings formulas', () => {
  it('Company Alpha: 30% → dividends 300k, RE 700k, REPS 14', () => {
    const div = calculateDividendsDistributed(1_000_000, 30);
    const re = calculateRetainedEarnings(1_000_000, div!);
    const reps = calculateRetainedEarningsPerShare(re!, 50_000);
    assert.equal(div, 300_000);
    assert.equal(re, 700_000);
    assert.equal(reps, 14);
    assert.equal(calculateRetentionRatioPercent(30), 70);
  });

  it('0% and 100% payout', () => {
    assert.equal(calculateDividendsDistributed(500_000, 0), 0);
    assert.equal(calculateRetainedEarnings(500_000, 0), 500_000);
    assert.equal(calculateDividendsDistributed(500_000, 100), 500_000);
    assert.equal(calculateRetainedEarnings(500_000, 500_000), 0);
  });

  it('25% and 50% examples', () => {
    assert.equal(calculateDividendsDistributed(800_000, 25), 200_000);
    assert.equal(calculateRetainedEarnings(800_000, 200_000), 600_000);
    assert.equal(
      calculateRetainedEarningsPerShare(600_000, 40_000),
      15
    );
    assert.equal(calculateDividendsDistributed(600_000, 50), 300_000);
    assert.equal(calculateRetainedEarnings(600_000, 300_000), 300_000);
  });

  it('payout above 100% → negative RE', () => {
    const div = calculateDividendsDistributed(100_000, 120);
    assert.equal(div, 120_000);
    assert.equal(calculateRetainedEarnings(100_000, div!), -20_000);
    assert.equal(calculateRetainedEarningsPerShare(-20_000, 10_000), -2);
  });

  it('zero/negative earnings → no dividend inference', () => {
    assert.equal(calculateDividendsDistributed(0, 30), null);
    assert.equal(calculateDividendsDistributed(-100_000, 30), null);
  });

  it('shares edge cases', () => {
    assert.equal(calculateRetainedEarningsPerShare(160_000, 0), null);
    assert.equal(calculateRetainedEarningsPerShare(160_000, -1), null);
    assert.equal(calculateRetainedEarningsPerShare(160_000, 1.5), null);
  });

  it('decimal earnings', () => {
    const div = calculateDividendsDistributed(125500.75, 20);
    assert.ok(Math.abs(div! - 25100.15) < TOL);
    const re = calculateRetainedEarnings(125500.75, div!);
    assert.ok(Math.abs(re! - 100400.6) < TOL);
  });

  it('large values', () => {
    assert.equal(calculateDividendsDistributed(1_000_000_000, 40), 400_000_000);
    assert.equal(
      calculateRetainedEarnings(1_000_000_000, 400_000_000),
      600_000_000
    );
    assert.equal(
      calculateRetainedEarningsPerShare(600_000_000, 100_000_000),
      6
    );
  });

  it('invariants', () => {
    const earnings = 1_000_000;
    const payout = 30;
    const div = calculateDividendsDistributed(earnings, payout)!;
    const re = calculateRetainedEarnings(earnings, div)!;
    assert.ok(Math.abs(re + div - earnings) < TOL);
    const reps = calculateRetainedEarningsPerShare(re, 50_000)!;
    assert.ok(Math.abs(reps * 50_000 - re) < TOL);
  });
});

describe('validateRetainedEarningsInput', () => {
  it('Company Alpha end-to-end', () => {
    const v = validateRetainedEarningsInput({
      ...createDefaultInput(),
      earnings: '1000000',
      dividendPayoutRatio: '30',
      sharesOutstanding: '50000',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result?.dividendsDistributed, 300000);
    assert.equal(v.result?.retainedEarnings, 700000);
    assert.equal(v.result?.retainedEarningsPerShare, 14);
  });

  it('missing shares → RE still works', () => {
    const v = validateRetainedEarningsInput({
      ...createDefaultInput(),
      earnings: '200000',
      dividendPayoutRatio: '20',
    });
    assert.equal(v.result?.dividendsDistributed, 40000);
    assert.equal(v.result?.retainedEarnings, 160000);
    assert.equal(v.result?.retainedEarningsPerShare, null);
  });

  it('payout 120% status', () => {
    const v = validateRetainedEarningsInput({
      ...createDefaultInput(),
      earnings: '100000',
      dividendPayoutRatio: '120',
      sharesOutstanding: '10000',
    });
    assert.equal(v.result?.retainedEarnings, -20000);
    assert.equal(v.result?.status, 'payoutAbove100');
  });

  it('zero earnings → no result', () => {
    const v = validateRetainedEarningsInput({
      ...createDefaultInput(),
      earnings: '0',
      dividendPayoutRatio: '30',
    });
    assert.equal(v.result, null);
    assert.ok(v.errors.form);
  });

  it('negative earnings → no result', () => {
    const v = validateRetainedEarningsInput({
      ...createDefaultInput(),
      earnings: '-100000',
      dividendPayoutRatio: '30',
    });
    assert.equal(v.result, null);
    assert.ok(v.errors.form);
  });

  it('negative payout → error', () => {
    const v = validateRetainedEarningsInput({
      ...createDefaultInput(),
      earnings: '100000',
      dividendPayoutRatio: '-1',
    });
    assert.ok(v.errors.dividendPayoutRatio);
    assert.equal(v.result, null);
  });

  it('all empty → no result', () => {
    assert.equal(validateRetainedEarningsInput(createDefaultInput()).result, null);
  });
});
