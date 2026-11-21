import assert from 'node:assert/strict';
import {
  calculateMaximumDrawdown,
  calculateRecoveryTime,
  calculateRequiredRecoveryGain,
  formatRecoveryDuration,
} from './calculation';
import { validateMaximumDrawdownInput } from './validation';
import { createDefaultInput, createExampleInput } from './types';

function nearly(actual: number, expected: number, eps = 0.02) {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`,
  );
}

// Test Case 1 — Standard drawdown
{
  const r = calculateMaximumDrawdown(15_000, 12_500, 'USD');
  assert.ok(r);
  assert.equal(r.absoluteLoss, 2_500);
  nearly(r.maximumDrawdownPercent, 16.6667, 0.0001);
}

// Test Case 2 — 20% drawdown
{
  const r = calculateMaximumDrawdown(10_000, 8_000, 'USD');
  assert.ok(r);
  assert.equal(r.maximumDrawdownPercent, 20);
}

// Test Case 3 — 50% drawdown
{
  const r = calculateMaximumDrawdown(10_000, 5_000, 'USD');
  assert.ok(r);
  assert.equal(r.maximumDrawdownPercent, 50);
  assert.equal(calculateRequiredRecoveryGain(50), 100);
  assert.equal(r.requiredRecoveryGainPercent, 100);
}

// Test Case 4 — Complete loss
{
  const r = calculateMaximumDrawdown(10_000, 0, 'USD');
  assert.ok(r);
  assert.equal(r.maximumDrawdownPercent, 100);
  const recovery = calculateRecoveryTime(100, 10);
  assert.ok(recovery);
  assert.equal(recovery.status, 'complete_loss');
  assert.equal(recovery.recoveryYears, null);
}

// Test Case 5 — No drawdown
{
  const r = calculateMaximumDrawdown(10_000, 10_000, 'USD');
  assert.ok(r);
  assert.equal(r.maximumDrawdownPercent, 0);
  assert.equal(r.requiredRecoveryGainPercent, 0);
  const recovery = calculateRecoveryTime(0, 10);
  assert.ok(recovery);
  assert.equal(recovery.status, 'zero_drawdown');
  assert.equal(recovery.recoveryYears, 0);
}

// Test Case 6 — Recovery after 20%
{
  const recovery = calculateRecoveryTime(20, 10);
  assert.ok(recovery);
  assert.equal(recovery.status, 'ok');
  nearly(recovery.recoveryYears!, 2.34, 0.01);
  nearly(recovery.requiredRecoveryGainPercent, 25, 0.01);
}

// Test Case 7 — Recovery after 50%
{
  const recovery = calculateRecoveryTime(50, 10);
  assert.ok(recovery);
  nearly(recovery.recoveryYears!, 7.27, 0.01);
}

// Test Case 8 — Zero growth
{
  const recovery = calculateRecoveryTime(20, 0);
  assert.ok(recovery);
  assert.equal(recovery.status, 'zero_growth');
  assert.equal(recovery.recoveryYears, null);
}

// Reject invalid peaks / troughs
assert.equal(calculateMaximumDrawdown(0, 0, 'USD'), null);
assert.equal(calculateMaximumDrawdown(-1, 0, 'USD'), null);
assert.equal(calculateMaximumDrawdown(1000, -1, 'USD'), null);
assert.equal(calculateMaximumDrawdown(1000, 1001, 'USD'), null);
assert.equal(calculateRecoveryTime(20, -1), null);
assert.equal(calculateRequiredRecoveryGain(-1), null);

// Recovery gain table spot checks
nearly(calculateRequiredRecoveryGain(10)!, 11.1111, 0.01);
nearly(calculateRequiredRecoveryGain(30)!, 42.8571, 0.01);
nearly(calculateRequiredRecoveryGain(90)!, 900, 0.01);

// Duration formatting
assert.match(formatRecoveryDuration(0), /0 years/);
assert.match(formatRecoveryDuration(2.34), /2 years/);
assert.equal(formatRecoveryDuration(null), 'Not available');

// Validation + example
{
  const empty = validateMaximumDrawdownInput(createDefaultInput());
  assert.equal(empty.isValid, false);

  const example = validateMaximumDrawdownInput(createExampleInput());
  assert.equal(example.isValid, true);
  assert.ok(example.drawdown);
  nearly(example.drawdown.maximumDrawdownPercent, 16.6667, 0.001);
  assert.ok(example.recovery);
  nearly(example.recovery.recoveryYears!, 1.95, 0.1);
}

console.log('maximum-drawdown/calculation.test.ts: all assertions passed');
