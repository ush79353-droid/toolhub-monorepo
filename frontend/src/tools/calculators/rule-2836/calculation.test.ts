import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateBackEndRatio,
  calculateFrontEndRatio,
  calculateGuidelineLimits,
  calculateItemizedHousingCosts,
  calculateTotalMonthlyDebt,
  meetsGuideline,
} from './calculation';
import { createDefaultInput } from './types';
import { validateRule2836Input } from './validation';

function nearly(actual: number | null, expected: number, eps = 1e-9) {
  assert.ok(actual !== null, 'expected a number');
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('28/36 formulas', () => {
  it('front-end 24%', () => {
    nearly(calculateFrontEndRatio(1200, 5000), 24);
  });

  it('total debt and back-end 32%', () => {
    nearly(calculateTotalMonthlyDebt(1200, 400), 1600);
    nearly(calculateBackEndRatio(1600, 5000), 32);
  });

  it('exactly at limits', () => {
    nearly(calculateFrontEndRatio(1400, 5000), 28);
    nearly(calculateBackEndRatio(1800, 5000), 36);
    assert.equal(meetsGuideline(28, 28), true);
    assert.equal(meetsGuideline(36, 36), true);
  });

  it('above front-end', () => {
    nearly(calculateFrontEndRatio(1600, 5000), 32);
    assert.equal(meetsGuideline(32, 28), false);
  });

  it('itemized housing 1300', () => {
    nearly(
      calculateItemizedHousingCosts(1000, 180, 70, 50, 0),
      1300
    );
  });

  it('zero income → null ratios', () => {
    assert.equal(calculateFrontEndRatio(1000, 0), null);
    assert.equal(calculateBackEndRatio(1200, 0), null);
  });

  it('guideline limits and capacity', () => {
    const lim = calculateGuidelineLimits(5000, 400)!;
    nearly(lim.maximumHousingCosts, 1400);
    nearly(lim.maximumTotalDebt, 1800);
    nearly(lim.housingCapacity, 1400);
  });

  it('capacity clamped when other debts high', () => {
    const lim = calculateGuidelineLimits(5000, 1500)!;
    nearly(lim.housingCapacity, 300);
  });
});

describe('validateRule2836Input', () => {
  it('both within guidelines', () => {
    const { isValid, result } = validateRule2836Input({
      ...createDefaultInput(),
      grossMonthlyIncome: '5000',
      combinedHousingCosts: '1200',
      otherMonthlyDebts: '400',
    });
    assert.equal(isValid, true);
    nearly(result!.frontEndRatio!, 24);
    nearly(result!.totalMonthlyDebt!, 1600);
    nearly(result!.backEndRatio!, 32);
    assert.equal(result!.meetsBothGuidelines, true);
  });

  it('above front-end fails overall', () => {
    const { result } = validateRule2836Input({
      ...createDefaultInput(),
      grossMonthlyIncome: '5000',
      combinedHousingCosts: '1600',
      otherMonthlyDebts: '0',
    });
    nearly(result!.frontEndRatio!, 32);
    nearly(result!.backEndRatio!, 32);
    assert.equal(result!.meetsFrontEndGuideline, false);
    assert.equal(result!.meetsBackEndGuideline, true);
    assert.equal(result!.meetsBothGuidelines, false);
  });

  it('above back-end fails overall', () => {
    const { result } = validateRule2836Input({
      ...createDefaultInput(),
      grossMonthlyIncome: '5000',
      combinedHousingCosts: '1200',
      otherMonthlyDebts: '1000',
    });
    nearly(result!.frontEndRatio!, 24);
    nearly(result!.backEndRatio!, 44);
    assert.equal(result!.meetsBothGuidelines, false);
  });

  it('exactly at both limits', () => {
    const { result } = validateRule2836Input({
      ...createDefaultInput(),
      grossMonthlyIncome: '5000',
      combinedHousingCosts: '1400',
      otherMonthlyDebts: '400',
    });
    nearly(result!.frontEndRatio!, 28);
    nearly(result!.backEndRatio!, 36);
    assert.equal(result!.meetsBothGuidelines, true);
  });

  it('itemized housing', () => {
    const { result } = validateRule2836Input({
      ...createDefaultInput(),
      grossMonthlyIncome: '5000',
      housingExpenseMode: 'itemized',
      mortgagePrincipalAndInterest: '1000',
      propertyTaxes: '180',
      homeownersInsurance: '70',
      hoaFees: '50',
      otherHousingExpenses: '0',
      otherMonthlyDebts: '400',
    });
    nearly(result!.monthlyHousingCosts!, 1300);
    nearly(result!.frontEndRatio!, 26);
    nearly(result!.backEndRatio!, 34);
  });

  it('zero income → unavailable', () => {
    const { isValid, result, errors } = validateRule2836Input({
      ...createDefaultInput(),
      grossMonthlyIncome: '0',
      combinedHousingCosts: '1000',
      otherMonthlyDebts: '200',
    });
    assert.equal(isValid, false);
    assert.equal(result!.status, 'zeroIncome');
    assert.equal(result!.frontEndRatio, null);
    assert.ok(errors.form);
  });

  it('empty → no result', () => {
    assert.equal(validateRule2836Input(createDefaultInput()).result, null);
  });
});
