import assert from 'node:assert/strict';
import {
  calculateFinance,
  calculateFutureValue,
  calculateInterestRatePercent,
  calculateNumberOfPeriods,
  calculatePayment,
  calculatePresentValue,
  generateSchedule,
  periodRateFromAnnual,
  tvmResidual,
} from './calculation';

const timing = 'end' as const;
const compounding = 'annually' as const;
const paymentFrequency = 'annually' as const;

// Test 1 — Calculator.net FV reference
{
  const r = periodRateFromAnnual(6, compounding, paymentFrequency);
  assert.ok(r !== null);
  const fv = calculateFutureValue(20_000, -2_000, r!, 10, timing);
  assert.ok(fv !== null);
  assert.ok(Math.abs(fv! - -9_455.36) < 0.01, `FV expected ≈ -9455.36, got ${fv}`);
}

// Test 2 — PV round-trip via residual
{
  const r = periodRateFromAnnual(6, compounding, paymentFrequency)!;
  const fv = -9_455.36;
  const pmt = -2_000;
  const n = 10;
  const pv = calculatePresentValue(fv, pmt, r, n, timing)!;
  const residual = tvmResidual(pv, pmt, fv, r, n, timing)!;
  assert.ok(Math.abs(residual) < 0.05, `PV residual ${residual}`);
}

// Test 3 — PMT round-trip
{
  const r = periodRateFromAnnual(6, compounding, paymentFrequency)!;
  const pmt = calculatePayment(20_000, -9_455.36, r, 10, timing)!;
  assert.ok(Math.abs(pmt - -2_000) < 0.02, `PMT expected ≈ -2000, got ${pmt}`);
}

// Test 4 — I/Y solver
{
  const iy = calculateInterestRatePercent(
    20_000,
    -2_000,
    -9_455.36,
    10,
    timing,
    compounding,
    paymentFrequency,
  );
  assert.ok(iy !== null);
  assert.ok(Math.abs(iy! - 6) < 0.02, `I/Y expected ≈ 6, got ${iy}`);
}

// Test 5 — N solver
{
  const r = periodRateFromAnnual(6, compounding, paymentFrequency)!;
  const n = calculateNumberOfPeriods(20_000, -2_000, -9_455.36, r, timing);
  assert.ok(n !== null);
  assert.ok(Math.abs(n! - 10) < 0.02, `N expected ≈ 10, got ${n}`);
}

// Test 6 — Zero interest
{
  const fv = calculateFutureValue(10_000, -500, 0, 20, timing)!;
  assert.equal(fv, -(10_000 + -500 * 20)); // -0? wait: -(10000 - 10000) = -0 = 0
  assert.ok(Math.abs(fv - 0) < 1e-9);
  const pmt = calculatePayment(5_000, 0, 0, 10, timing)!;
  assert.ok(Math.abs(pmt - -500) < 1e-9);
  const pv = calculatePresentValue(0, -100, 0, 12, timing)!;
  assert.ok(Math.abs(pv - 1_200) < 1e-9);
}

// Test 7 — Beginning-of-period vs end
{
  const r = 0.06;
  const fvEnd = calculateFutureValue(0, -1_000, r, 10, 'end')!;
  const fvBegin = calculateFutureValue(0, -1_000, r, 10, 'beginning')!;
  // Beginning payments earn one extra period of interest → |FV| larger for deposits...
  // With negative PMT (outflow), beginning makes FV more negative in magnitude when PV=0.
  assert.ok(Math.abs(fvBegin) > Math.abs(fvEnd));
  assert.notEqual(fvEnd, fvBegin);
}

// Test 8 — Negative cash flows residual ≈ 0 for full solution
{
  const result = calculateFinance({
    mode: 'FV',
    n: 10,
    iy: 6,
    pv: 20_000,
    pmt: -2_000,
    fv: 0,
    paymentFrequency,
    compoundingFrequency: compounding,
    paymentTiming: timing,
    currency: 'USD',
  });
  assert.ok(result);
  const residual = tvmResidual(
    result!.pv,
    result!.pmt,
    result!.fv,
    result!.periodRate,
    result!.n,
    timing,
  )!;
  assert.ok(Math.abs(residual) < 0.02);
}

// Test 9 — Decimal values
{
  const r = periodRateFromAnnual(5.25, compounding, paymentFrequency)!;
  const fv = calculateFutureValue(12_345.67, -100.25, r, 8, timing);
  assert.ok(fv !== null && Number.isFinite(fv));
}

// Test 10 — Large values
{
  const r = periodRateFromAnnual(4, compounding, paymentFrequency)!;
  const fv = calculateFutureValue(1_000_000_000, -50_000_000, r, 15, timing);
  assert.ok(fv !== null && Number.isFinite(fv));
}

// Test 11 — Schedule consistency
{
  const r = periodRateFromAnnual(6, compounding, paymentFrequency)!;
  const schedule = generateSchedule({
    pv: 20_000,
    pmt: -2_000,
    r,
    n: 10,
    timing,
  });
  assert.equal(schedule.length, 10);
  assert.ok(Math.abs(schedule[0]!.openingBalance - 20_000) < 1e-9);
  // Running account balance = −TVM FV (cash-flow sign convention)
  const fv = calculateFutureValue(20_000, -2_000, r, 10, timing)!;
  assert.ok(
    Math.abs(schedule[9]!.endingBalance - -fv) < 0.05,
    `schedule end ${schedule[9]!.endingBalance} vs −FV ${-fv}`,
  );
}

// Test 12 — Monthly period rate conversion
{
  const r = periodRateFromAnnual(12, 'monthly', 'monthly');
  assert.ok(r !== null);
  assert.ok(Math.abs(r! - 0.01) < 1e-12);
}

console.log('finance/calculation.test.ts: all assertions passed');
