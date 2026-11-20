import assert from 'node:assert/strict';
import {
  calculateBackEndDTILimit,
  calculateDTIBasedHousingBudget,
  calculateFrontEndDTILimit,
  calculateMaximumLoanPrincipal,
  calculateMonthlyGrossIncome,
  calculateMonthlyMortgagePayment,
  downPaymentAndLoan,
  monthlyCostFromMode,
  solveFixedBudgetAffordability,
  solveIncomeBasedAffordability,
} from './calculation';
import {
  createDefaultFixedBudgetInput,
  createDefaultIncomeInput,
} from './types';
import {
  validateFixedBudgetInput,
  validateIncomeBasedInput,
} from './validation';

// Test 1: Monthly Gross Income
assert.equal(calculateMonthlyGrossIncome(120_000), 10_000);

// Test 2: Conventional Front-End Limit
assert.ok(Math.abs(calculateFrontEndDTILimit(10_000, 28) - 2_800) < 1e-9);

// Test 3: Conventional Back-End Limit
assert.ok(Math.abs(calculateBackEndDTILimit(10_000, 36, 500) - 3_100) < 1e-9);

// Test 4: Binding Constraint
{
  const b = calculateDTIBasedHousingBudget(2_800, 3_100);
  assert.ok(Math.abs(b.budget - 2_800) < 1e-9);
  assert.equal(b.binding, 'front');
}

// Test 5: Standard Mortgage Payment ≈ 1,798.65
{
  const m = calculateMonthlyMortgagePayment(300_000, 6, 360);
  assert.ok(m !== null);
  assert.ok(Math.abs(m! - 1_798.65) < 0.02);
}

// Test 6: Zero Interest
assert.equal(calculateMonthlyMortgagePayment(120_000, 0, 120), 1_000);

// Test 7: Property Tax
assert.equal(monthlyCostFromMode(400_000, 1.5, 'annualPercentage'), 500);

// Test 8: Insurance ≈ 166.67
{
  const ins = monthlyCostFromMode(400_000, 0.5, 'annualPercentage');
  assert.ok(Math.abs(ins - 166.6666667) < 0.01);
}

// Test 9: Maintenance
assert.equal(monthlyCostFromMode(400_000, 1.5, 'annualPercentage'), 500);

// Test 10: Percentage Down Payment
{
  const d = downPaymentAndLoan(400_000, 'percentage', 20);
  assert.equal(d.downPayment, 80_000);
  assert.equal(d.loanAmount, 320_000);
}

// Test 11: Fixed Down Payment
{
  const d = downPaymentAndLoan(400_000, 'amount', 50_000);
  assert.equal(d.loanAmount, 350_000);
}

// Test 12: Monthly Budget Constraint (include fees)
{
  const solved = solveFixedBudgetAffordability({
    monthlyHousingBudget: 3_500,
    annualInterestRatePercent: 7.3,
    termMonths: 360,
    downPaymentMode: 'percentage',
    downPaymentValue: 20,
    includeTaxesAndFees: true,
    propertyTax: 1.5,
    propertyTaxMode: 'annualPercentage',
    hoaFee: 0,
    hoaMode: 'annualPercentage',
    insurance: 0.5,
    insuranceMode: 'annualPercentage',
    maintenance: 1.5,
    maintenanceMode: 'annualPercentage',
    currency: 'USD',
  });
  assert.equal(solved.ok, true);
  if (solved.ok) {
    assert.ok(solved.result.housePrice > 0);
    assert.ok(
      solved.result.totalMonthlyHousingCosts <=
        solved.result.monthlyHousingBudget + 1
    );
  }
}

// Test 13: Excluded Taxes and Fees
{
  const solved = solveFixedBudgetAffordability({
    monthlyHousingBudget: 2_000,
    annualInterestRatePercent: 6,
    termMonths: 360,
    downPaymentMode: 'percentage',
    downPaymentValue: 20,
    includeTaxesAndFees: false,
    propertyTax: 1.5,
    propertyTaxMode: 'annualPercentage',
    hoaFee: 0,
    hoaMode: 'annualPercentage',
    insurance: 0.5,
    insuranceMode: 'annualPercentage',
    maintenance: 1.5,
    maintenanceMode: 'annualPercentage',
    currency: 'USD',
  });
  assert.equal(solved.ok, true);
  if (solved.ok) {
    assert.ok(solved.result.monthlyPi <= 2_000 + 1);
    assert.ok(solved.result.totalMonthlyHousingCosts >= solved.result.monthlyPi);
    assert.equal(solved.result.includeTaxesAndFees, false);
  }
}

// Test 14: Higher interest reduces capacity
{
  const low = calculateMaximumLoanPrincipal(2_000, 4, 360)!;
  const high = calculateMaximumLoanPrincipal(2_000, 8, 360)!;
  assert.ok(high < low);
}

// Test 15: Existing debt reduces back-end housing limit
{
  const a = calculateBackEndDTILimit(10_000, 36, 0);
  const b = calculateBackEndDTILimit(10_000, 36, 800);
  assert.ok(b < a);
}

// Test 16 / 17: DTI profile switching via validation
{
  const conventional = validateIncomeBasedInput(createDefaultIncomeInput());
  assert.ok(conventional.result);
  assert.equal(conventional.result!.dtiProfile, 'conventional');

  const custom = validateIncomeBasedInput({
    ...createDefaultIncomeInput(),
    dtiProfile: 'custom',
    customFrontEndDti: '25',
    customBackEndDti: '35',
  });
  assert.ok(custom.result);
  assert.equal(custom.result!.dtiProfile, 'custom');
}

// Test 18: Invalid inputs
{
  const neg = validateIncomeBasedInput({
    ...createDefaultIncomeInput(),
    annualHouseholdIncome: '-1',
  });
  assert.ok(neg.errors.annualHouseholdIncome);

  const zeroTerm = validateIncomeBasedInput({
    ...createDefaultIncomeInput(),
    mortgageTermYears: '0',
  });
  assert.ok(zeroTerm.errors.mortgageTermYears);
}

// Test 19: Solver accuracy for income-based defaults
{
  const v = validateIncomeBasedInput(createDefaultIncomeInput());
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  assert.ok(
    v.result!.totalHousingPayment <= v.result!.housingBudget + 1
  );
}

// Test 20: Independent calculator state (defaults differ)
{
  const a = createDefaultIncomeInput();
  const b = createDefaultFixedBudgetInput();
  a.annualInterestRate = '5';
  assert.equal(b.annualInterestRate, '7.3');
}

// Test 21: Reset defaults
{
  const a = createDefaultIncomeInput();
  const b = createDefaultFixedBudgetInput();
  assert.equal(a.dtiProfile, 'conventional');
  assert.equal(b.includeTaxesAndFees, true);
  assert.equal(b.monthlyHousingBudget, '3500');
}

// Test 22: Large numbers
{
  const v = validateFixedBudgetInput({
    ...createDefaultFixedBudgetInput(),
    monthlyHousingBudget: '500000',
  });
  assert.ok(v.result);
  assert.ok(v.result!.formattedHousePrice.includes(','));
}

// Test 24: No feasible financing
{
  const v = validateFixedBudgetInput({
    ...createDefaultFixedBudgetInput(),
    monthlyHousingBudget: '0',
  });
  assert.ok(v.errors.form || !v.result);
}

// Test 25: No finite price bound (100% down, fees excluded)
{
  const solved = solveFixedBudgetAffordability({
    monthlyHousingBudget: 3_500,
    annualInterestRatePercent: 7.3,
    termMonths: 360,
    downPaymentMode: 'percentage',
    downPaymentValue: 100,
    includeTaxesAndFees: false,
    propertyTax: 0,
    propertyTaxMode: 'annualPercentage',
    hoaFee: 0,
    hoaMode: 'annualPercentage',
    insurance: 0,
    insuranceMode: 'annualPercentage',
    maintenance: 0,
    maintenanceMode: 'annualPercentage',
    currency: 'USD',
  });
  assert.equal(solved.ok, false);
}

// Income-based insufficient back-end
{
  const v = validateIncomeBasedInput({
    ...createDefaultIncomeInput(),
    annualHouseholdIncome: '60000',
    monthlyDebtPayments: '2500',
  });
  assert.ok(v.errors.form || !v.result);
}

console.log('house-affordability/calculation.test.ts: all assertions passed');
