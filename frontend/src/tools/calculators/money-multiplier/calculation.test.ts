import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateBankReserves,
  calculateMoneyMultiplier,
  calculateMoneyMultiplierBundle,
  calculateSimpleDepositMultiplier,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
} from './types';
import { validateMoneyMultiplierInput } from './validation';

describe('money multiplier math', () => {
  it('example 1M / 10% / 200k → m = 4', () => {
    const b = calculateMoneyMultiplierBundle({
      checkableDeposits: 1_000_000,
      reserveRatioPercent: 10,
      currencyInCirculation: 200_000,
    });
    assert.equal(b.bankReserves, 100_000);
    assert.equal(b.monetaryBase, 300_000);
    assert.equal(b.moneySupply, 1_200_000);
    assert.equal(b.moneyMultiplier, 4);
    assert.equal(b.simpleDepositMultiplier, 10);
  });

  it('table fixtures', () => {
    assert.equal(
      calculateMoneyMultiplierBundle({
        checkableDeposits: 1_000_000,
        reserveRatioPercent: 20,
        currencyInCirculation: 0,
      }).moneyMultiplier,
      5
    );
    assert.equal(
      calculateMoneyMultiplierBundle({
        checkableDeposits: 1_000_000,
        reserveRatioPercent: 10,
        currencyInCirculation: 0,
      }).moneyMultiplier,
      10
    );
    assert.equal(
      calculateMoneyMultiplierBundle({
        checkableDeposits: 500_000,
        reserveRatioPercent: 25,
        currencyInCirculation: 125_000,
      }).moneyMultiplier,
      2.5
    );
    assert.ok(
      Math.abs(
        calculateMoneyMultiplierBundle({
          checkableDeposits: 1_000_000,
          reserveRatioPercent: 100,
          currencyInCirculation: 200_000,
        }).moneyMultiplier! - 1
      ) < 1e-9
    );
  });

  it('zero base → null multiplier', () => {
    assert.equal(calculateMoneyMultiplier(0, 0), null);
    assert.equal(
      calculateMoneyMultiplierBundle({
        checkableDeposits: 0,
        reserveRatioPercent: 0,
        currencyInCirculation: 0,
      }).moneyMultiplier,
      null
    );
  });

  it('simple md unavailable at 0%', () => {
    assert.equal(calculateSimpleDepositMultiplier(0), null);
    assert.equal(calculateBankReserves(1_000_000, 10), 100_000);
  });
});

describe('validateMoneyMultiplierInput', () => {
  it('empty invalid', () => {
    assert.equal(validateMoneyMultiplierInput(createEmptyInput()).isValid, false);
    assert.equal(
      validateMoneyMultiplierInput(createDefaultInput()).isValid,
      false
    );
  });

  it('example → 4.00×', () => {
    const v = validateMoneyMultiplierInput(createExampleInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result?.moneyMultiplier, 4);
    assert.equal(v.result?.simpleDepositMultiplier, 10);
    assert.equal(v.result?.bankReserves, 100_000);
  });

  it('reserves mode derives ratio', () => {
    const v = validateMoneyMultiplierInput({
      ...createExampleInput(),
      reserveSource: 'reserves',
      reserveRatio: '',
      bankReserves: '100000',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result?.reserveRatioPercent, 10);
    assert.equal(v.result?.moneyMultiplier, 4);
  });

  it('rejects ratio > 100 and negatives', () => {
    assert.equal(
      validateMoneyMultiplierInput({
        ...createExampleInput(),
        reserveRatio: '101',
      }).isValid,
      false
    );
    assert.equal(
      validateMoneyMultiplierInput({
        ...createExampleInput(),
        checkableDeposits: '-1',
      }).isValid,
      false
    );
  });
});
