/**
 * Self-check for SIP + Lumpsum math.
 * Run: npx tsx src/tools/calculators/sip-lumpsum/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  calculateSipLumpsum,
  futureValueCombined,
  periodicRate,
  roundMoneyAmount,
  solveDeposit,
  solveLumpsum,
} from './calculation';

// Screenshot: 1,000 · 10% · 10y · monthly · PMT 0 → 2,707.04
{
  const i = periodicRate(0.1, 'monthly', 12);
  assert.ok(i != null);
  const fv = futureValueCombined({
    pv: 1000,
    pmt: 0,
    periodicRate: i!,
    periods: 120,
    timing: 'beginning',
  });
  assert.ok(fv != null);
  assert.equal(roundMoneyAmount(fv!, 'PKR'), 2707.04);
}

{
  const math = calculateSipLumpsum({
    solveFor: 'finalBalance',
    currency: 'PKR',
    pv: 1000,
    annualReturnPercent: 10,
    termYears: 10,
    startDateIso: '2023-11-21',
    inflationPercent: 0,
    compounding: 'monthly',
    pmt: 0,
    depositFrequency: 'monthly',
    timing: 'beginning',
    targetFv: 0,
  });
  assert.ok(math);
  assert.equal(roundMoneyAmount(math!.finalBalance, 'PKR'), 2707.04);
  assert.equal(math!.numberOfTransactions, 120);
  assert.equal(math!.endDate.toISOString().slice(0, 10), '2033-11-21');
  assert.equal(roundMoneyAmount(math!.totalReturn, 'PKR'), 1707.04);
}

// Beginning deposit earns one extra period of interest vs end
{
  const i = periodicRate(0.12, 'monthly', 12)!;
  const begin = futureValueCombined({
    pv: 0,
    pmt: 100,
    periodicRate: i,
    periods: 12,
    timing: 'beginning',
  })!;
  const end = futureValueCombined({
    pv: 0,
    pmt: 100,
    periodicRate: i,
    periods: 12,
    timing: 'end',
  })!;
  assert.ok(begin > end);
}

// Solve deposit round-trip
{
  const i = periodicRate(0.1, 'monthly', 12)!;
  const target = futureValueCombined({
    pv: 1000,
    pmt: 50,
    periodicRate: i,
    periods: 120,
    timing: 'beginning',
  })!;
  const pmt = solveDeposit({
    targetFv: target,
    pv: 1000,
    periodicRate: i,
    periods: 120,
    timing: 'beginning',
  });
  assert.ok(pmt != null);
  assert.ok(Math.abs(pmt! - 50) < 1e-6);
}

// Solve lumpsum round-trip
{
  const i = periodicRate(0.1, 'monthly', 12)!;
  const target = futureValueCombined({
    pv: 1000,
    pmt: 0,
    periodicRate: i,
    periods: 120,
    timing: 'end',
  })!;
  const pv = solveLumpsum({
    targetFv: target,
    pmt: 0,
    periodicRate: i,
    periods: 120,
    timing: 'end',
  });
  assert.ok(pv != null);
  assert.ok(Math.abs(pv! - 1000) < 1e-6);
}

// Zero rate: FV = PV + PMT * n
{
  const fv = futureValueCombined({
    pv: 500,
    pmt: 100,
    periodicRate: 0,
    periods: 10,
    timing: 'end',
  });
  assert.equal(fv, 1500);
}

// Invalid: division / negative base rejected
{
  assert.equal(periodicRate(-2, 'monthly', 12), null);
  assert.equal(
    futureValueCombined({
      pv: 100,
      pmt: 0,
      periodicRate: -1,
      periods: 5,
      timing: 'end',
    }),
    null
  );
}

console.log('sip-lumpsum calculation.test.ts: ok');
