import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateRecurringDeposit,
  termToMonths,
} from './calculation';
import { createExampleInput } from './types';
import { validateRdInput } from './validation';

describe('RD term conversion', () => {
  it('converts years and months to months', () => {
    assert.equal(termToMonths(5, 'years'), 60);
    assert.equal(termToMonths(18, 'months'), 18);
    assert.equal(termToMonths(0, 'years'), null);
  });
});

describe('RD quarterly compounding formula', () => {
  it('worked example: 5000/mo · 5y · 6%', () => {
    const out = calculateRecurringDeposit({
      monthlyDeposit: 5000,
      term: 5,
      termUnit: 'years',
      annualRatePercent: 6,
    });
    assert.ok(out);
    assert.equal(out.months, 60);
    assert.equal(out.quarters, 20);
    assert.equal(out.totalDeposits, 300_000);
    assert.ok(out.maturityAmount > 348_000 && out.maturityAmount < 352_000);
    assert.ok(out.totalInterest > 48_000 && out.totalInterest < 52_000);
  });

  it('zero rate → maturity equals deposits', () => {
    const out = calculateRecurringDeposit({
      monthlyDeposit: 1000,
      term: 12,
      termUnit: 'months',
      annualRatePercent: 0,
    });
    assert.ok(out);
    assert.equal(out.totalDeposits, 12_000);
    assert.equal(out.maturityAmount, 12_000);
    assert.equal(out.totalInterest, 0);
  });

  it('rejects negative deposit / non-positive term', () => {
    assert.equal(
      calculateRecurringDeposit({
        monthlyDeposit: -1,
        term: 1,
        termUnit: 'years',
        annualRatePercent: 6,
      }),
      null,
    );
    assert.equal(
      calculateRecurringDeposit({
        monthlyDeposit: 100,
        term: 0,
        termUnit: 'years',
        annualRatePercent: 6,
      }),
      null,
    );
  });

  it('validation accepts same-currency example without rates', () => {
    const same = validateRdInput(createExampleInput(), null);
    assert.equal(same.isValid, true);
    assert.ok(same.result);
    assert.equal(same.result.totalDeposits, 300_000);
  });
});
