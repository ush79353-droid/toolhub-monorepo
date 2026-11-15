import { calculateInvestment, inflationAdjustedValue } from './calculation';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function approx(actual: number, expected: number, tol = 0.02): boolean {
  return Math.abs(actual - expected) <= tol;
}

{
  const result = calculateInvestment({
    initialInvestment: 10_000,
    rateOfReturnPercent: 5,
    termYears: 10,
    compounding: 'monthly',
    inflationRatePercent: 0,
    contributionFrequency: 'never',
    contributionAmount: 0,
    contributionTiming: 'end',
    currency: 'PKR',
  });
  assert(result !== null, 'reference should solve');
  assert(approx(result!.finalBalance, 16_470.09), `final ${result!.finalBalance}`);
  assert(approx(result!.investmentReturn, 6_470.09), `return ${result!.investmentReturn}`);
  assert(result!.annualPoints[0]?.year === 0, 'year 0 point');
  assert(result!.annualPoints.length >= 11, 'annual points through year 10');
}

{
  const adj = inflationAdjustedValue(16_470.09, 0.02, 10);
  assert(adj !== null && adj < 16_470.09, 'inflation reduces real value');
}

{
  assert(
    calculateInvestment({
      initialInvestment: 10_000,
      rateOfReturnPercent: 5,
      termYears: 0,
      compounding: 'monthly',
      inflationRatePercent: 0,
      contributionFrequency: 'never',
      contributionAmount: 0,
      contributionTiming: 'end',
      currency: 'PKR',
    }) === null,
    'zero term fails'
  );
}

console.log('investment calculation.test.ts: ok');
