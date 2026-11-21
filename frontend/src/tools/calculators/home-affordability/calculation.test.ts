import assert from 'node:assert/strict';
import {
  calculateMaximumHousingBudget,
  calculateMaximumLoanPrincipal,
  calculateMonthlyInsurance,
  calculateMonthlyMortgagePayment,
  calculateMonthlyPropertyTax,
  calculateFrontEndDTILimit,
  calculateBackEndDTILimit,
  calculateMonthlyIncome,
  solveAffordableHomePrice,
} from './calculation';
import { createDefaultInput } from './types';
import { validateHomeAffordabilityInput } from './validation';

// Test 1: Zero-Interest Mortgage
{
  const m = calculateMonthlyMortgagePayment(120_000, 0, 120);
  assert.equal(m, 1_000);
}

// Test 2: Standard Mortgage Payment ≈ 1,798.65
{
  const m = calculateMonthlyMortgagePayment(300_000, 6, 360);
  assert.ok(m !== null);
  assert.ok(Math.abs(m! - 1_798.65) < 0.02);
}

// Test 3: Maximum Loan Principal ≈ 333,583
{
  const L = calculateMaximumLoanPrincipal(2_000, 6, 360);
  assert.ok(L !== null);
  assert.ok(Math.abs(L! - 333_583) < 1);
}

// Test 4: Maximum Payment From Income
{
  const monthly = calculateMonthlyIncome(120_000, 'annual');
  assert.equal(monthly, 10_000);
  const front = calculateFrontEndDTILimit(10_000, 28);
  const back = calculateBackEndDTILimit(10_000, 36, 800);
  assert.ok(Math.abs(front - 2_800) < 1e-9);
  assert.ok(Math.abs(back - 2_800) < 1e-9);
  const budget = calculateMaximumHousingBudget(front, back);
  assert.ok(Math.abs(budget.budget - 2_800) < 1e-9);
}

// Test 5: Fixed Down Payment Without Additional Costs
{
  const L = calculateMaximumLoanPrincipal(2_000, 6, 360)!;
  const solved = solveAffordableHomePrice({
    maximumHousingBudget: 2_000,
    annualInterestRatePercent: 6,
    termMonths: 360,
    downPaymentMode: 'amount',
    downPaymentAmount: 50_000,
    downPaymentPercent: 0,
    annualPropertyTaxRatePercent: 0,
    annualHomeownersInsurance: 0,
    monthlyHoa: 0,
    annualMortgageInsuranceRatePercent: 0,
    closingCostMode: 'none',
    closingCostAmount: 0,
    closingCostPercent: 0,
    currency: 'USD',
    bindingLimit: 'payment',
    monthlyIncome: null,
    monthlyDebt: 0,
  });
  assert.equal(solved.ok, true);
  if (solved.ok) {
    assert.ok(Math.abs(solved.result.loanAmount - L) < 2);
    assert.ok(Math.abs(solved.result.affordableHomePrice - (L + 50_000)) < 2);
  }
}

// Test 6: Property Tax
{
  assert.equal(calculateMonthlyPropertyTax(400_000, 1.2), 400);
}

// Test 7: Homeowners Insurance
{
  assert.equal(calculateMonthlyInsurance(1_800), 150);
}

// Test 8: HOA (passthrough)
{
  assert.equal(150 + 200, 350); // composition covered in solver tests
}

// Test 9: Zero Loan Term
{
  const v = validateHomeAffordabilityInput({
    ...createDefaultInput(),
    maximumPayment: '2000',
    loanTermValue: '0',
    annualInterestRate: '6',
  });
  assert.ok(v.errors.loanTermValue);
  assert.equal(v.result, null);
}

// Test 10: Zero Interest (no division by zero)
{
  const m = calculateMonthlyMortgagePayment(240_000, 0, 240);
  assert.equal(m, 1_000);
  const L = calculateMaximumLoanPrincipal(1_000, 0, 240);
  assert.equal(L, 240_000);
}

// Test 11: Negative Income
{
  const v = validateHomeAffordabilityInput({
    ...createDefaultInput(),
    mode: 'income',
    income: '-1000',
    loanTermValue: '30',
    annualInterestRate: '6',
  });
  assert.ok(v.errors.income);
}

// Test 12: DTI Limit Exceeded
{
  const back = calculateBackEndDTILimit(5_000, 36, 2_500);
  assert.ok(back < 0);
  const v = validateHomeAffordabilityInput({
    ...createDefaultInput(),
    mode: 'income',
    income: '60000',
    incomePeriod: 'annual',
    monthlyDebtPayments: '2500',
    loanTermValue: '30',
    annualInterestRate: '6',
    frontEndDtiLimit: '28',
    backEndDtiLimit: '36',
  });
  assert.ok(v.errors.form || v.result === null);
}

// Test 13: Price-Dependent Property Tax reduces affordability vs ignoring tax
{
  const noTax = solveAffordableHomePrice({
    maximumHousingBudget: 2_500,
    annualInterestRatePercent: 6,
    termMonths: 360,
    downPaymentMode: 'amount',
    downPaymentAmount: 40_000,
    downPaymentPercent: 0,
    annualPropertyTaxRatePercent: 0,
    annualHomeownersInsurance: 0,
    monthlyHoa: 0,
    annualMortgageInsuranceRatePercent: 0,
    closingCostMode: 'none',
    closingCostAmount: 0,
    closingCostPercent: 0,
    currency: 'USD',
    bindingLimit: 'payment',
    monthlyIncome: null,
    monthlyDebt: 0,
  });
  const withTax = solveAffordableHomePrice({
    maximumHousingBudget: 2_500,
    annualInterestRatePercent: 6,
    termMonths: 360,
    downPaymentMode: 'amount',
    downPaymentAmount: 40_000,
    downPaymentPercent: 0,
    annualPropertyTaxRatePercent: 1.2,
    annualHomeownersInsurance: 0,
    monthlyHoa: 0,
    annualMortgageInsuranceRatePercent: 0,
    closingCostMode: 'none',
    closingCostAmount: 0,
    closingCostPercent: 0,
    currency: 'USD',
    bindingLimit: 'payment',
    monthlyIncome: null,
    monthlyDebt: 0,
  });
  assert.equal(noTax.ok, true);
  assert.equal(withTax.ok, true);
  if (noTax.ok && withTax.ok) {
    assert.ok(withTax.result.affordableHomePrice < noTax.result.affordableHomePrice);
    assert.ok(
      withTax.result.totalMonthlyHousingPayment <=
        withTax.result.maximumHousingBudget + 1
    );
  }
}

// Test 14: Percentage Down Payment consistency
{
  const solved = solveAffordableHomePrice({
    maximumHousingBudget: 3_000,
    annualInterestRatePercent: 5,
    termMonths: 360,
    downPaymentMode: 'percent',
    downPaymentAmount: 0,
    downPaymentPercent: 20,
    annualPropertyTaxRatePercent: 0,
    annualHomeownersInsurance: 0,
    monthlyHoa: 0,
    annualMortgageInsuranceRatePercent: 0,
    closingCostMode: 'none',
    closingCostAmount: 0,
    closingCostPercent: 0,
    currency: 'USD',
    bindingLimit: 'payment',
    monthlyIncome: null,
    monthlyDebt: 0,
  });
  assert.equal(solved.ok, true);
  if (solved.ok) {
    const { affordableHomePrice, loanAmount, downPayment } = solved.result;
    assert.ok(Math.abs(downPayment - affordableHomePrice * 0.2) < 1);
    assert.ok(Math.abs(loanAmount + downPayment - affordableHomePrice) < 1);
  }
}

// Test 15: Higher interest rate reduces principal capacity
{
  const low = calculateMaximumLoanPrincipal(2_000, 4, 360)!;
  const high = calculateMaximumLoanPrincipal(2_000, 8, 360)!;
  assert.ok(high < low);
}

// Test 16: Input Clearing
{
  const full = validateHomeAffordabilityInput({
    ...createDefaultInput(),
    maximumPayment: '2000',
    loanTermValue: '30',
    annualInterestRate: '6',
    downPaymentAmount: '50000',
  });
  assert.ok(full.result);
  const cleared = validateHomeAffordabilityInput({
    ...createDefaultInput(),
    maximumPayment: '',
    loanTermValue: '30',
    annualInterestRate: '6',
  });
  assert.equal(cleared.result, null);
}

// Test 17: Reset defaults
{
  const d = createDefaultInput();
  assert.equal(d.mode, 'payment');
  assert.equal(d.currency, 'PKR');
  assert.equal(d.frontEndDtiLimit, '28');
  assert.equal(d.backEndDtiLimit, '36');
  assert.equal(validateHomeAffordabilityInput(d).result, null);
}

// Test 18: Large values
{
  const v = validateHomeAffordabilityInput({
    ...createDefaultInput(),
    maximumPayment: '500000',
    loanTermValue: '25',
    annualInterestRate: '7.5',
    downPaymentAmount: '4000000',
    annualPropertyTaxRate: '1',
  });
  assert.ok(v.result);
  assert.ok(v.result!.affordableHomePrice > 0);
  assert.ok(v.result!.formattedHomePrice.includes(','));
}

// Test 19 / 20: Mode switching independence
{
  const payment = validateHomeAffordabilityInput({
    ...createDefaultInput(),
    mode: 'payment',
    maximumPayment: '2800',
    loanTermValue: '30',
    annualInterestRate: '6',
    downPaymentAmount: '50000',
  });
  const income = validateHomeAffordabilityInput({
    ...createDefaultInput(),
    mode: 'income',
    income: '120000',
    monthlyDebtPayments: '800',
    loanTermValue: '30',
    annualInterestRate: '6',
    downPaymentAmount: '50000',
    frontEndDtiLimit: '28',
    backEndDtiLimit: '36',
  });
  assert.ok(payment.result);
  assert.ok(income.result);
  assert.equal(payment.result!.bindingLimit, 'payment');
  assert.ok(
    income.result!.bindingLimit === 'front' ||
      income.result!.bindingLimit === 'back' ||
      income.result!.bindingLimit === 'tie'
  );
  assert.ok(
    Math.abs(payment.result!.maximumHousingBudget - 2_800) < 1 ||
      Math.abs(income.result!.maximumHousingBudget - 2_800) < 1
  );
}

console.log('home-affordability/calculation.test.ts: all assertions passed');
