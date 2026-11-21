import assert from 'node:assert/strict';
import {
  calculateAPC,
  calculateAveragePropensityToSave,
  calculateDisposableIncome,
  getAPCInterpretation,
} from './calculation';
import { validateApcInput } from './validation';
import { createDefaultInput, createExampleInput } from './types';

function nearly(actual: number, expected: number, eps = 1e-9) {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`,
  );
}

// Test Case 1 — Standard APC
{
  const r = calculateAPC(8400, 10_000, 'USD');
  assert.ok(r);
  nearly(r.apcRatio, 0.84);
  nearly(r.apcPercentage, 84);
  assert.equal(r.impliedSavings, 1600);
  nearly(r.averagePropensityToSave, 0.16);
}

// Test Case 2 — APC = 1
{
  const r = calculateAPC(10_000, 10_000, 'USD');
  assert.ok(r);
  assert.equal(r.apcRatio, 1);
  assert.equal(r.apcPercentage, 100);
  assert.equal(r.impliedSavings, 0);
}

// Test Case 3 — APC > 1
{
  const r = calculateAPC(11_000, 10_000, 'USD');
  assert.ok(r);
  nearly(r.apcRatio, 1.1);
  nearly(r.apcPercentage, 110);
  assert.equal(r.impliedSavings, -1000);
  assert.match(r.interpretation, /exceeds/i);
}

// Test Case 4 — Zero consumption
{
  const r = calculateAPC(0, 10_000, 'USD');
  assert.ok(r);
  assert.equal(r.apcRatio, 0);
  assert.equal(r.apcPercentage, 0);
  assert.equal(r.impliedSavings, 10_000);
  nearly(r.averagePropensityToSave, 1);
}

// Test Case 5 — Decimal inputs
{
  const r = calculateAPC(8455.5, 10_000, 'USD');
  assert.ok(r);
  nearly(r.apcRatio, 0.84555);
  nearly(r.apcPercentage, 84.555);
  assert.equal(r.impliedSavings, 1544.5);
}

// Test Case 6 — Large values
{
  const r = calculateAPC(850_000, 1_000_000, 'USD');
  assert.ok(r);
  nearly(r.apcRatio, 0.85);
  nearly(r.apcPercentage, 85);
  assert.equal(r.impliedSavings, 150_000);
}

// Test Case 7 — Zero disposable income rejected
assert.equal(calculateAPC(0, 0, 'USD'), null);
assert.equal(calculateAPC(100, 0, 'USD'), null);
assert.equal(calculateAPC(-1, 1000, 'USD'), null);
assert.equal(calculateAPC(1000, -1, 'USD'), null);

nearly(calculateAveragePropensityToSave(8400, 10_000)!, 0.16);
assert.equal(calculateDisposableIncome(12_000, 2000), 10_000);
assert.match(getAPCInterpretation(0.8), /80\.00%/);

{
  const empty = validateApcInput(createDefaultInput());
  assert.equal(empty.isValid, false);

  const example = validateApcInput(createExampleInput());
  assert.equal(example.isValid, true);
  assert.ok(example.result);
  nearly(example.result.apcRatio, 0.84);
}

console.log('apc/calculation.test.ts: all assertions passed');
