import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateFinanceCharge,
  convertTermToDays,
  formatFcMoney,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateFinanceChargeInput } from './validation';

function nearly(actual: number | null | undefined, expected: number, eps = 1e-6) {
  assert.ok(actual != null, `expected ~${expected}, got ${actual}`);
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateFinanceCharge', () => {
  it('reference default 1000 @ 18% × 30d → ~14.7945', () => {
    const r = calculateFinanceCharge({ balance: 1000, apr: 18, days: 30 })!;
    nearly(r.dailyPeriodicRate, 0.18 / 365, 1e-12);
    nearly(r.dailyFinanceCharge, 1000 * (0.18 / 365), 1e-12);
    nearly(r.financeCharge, 1000 * 0.18 * (30 / 365), 1e-9);
    nearly(r.totalBalanceWithCharge, 1000 + r.financeCharge, 1e-9);
    assert.equal(formatFcMoney(r.financeCharge, 'PKR'), '14.79');
    assert.equal(formatFcMoney(r.totalBalanceWithCharge, 'PKR'), '1,014.79');
  });

  it('zero APR → 0 charge', () => {
    const r = calculateFinanceCharge({ balance: 1000, apr: 0, days: 30 })!;
    nearly(r.financeCharge, 0);
    nearly(r.totalBalanceWithCharge, 1000);
  });

  it('zero balance → 0 charge', () => {
    const r = calculateFinanceCharge({ balance: 0, apr: 18, days: 30 })!;
    nearly(r.financeCharge, 0);
    nearly(r.totalBalanceWithCharge, 0);
    nearly(r.periodInterestRate, 18 * (30 / 365), 1e-9);
  });

  it('high APR 36% × 30d → ~29.59', () => {
    const r = calculateFinanceCharge({ balance: 1000, apr: 36, days: 30 })!;
    nearly(r.financeCharge, 1000 * 0.36 * (30 / 365), 1e-9);
    assert.equal(formatFcMoney(r.financeCharge, 'PKR'), '29.59');
  });

  it('1-day billing cycle → ~0.49', () => {
    const r = calculateFinanceCharge({ balance: 1000, apr: 18, days: 1 })!;
    assert.equal(formatFcMoney(r.financeCharge, 'PKR'), '0.49');
  });

  it('31-day billing cycle → ~15.29', () => {
    const r = calculateFinanceCharge({ balance: 1000, apr: 18, days: 31 })!;
    assert.equal(formatFcMoney(r.financeCharge, 'PKR'), '15.29');
  });

  it('24% FAQ example → ~47.34', () => {
    const r = calculateFinanceCharge({ balance: 2400, apr: 24, days: 30 })!;
    assert.equal(formatFcMoney(r.financeCharge, 'PKR'), '47.34');
  });

  it('decimal balance', () => {
    const r = calculateFinanceCharge({
      balance: 1234.56,
      apr: 18,
      days: 30,
    })!;
    nearly(r.financeCharge, 1234.56 * 0.18 * (30 / 365), 1e-9);
  });

  it('decimal APR 19.99', () => {
    const r = calculateFinanceCharge({
      balance: 1000,
      apr: 19.99,
      days: 30,
    })!;
    nearly(r.financeCharge, 1000 * 0.1999 * (30 / 365), 1e-9);
  });

  it('large balance', () => {
    const r = calculateFinanceCharge({
      balance: 1_000_000,
      apr: 18,
      days: 30,
    })!;
    nearly(r.financeCharge, 1_000_000 * 0.18 * (30 / 365), 1e-6);
  });

  it('rejects invalid inputs', () => {
    assert.equal(
      calculateFinanceCharge({ balance: -100, apr: 18, days: 30 }),
      null
    );
    assert.equal(
      calculateFinanceCharge({ balance: 1000, apr: -18, days: 30 }),
      null
    );
    assert.equal(
      calculateFinanceCharge({ balance: 1000, apr: 18, days: 0 }),
      null
    );
  });
});

describe('convertTermToDays', () => {
  it('six months → 182.5 days → FC 900', () => {
    const days = convertTermToDays(6, 'months');
    nearly(days, 182.5);
    const r = calculateFinanceCharge({
      balance: 10000,
      apr: 18,
      days,
    })!;
    nearly(r.financeCharge, 900);
  });

  it('one year → 600 on 5000 @ 12%', () => {
    const days = convertTermToDays(1, 'years');
    nearly(days, 365);
    const r = calculateFinanceCharge({
      balance: 5000,
      apr: 12,
      days,
    })!;
    nearly(r.financeCharge, 600);
  });

  it('two weeks → ~23.01', () => {
    const days = convertTermToDays(2, 'weeks');
    nearly(days, 14);
    const r = calculateFinanceCharge({
      balance: 2500,
      apr: 24,
      days,
    })!;
    assert.equal(formatFcMoney(r.financeCharge, 'PKR'), '23.01');
  });
});

describe('validateFinanceChargeInput', () => {
  it('defaults → 14.79', () => {
    const v = validateFinanceChargeInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result!.formattedFinanceCharge, '14.79');
    assert.equal(v.result!.formattedTotal, '1,014.79');
  });

  it('empty → invalid', () => {
    const v = validateFinanceChargeInput(createEmptyInput());
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
  });

  it('negative balance errors', () => {
    const input = createDefaultInput();
    input.balance = '-100';
    const v = validateFinanceChargeInput(input);
    assert.equal(v.isValid, false);
    assert.match(v.errors.balance!, /negative/i);
  });

  it('negative APR errors', () => {
    const input = createDefaultInput();
    input.apr = '-18';
    const v = validateFinanceChargeInput(input);
    assert.equal(v.isValid, false);
  });

  it('zero billing cycle errors', () => {
    const input = createDefaultInput();
    input.billingCycleDays = '0';
    const v = validateFinanceChargeInput(input);
    assert.equal(v.isValid, false);
  });

  it('missing APR incomplete', () => {
    const input = createDefaultInput();
    input.apr = '';
    const v = validateFinanceChargeInput(input);
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
  });

  it('given-term six months', () => {
    const input = createDefaultInput();
    input.method = 'given-term';
    input.termLength = '6';
    input.termUnit = 'months';
    input.balance = '10000';
    const v = validateFinanceChargeInput(input);
    assert.equal(v.isValid, true);
    nearly(v.result!.financeCharge, 900);
  });

  it('daily breakdown rows when enabled', () => {
    const input = createDefaultInput();
    input.showDailyBreakdown = true;
    const v = validateFinanceChargeInput(input);
    assert.ok(v.result!.dailyRows);
    assert.equal(v.result!.dailyRows!.length, 30);
    nearly(v.result!.dailyRows![29]!.cumulativeInterest, v.result!.financeCharge);
  });
});
