import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  calculateEffectiveAnnualRate,
  calculateFutureValue,
  calculateInflationAdjustedValue,
  calculateInitialLumpsum,
  calculateInvestmentEndDate,
  calculateInvestmentTerm,
  calculateLumpsumFromInput,
  calculateRequiredReturn,
} from './calculation';
import {
  createEmptyInput,
  createExampleInput,
  type LumpsumInput,
} from './types';
import { validateLumpsumInput } from './validation';

function approx(actual: number | null | undefined, expected: number, tol = 0.05) {
  assert.ok(actual != null, `expected ${expected}, got null`);
  assert.ok(
    Math.abs(actual! - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('Lumpsum Calculator engine', () => {
  it('annual growth: 100000, 10%, 10y → 259374.25', () => {
    approx(calculateFutureValue(100000, 10, 10, 'annually'), 259374.246, 0.01);
  });

  it('initial investment: goal 100000, 10%, 10y monthly ≈ 36941', () => {
    approx(
      calculateInitialLumpsum(100000, 10, 10, 'monthly'),
      36940.7,
      0.5,
    );
  });

  it('zero return: FV stays PV', () => {
    approx(calculateFutureValue(100000, 0, 10, 'annually'), 100000);
  });

  it('negative return: 100000, -5%, 1y annually → 95000', () => {
    approx(calculateFutureValue(100000, -5, 1, 'annually'), 95000);
  });

  it('required return from PV/FV/t', () => {
    const r = calculateRequiredReturn(100000, 259374.24601, 10, 'annually');
    approx(r, 10, 0.01);
  });

  it('investment duration from PV/FV/r', () => {
    const t = calculateInvestmentTerm(100000, 259374.24601, 10, 'annually');
    approx(t, 10, 0.001);
  });

  it('continuous compounding FV = PV e^(rt)', () => {
    const fv = calculateFutureValue(100000, 10, 10, 'continuously');
    approx(fv, 100000 * Math.exp(1), 0.01);
  });

  it('inflation adjustment: RealFV = FV/(1+i)^t', () => {
    const fv = 259374.24601;
    approx(calculateInflationAdjustedValue(fv, 6, 10), fv / 1.06 ** 10, 0.05);
  });

  it('EAR monthly 10% > nominal', () => {
    const ear = calculateEffectiveAnnualRate(10, 'monthly');
    assert.ok(ear != null && ear > 10);
    approx(ear, ((1 + 0.1 / 12) ** 12 - 1) * 100, 0.001);
  });

  it('example mode initial-lumpsum ≈ 36941', () => {
    const r = calculateLumpsumFromInput(createExampleInput());
    assert.ok(r);
    approx(r!.initialInvestment, 36940.7, 0.5);
    approx(r!.finalBalance, 100000, 0.02);
  });

  it('final-balance mode annual example', () => {
    const input: LumpsumInput = {
      ...createExampleInput(),
      mode: 'final-balance',
      initialInvestment: '100000',
      targetAmount: '',
      annualReturn: '10',
      termValue: '10',
      compoundingFrequency: 'annually',
      inflationRate: '0',
    };
    const r = calculateLumpsumFromInput(input)!;
    approx(r.finalBalance, 259374.25, 0.05);
    approx(r.totalReturns, 159374.25, 0.05);
  });

  it('zero initial investment for rate mode → validation error', () => {
    const input: LumpsumInput = {
      ...createExampleInput(),
      mode: 'expected-return',
      initialInvestment: '0',
      targetAmount: '100000',
      termValue: '10',
    };
    const v = validateLumpsumInput(input);
    assert.equal(v.isValid, false);
    assert.ok(v.errors.initialInvestment || v.errors.form || !v.result);
  });

  it('unreachable growth with zero return → error', () => {
    const input: LumpsumInput = {
      ...createExampleInput(),
      mode: 'investment-term',
      initialInvestment: '100000',
      targetAmount: '200000',
      annualReturn: '0',
    };
    const v = validateLumpsumInput(input);
    assert.equal(v.result, null);
  });

  it('negative duration → validation error', () => {
    const v = validateLumpsumInput({
      ...createExampleInput(),
      termValue: '-5',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.termValue);
  });

  it('inflation ≤ -100% → validation error', () => {
    const v = validateLumpsumInput({
      ...createExampleInput(),
      inflationRate: '-100',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.inflationRate);
  });

  it('end date advances by term', () => {
    const end = calculateInvestmentEndDate('2026-01-15', 10);
    assert.equal(end, '2036-01-15');
  });

  it('quarterly compounding differs from annual', () => {
    const a = calculateFutureValue(100000, 10, 5, 'annually')!;
    const q = calculateFutureValue(100000, 10, 5, 'quarterly')!;
    assert.ok(q > a);
  });

  it('daily frequency uses 365 periods', () => {
    const d = calculateFutureValue(1000, 12, 1, 'daily')!;
    approx(d, 1000 * (1 + 0.12 / 365) ** 365, 0.01);
  });

  it('empty form yields no result', () => {
    const v = validateLumpsumInput(createEmptyInput());
    assert.equal(v.result, null);
  });

  it('schedule reconciles with final balance', () => {
    const input: LumpsumInput = {
      ...createExampleInput(),
      mode: 'final-balance',
      initialInvestment: '100000',
      compoundingFrequency: 'annually',
      inflationRate: '0',
      termValue: '5',
    };
    const r = calculateLumpsumFromInput(input)!;
    assert.equal(r.schedule.length, 5);
    approx(r.schedule[4]!.closingBalance, r.finalBalance, 0.02);
  });
});
