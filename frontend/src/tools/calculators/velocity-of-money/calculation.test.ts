import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateVelocityOfMoney } from './calculation';
import { collectFieldErrors, validateVelocityOfMoneyInput } from './validation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
  createGdpExampleInput,
  type VelocityOfMoneyInput,
} from './types';

function base(overrides: Partial<VelocityOfMoneyInput> = {}): VelocityOfMoneyInput {
  return { ...createExampleInput(), ...overrides };
}

describe('calculateVelocityOfMoney', () => {
  it('Test 1: transaction V = 1.5M / 500k = 3', () => {
    const r = calculateVelocityOfMoney(createExampleInput());
    assert.ok(r);
    assert.equal(r.velocity, 3);
  });

  it('Test 2: GDP V = 25T / 20T = 1.25', () => {
    const r = calculateVelocityOfMoney(createGdpExampleInput());
    assert.ok(r);
    assert.equal(r.velocity, 1.25);
  });

  it('Test 3: reverse money supply 4T / V2 = 2T', () => {
    const r = calculateVelocityOfMoney(
      base({
        mode: 'transactions',
        solveTarget: 'moneySupply',
        magnitude: 'trillions',
        nominalTransactionValue: '4',
        velocity: '2',
        moneySupply: '',
      })
    );
    assert.ok(r);
    assert.equal(r.moneySupplyBase, 2e12);
  });

  it('Test 4: zero money supply → invalid', () => {
    const v = validateVelocityOfMoneyInput(
      base({ moneySupply: '0' })
    );
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
    assert.ok(v.errors.moneySupply || v.errors.form);
  });

  it('Test 5: zero transaction value → V = 0', () => {
    const r = calculateVelocityOfMoney(
      base({ nominalTransactionValue: '0', moneySupply: '500000' })
    );
    assert.ok(r);
    assert.equal(r.velocity, 0);
  });

  it('Test 6: negative money supply', () => {
    const e = collectFieldErrors(base({ moneySupply: '-1' }));
    assert.ok(e.moneySupply);
  });

  it('Test 7: negative transaction value', () => {
    const e = collectFieldErrors(
      base({ nominalTransactionValue: '-10' })
    );
    assert.ok(e.nominalTransactionValue);
  });

  it('Test 8: missing required field', () => {
    const v = validateVelocityOfMoneyInput(
      base({ moneySupply: '' })
    );
    assert.equal(v.result, null);
  });

  it('Test 9: large trillion values', () => {
    const r = calculateVelocityOfMoney(
      base({
        magnitude: 'trillions',
        nominalTransactionValue: '100',
        moneySupply: '40',
      })
    );
    assert.ok(r);
    assert.equal(r.velocity, 2.5);
    assert.ok(Number.isFinite(r.velocity));
  });

  it('Test 10: mode switch isolation', () => {
    const txn = calculateVelocityOfMoney(createExampleInput());
    const gdp = calculateVelocityOfMoney(createGdpExampleInput());
    assert.ok(txn && gdp);
    assert.equal(txn.mode, 'transactions');
    assert.equal(gdp.mode, 'gdp');
    assert.notEqual(txn.velocity, gdp.velocity);
  });

  it('Test 11: reverse nominal flow M×V', () => {
    const r = calculateVelocityOfMoney(
      base({
        solveTarget: 'nominalFlow',
        moneySupply: '500000',
        velocity: '3',
        nominalTransactionValue: '',
      })
    );
    assert.ok(r);
    assert.equal(r.numeratorBase, 1_500_000);
  });

  it('Test 12: period unit yearly', () => {
    const r = calculateVelocityOfMoney(createExampleInput());
    assert.ok(r);
    assert.match(r.formattedVelocity, /turnovers\/year/);
  });

  it('Test 13: price index not used as currency without base price', () => {
    const e = collectFieldErrors(
      base({
        transactionSource: 'derived',
        priceIndex: '120',
        indexBase: '100',
        basePrice: '',
        volume: '10000',
        moneySupply: '300000',
      })
    );
    assert.ok(e.basePrice);
  });

  it('Test 13b: derived Example D → V = 4', () => {
    const r = calculateVelocityOfMoney(
      base({
        transactionSource: 'derived',
        priceIndex: '120',
        indexBase: '100',
        basePrice: '100',
        volume: '10000',
        moneySupply: '300000',
        magnitude: 'units',
        nominalTransactionValue: '',
      })
    );
    assert.ok(r);
    assert.equal(r.velocity, 4);
    assert.equal(r.impliedPricePerBasket, 120);
  });

  it('Test 14: reset/clear helpers', () => {
    assert.equal(createEmptyInput().moneySupply, '');
    assert.equal(createDefaultInput().solveTarget, 'velocity');
  });

  it('never returns Infinity', () => {
    assert.equal(
      calculateVelocityOfMoney(base({ moneySupply: '0' })),
      null
    );
  });
});
