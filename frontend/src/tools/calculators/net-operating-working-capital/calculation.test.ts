import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateCurrentOperatingAssets,
  calculateCurrentOperatingLiabilities,
  calculateNetOperatingWorkingCapital,
} from './calculation';
import { validateNetOperatingWorkingCapitalInput } from './validation';
import { createDefaultInput } from './types';

const TOL = 1e-9;

describe('NOWC formulas', () => {
  it('Company Alpha: COA 21k, COL 20k, NOWC 1k', () => {
    const coa = calculateCurrentOperatingAssets(1000, 15000, 5000);
    const col = calculateCurrentOperatingLiabilities(18000, 2000);
    const nowc = calculateNetOperatingWorkingCapital(coa!, col!);
    assert.equal(coa, 21000);
    assert.equal(col, 20000);
    assert.equal(nowc, 1000);
  });

  it('positive / zero / negative', () => {
    assert.equal(
      calculateNetOperatingWorkingCapital(60000, 20000),
      40000
    );
    assert.equal(calculateNetOperatingWorkingCapital(30000, 30000), 0);
    assert.equal(
      calculateNetOperatingWorkingCapital(10000, 20000),
      -10000
    );
  });

  it('all zeros', () => {
    assert.equal(calculateCurrentOperatingAssets(0, 0, 0), 0);
    assert.equal(calculateCurrentOperatingLiabilities(0, 0), 0);
    assert.equal(calculateNetOperatingWorkingCapital(0, 0), 0);
  });

  it('decimal amounts', () => {
    const coa = calculateCurrentOperatingAssets(1000.25, 2000.5, 3000.75);
    const col = calculateCurrentOperatingLiabilities(1500.25, 500.5);
    const nowc = calculateNetOperatingWorkingCapital(coa!, col!);
    assert.ok(Math.abs(coa! - 6001.5) < TOL);
    assert.ok(Math.abs(col! - 2000.75) < TOL);
    assert.ok(Math.abs(nowc! - 4000.75) < TOL);
  });

  it('large values', () => {
    assert.equal(
      calculateNetOperatingWorkingCapital(26000000, 11000000),
      15000000
    );
  });

  it('negative component → null', () => {
    assert.equal(calculateCurrentOperatingAssets(-1, 0, 0), null);
    assert.equal(calculateCurrentOperatingLiabilities(-1, 0), null);
  });
});

describe('validateNetOperatingWorkingCapitalInput', () => {
  it('Company Alpha end-to-end', () => {
    const v = validateNetOperatingWorkingCapitalInput({
      ...createDefaultInput(),
      cash: '1000',
      accountsReceivable: '15000',
      inventories: '5000',
      accountsPayable: '18000',
      accruedExpenses: '2000',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result?.currentOperatingAssets, 21000);
    assert.equal(v.result?.currentOperatingLiabilities, 20000);
    assert.equal(v.result?.netOperatingWorkingCapital, 1000);
  });

  it('negative NOWC status', () => {
    const v = validateNetOperatingWorkingCapitalInput({
      ...createDefaultInput(),
      cash: '2000',
      accountsReceivable: '5000',
      inventories: '3000',
      accountsPayable: '15000',
      accruedExpenses: '5000',
    });
    assert.equal(v.result?.netOperatingWorkingCapital, -10000);
    assert.equal(v.result?.status, 'negativeNowc');
  });

  it('negative cash → error', () => {
    const v = validateNetOperatingWorkingCapitalInput({
      ...createDefaultInput(),
      cash: '-1',
      accountsReceivable: '0',
      inventories: '0',
      accountsPayable: '0',
      accruedExpenses: '0',
    });
    assert.ok(v.errors.cash);
    assert.equal(v.result, null);
  });

  it('missing inputs → no result', () => {
    assert.equal(
      validateNetOperatingWorkingCapitalInput(createDefaultInput()).result,
      null
    );
  });
});
