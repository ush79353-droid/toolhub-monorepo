import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateAverageAccountsReceivable,
  calculateReceivablesTurnoverRatio,
} from './calculation';
import { validateReceivablesTurnoverInput } from './validation';
import { createDefaultInput } from './types';

const TOL = 1e-9;

describe('receivables turnover formulas', () => {
  it('Company Alpha: avg 25k, turnover 4.8', () => {
    const avg = calculateAverageAccountsReceivable(20000, 30000);
    assert.equal(avg, 25000);
    assert.equal(calculateReceivablesTurnoverRatio(120000, avg!), 4.8);
  });

  it('high / low / equal balances', () => {
    assert.equal(calculateReceivablesTurnoverRatio(500000, 25000), 20);
    assert.equal(calculateReceivablesTurnoverRatio(100000, 50000), 2);
    assert.equal(
      calculateReceivablesTurnoverRatio(
        250000,
        calculateAverageAccountsReceivable(25000, 25000)!
      ),
      10
    );
  });

  it('zero opening or closing AR', () => {
    assert.equal(calculateAverageAccountsReceivable(0, 20000), 10000);
    assert.equal(calculateAverageAccountsReceivable(20000, 0), 10000);
    assert.equal(calculateReceivablesTurnoverRatio(60000, 10000), 6);
    assert.equal(calculateReceivablesTurnoverRatio(80000, 10000), 8);
  });

  it('zero average → undefined; zero sales → 0', () => {
    assert.equal(calculateAverageAccountsReceivable(0, 0), 0);
    assert.equal(calculateReceivablesTurnoverRatio(100000, 0), null);
    assert.equal(calculateReceivablesTurnoverRatio(0, 15000), 0);
    assert.equal(calculateReceivablesTurnoverRatio(0, 0), null);
  });

  it('decimal average', () => {
    const avg = calculateAverageAccountsReceivable(24500.25, 30500.75);
    assert.ok(Math.abs(avg! - 27500.5) < TOL);
    const rtr = calculateReceivablesTurnoverRatio(125500.75, avg!);
    assert.ok(Math.abs(rtr! - 125500.75 / 27500.5) < TOL);
  });

  it('large values', () => {
    assert.equal(
      calculateReceivablesTurnoverRatio(1_000_000_000, 125_000_000),
      8
    );
  });

  it('negatives → null', () => {
    assert.equal(calculateAverageAccountsReceivable(-1, 0), null);
    assert.equal(calculateReceivablesTurnoverRatio(-1, 100), null);
  });

  it('invariant: RTR × Avg ≈ Sales', () => {
    const sales = 120000;
    const avg = 25000;
    const rtr = calculateReceivablesTurnoverRatio(sales, avg)!;
    assert.ok(Math.abs(rtr * avg - sales) < TOL);
  });
});

describe('validateReceivablesTurnoverInput', () => {
  it('Company Alpha end-to-end', () => {
    const v = validateReceivablesTurnoverInput({
      ...createDefaultInput(),
      netCreditSales: '120000',
      openingAccountsReceivable: '20000',
      closingAccountsReceivable: '30000',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result?.averageAccountsReceivable, 25000);
    assert.equal(v.result?.receivablesTurnoverRatio, 4.8);
  });

  it('missing sales → average still works', () => {
    const v = validateReceivablesTurnoverInput({
      ...createDefaultInput(),
      openingAccountsReceivable: '20000',
      closingAccountsReceivable: '30000',
    });
    assert.equal(v.result?.averageAccountsReceivable, 25000);
    assert.equal(v.result?.receivablesTurnoverRatio, null);
    assert.equal(v.result?.status, 'partial');
  });

  it('both AR zero → undefined turnover', () => {
    const v = validateReceivablesTurnoverInput({
      ...createDefaultInput(),
      netCreditSales: '100000',
      openingAccountsReceivable: '0',
      closingAccountsReceivable: '0',
    });
    assert.equal(v.result?.averageAccountsReceivable, 0);
    assert.equal(v.result?.receivablesTurnoverRatio, null);
    assert.equal(v.result?.status, 'undefinedTurnover');
  });

  it('zero sales with positive AR → 0 turnover', () => {
    const v = validateReceivablesTurnoverInput({
      ...createDefaultInput(),
      netCreditSales: '0',
      openingAccountsReceivable: '10000',
      closingAccountsReceivable: '20000',
    });
    assert.equal(v.result?.receivablesTurnoverRatio, 0);
    assert.equal(v.result?.status, 'zeroTurnover');
  });

  it('negative opening → error', () => {
    const v = validateReceivablesTurnoverInput({
      ...createDefaultInput(),
      netCreditSales: '100000',
      openingAccountsReceivable: '-5000',
      closingAccountsReceivable: '10000',
    });
    assert.ok(v.errors.openingAccountsReceivable);
    assert.equal(v.result, null);
  });

  it('all empty → no result', () => {
    assert.equal(
      validateReceivablesTurnoverInput(createDefaultInput()).result,
      null
    );
  });
});
