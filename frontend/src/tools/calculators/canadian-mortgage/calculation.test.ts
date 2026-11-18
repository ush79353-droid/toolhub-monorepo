import {
  amortizingMonthlyPayment,
  calculateCanadianMortgage,
  canadianEffectiveMonthlyRate,
  formatUsdAmount,
} from './calculation';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function nearlyEqual(a: number, b: number, tol = 1e-6): boolean {
  return Math.abs(a - b) <= tol;
}

// Reference: $800,000, 20% down, 25 years, 5% Canadian APR → ~$3,722.27 / mo
{
  const r = canadianEffectiveMonthlyRate(5);
  assert(nearlyEqual(r, Math.pow(1.025, 1 / 6) - 1), 'semi-annual monthly rate');

  const payment = amortizingMonthlyPayment(640000, r, 300);
  assert(payment !== null, 'payment exists');
  assert(nearlyEqual(payment!, 3722.2719042369, 1e-6), `payment ${payment}`);
  assert(formatUsdAmount(payment!) === '3,722.27', 'formatted payment');
}

{
  const result = calculateCanadianMortgage({
    homePrice: 800000,
    downPaymentPercent: 20,
    loanTermYears: 25,
    interestRatePercent: 5,
    includeOptionals: true,
    propertyTaxPercent: 0.3,
    homeInsuranceAnnual: 2500,
    mortgageInsuranceAnnual: 0,
    condoHoaFeeAnnual: 0,
    otherCostsAnnual: 6000,
    startMonth: 11,
    startYear: 2026,
  });
  assert(result !== null, 'full result');
  assert(result!.loanAmount === 640000, 'loan amount');
  assert(result!.downPayment === 160000, 'down payment');
  assert(result!.paymentCount === 300, 'payment count');
  assert(nearlyEqual(result!.monthlyMortgagePayment, 3722.2719042369, 1e-6), 'monthly');
  assert(nearlyEqual(result!.monthlyPropertyTax, 200, 1e-9), 'property tax monthly');
  assert(nearlyEqual(result!.totalPropertyTax, 60000, 1e-6), 'property tax total');
  assert(nearlyEqual(result!.monthlyHomeInsurance, 2500 / 12, 1e-9), 'insurance monthly');
  assert(nearlyEqual(result!.totalHomeInsurance, 62500, 1e-6), 'insurance total');
  assert(nearlyEqual(result!.monthlyOtherCosts, 500, 1e-9), 'other monthly');
  assert(nearlyEqual(result!.totalOtherCosts, 150000, 1e-6), 'other total');
  assert(result!.payoffMonth === 11 && result!.payoffYear === 2051, 'payoff date');
  assert(
    nearlyEqual(
      result!.monthlyOutOfPocket,
      result!.monthlyMortgagePayment + 200 + 2500 / 12 + 500,
      1e-9
    ),
    'out of pocket monthly'
  );
}

{
  const zero = calculateCanadianMortgage({
    homePrice: 100000,
    downPaymentPercent: 10,
    loanTermYears: 10,
    interestRatePercent: 0,
    includeOptionals: false,
    propertyTaxPercent: 0,
    homeInsuranceAnnual: 0,
    mortgageInsuranceAnnual: 0,
    condoHoaFeeAnnual: 0,
    otherCostsAnnual: 0,
    startMonth: 1,
    startYear: 2026,
  });
  assert(zero !== null, 'zero rate');
  assert(nearlyEqual(zero!.monthlyMortgagePayment, 90000 / 120, 1e-9), 'P/n');
  assert(zero!.monthlyPropertyTax === 0, 'optionals off');
  assert(zero!.totalInterest === 0, 'no interest');
}

console.log('canadian-mortgage calculation.test.ts: ok');
