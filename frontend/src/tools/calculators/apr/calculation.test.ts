import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculatePeriodicPayment,
  resolveCashFlows,
  resolvePaymentCount,
  solvePeriodicAprRate,
  annualizePeriodicRate,
} from './calculation';
import { createDefaultInput } from './types';
import { validateAprInput } from './validation';

function nearly(actual: number | null, expected: number, eps = 0.02) {
  assert.ok(actual !== null, `expected ~${expected}, got null`);
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('APR payment math', () => {
  it('monthly payment ~461.45 for 10k @ 10% / 24 mo', () => {
    const r = 0.1 / 12;
    nearly(calculatePeriodicPayment(10000, r, 24), 461.45, 0.01);
  });

  it('zero interest payment = P/n', () => {
    nearly(calculatePeriodicPayment(12000, 0, 12), 1000, 1e-9);
  });

  it('payment count years×monthly', () => {
    assert.equal(resolvePaymentCount(2, 'years', 'monthly'), 24);
    assert.equal(resolvePaymentCount(12, 'months', 'monthly'), 12);
  });

  it('rejects fractional periods', () => {
    assert.equal(resolvePaymentCount(13, 'months', 'annual'), null);
  });
});

describe('fee cash flows', () => {
  it('deducted fees', () => {
    const f = resolveCashFlows(10000, 200, 'deducted')!;
    assert.equal(f.amortizingPrincipal, 10000);
    assert.equal(f.netProceeds, 9800);
  });

  it('financed fees', () => {
    const f = resolveCashFlows(10000, 200, 'financed')!;
    assert.equal(f.amortizingPrincipal, 10200);
    assert.equal(f.netProceeds, 10000);
  });

  it('fees >= principal rejected when deducted', () => {
    assert.equal(resolveCashFlows(10000, 10000, 'deducted'), null);
  });
});

describe('APR solver', () => {
  it('zero fees → APR ≈ nominal 10%', () => {
    const pmt = calculatePeriodicPayment(10000, 0.1 / 12, 24)!;
    const r = solvePeriodicAprRate(10000, pmt, 24)!;
    nearly(annualizePeriodicRate(r, 12), 10, 0.05);
  });

  it('deducted $200 fee → APR > 10% (~12.1%)', () => {
    const pmt = calculatePeriodicPayment(10000, 0.1 / 12, 24)!;
    const r = solvePeriodicAprRate(9800, pmt, 24)!;
    const apr = annualizePeriodicRate(r, 12)!;
    assert.ok(apr > 10.5, `APR ${apr} should exceed 10.5`);
    nearly(apr, 12.1, 0.3);
  });

  it('zero interest zero fees → APR 0', () => {
    const pmt = calculatePeriodicPayment(12000, 0, 12)!;
    const r = solvePeriodicAprRate(12000, pmt, 12)!;
    nearly(annualizePeriodicRate(r, 12), 0, 1e-6);
  });

  it('zero interest with fee → APR > 0', () => {
    const pmt = calculatePeriodicPayment(12000, 0, 12)!;
    const r = solvePeriodicAprRate(11700, pmt, 12)!;
    const apr = annualizePeriodicRate(r, 12)!;
    assert.ok(apr > 0, `APR ${apr}`);
  });
});

describe('validateAprInput', () => {
  it('zero fees case', () => {
    const { isValid, result } = validateAprInput({
      ...createDefaultInput(),
      loanAmount: '10000',
      annualInterestRate: '10',
      loanTerm: '2',
      loanTermUnit: 'years',
      paymentFrequency: 'monthly',
      originationFee: '0',
      otherFinanceCharges: '0',
      feeTreatment: 'deducted',
    });
    assert.equal(isValid, true);
    nearly(result!.periodicPayment!, 461.45, 0.01);
    nearly(result!.apr!, 10, 0.05);
  });

  it('deducted origination fee', () => {
    const { result } = validateAprInput({
      ...createDefaultInput(),
      loanAmount: '10000',
      annualInterestRate: '10',
      loanTerm: '2',
      paymentFrequency: 'monthly',
      originationFee: '200',
      otherFinanceCharges: '0',
      feeTreatment: 'deducted',
    });
    nearly(result!.netProceeds!, 9800, 1e-9);
    nearly(result!.periodicPayment!, 461.45, 0.01);
    assert.ok(result!.apr! > 10.5);
  });

  it('zero interest zero fees', () => {
    const { result } = validateAprInput({
      ...createDefaultInput(),
      loanAmount: '12000',
      annualInterestRate: '0',
      loanTerm: '1',
      paymentFrequency: 'monthly',
      originationFee: '0',
      otherFinanceCharges: '',
    });
    nearly(result!.periodicPayment!, 1000, 1e-6);
    nearly(result!.apr!, 0, 1e-6);
  });

  it('zero interest with fee', () => {
    const { result } = validateAprInput({
      ...createDefaultInput(),
      loanAmount: '12000',
      annualInterestRate: '0',
      loanTerm: '1',
      paymentFrequency: 'monthly',
      originationFee: '300',
      feeTreatment: 'deducted',
    });
    nearly(result!.netProceeds!, 11700, 1e-9);
    nearly(result!.periodicPayment!, 1000, 1e-6);
    assert.ok(result!.apr! > 0);
  });

  it('invalid principal', () => {
    const { result, errors } = validateAprInput({
      ...createDefaultInput(),
      loanAmount: '0',
      annualInterestRate: '10',
      loanTerm: '2',
    });
    assert.equal(result, null);
    assert.ok(errors.loanAmount);
  });

  it('invalid term', () => {
    const { result, errors } = validateAprInput({
      ...createDefaultInput(),
      loanAmount: '10000',
      annualInterestRate: '10',
      loanTerm: '0',
    });
    assert.equal(result, null);
    assert.ok(errors.loanTerm);
  });

  it('fees equal principal rejected', () => {
    const { result, errors } = validateAprInput({
      ...createDefaultInput(),
      loanAmount: '10000',
      annualInterestRate: '10',
      loanTerm: '2',
      originationFee: '10000',
      feeTreatment: 'deducted',
    });
    assert.equal(result, null);
    assert.ok(errors.form);
  });

  it('percentage origination fee', () => {
    const { result } = validateAprInput({
      ...createDefaultInput(),
      loanAmount: '10000',
      annualInterestRate: '10',
      loanTerm: '2',
      originationFee: '2',
      originationFeeType: 'percentage',
      feeTreatment: 'deducted',
    });
    nearly(result!.totalFees!, 200, 1e-9);
    nearly(result!.netProceeds!, 9800, 1e-9);
  });

  it('empty → no result', () => {
    assert.equal(validateAprInput(createDefaultInput()).result, null);
  });
});
