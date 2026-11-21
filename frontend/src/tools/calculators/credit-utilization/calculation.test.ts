import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateCreditUtilization, formatCuPercent } from './calculation';
import { createDefaultInput, createLineId } from './types';
import { validateCreditUtilizationInput } from './validation';

function nearly(actual: number | null | undefined, expected: number, eps = 1e-6) {
  assert.ok(actual != null, `expected ~${expected}, got ${actual}`);
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateCreditUtilization', () => {
  it('single card 500/2000 → 25%', () => {
    const r = calculateCreditUtilization(
      [{ id: 'a', moneyUsed: 500, creditLimit: 2000 }],
      30
    )!;
    nearly(r.overallUtilization, 25);
    nearly(r.remainingAvailableCredit, 1500);
    nearly(r.requiredBalanceReduction, 0);
  });

  it('two cards → ~26.6667%', () => {
    const r = calculateCreditUtilization(
      [
        { id: 'a', moneyUsed: 500, creditLimit: 2000 },
        { id: 'b', moneyUsed: 300, creditLimit: 1000 },
      ],
      30
    )!;
    nearly(r.totalCreditUsed, 800);
    nearly(r.totalCreditLimit, 3000);
    nearly(r.overallUtilization, (800 / 3000) * 100, 1e-9);
    assert.equal(formatCuPercent(r.overallUtilization), '26.67');
    nearly(r.remainingAvailableCredit, 2200);
  });

  it('three cards → 37.60%', () => {
    const r = calculateCreditUtilization(
      [
        { id: 'a', moneyUsed: 400, creditLimit: 4000 },
        { id: 'b', moneyUsed: 500, creditLimit: 4000 },
        { id: 'c', moneyUsed: 8500, creditLimit: 17000 },
      ],
      30
    )!;
    nearly(r.totalCreditUsed, 9400);
    nearly(r.totalCreditLimit, 25000);
    nearly(r.overallUtilization, 37.6);
    nearly(r.remainingAvailableCredit, 15600);
  });

  it('zero used → 0%', () => {
    nearly(
      calculateCreditUtilization(
        [{ id: 'a', moneyUsed: 0, creditLimit: 5000 }],
        30
      )!.overallUtilization,
      0
    );
  });

  it('full utilization → 100%', () => {
    nearly(
      calculateCreditUtilization(
        [{ id: 'a', moneyUsed: 5000, creditLimit: 5000 }],
        30
      )!.overallUtilization,
      100
    );
  });

  it('over-limit → 120%', () => {
    const r = calculateCreditUtilization(
      [{ id: 'a', moneyUsed: 6000, creditLimit: 5000 }],
      30
    )!;
    nearly(r.overallUtilization, 120);
    nearly(r.remainingAvailableCredit, -1000);
    nearly(r.overLimitAmount, 1000);
  });

  it('target reduction 4000/10000 @ 30%', () => {
    const r = calculateCreditUtilization(
      [{ id: 'a', moneyUsed: 4000, creditLimit: 10000 }],
      30
    )!;
    nearly(r.overallUtilization, 40);
    nearly(r.targetBalance, 3000);
    nearly(r.requiredBalanceReduction, 1000);
  });

  it('already below target → reduction 0', () => {
    nearly(
      calculateCreditUtilization(
        [{ id: 'a', moneyUsed: 1000, creditLimit: 10000 }],
        30
      )!.requiredBalanceReduction,
      0
    );
  });

  it('additional limit 5000/10000 @ 25%', () => {
    const r = calculateCreditUtilization(
      [{ id: 'a', moneyUsed: 5000, creditLimit: 10000 }],
      25
    )!;
    nearly(r.additionalCreditLimitNeeded, 10000);
  });

  it('target 0% with balance → null additional limit', () => {
    const r = calculateCreditUtilization(
      [{ id: 'a', moneyUsed: 1000, creditLimit: 5000 }],
      0
    )!;
    nearly(r.requiredBalanceReduction, 1000);
    assert.equal(r.additionalCreditLimitNeeded, null);
    assert.ok(r.additionalLimitUnavailableReason);
  });

  it('decimal currency → 12.55%', () => {
    nearly(
      calculateCreditUtilization(
        [{ id: 'a', moneyUsed: 125.5, creditLimit: 1000 }],
        30
      )!.overallUtilization,
      12.55
    );
  });

  it('empty → null', () => {
    assert.equal(calculateCreditUtilization([], 30), null);
  });
});

describe('validateCreditUtilizationInput', () => {
  it('defaults empty → no result', () => {
    const v = validateCreditUtilizationInput(createDefaultInput());
    assert.equal(v.result, null);
    assert.equal(v.isValid, false);
  });

  it('single card validates', () => {
    const input = createDefaultInput();
    input.lines[0] = {
      id: createLineId(),
      moneyUsed: '500',
      creditLimit: '2000',
    };
    const v = validateCreditUtilizationInput(input);
    assert.equal(v.isValid, true);
    nearly(v.result!.overallUtilization, 25);
  });

  it('zero credit limit errors', () => {
    const input = createDefaultInput();
    input.lines[0] = {
      id: createLineId(),
      moneyUsed: '500',
      creditLimit: '0',
    };
    const v = validateCreditUtilizationInput(input);
    assert.equal(v.isValid, false);
    assert.ok(v.errors.lines);
  });

  it('negative balance errors', () => {
    const input = createDefaultInput();
    input.lines[0] = {
      id: createLineId(),
      moneyUsed: '-500',
      creditLimit: '2000',
    };
    const v = validateCreditUtilizationInput(input);
    assert.equal(v.isValid, false);
  });

  it('missing limit errors', () => {
    const input = createDefaultInput();
    input.lines[0] = {
      id: createLineId(),
      moneyUsed: '500',
      creditLimit: '',
    };
    const v = validateCreditUtilizationInput(input);
    assert.equal(v.isValid, false);
    const id = input.lines[0].id;
    assert.match(
      v.errors.lines![id]!.creditLimit!,
      /credit limit/i
    );
  });

  it('missing money used errors', () => {
    const input = createDefaultInput();
    input.lines[0] = {
      id: createLineId(),
      moneyUsed: '',
      creditLimit: '2000',
    };
    const v = validateCreditUtilizationInput(input);
    assert.equal(v.isValid, false);
    const id = input.lines[0].id;
    assert.match(v.errors.lines![id]!.moneyUsed!, /money used/i);
  });
});
