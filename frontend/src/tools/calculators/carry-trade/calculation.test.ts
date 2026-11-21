import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateCarryTrade,
  formatCarryPercent,
  interpretCarryTrade,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
} from './types';
import { validateCarryTradeInput } from './validation';

describe('calculateCarryTrade', () => {
  it('worked example ≈ profit 222.68 · return 4.45%', () => {
    const r = calculateCarryTrade(0.85, 0.83, 180, 0.06, 0.02, 5000, 365)!;
    const spot = 0.85 / 0.83;
    const rl = (0.06 * 180) / 365;
    const rb = (0.02 * 180) / 365;
    const proceeds = 5000 * spot * (1 + rl);
    const repay = 5000 * (1 + rb);
    assert.ok(Math.abs(r.spotRateDifferentialPercent - (spot - 1) * 100) < 1e-12);
    assert.ok(Math.abs(r.lendingPeriodReturn - rl) < 1e-12);
    assert.ok(Math.abs(r.borrowingPeriodCost - rb) < 1e-12);
    assert.ok(Math.abs(r.investmentProceeds - proceeds) < 1e-9);
    assert.ok(Math.abs(r.borrowingRepayment - repay) < 1e-9);
    assert.ok(Math.abs(r.carryTradeProfit - (proceeds - repay)) < 1e-9);
    assert.ok(Math.abs(r.totalReturn - (proceeds - repay) / 5000) < 1e-12);
  });

  it('equal exchange rates → spot differential 0', () => {
    const r = calculateCarryTrade(1.2, 1.2, 365, 0.05, 0.02, 1000, 365)!;
    assert.equal(r.spotRateDifferentialPercent, 0);
    assert.ok(r.carryTradeProfit > 0);
  });

  it('negative interest differential can still be profitable via FX', () => {
    const r = calculateCarryTrade(1.0, 0.9, 365, 0.01, 0.05, 1000, 365)!;
    assert.ok(r.netInterestDifferential < 0);
    assert.ok(r.carryTradeProfit > 0);
  });

  it('FX depreciation can wipe interest advantage', () => {
    const r = calculateCarryTrade(1.0, 1.2, 365, 0.06, 0.02, 1000, 365)!;
    assert.ok(r.spotRateDifferentialPercent < 0);
    assert.ok(r.carryTradeProfit < 0);
  });

  it('zero interest rates → FX-only return', () => {
    const r = calculateCarryTrade(0.85, 0.83, 180, 0, 0, 5000, 365)!;
    assert.equal(r.lendingPeriodReturn, 0);
    assert.equal(r.borrowingPeriodCost, 0);
    assert.ok(Math.abs(r.totalReturn - (0.85 / 0.83 - 1)) < 1e-12);
  });

  it('negative rates allowed when finite', () => {
    const r = calculateCarryTrade(1, 1, 365, -0.01, -0.02, 1000, 365)!;
    assert.ok(r.lendingPeriodReturn < 0);
    assert.ok(r.borrowingPeriodCost < 0);
    assert.ok(Number.isFinite(r.carryTradeProfit));
  });

  it('zero amount → zero profit, finite return factor', () => {
    const r = calculateCarryTrade(0.85, 0.83, 180, 0.06, 0.02, 0, 365)!;
    assert.equal(r.carryTradeProfit, 0);
    assert.ok(Number.isFinite(r.totalReturn));
  });

  it('360-day basis differs from 365', () => {
    const a = calculateCarryTrade(0.85, 0.83, 180, 0.06, 0.02, 5000, 360)!;
    const b = calculateCarryTrade(0.85, 0.83, 180, 0.06, 0.02, 5000, 365)!;
    assert.notEqual(a.lendingPeriodReturn, b.lendingPeriodReturn);
    assert.ok(a.lendingPeriodReturn > b.lendingPeriodReturn);
  });

  it('same lending and borrowing rates → net interest 0 when FX flat', () => {
    const r = calculateCarryTrade(1, 1, 90, 0.04, 0.04, 2000, 365)!;
    assert.ok(Math.abs(r.netInterestDifferential) < 1e-15);
    assert.ok(Math.abs(r.carryTradeProfit) < 1e-9);
  });

  it('invalid inputs → null', () => {
    assert.equal(calculateCarryTrade(0, 0.83, 180, 0.06, 0.02, 5000, 365), null);
    assert.equal(calculateCarryTrade(0.85, -1, 180, 0.06, 0.02, 5000, 365), null);
    assert.equal(calculateCarryTrade(0.85, 0.83, 0, 0.06, 0.02, 5000, 365), null);
    assert.equal(calculateCarryTrade(0.85, 0.83, 180, 0.06, 0.02, -1, 365), null);
  });

  it('approximate return ≠ exact when FX and lending interact', () => {
    const r = calculateCarryTrade(0.85, 0.83, 180, 0.06, 0.02, 5000, 365)!;
    assert.ok(Math.abs(r.approximateReturn - r.totalReturn) > 1e-6);
  });
});

describe('interpretCarryTrade', () => {
  it('bands', () => {
    assert.match(interpretCarryTrade(100, 4), /profitable/i);
    assert.match(interpretCarryTrade(-50, -2), /loss/i);
    assert.match(interpretCarryTrade(0, 0), /zero/i);
  });
});

describe('validateCarryTradeInput', () => {
  it('defaults empty → invalid', () => {
    const v = validateCarryTradeInput(createDefaultInput());
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
  });

  it('empty → invalid', () => {
    assert.equal(validateCarryTradeInput(createEmptyInput()).isValid, false);
  });

  it('example → ≈ +4.45% · profit formatted', () => {
    const v = validateCarryTradeInput(createExampleInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result!.formattedTotalReturn, '+4.45%');
    assert.match(v.result!.formattedCarryTradeProfit, /\+.*222\.68/);
    assert.equal(formatCarryPercent(v.result!.totalReturnPercent), '+4.45%');
    assert.equal(v.result!.dayCountBasis, 365);
  });

  it('missing exchange rate → invalid', () => {
    const v = validateCarryTradeInput({
      ...createExampleInput(),
      initialExchangeRate: '',
    });
    assert.equal(v.isValid, false);
  });

  it('invalid duration → invalid', () => {
    const v = validateCarryTradeInput({
      ...createExampleInput(),
      days: '0',
    });
    assert.equal(v.isValid, false);
  });

  it('360-day example validates', () => {
    const v = validateCarryTradeInput({
      ...createExampleInput(),
      dayCountBasis: 360,
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result!.dayCountBasis, 360);
  });

  it('zero amount allowed', () => {
    const v = validateCarryTradeInput({
      ...createExampleInput(),
      amountInvested: '0',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result!.carryTradeProfit, 0);
  });
});
