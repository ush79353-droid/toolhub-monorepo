import assert from 'node:assert/strict';
import {
  calculateAnnualSalaryTax,
  calculatePakistanIncomeTax,
  formatPakistanRupees,
  PAKISTAN_SALARY_TAX_YEAR_LABEL,
} from './calculation';
import { validatePakistanIncomeTaxInput } from './validation';
import { createDefaultInput } from './types';

function approxEqual(actual: number, expected: number, eps = 1e-9) {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

// Tax-free ceiling
{
  assert.equal(calculateAnnualSalaryTax(0), 0);
  assert.equal(calculateAnnualSalaryTax(600_000), 0);
}

// Slab 2: 1% above 600k — guide example annual 1,200,000 → 6,000
{
  assert.equal(calculateAnnualSalaryTax(1_200_000), 6_000);
  approxEqual(calculateAnnualSalaryTax(900_000)!, 3_000);
}

// Slab 3 boundary continuity: just above 1.2m
{
  approxEqual(calculateAnnualSalaryTax(1_200_000.01)!, 6_000 + 0.01 * 0.11);
}

// Slab 4: 2.5m annual → 116,000 + 20% × 300,000 = 176,000
{
  assert.equal(calculateAnnualSalaryTax(2_500_000), 176_000);
}

// Slab 5: 3.5m → 316,000 + 25% × 300,000 = 391,000
{
  assert.equal(calculateAnnualSalaryTax(3_500_000), 391_000);
}

// Slab 6: 5m → 541,000 + 29% × 900,000 = 802,000
{
  assert.equal(calculateAnnualSalaryTax(5_000_000), 802_000);
}

// Slab 7: 6m → 976,000 + 32% × 400,000 = 1,104,000
{
  assert.equal(calculateAnnualSalaryTax(6_000_000), 1_104_000);
}

// Slab 8: 8m → 1,424,000 + 35% × 1,000,000 = 1,774,000 (no surcharge)
{
  assert.equal(calculateAnnualSalaryTax(8_000_000), 1_774_000);
  assert.equal(calculateAnnualSalaryTax(12_000_000), 1_424_000 + 0.35 * 5_000_000);
}

// Rejects
{
  assert.equal(calculateAnnualSalaryTax(-1), null);
  assert.equal(calculateAnnualSalaryTax(Number.NaN), null);
  assert.equal(calculateAnnualSalaryTax(Number.POSITIVE_INFINITY), null);
}

// Monthly path — guide example 100,000/mo
{
  const out = calculatePakistanIncomeTax({ monthlyIncome: 100_000 });
  assert.ok(out);
  assert.equal(out.yearlyIncome, 1_200_000);
  assert.equal(out.yearlyTax, 6_000);
  assert.equal(out.monthlyTax, 500);
  assert.equal(out.monthlyIncomeAfterTax, 99_500);
  assert.equal(out.taxYearLabel, PAKISTAN_SALARY_TAX_YEAR_LABEL);
}

// Zero monthly default
{
  const out = calculatePakistanIncomeTax({ monthlyIncome: 0 });
  assert.ok(out);
  assert.equal(out.yearlyTax, 0);
  assert.equal(out.monthlyTax, 0);
  assert.equal(out.monthlyIncomeAfterTax, 0);
}

// Display formatting
{
  assert.equal(formatPakistanRupees(6000), '6,000');
  assert.equal(formatPakistanRupees(99_500.5), '99,500.5');
}

// Validation: default "0" is valid
{
  const ok = validatePakistanIncomeTaxInput(createDefaultInput());
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.yearlyTax, 0);
  assert.equal(ok.result.formattedMonthlyTax, '0');
}

// Validation: blank / negative
{
  const blank = validatePakistanIncomeTaxInput({ monthlyIncome: '' });
  assert.equal(blank.isValid, false);
  const neg = validatePakistanIncomeTaxInput({ monthlyIncome: '-1' });
  assert.equal(neg.isValid, false);
  assert.ok(neg.errors.monthlyIncome);
}

// Validation: 50,000/mo → annual 600,000 → still 0 tax
{
  const ok = validatePakistanIncomeTaxInput({ monthlyIncome: '50000' });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.yearlyIncome, 600_000);
  assert.equal(ok.result.yearlyTax, 0);
}

console.log('pakistan-income-tax calculation.test.ts: ok');
