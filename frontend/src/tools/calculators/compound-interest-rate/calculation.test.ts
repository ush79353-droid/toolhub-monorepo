import {
  calculateCompoundInterestRate,
  roundRate4,
  solveAnnualNominalRate,
} from './calculation';
import { createDefaultCompoundInterestRateInput } from './types';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function approx(actual: number, expected: number, tol = 1e-4): boolean {
  return Math.abs(actual - expected) <= tol;
}

{
  const rate = solveAnnualNominalRate(10_000, 18_000, 12, 10);
  assert(rate !== null, 'reference rate should solve');
  assert(approx(roundRate4(rate!), 5.8923), `expected ~5.8923, got ${rate}`);
}

{
  const result = calculateCompoundInterestRate(createDefaultCompoundInterestRateInput());
  assert(result.defined, 'defaults should calculate');
  assert(result.surplus === 8_000, `surplus ${result.surplus}`);
  assert(
    result.annualNominalRatePercent === 5.8923,
    `rate ${result.annualNominalRatePercent}`
  );
}

{
  const declining = calculateCompoundInterestRate({
    ...createDefaultCompoundInterestRateInput(),
    finalBalance: 8_000,
  });
  assert(declining.defined, 'declining balance should calculate');
  assert(
    (declining.annualNominalRatePercent ?? 0) < 0,
    'declining balance should yield negative rate'
  );
}

{
  const zeroTerm = calculateCompoundInterestRate({
    ...createDefaultCompoundInterestRateInput(),
    termYears: 0,
    termMonths: 0,
  });
  assert(!zeroTerm.defined, 'zero term must fail');
}

{
  const badPv = calculateCompoundInterestRate({
    ...createDefaultCompoundInterestRateInput(),
    initialBalance: 0,
  });
  assert(!badPv.defined, 'zero initial must fail');
}

console.log('compound-interest-rate calculation.test.ts: ok');
