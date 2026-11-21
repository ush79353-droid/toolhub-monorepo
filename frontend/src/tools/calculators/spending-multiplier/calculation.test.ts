import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateMPC,
  calculateMPS,
  calculateMpcFromMultiplier,
  calculateMpsFromMultiplier,
  calculateOutputChange,
  calculateRequiredSpendingChange,
  calculateSpendingMultiplierFromMPC,
  calculateSpendingMultiplierFromMPS,
} from './calculation';
import { createExampleInput } from './types';
import { validateSpendingMultiplierInput } from './validation';

describe('Spending Multiplier calculation', () => {
  it('multiplier from MPC 0.6 → MPS 0.4, k 2.5', () => {
    assert.equal(calculateMPS(0.6), 0.4);
    assert.equal(calculateSpendingMultiplierFromMPC(0.6), 2.5);
  });

  it('multiplier from MPS 0.2 → MPC 0.8, k 5', () => {
    assert.equal(calculateMPC(0.2), 0.8);
    assert.equal(calculateSpendingMultiplierFromMPS(0.2), 5);
  });

  it('output change: MPC 0.75, ΔA 1000 → k 4, ΔY 4000', () => {
    assert.equal(calculateSpendingMultiplierFromMPC(0.75), 4);
    assert.equal(calculateOutputChange(1000, 4), 4000);
  });

  it('negative spending: MPC 0.5, ΔA −1000 → ΔY −2000', () => {
    assert.equal(calculateSpendingMultiplierFromMPC(0.5), 2);
    assert.equal(calculateOutputChange(-1000, 2), -2000);
  });

  it('MPC/MPS from multiplier 5', () => {
    assert.equal(calculateMpcFromMultiplier(5), 0.8);
    assert.equal(calculateMpsFromMultiplier(5), 0.2);
  });

  it('required autonomous spending: ΔY 10000 / k 4 = 2500', () => {
    assert.equal(calculateRequiredSpendingChange(10_000, 4), 2500);
  });

  it('MPC = 0 → MPS 1, k 1', () => {
    assert.equal(calculateMPS(0), 1);
    assert.equal(calculateSpendingMultiplierFromMPC(0), 1);
  });

  it('MPC = 1 → multiplier undefined (null)', () => {
    assert.equal(calculateSpendingMultiplierFromMPC(1), null);
  });

  it('invalid MPC 1.5 returns null', () => {
    assert.equal(calculateMPS(1.5), null);
    assert.equal(calculateSpendingMultiplierFromMPC(1.5), null);
  });

  it('invalid MPS −0.2 returns null', () => {
    assert.equal(calculateMPC(-0.2), null);
  });

  it('example input validates to k 2.5 and ΔY 2.5M', () => {
    const v = validateSpendingMultiplierInput(createExampleInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result!.mpc, 0.6);
    assert.equal(v.result!.mps, 0.4);
    assert.equal(v.result!.multiplier, 2.5);
    assert.equal(v.result!.outputChangeBase, 2_500_000);
    assert.equal(v.result!.observedDifferenceBase, -500_000);
  });

  it('MPC=1 validation shows undefined multiplier', () => {
    const v = validateSpendingMultiplierInput({
      ...createExampleInput(),
      mpc: '1',
      autonomousSpending: '',
      observedGdpChange: '',
    });
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result!.multiplierUndefined, true);
    assert.match(v.result!.formattedMultiplier, /undefined/i);
  });

  it('from-mps source', () => {
    const v = validateSpendingMultiplierInput({
      ...createExampleInput(),
      propensitySource: 'mps',
      mps: '0.2',
      mpc: '',
      autonomousSpending: '',
      observedGdpChange: '',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result!.mpc, 0.8);
    assert.equal(v.result!.multiplier, 5);
  });

  it('from-multiplier source', () => {
    const v = validateSpendingMultiplierInput({
      ...createExampleInput(),
      propensitySource: 'multiplier',
      multiplier: '5',
      mpc: '',
      mps: '',
      autonomousSpending: '',
      observedGdpChange: '',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result!.mpc, 0.8);
    assert.equal(v.result!.mps, 0.2);
  });

  it('required spending mode', () => {
    const v = validateSpendingMultiplierInput({
      ...createExampleInput(),
      impactSolve: 'required',
      targetOutputChange: '10000',
      autonomousSpending: '',
      observedGdpChange: '',
      mpc: '0.75',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result!.multiplier, 4);
    assert.equal(v.result!.requiredSpendingBase, 2500);
  });
});
