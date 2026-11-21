import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateDepositsFromReserves,
  calculateExcessReserves,
  calculateRequiredReserves,
  calculateReserveRatio,
  calculateReservesFromDeposits,
  calculateSimpleMoneyMultiplier,
  calculateSimplifiedUnreservedFunds,
  toBaseUnits,
} from './calculation';
import { createExampleInput } from './types';
import { validateReserveRatioInput } from './validation';

describe('Reserve Ratio calculation', () => {
  it('basic: 100/1000 → 10% and unreserved 900', () => {
    assert.equal(calculateReserveRatio(100, 1000), 10);
    assert.equal(calculateSimplifiedUnreservedFunds(1000, 100), 900);
  });

  it('required reserves: 1000 × 10% = 100', () => {
    assert.equal(calculateRequiredReserves(1000, 10), 100);
  });

  it('excess reserves: 150 − 100 = 50', () => {
    assert.equal(calculateExcessReserves(150, 100), 50);
  });

  it('reserve shortfall: 80 − 100 = −20', () => {
    assert.equal(calculateExcessReserves(80, 100), -20);
  });

  it('calculate reserves: 2000 × 12% = 240', () => {
    assert.equal(calculateReservesFromDeposits(2000, 12), 240);
  });

  it('calculate deposits: 100 / 10% = 1000', () => {
    assert.equal(calculateDepositsFromReserves(100, 10), 1000);
  });

  it('money multiplier at 10% = 10', () => {
    assert.equal(calculateSimpleMoneyMultiplier(10), 10);
  });

  it('zero deposits returns null for ratio', () => {
    assert.equal(calculateReserveRatio(100, 0), null);
  });

  it('zero reserve ratio → multiplier undefined (null)', () => {
    assert.equal(calculateSimpleMoneyMultiplier(0), null);
  });

  it('reserves above deposits: 120% ratio, unreserved N/A', () => {
    assert.equal(calculateReserveRatio(1200, 1000), 120);
    assert.equal(calculateSimplifiedUnreservedFunds(1000, 1200), null);
  });

  it('mixed magnitudes: 1 billion / 100 million = 10%', () => {
    const d = toBaseUnits(1, 'billions');
    const r = toBaseUnits(100, 'millions');
    assert.equal(calculateReserveRatio(r, d), 10);
  });

  it('decimal inputs: 187.5 / 1250 = 15%', () => {
    assert.equal(calculateReserveRatio(187.5, 1250), 15);
  });

  it('example input validates to 10%', () => {
    const v = validateReserveRatioInput(createExampleInput('ratio'));
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result!.reserveRatioPercent, 10);
    assert.equal(v.result!.unreservedFundsBase, toBaseUnits(900, 'millions'));
    assert.equal(v.result!.moneyMultiplier, 10);
  });

  it('zero deposits fails validation', () => {
    const v = validateReserveRatioInput({
      ...createExampleInput('ratio'),
      deposits: '0',
    });
    assert.equal(v.isValid, false);
    assert.match(v.errors.deposits ?? '', /greater than zero/i);
  });

  it('excess mode shortfall labeled', () => {
    const v = validateReserveRatioInput(createExampleInput('excess'));
    // example is surplus 50; override for shortfall
    const short = validateReserveRatioInput({
      ...createExampleInput('excess'),
      reserves: '80',
      requiredReserves: '100',
    });
    assert.equal(short.isValid, true);
    assert.equal(short.result!.excessStatus, 'shortfall');
    assert.equal(short.result!.excessOrShortfallBase, toBaseUnits(-20, 'millions'));
    assert.equal(v.result!.excessStatus, 'surplus');
  });
});
