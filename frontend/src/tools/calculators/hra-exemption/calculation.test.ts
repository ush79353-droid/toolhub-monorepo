import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  calculateCitySalaryLimit,
  calculateHRAExemption,
  calculateHraFromInput,
  calculateQualifyingSalary,
  calculateRentAboveTenPercent,
  calculateTaxableHRA,
  toMonthly,
} from './calculation';
import { getCitySalaryPercentage } from './tax-rules';
import {
  createEmptyInput,
  createExampleInput,
  type HraInput,
} from './types';
import { validateHraInput } from './validation';

function approx(actual: number | null | undefined, expected: number, tol = 0.02) {
  assert.ok(actual != null, `expected ${expected}, got null`);
  assert.ok(
    Math.abs(actual! - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('HRA Exemption Calculator engine', () => {
  it('qualifying salary: 50000 + 5000 eligible DA → 55000', () => {
    approx(calculateQualifyingSalary(50000, 5000, true), 55000);
  });

  it('DA ineligible excludes DA from salary base', () => {
    approx(calculateQualifyingSalary(50000, 5000, false), 50000);
  });

  it('rent above 10%: 18000 − 5500 → 12500', () => {
    approx(calculateRentAboveTenPercent(18000, 55000), 12500);
  });

  it('Delhi limit: 50% × 55000 → 27500', () => {
    const city = getCitySalaryPercentage('2025-26', 'Delhi');
    assert.ok(city);
    assert.equal(city!.percent, 0.5);
    approx(calculateCitySalaryLimit(55000, city!.percent), 27500);
  });

  it('HRA exemption: min(20000, 12500, 27500) → 12500', () => {
    const r = calculateHRAExemption({
      actualHRA: 20000,
      rentAboveTenPercent: 12500,
      salaryPercentageLimit: 27500,
      claimable: true,
    });
    assert.ok(r);
    approx(r!.exempt, 12500);
    assert.equal(r!.limiting, 'rent-minus-10pct');
  });

  it('taxable HRA: 20000 − 12500 → 7500', () => {
    approx(calculateTaxableHRA(20000, 12500), 7500);
  });

  it('example input → monthly exempt 12500, annual 150000', () => {
    const r = calculateHraFromInput(createExampleInput());
    assert.ok(r);
    approx(r!.exemptHRAMonthly, 12500);
    approx(r!.taxableHRAMonthly, 7500);
    approx(r!.annualExemptHRA, 150000);
    approx(r!.annualTaxableHRA, 90000);
    approx(r!.qualifyingSalaryMonthly, 55000);
  });

  it('zero rent → zero exemption', () => {
    const input: HraInput = { ...createExampleInput(), rentPaid: '0' };
    const r = calculateHraFromInput(input)!;
    assert.equal(r.exemptHRAMonthly, 0);
    approx(r.taxableHRAMonthly, 20000);
  });

  it('zero HRA → zero exemption', () => {
    const input: HraInput = { ...createExampleInput(), hraReceived: '0' };
    const r = calculateHraFromInput(input)!;
    assert.equal(r.exemptHRAMonthly, 0);
  });

  it('rent below 10% of salary → zero exemption', () => {
    const input: HraInput = { ...createExampleInput(), rentPaid: '4000' };
    const r = calculateHraFromInput(input)!;
    assert.equal(r.exemptHRAMonthly, 0);
  });

  it('new tax regime → zero exemption', () => {
    const input: HraInput = { ...createExampleInput(), taxRegime: 'new' };
    const r = calculateHraFromInput(input)!;
    assert.equal(r.exemptHRAMonthly, 0);
    assert.equal(r.claimable, false);
    approx(r.taxableHRAMonthly, 20000);
    approx(r.annualTaxableHRA, 240000);
  });

  it('negative salary → validation error', () => {
    const v = validateHraInput({
      ...createExampleInput(),
      basicSalary: '-5000',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.basicSalary);
  });

  it('unsupported tax year → validation error', () => {
    const v = validateHraInput({
      ...createExampleInput(),
      taxYear: '2010-11',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.taxYear);
  });

  it('partial-year: 6 eligible months → half annual exempt', () => {
    const input: HraInput = {
      ...createExampleInput(),
      enablePartialYear: true,
      eligibleMonths: '6',
    };
    const r = calculateHraFromInput(input)!;
    approx(r.annualExemptHRA, 75000);
    approx(r.annualTaxableHRA, 45000);
  });

  it('historical metros: Bengaluru is 40% in FY 2025-26', () => {
    const city = getCitySalaryPercentage('2025-26', 'Bengaluru');
    assert.ok(city);
    assert.equal(city!.percent, 0.4);
  });

  it('expanded metros: Bengaluru is 50% in FY 2026-27', () => {
    const city = getCitySalaryPercentage('2026-27', 'Bengaluru');
    assert.ok(city);
    assert.equal(city!.percent, 0.5);
  });

  it('annual frequency normalizes to monthly', () => {
    approx(toMonthly(600000, 'annual'), 50000);
    const input: HraInput = {
      ...createExampleInput(),
      frequency: 'annual',
      basicSalary: '600000',
      dearnessAllowance: '60000',
      hraReceived: '240000',
      rentPaid: '216000',
    };
    const r = calculateHraFromInput(input)!;
    approx(r.exemptHRAMonthly, 12500);
    approx(r.annualExemptHRA, 150000);
  });

  it('other city uses 40%', () => {
    const input: HraInput = {
      ...createExampleInput(),
      city: 'Other city (40%)',
    };
    const r = calculateHraFromInput(input)!;
    assert.equal(r.applicableCityPercentage, 40);
    approx(r.salaryPercentageLimitMonthly, 22000);
    // still limited by rent-10% = 12500
    approx(r.exemptHRAMonthly, 12500);
  });

  it('empty form yields no result', () => {
    const v = validateHraInput(createEmptyInput());
    assert.equal(v.result, null);
  });

  it('city change FY2026: Pune 50% raises city limit', () => {
    const input: HraInput = {
      ...createExampleInput(),
      city: 'Pune',
      taxYear: '2026-27',
      rentPaid: '30000',
      hraReceived: '30000',
    };
    const r = calculateHraFromInput(input)!;
    assert.equal(r.applicableCityPercentage, 50);
    approx(r.salaryPercentageLimitMonthly, 27500);
  });
});
