import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateMonthlyPrincipalAndInterest,
  calculatePITI,
  formatPitiMoney,
  termToMonths,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validatePitiInput } from './validation';

function nearly(actual: number | null | undefined, expected: number, eps = 1e-2) {
  assert.ok(actual != null, `expected ~${expected}, got ${actual}`);
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('termToMonths', () => {
  it('30 years → 360', () => {
    assert.equal(termToMonths(30, 0), 360);
  });
  it('15 years → 180', () => {
    assert.equal(termToMonths(15, 0), 180);
  });
  it('10y 6m → 126', () => {
    assert.equal(termToMonths(10, 6), 126);
  });
  it('zero term → null', () => {
    assert.equal(termToMonths(0, 0), null);
  });
});

describe('calculateMonthlyPrincipalAndInterest', () => {
  it('200k @ 7% × 360 ≈ 1330.60', () => {
    nearly(
      calculateMonthlyPrincipalAndInterest(200000, 7, 360),
      1330.60499,
      1e-3
    );
  });
  it('zero rate → P/n', () => {
    nearly(calculateMonthlyPrincipalAndInterest(120000, 0, 120), 1000);
  });
});

describe('calculatePITI', () => {
  it('standard example ≈ 1730.60', () => {
    const r = calculatePITI({
      principal: 200000,
      termYears: 30,
      termMonths: 0,
      annualInterestRate: 7,
      annualPropertyTax: 3600,
      annualInsurance: 1200,
    })!;
    nearly(r.monthlyPrincipalAndInterest, 1330.60499, 1e-3);
    nearly(r.monthlyPropertyTax, 300);
    nearly(r.monthlyHomeownersInsurance, 100);
    nearly(r.monthlyPITI, 1730.60499, 1e-3);
    assert.equal(formatPitiMoney(r.monthlyPITI, 'PKR'), '1,730.60');
    nearly(r.annualPITI, r.monthlyPITI * 12, 1e-6);
    nearly(
      r.totalMortgageInterest,
      r.monthlyPrincipalAndInterest * 360 - 200000,
      1e-2
    );
  });

  it('tax 6000 → monthly 500', () => {
    nearly(
      calculatePITI({
        principal: 100000,
        termYears: 30,
        termMonths: 0,
        annualInterestRate: 0,
        annualPropertyTax: 6000,
        annualInsurance: 0,
      })!.monthlyPropertyTax,
      500
    );
  });

  it('insurance 2400 → monthly 200', () => {
    nearly(
      calculatePITI({
        principal: 100000,
        termYears: 30,
        termMonths: 0,
        annualInterestRate: 0,
        annualPropertyTax: 0,
        annualInsurance: 2400,
      })!.monthlyHomeownersInsurance,
      200
    );
  });

  it('zero tax/insurance → PITI = P&I', () => {
    const r = calculatePITI({
      principal: 200000,
      termYears: 30,
      termMonths: 0,
      annualInterestRate: 7,
      annualPropertyTax: 0,
      annualInsurance: 0,
    })!;
    nearly(r.monthlyPITI, r.monthlyPrincipalAndInterest, 1e-9);
  });

  it('zero interest 120k / 10y', () => {
    const r = calculatePITI({
      principal: 120000,
      termYears: 10,
      termMonths: 0,
      annualInterestRate: 0,
      annualPropertyTax: 0,
      annualInsurance: 0,
    })!;
    nearly(r.monthlyPITI, 1000);
  });

  it('tax increase 3600→4800 adds 100', () => {
    const a = calculatePITI({
      principal: 200000,
      termYears: 30,
      termMonths: 0,
      annualInterestRate: 7,
      annualPropertyTax: 3600,
      annualInsurance: 1200,
    })!;
    const b = calculatePITI({
      principal: 200000,
      termYears: 30,
      termMonths: 0,
      annualInterestRate: 7,
      annualPropertyTax: 4800,
      annualInsurance: 1200,
    })!;
    nearly(b.monthlyPITI - a.monthlyPITI, 100, 1e-6);
  });
});

describe('validatePitiInput', () => {
  it('defaults → ~1730.60', () => {
    const v = validatePitiInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result!.formattedPITI, '1,730.60');
  });

  it('empty → invalid', () => {
    const v = validatePitiInput(createEmptyInput());
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
  });

  it('negative principal', () => {
    const input = createDefaultInput();
    input.principal = '-1';
    assert.equal(validatePitiInput(input).isValid, false);
  });

  it('negative rate', () => {
    const input = createDefaultInput();
    input.annualInterestRate = '-1';
    assert.equal(validatePitiInput(input).isValid, false);
  });

  it('zero term', () => {
    const input = createDefaultInput();
    input.termYears = '0';
    input.termMonths = '0';
    assert.equal(validatePitiInput(input).isValid, false);
  });

  it('negative tax', () => {
    const input = createDefaultInput();
    input.annualPropertyTax = '-10';
    assert.equal(validatePitiInput(input).isValid, false);
  });

  it('negative insurance', () => {
    const input = createDefaultInput();
    input.annualInsurance = '-10';
    assert.equal(validatePitiInput(input).isValid, false);
  });

  it('10y 6m → 126 months', () => {
    const input = createDefaultInput();
    input.termYears = '10';
    input.termMonths = '6';
    input.annualPropertyTax = '0';
    input.annualInsurance = '0';
    const v = validatePitiInput(input);
    assert.equal(v.result!.totalTermMonths, 126);
  });
});
