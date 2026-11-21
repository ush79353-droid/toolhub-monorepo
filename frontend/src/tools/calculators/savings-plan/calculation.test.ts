/**
 * Lightweight assert suite for Savings Plan Calculator (principal-only series).
 * Run: npx tsx frontend/src/tools/calculators/savings-plan/calculation.test.ts
 */
import {
  buildPeriodBalances,
  computeSavingsPlan,
  startingDepositFromTarget,
  totalFromDepositSeries,
} from './calculation';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function approxEqual(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

// Default screenshot case: 52 × 100 + 0 = 5,200
assert(
  approxEqual(totalFromDepositSeries(52, 100, 0), 5200),
  'weekly 52×100 should total 5200'
);

// Growing deposits: nA + G n(n-1)/2
assert(
  approxEqual(totalFromDepositSeries(52, 100, 10), 5200 + (10 * 52 * 51) / 2),
  'growing weekly series mismatch'
);
assert(
  approxEqual(totalFromDepositSeries(52, 100, 10), 18460),
  '52×100 + 10×52×51/2 should be 18460'
);

// Reverse solve
assert(
  approxEqual(startingDepositFromTarget(52, 5200, 0), 100),
  'target 5200 with G=0 should require A=100'
);
assert(
  approxEqual(startingDepositFromTarget(52, 18460, 10), 100),
  'target 18460 with G=10 should require A=100'
);

// Chart balances match closed form
{
  const balances = buildPeriodBalances(5, 100, 10);
  assert(balances.length === 5, 'expected 5 period rows');
  assert(approxEqual(balances[0]!.deposit, 100), 'period 1 deposit');
  assert(approxEqual(balances[0]!.balance, 100), 'period 1 balance');
  assert(approxEqual(balances[1]!.deposit, 110), 'period 2 deposit');
  assert(approxEqual(balances[1]!.balance, 210), 'period 2 balance');
  assert(approxEqual(balances[4]!.balance, totalFromDepositSeries(5, 100, 10)), 'final chart vs formula');
}

// Deposit mode compute
{
  const r = computeSavingsPlan({
    mode: 'deposit',
    frequency: 'weekly',
    periods: 52,
    startingDeposit: 100,
    increasePerPeriod: 0,
    targetBalance: 0,
    currency: 'PKR',
  });
  assert(r.ok, 'deposit mode should succeed');
  if (r.ok) {
    assert(approxEqual(r.finalBalance, 5200), 'final balance 5200');
    assert(approxEqual(r.balances[r.balances.length - 1]!.balance, r.finalBalance), 'chart sync');
  }
}

// Target mode unreachable
{
  const r = computeSavingsPlan({
    mode: 'target',
    frequency: 'weekly',
    periods: 10,
    startingDeposit: 0,
    increasePerPeriod: 100,
    targetBalance: 100,
    currency: 'PKR',
  });
  // growth alone = 100*10*9/2 = 4500 > 100 → A negative
  assert(!r.ok && r.reason === 'unreachable-target', 'should reject unreachable target');
}

// Invalid periods
{
  const r = computeSavingsPlan({
    mode: 'deposit',
    frequency: 'weekly',
    periods: 0,
    startingDeposit: 100,
    increasePerPeriod: 0,
    targetBalance: 0,
    currency: 'PKR',
  });
  assert(!r.ok && r.reason === 'invalid-periods', 'periods=0 invalid');
}

// Negative growth allowed (decreasing deposits)
assert(
  approxEqual(totalFromDepositSeries(3, 100, -10), 300 - 30),
  'decreasing series 100+90+80 = 270'
);

console.log('savings-plan calculation.test.ts: all asserts passed');
