import assert from 'node:assert/strict';
import { calculateMortgageUk, formatGbp } from './calculation';

// Screenshot example: £500,000 / 25% / 25y / 5% with optionals
{
  const r = calculateMortgageUk({
    homePrice: 500_000,
    depositPercent: 25,
    termYears: 25,
    annualRatePercent: 5,
    includeOptionals: true,
    taxesPercent: 1.2,
    homeInsuranceAnnual: 2_500,
    mortgageInsuranceAnnual: 0,
    otherCostsAnnual: 6_000,
    startMonth: 11,
    startYear: 2026,
  });
  assert.ok(r);
  assert.equal(r.loanAmount, 375_000);
  assert.equal(r.depositAmount, 125_000);
  assert.equal(r.interestOnlyMonthly, 1_562.5);
  assert.equal(formatGbp(r.monthlyRepayment), '2,192.21');
  assert.equal(formatGbp(r.totalMortgagePayments), '657,663.80');
  assert.equal(formatGbp(r.totalInterest), '282,663.80');
  assert.equal(r.taxesMonthly, 500);
  assert.equal(r.taxesTotal, 150_000);
  assert.equal(formatGbp(r.homeInsuranceMonthly), '208.33');
  assert.equal(r.homeInsuranceTotal, 62_500);
  assert.equal(r.otherCostsMonthly, 500);
  assert.equal(r.otherCostsTotal, 150_000);
  assert.equal(formatGbp(r.outOfPocketMonthly), '3,400.55');
  assert.equal(formatGbp(r.outOfPocketTotal), '1,020,163.80');
  assert.equal(r.startLabel, 'Nov 2026');
  assert.ok(r.chartSlices.every((s) => s.key !== 'mortgageInsurance'));
}

// Zero interest → repayment = loan / n
{
  const r = calculateMortgageUk({
    homePrice: 100_000,
    depositPercent: 0,
    termYears: 10,
    annualRatePercent: 0,
    includeOptionals: false,
    taxesPercent: 0,
    homeInsuranceAnnual: 0,
    mortgageInsuranceAnnual: 0,
    otherCostsAnnual: 0,
    startMonth: 1,
    startYear: 2026,
  });
  assert.ok(r);
  assert.equal(r.monthlyRepayment, 100_000 / 120);
  assert.equal(r.interestOnlyMonthly, 0);
  assert.equal(r.totalInterest, 0);
}

// Optionals off → no tax/insurance/other in OOP
{
  const r = calculateMortgageUk({
    homePrice: 500_000,
    depositPercent: 25,
    termYears: 25,
    annualRatePercent: 5,
    includeOptionals: false,
    taxesPercent: 1.2,
    homeInsuranceAnnual: 2_500,
    mortgageInsuranceAnnual: 0,
    otherCostsAnnual: 6_000,
    startMonth: 11,
    startYear: 2026,
  });
  assert.ok(r);
  assert.equal(r.taxesTotal, 0);
  assert.equal(r.outOfPocketMonthly, r.monthlyRepayment);
  assert.equal(r.chartSlices.length, 1);
  assert.equal(r.chartSlices[0]?.key, 'mortgage');
}

console.log('mortgage-uk calculation.test.ts: ok');
