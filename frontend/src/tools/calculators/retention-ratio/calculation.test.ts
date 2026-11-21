import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateRetentionRatio,
  formatPercent,
  interpretRetentionRatio,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateRetentionRatioInput } from './validation';

describe('calculateRetentionRatio', () => {
  it('1,000,000 / 350,000 → 65%', () => {
    const r = calculateRetentionRatio(1_000_000, 350_000)!;
    assert.equal(r.retainedEarnings, 650_000);
    assert.equal(r.retentionRatioPercent, 65);
    assert.equal(r.status, 'valid');
  });

  it('zero dividends → 100%', () => {
    const r = calculateRetentionRatio(100_000, 0)!;
    assert.equal(r.retainedEarnings, 100_000);
    assert.equal(r.retentionRatioPercent, 100);
  });

  it('full payout → 0%', () => {
    const r = calculateRetentionRatio(100_000, 100_000)!;
    assert.equal(r.retainedEarnings, 0);
    assert.equal(r.retentionRatioPercent, 0);
  });

  it('dividends exceed NI → −20%', () => {
    const r = calculateRetentionRatio(100_000, 120_000)!;
    assert.equal(r.retainedEarnings, -20_000);
    assert.equal(r.retentionRatioPercent, -20);
  });

  it('zero NI → undefined', () => {
    const r = calculateRetentionRatio(0, 0)!;
    assert.equal(r.status, 'undefined');
    assert.equal(r.retentionRatioPercent, null);
    assert.equal(r.retainedEarnings, 0);
  });

  it('negative NI flagged', () => {
    const r = calculateRetentionRatio(-50_000, 10_000)!;
    assert.equal(r.status, 'negative-income');
    assert.ok(r.retentionRatioPercent != null);
  });

  it('matches 1 − payout', () => {
    const r = calculateRetentionRatio(1_000_000, 350_000)!;
    const fromPayout = (1 - r.dividendPayoutRatio!) * 100;
    assert.ok(Math.abs(fromPayout - r.retentionRatioPercent!) < 1e-12);
  });
});

describe('interpretRetentionRatio', () => {
  it('bands', () => {
    assert.match(interpretRetentionRatio(100, 1000), /100\.00%/);
    assert.match(interpretRetentionRatio(0, 1000), /0\.00%/);
    assert.match(interpretRetentionRatio(-20, 1000), /negative/i);
    assert.match(interpretRetentionRatio(65, -1000), /negative net income/i);
  });
});

describe('formatting', () => {
  it('formats percent', () => {
    assert.equal(formatPercent(65), '65.00%');
  });
});

describe('validateRetentionRatioInput', () => {
  it('defaults → 65%', () => {
    const v = validateRetentionRatioInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result!.retentionRatioPercent, 65);
    assert.equal(v.result!.retainedEarnings, 650_000);
  });

  it('empty → invalid', () => {
    const v = validateRetentionRatioInput(createEmptyInput());
    assert.equal(v.isValid, false);
  });

  it('zero NI message', () => {
    const v = validateRetentionRatioInput({
      ...createDefaultInput(),
      netIncome: '0',
      dividendsPaid: '0',
    });
    assert.equal(v.result!.status, 'undefined');
    assert.ok(v.result!.unavailableReason);
  });
});
