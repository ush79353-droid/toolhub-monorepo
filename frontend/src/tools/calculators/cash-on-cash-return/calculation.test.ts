import assert from 'node:assert/strict';
import {
  calculateAnnualCashFlow,
  calculateAnnualDebtService,
  calculateCashOnCashReturn,
  calculateEffectiveRentalIncome,
  calculateNetOperatingIncome,
  calculateVacancyLoss,
} from './calculation';
import { createDefaultInput } from './types';
import { validateCashOnCashInput } from './validation';

// Test 1: Standard Cash-on-Cash Return
{
  const vacancyLoss = calculateVacancyLoss(60_000, 5)!;
  assert.equal(vacancyLoss, 3_000);
  const effective = calculateEffectiveRentalIncome(60_000, vacancyLoss)!;
  assert.equal(effective, 57_000);
  const noi = calculateNetOperatingIncome(effective, 15_000)!;
  assert.equal(noi, 42_000);
  const debt = calculateAnnualDebtService(1_500)!;
  assert.equal(debt, 18_000);
  const cashFlow = calculateAnnualCashFlow(noi, debt)!;
  assert.equal(cashFlow, 24_000);
  assert.equal(calculateCashOnCashReturn(cashFlow, 80_000), 30);

  const v = validateCashOnCashInput({
    ...createDefaultInput(),
    totalCashInvestment: '80000',
    grossAnnualRentalIncome: '60000',
    vacancyRate: '5',
    annualOperatingExpenses: '15000',
    monthlyLoanPayment: '1500',
  });
  assert.equal(v.isValid, true);
  assert.equal(v.result?.noi, 42_000);
  assert.equal(v.result?.annualDebtService, 18_000);
  assert.equal(v.result?.annualCashFlow, 24_000);
  assert.equal(v.result?.cashOnCashReturnPercent, 30);
}

// Test 2: No Vacancy
{
  assert.equal(calculateVacancyLoss(50_000, 0), 0);
  assert.equal(calculateEffectiveRentalIncome(50_000, 0), 50_000);
}

// Test 3: Full Vacancy
{
  assert.equal(calculateVacancyLoss(50_000, 100), 50_000);
  assert.equal(calculateEffectiveRentalIncome(50_000, 50_000), 0);
}

// Test 4: No Mortgage
{
  assert.equal(calculateAnnualDebtService(0), 0);
}

// Test 5: Negative Annual Cash Flow
{
  assert.equal(calculateAnnualCashFlow(20_000, 30_000), -10_000);
}

// Test 6: Negative Cash-on-Cash Return
{
  assert.equal(calculateCashOnCashReturn(-10_000, 100_000), -10);
}

// Test 7: Zero Cash Investment → return unavailable (NOI path still ok)
{
  assert.equal(calculateCashOnCashReturn(10_000, 0), null);
  const v = validateCashOnCashInput({
    ...createDefaultInput(),
    totalCashInvestment: '0',
    grossAnnualRentalIncome: '60000',
    vacancyRate: '0',
    annualOperatingExpenses: '10000',
    monthlyLoanPayment: '0',
  });
  assert.ok(v.errors.totalCashInvestment);
  assert.equal(v.isValid, true);
  assert.equal(v.result?.noi, 50_000);
  assert.equal(v.result?.cashOnCashReturnPercent, null);
}

// Test 8: Annual Debt Service
{
  assert.equal(calculateAnnualDebtService(2_500), 30_000);
}

// Test 9: Decimal inputs
{
  const v = validateCashOnCashInput({
    ...createDefaultInput(),
    totalCashInvestment: '100000.50',
    grossAnnualRentalIncome: '72000.25',
    vacancyRate: '5.5',
    annualOperatingExpenses: '20000.10',
    monthlyLoanPayment: '2000.00',
  });
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  assert.ok(Number.isFinite(v.result.cashOnCashReturnPercent!));
}

// Test 10: Invalid Vacancy
{
  const low = validateCashOnCashInput({
    ...createDefaultInput(),
    grossAnnualRentalIncome: '50000',
    vacancyRate: '-1',
    annualOperatingExpenses: '10000',
    monthlyLoanPayment: '0',
  });
  assert.ok(low.errors.vacancyRate);

  const high = validateCashOnCashInput({
    ...createDefaultInput(),
    grossAnnualRentalIncome: '50000',
    vacancyRate: '101',
    annualOperatingExpenses: '10000',
    monthlyLoanPayment: '0',
  });
  assert.ok(high.errors.vacancyRate);
}

// Test 11: Input clearing — clear gross rent → no results
{
  const cleared = validateCashOnCashInput({
    ...createDefaultInput(),
    totalCashInvestment: '80000',
    grossAnnualRentalIncome: '',
    vacancyRate: '5',
    annualOperatingExpenses: '15000',
    monthlyLoanPayment: '1500',
  });
  assert.equal(cleared.isValid, false);
  assert.equal(cleared.result, null);
}

// Test 12: Reset defaults
{
  const d = createDefaultInput();
  assert.equal(d.currency, 'PKR');
  assert.equal(d.vacancyRate, '0');
  assert.equal(d.totalCashInvestment, '');
  const v = validateCashOnCashInput(d);
  assert.equal(v.isValid, false);
  assert.equal(v.result, null);
}

// Test 13: Large values
{
  const v = validateCashOnCashInput({
    ...createDefaultInput(),
    totalCashInvestment: '1500000',
    grossAnnualRentalIncome: '250000',
    vacancyRate: '5',
    annualOperatingExpenses: '75000',
    monthlyLoanPayment: '12000',
  });
  assert.equal(v.isValid, true);
  assert.equal(v.result?.annualDebtService, 144_000);
  assert.ok(v.result!.formattedNoi.includes(','));
}

// Test 14: NOI/cash flow without investment still computes (return null)
{
  const v = validateCashOnCashInput({
    ...createDefaultInput(),
    totalCashInvestment: '',
    grossAnnualRentalIncome: '60000',
    vacancyRate: '5',
    annualOperatingExpenses: '15000',
    monthlyLoanPayment: '1500',
  });
  assert.equal(v.isValid, true);
  assert.equal(v.result?.noi, 42_000);
  assert.equal(v.result?.annualCashFlow, 24_000);
  assert.equal(v.result?.cashOnCashReturnPercent, null);
}

console.log('cash-on-cash-return/calculation.test.ts: all assertions passed');
