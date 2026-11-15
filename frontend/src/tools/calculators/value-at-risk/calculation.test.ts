import { calculateValueAtRisk, inverseNormalCdf, zForTailPercent, Z_5 } from './calculation';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function approx(actual: number, expected: number, tol = 0.02): boolean {
  return Math.abs(actual - expected) <= tol;
}

{
  assert(approx(zForTailPercent(5)!, Z_5, 1e-9), '5% Z');
  assert(approx(inverseNormalCdf(0.95), Z_5, 1e-5), 'invNorm 95%');
}

{
  const result = calculateValueAtRisk({
    portfolioValue: 100_000,
    standardDeviationPercent: 2,
    expectedReturnPercent: 0,
    timeframeAmount: 1,
    timeframeUnit: 'days',
    tailProbabilityPercent: 5,
    currency: 'PKR',
  });
  assert(result !== null, 'example should solve');
  assert(approx(result!.varAmount, 3289.71, 0.05), `VaR ${result!.varAmount}`);
}

{
  const zeroVol = calculateValueAtRisk({
    portfolioValue: 100_000,
    standardDeviationPercent: 0,
    expectedReturnPercent: 0,
    timeframeAmount: 1,
    timeframeUnit: 'days',
    tailProbabilityPercent: 5,
    currency: 'PKR',
  });
  assert(zeroVol !== null && zeroVol.varAmount === 0, 'zero vol → zero VaR');
}

console.log('value-at-risk calculation.test.ts: ok');
