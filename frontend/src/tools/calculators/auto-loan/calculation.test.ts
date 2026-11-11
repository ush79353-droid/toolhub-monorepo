import assert from 'node:assert/strict';
import {
  addMonthsToIsoDate,
  buildAmortizationCsv,
  calculateAutoLoan,
  escapeCsvCell,
} from './calculation';
import { createDefaultAutoLoanInput, type AutoLoanInput } from './types';
import { validateAutoLoanInput } from './validation';

function makeInput(overrides: Partial<AutoLoanInput> = {}): AutoLoanInput {
  return {
    ...createDefaultAutoLoanInput('2026-01-15'),
    ...overrides,
  };
}

// 1. Standard amortizing loan (baseline formula check)
{
  const input = makeInput({
    autoPrice: 30000,
    downPaymentValue: 5000,
    downPaymentMode: 'amount',
    loanTermValue: 60,
    loanTermUnit: 'months',
    annualInterestRate: 6,
    tradeInValue: 0,
    tradeInOwed: 0,
    salesTaxRate: 0,
    additionalFees: 0,
  });
  const result = calculateAutoLoan(input);
  assert.equal(result.amountFinanced, 25000);
  // M = 25000 * 0.005 * (1.005)^60 / ((1.005)^60 - 1) = 483.3200...
  assert.equal(result.estimatedMonthlyPayment, 483.32);
  assert.equal(result.monthlySchedule.length, 60);
  assert.equal(result.monthlySchedule[59].endingBalance, 0);
  assert.equal(result.payoffDate, '2031-01-15');
}

// 2. Zero interest loan (M = P / n with final payment cent adjustment)
{
  const input = makeInput({
    autoPrice: 10000,
    downPaymentValue: 0,
    downPaymentMode: 'amount',
    loanTermValue: 36,
    loanTermUnit: 'months',
    annualInterestRate: 0,
    tradeInValue: 0,
    tradeInOwed: 0,
    salesTaxRate: 0,
    additionalFees: 0,
  });
  const result = calculateAutoLoan(input);
  assert.equal(result.amountFinanced, 10000);
  assert.equal(result.estimatedMonthlyPayment, 277.78);
  assert.equal(result.totalInterest, 0);
  assert.equal(result.totalLoanPayments, 10000);
  assert.equal(result.scheduleTotals.totalPrincipal, 10000);
  assert.equal(result.monthlySchedule[35].endingBalance, 0);
  // 35 * 277.78 = 9722.30 -> final payment = 277.70
  assert.equal(result.finalMonthlyPayment, 277.7);
}

// 3. Zero principal case (down payment covers entire price, tax & fees paid upfront)
{
  const input = makeInput({
    autoPrice: 25000,
    downPaymentValue: 100,
    downPaymentMode: 'percent',
    loanTermValue: 48,
    loanTermUnit: 'months',
    annualInterestRate: 5.5,
    tradeInValue: 0,
    tradeInOwed: 0,
    salesTaxRate: 8,
    salesTaxInclusion: 'upfront',
    additionalFees: 500,
    feesInclusion: 'upfront',
    startDate: '2026-03-10',
  });
  const result = calculateAutoLoan(input);
  assert.equal(result.amountFinanced, 0);
  assert.equal(result.estimatedMonthlyPayment, 0);
  assert.equal(result.totalInterest, 0);
  assert.equal(result.totalLoanPayments, 0);
  assert.equal(result.upfrontCosts, 27500);
  assert.equal(result.totalEstimatedCost, 27500);
  assert.equal(result.monthlySchedule.length, 0);
  assert.equal(result.payoffDate, '2026-03-10');
}

// 4. Positive trade-in equity reduces financed amount without double counting
{
  const input = makeInput({
    autoPrice: 32000,
    downPaymentValue: 2000,
    downPaymentMode: 'amount',
    tradeInValue: 10000,
    tradeInOwed: 4000,
    salesTaxRate: 0,
    additionalFees: 0,
  });
  const result = calculateAutoLoan(input);
  assert.equal(result.netTradeInEquity, 6000);
  assert.equal(result.tradeInEquityStatus, 'positive');
  // 32000 - 2000 - 6000 = 24000
  assert.equal(result.amountFinanced, 24000);
  // Total cost = upfront (2000) + positive equity (6000) + loan payments (24000 + interest)
  assert.equal(
    Number((result.totalEstimatedCost - result.totalInterest).toFixed(2)),
    32000
  );
}

// 5. Negative trade-in equity rolls underwater balance into financed principal
{
  const input = makeInput({
    autoPrice: 28000,
    downPaymentValue: 1000,
    downPaymentMode: 'amount',
    tradeInValue: 5000,
    tradeInOwed: 8500,
    salesTaxRate: 0,
    additionalFees: 0,
  });
  const result = calculateAutoLoan(input);
  assert.equal(result.netTradeInEquity, -3500);
  assert.equal(result.tradeInEquityStatus, 'negative');
  // 28000 - 1000 - (-3500) = 30500
  assert.equal(result.amountFinanced, 30500);
  assert.equal(
    Number((result.totalEstimatedCost - result.totalInterest).toFixed(2)),
    31500
  );
}

// 6 & 7. Financed vs Upfront sales tax + explicit tax policy ('after-trade-in' vs 'full-price')
{
  const base = {
    autoPrice: 40000,
    downPaymentValue: 4000,
    downPaymentMode: 'amount' as const,
    tradeInValue: 10000,
    tradeInOwed: 0,
    salesTaxRate: 10,
    additionalFees: 0,
  };

  const financedAfterTrade = calculateAutoLoan(
    makeInput({ ...base, taxPolicy: 'after-trade-in', salesTaxInclusion: 'finance' })
  );
  assert.equal(financedAfterTrade.taxableVehicleAmount, 30000);
  assert.equal(financedAfterTrade.salesTax, 3000);
  assert.equal(financedAfterTrade.amountFinanced, 29000);
  assert.equal(financedAfterTrade.upfrontCosts, 4000);

  const upfrontFullPrice = calculateAutoLoan(
    makeInput({ ...base, taxPolicy: 'full-price', salesTaxInclusion: 'upfront' })
  );
  assert.equal(upfrontFullPrice.taxableVehicleAmount, 40000);
  assert.equal(upfrontFullPrice.salesTax, 4000);
  assert.equal(upfrontFullPrice.amountFinanced, 26000);
  assert.equal(upfrontFullPrice.upfrontCosts, 8000);
}

// 8 & 9. Financed fees vs Upfront fees
{
  const financed = calculateAutoLoan(
    makeInput({
      autoPrice: 20000,
      downPaymentValue: 2000,
      tradeInValue: 0,
      tradeInOwed: 0,
      salesTaxRate: 0,
      additionalFees: 1200,
      feesInclusion: 'finance',
    })
  );
  assert.equal(financed.amountFinanced, 19200);
  assert.equal(financed.upfrontCosts, 2000);
  assert.equal(financed.financedFees, 1200);
  assert.equal(financed.upfrontFees, 0);

  const upfront = calculateAutoLoan(
    makeInput({
      autoPrice: 20000,
      downPaymentValue: 2000,
      tradeInValue: 0,
      tradeInOwed: 0,
      salesTaxRate: 0,
      additionalFees: 1200,
      feesInclusion: 'upfront',
    })
  );
  assert.equal(upfront.amountFinanced, 18000);
  assert.equal(upfront.upfrontCosts, 3200);
  assert.equal(upfront.financedFees, 0);
  assert.equal(upfront.upfrontFees, 1200);
}

// 10. Down payment percentage conversion
{
  const pct = calculateAutoLoan(
    makeInput({
      autoPrice: 45000,
      downPaymentValue: 20,
      downPaymentMode: 'percent',
      tradeInValue: 0,
      tradeInOwed: 0,
      salesTaxRate: 0,
      additionalFees: 0,
    })
  );
  assert.equal(pct.downPaymentAmount, 9000);
  assert.equal(pct.downPaymentPercentOfPrice, 20);
  assert.equal(pct.amountFinanced, 36000);
}

// 11. Invalid inputs (including negative financed balance & bad calendar dates)
{
  assert.equal(validateAutoLoanInput(makeInput({ autoPrice: 0 })).isValid, false);
  assert.equal(validateAutoLoanInput(makeInput({ annualInterestRate: -1 })).isValid, false);
  assert.equal(
    validateAutoLoanInput(makeInput({ downPaymentMode: 'percent', downPaymentValue: 105 })).isValid,
    false
  );
  assert.equal(
    validateAutoLoanInput(makeInput({ loanTermUnit: 'months', loanTermValue: 12.5 })).isValid,
    false
  );
  assert.equal(
    validateAutoLoanInput(makeInput({ loanTermUnit: 'years', loanTermValue: 35 })).isValid,
    false
  );
  assert.equal(validateAutoLoanInput(makeInput({ startDate: '2026-02-30' })).isValid, false);

  const negativeFinanced = validateAutoLoanInput(
    makeInput({
      autoPrice: 20000,
      downPaymentValue: 15000,
      tradeInValue: 8000,
      tradeInOwed: 0,
      salesTaxRate: 0,
      additionalFees: 0,
    })
  );
  assert.equal(negativeFinanced.isValid, false);
  assert.ok(negativeFinanced.errors.form);
}

// 12 & 13. Long loan term (96 months and 360 months) + date clamping + final payment adjustment
{
  assert.equal(addMonthsToIsoDate('2024-01-31', 1), '2024-02-29'); // leap year
  assert.equal(addMonthsToIsoDate('2025-01-31', 1), '2025-02-28'); // non-leap year

  const longTerm = calculateAutoLoan(
    makeInput({
      autoPrice: 95000,
      downPaymentValue: 5000,
      tradeInValue: 0,
      tradeInOwed: 0,
      salesTaxRate: 6.25,
      additionalFees: 995,
      loanTermValue: 8,
      loanTermUnit: 'years',
      annualInterestRate: 7.49,
      startDate: '2026-01-31',
    })
  );
  assert.equal(longTerm.totalMonths, 96);
  assert.equal(longTerm.monthlySchedule.length, 96);
  assert.equal(longTerm.monthlySchedule[95].endingBalance, 0);
  assert.equal(longTerm.payoffDate, '2034-01-31');

  const maxTerm = calculateAutoLoan(
    makeInput({
      loanTermValue: 30,
      loanTermUnit: 'years',
      annualInterestRate: 5.25,
    })
  );
  assert.equal(maxTerm.totalMonths, 360);
  assert.equal(maxTerm.monthlySchedule[359].endingBalance, 0);
}

// 14. Amortization totals reconciliation & RFC-4180 CSV escaping
{
  const result = calculateAutoLoan(
    makeInput({
      autoPrice: 37450.55,
      downPaymentValue: 4125.15,
      tradeInValue: 7350,
      tradeInOwed: 3120.4,
      salesTaxRate: 7.375,
      additionalFees: 799.99,
      annualInterestRate: 5.89,
      loanTermValue: 72,
      loanTermUnit: 'months',
    })
  );

  const monthlyPrincipalSum = Number(
    result.monthlySchedule.reduce((acc, row) => acc + row.principalPaid, 0).toFixed(2)
  );
  const monthlyInterestSum = Number(
    result.monthlySchedule.reduce((acc, row) => acc + row.interestPaid, 0).toFixed(2)
  );
  const monthlyPaymentSum = Number(
    result.monthlySchedule.reduce((acc, row) => acc + row.monthlyPayment, 0).toFixed(2)
  );

  assert.equal(monthlyPrincipalSum, result.amountFinanced);
  assert.equal(monthlyInterestSum, result.totalInterest);
  assert.equal(monthlyPaymentSum, result.totalLoanPayments);
  assert.equal(result.scheduleTotals.totalPrincipal, result.amountFinanced);
  assert.equal(result.scheduleTotals.totalInterest, result.totalInterest);
  assert.equal(result.scheduleTotals.totalPayment, result.totalLoanPayments);

  const yearlyPrincipalSum = Number(
    result.yearlySchedule.reduce((acc, row) => acc + row.principalPaid, 0).toFixed(2)
  );
  const yearlyInterestSum = Number(
    result.yearlySchedule.reduce((acc, row) => acc + row.interestPaid, 0).toFixed(2)
  );
  const yearlyPaymentSum = Number(
    result.yearlySchedule.reduce((acc, row) => acc + row.totalPayment, 0).toFixed(2)
  );
  assert.equal(yearlyPrincipalSum, result.amountFinanced);
  assert.equal(yearlyInterestSum, result.totalInterest);
  assert.equal(yearlyPaymentSum, result.totalLoanPayments);

  // CSV escaping
  assert.equal(escapeCsvCell('simple'), 'simple');
  assert.equal(escapeCsvCell('a,b'), '"a,b"');
  assert.equal(escapeCsvCell('say "hi"'), '"say ""hi"""');
  assert.equal(escapeCsvCell('line1\nline2'), '"line1\nline2"');

  const csv = buildAmortizationCsv(result, 'monthly', 'USD');
  const csvLines = csv.split('\r\n');
  assert.equal(csvLines.length, result.monthlySchedule.length + 2);
}

console.log('auto-loan calculation.test ok (14 test suites passed)');

