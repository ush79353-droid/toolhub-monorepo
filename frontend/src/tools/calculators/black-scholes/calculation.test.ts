import assert from 'node:assert/strict';
import {
  calculateBlackScholes,
  normalCdf,
  timeToYears,
} from './calculation';
import { validateBlackScholesInput } from './validation';
import { createExampleInput } from './types';

// Φ(0) = 0.5
assert.ok(Math.abs(normalCdf(0) - 0.5) < 1e-12);

// Φ is odd around 0.5
assert.ok(Math.abs(normalCdf(1.2) + normalCdf(-1.2) - 1) < 1e-7);

assert.equal(timeToYears(12, 'months'), 1);
assert.equal(timeToYears(365, 'days'), 1);
assert.equal(timeToYears(2, 'years'), 2);

// Hull-style ATM: S=K=100, T=1, r=5%, σ=20%, q=0 → call ≈ 10.4506, put ≈ 5.5735
const atm = calculateBlackScholes({
  stock: 100,
  strike: 100,
  timeYears: 1,
  dividendYield: 0,
  volatility: 0.2,
  riskFreeRate: 0.05,
});
assert.ok(atm);
assert.ok(Math.abs(atm!.call - 10.450575415) < 1e-4);
assert.ok(Math.abs(atm!.put - 5.573517866) < 1e-4);

// Put-call parity (q=0): C − P = S − K e^(−rT)
const parity =
  atm!.call -
  atm!.put -
  (100 - 100 * Math.exp(-0.05));
assert.ok(Math.abs(parity) < 1e-6);

// T=0 intrinsic
const expiry = calculateBlackScholes({
  stock: 120,
  strike: 100,
  timeYears: 0,
  dividendYield: 0,
  volatility: 0.25,
  riskFreeRate: 0.05,
});
assert.ok(expiry);
assert.equal(expiry!.call, 20);
assert.equal(expiry!.put, 0);

// σ=0 forward intrinsic
const zeroVol = calculateBlackScholes({
  stock: 100,
  strike: 100,
  timeYears: 1,
  dividendYield: 0,
  volatility: 0,
  riskFreeRate: 0.05,
});
assert.ok(zeroVol);
assert.ok(zeroVol!.call > 0);
assert.equal(zeroVol!.put, 0);

// Reject non-positive spot
assert.equal(
  calculateBlackScholes({
    stock: 0,
    strike: 100,
    timeYears: 1,
    dividendYield: 0,
    volatility: 0.2,
    riskFreeRate: 0.05,
  }),
  null
);

// Validation wiring (same-currency paths skip the rate map)
const validated = validateBlackScholesInput(createExampleInput(), null);
assert.equal(validated.isValid, true);
assert.ok(validated.result);
assert.ok(Math.abs(validated.result!.callCanonical - 10.450575415) < 1e-4);

console.log('black-scholes calculation.test.ts: ok');
