import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateClass1Employee,
  calculateClass4,
  calculateNationalInsurance,
  roundGbp,
} from './calculation';
import { NI_YEAR_PARAMS } from './ni-parameters';
import { createDefaultInput, createExampleInput } from './types';
import { validateNationalInsuranceInput } from './validation';

const y2627 = NI_YEAR_PARAMS['2026-27'];

describe('UK National Insurance', () => {
  it('£40,000 employment · 2026/27 → Class 1 £2,194.40', () => {
    const c1 = calculateClass1Employee(40_000, y2627);
    assert.equal(c1, 2194.4);
    const r = calculateNationalInsurance({
      employmentIncome: 40_000,
      selfEmploymentIncome: 0,
      taxYear: '2026-27',
    });
    assert.ok(r);
    assert.equal(r!.totalNationalInsurance, 2194.4);
    assert.equal(r!.class4, 0);
    assert.equal(r!.totalAnnualIncome, 40_000);
  });

  it('£60,000 employment → main + upper bands', () => {
    // (50270-12570)*0.08 + (60000-50270)*0.02 = 3016 + 194.60 = 3210.60
    assert.equal(calculateClass1Employee(60_000, y2627), 3210.6);
  });

  it('£30,000 self-employment → Class 4 £1,045.80', () => {
    // (30000-12570)*0.06 = 1045.80
    assert.equal(calculateClass4(30_000, y2627), 1045.8);
  });

  it('separate bases: do not combine before banding', () => {
    const r = calculateNationalInsurance({
      employmentIncome: 20_000,
      selfEmploymentIncome: 20_000,
      taxYear: '2026-27',
    });
    assert.ok(r);
    // Each base: (20000-12570)*0.08 = 594.40 Class1; (20000-12570)*0.06 = 445.80 Class4
    assert.equal(r!.class1Employee, 594.4);
    assert.equal(r!.class4, 445.8);
    assert.equal(r!.totalNationalInsurance, 1040.2);
    // Combined £40k would be 2194.40 if wrongly merged — must differ
    assert.notEqual(r!.totalNationalInsurance, 2194.4);
  });

  it('income at PT → £0 Class 1', () => {
    assert.equal(calculateClass1Employee(12_570, y2627), 0);
  });

  it('zero incomes → £0 NI', () => {
    const r = calculateNationalInsurance({
      employmentIncome: 0,
      selfEmploymentIncome: 0,
      taxYear: '2025-26',
    });
    assert.ok(r);
    assert.equal(r!.totalNationalInsurance, 0);
  });

  it('rejects negatives', () => {
    assert.equal(
      calculateNationalInsurance({
        employmentIncome: -1,
        selfEmploymentIncome: 0,
        taxYear: '2026-27',
      }),
      null
    );
  });

  it('2024/25 same employee rates as 2026/27 for these bands', () => {
    assert.equal(
      calculateClass1Employee(40_000, NI_YEAR_PARAMS['2024-25']),
      2194.4
    );
  });

  it('roundGbp', () => {
    assert.equal(roundGbp(10.005), 10.01);
  });
});

describe('validateNationalInsuranceInput', () => {
  it('example validates', () => {
    const v = validateNationalInsuranceInput(createExampleInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result!.totalNationalInsurance, 2194.4);
  });

  it('default blank employment invalid', () => {
    const v = validateNationalInsuranceInput(createDefaultInput());
    assert.equal(v.isValid, false);
  });

  it('negative SE rejected', () => {
    const v = validateNationalInsuranceInput({
      ...createExampleInput(),
      selfEmploymentIncome: '-10',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.selfEmploymentIncome);
  });
});
