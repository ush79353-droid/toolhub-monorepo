import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateBreakEvenIncome,
  calculateConsumption,
  calculateMPC,
  calculateMPS,
  calculateSpendingMultiplier,
  generateConsumptionCurve,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
} from './types';
import { validateMpcInput } from './validation';

describe('mpc math', () => {
  it('MPC 600/1000 = 0.6', () => {
    assert.equal(calculateMPC(600, 1000), 0.6);
  });

  it('consumer spending 18000 + 0.6*40000 = 42000', () => {
    assert.equal(calculateConsumption(18_000, 0.6, 40_000), 42_000);
  });

  it('MPS and multiplier', () => {
    assert.equal(calculateMPS(0.6), 0.4);
    assert.equal(calculateSpendingMultiplier(0.6), 2.5);
  });

  it('break-even 18000/(1-0.6) = 45000', () => {
    assert.equal(calculateBreakEvenIncome(18_000, 0.6), 45_000);
  });

  it('zero ΔYd → null MPC', () => {
    assert.equal(calculateMPC(600, 0), null);
  });

  it('negative MPC allowed', () => {
    assert.equal(calculateMPC(-200, 1000), -0.2);
  });

  it('MPC = 1 → multiplier and break-even null', () => {
    assert.equal(calculateSpendingMultiplier(1), null);
    assert.equal(calculateBreakEvenIncome(18_000, 1), null);
  });

  it('curve includes intercept and current income', () => {
    const pts = generateConsumptionCurve(18_000, 0.6, 40_000);
    assert.ok(pts.length > 2);
    assert.equal(pts[0]!.disposableIncome, 0);
    assert.equal(pts[0]!.consumerSpending, 18_000);
    const at40 = pts.find((p) => p.disposableIncome === 40_000);
    assert.ok(at40);
    assert.equal(at40!.consumerSpending, 42_000);
  });
});

describe('validateMpcInput', () => {
  it('empty invalid', () => {
    assert.equal(validateMpcInput(createEmptyInput()).isValid, false);
    assert.equal(validateMpcInput(createDefaultInput()).isValid, false);
  });

  it('example → 0.6 / 42000 / 2.5 / 45000', () => {
    const v = validateMpcInput(createExampleInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result?.mpc, 0.6);
    assert.equal(v.result?.consumerSpending, 42_000);
    assert.equal(v.result?.mps, 0.4);
    assert.equal(v.result?.spendingMultiplier, 2.5);
    assert.equal(v.result?.breakEvenIncome, 45_000);
  });

  it('ΔYd = 0 undefined', () => {
    const v = validateMpcInput({
      ...createExampleInput(),
      changeInDisposableIncome: '0',
    });
    assert.equal(v.isValid, false);
    assert.match(
      v.errors.changeInDisposableIncome ?? '',
      /undefined/i
    );
  });

  it('negative MPC with warning', () => {
    const v = validateMpcInput({
      ...createExampleInput(),
      changeInConsumption: '-200',
      changeInDisposableIncome: '1000',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result?.mpc, -0.2);
    assert.ok(v.result?.mpcWarning);
  });

  it('direct MPC mode', () => {
    const v = validateMpcInput({
      ...createExampleInput(),
      mode: 'direct-mpc',
      mpcDirect: '0.8',
      changeInDisposableIncome: '',
      changeInConsumption: '',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result?.mpc, 0.8);
    assert.equal(v.result?.consumerSpending, 18_000 + 0.8 * 40_000);
  });
});
