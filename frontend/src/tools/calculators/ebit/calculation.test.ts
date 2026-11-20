import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateEbit,
  calculateEbitMargin,
  calculateOperatingExpensesFromEbit,
  calculateRevenueFromEbit,
} from './calculation';
import { createDefaultInput } from './types';
import { validateEbitInput } from './validation';

function nearly(actual: number | null, expected: number, eps = 1e-9) {
  assert.ok(actual !== null, 'expected a number');
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateEbit', () => {
  it('computes positive EBIT', () => {
    nearly(calculateEbit(50_000, 24_000), 26_000);
  });

  it('computes zero EBIT', () => {
    nearly(calculateEbit(100_000, 100_000), 0);
  });

  it('computes negative EBIT', () => {
    nearly(calculateEbit(80_000, 100_000), -20_000);
  });

  it('allows zero revenue', () => {
    nearly(calculateEbit(0, 15_000), -15_000);
  });

  it('allows zero expenses', () => {
    nearly(calculateEbit(50_000, 0), 50_000);
  });

  it('rejects negative revenue', () => {
    assert.equal(calculateEbit(-1, 10), null);
  });
});

describe('reverse calculations', () => {
  it('solves revenue from EBIT', () => {
    nearly(calculateRevenueFromEbit(30_000, 70_000), 100_000);
  });

  it('solves operating expenses from EBIT', () => {
    nearly(calculateOperatingExpensesFromEbit(100_000, 25_000), 75_000);
  });

  it('rejects reverse revenue below zero', () => {
    assert.equal(calculateRevenueFromEbit(-100, 50), null);
  });

  it('rejects reverse expenses below zero', () => {
    assert.equal(calculateOperatingExpensesFromEbit(50, 100), null);
  });
});

describe('calculateEbitMargin', () => {
  it('computes positive margin', () => {
    nearly(calculateEbitMargin(25_000, 100_000), 25);
  });

  it('computes negative margin', () => {
    nearly(calculateEbitMargin(-20_000, 80_000), -25);
  });

  it('is unavailable when revenue is zero', () => {
    assert.equal(calculateEbitMargin(-15_000, 0), null);
  });
});

describe('validateEbitInput', () => {
  it('validates the worked example', () => {
    const { isValid, result } = validateEbitInput({
      ...createDefaultInput(),
      revenue: '50000',
      operatingExpenses: '24000',
    });
    assert.equal(isValid, true);
    nearly(result!.ebit, 26_000);
    nearly(result!.ebitMargin!, 52);
  });

  it('preserves negative EBIT', () => {
    const { isValid, result } = validateEbitInput({
      ...createDefaultInput(),
      revenue: '80000',
      operatingExpenses: '100000',
    });
    assert.equal(isValid, true);
    nearly(result!.ebit, -20_000);
    nearly(result!.ebitMargin!, -25);
  });

  it('reverse revenue mode', () => {
    const { isValid, result } = validateEbitInput({
      ...createDefaultInput(),
      mode: 'revenue',
      ebit: '30000',
      operatingExpenses: '70000',
    });
    assert.equal(isValid, true);
    nearly(result!.revenue, 100_000);
  });

  it('reverse operating expenses mode', () => {
    const { isValid, result } = validateEbitInput({
      ...createDefaultInput(),
      mode: 'operatingExpenses',
      revenue: '100000',
      ebit: '25000',
    });
    assert.equal(isValid, true);
    nearly(result!.operatingExpenses, 75_000);
  });

  it('rejects negative revenue input', () => {
    const { isValid, errors } = validateEbitInput({
      ...createDefaultInput(),
      revenue: '-100',
      operatingExpenses: '50',
    });
    assert.equal(isValid, false);
    assert.ok(errors.revenue);
  });

  it('returns incomplete when blank', () => {
    const { isValid, result } = validateEbitInput(createDefaultInput());
    assert.equal(isValid, false);
    assert.equal(result, null);
  });
});
