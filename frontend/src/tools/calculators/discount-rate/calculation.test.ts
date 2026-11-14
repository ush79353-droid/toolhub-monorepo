import assert from 'node:assert/strict';
import {
  closedFormDiscountRate,
  presentValueAtRate,
  solveDiscountRate,
} from './calculation';

// Zero CF closed form: PV=1000, FV=1500, 5y, yearly → ~8.447%
{
  const r = closedFormDiscountRate(1000, 1500, 5, 1);
  assert.ok(r !== null);
  assert.ok(Math.abs(r! - 0.0844717712) < 1e-6);
}

// Closed form matches solver with CF=0
{
  const solved = solveDiscountRate({
    presentValue: 1000,
    futureValue: 1500,
    cashFlow: 0,
    termYears: 5,
    compoundFrequency: 'annually',
    cashFlowFrequency: 'annually',
    cashFlowTiming: 'end',
  });
  assert.ok(solved);
  assert.ok(Math.abs(solved!.annualDiscountRatePercent - 8.44717712) < 1e-3);
}

// With CF: reconstructed PV at solved rate ≈ input PV
{
  const solved = solveDiscountRate({
    presentValue: 1000,
    futureValue: 500,
    cashFlow: 50,
    termYears: 5,
    compoundFrequency: 'annually',
    cashFlowFrequency: 'annually',
    cashFlowTiming: 'end',
  });
  assert.ok(solved);
  const r = solved!.annualDiscountRatePercent / 100;
  const times = [1, 2, 3, 4, 5];
  const pvModel = presentValueAtRate(r, 500, 50, 5, 1, times);
  assert.ok(Math.abs(pvModel - 1000) < 0.05);
}

// Invalid: PV ≤ 0
{
  const solved = solveDiscountRate({
    presentValue: 0,
    futureValue: 1000,
    cashFlow: 0,
    termYears: 5,
    compoundFrequency: 'annually',
    cashFlowFrequency: 'annually',
    cashFlowTiming: 'end',
  });
  assert.equal(solved, null);
}

console.log('discount-rate calculation.test.ts: ok');
