import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateNav,
  formatNavMoney,
  roundMoneyAmount,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateNavInput } from './validation';

describe('calculateNav', () => {
  it('full reference example', () => {
    const r = calculateNav({
      totalInvestmentValue: 1_500_000,
      cashAndCashEquivalents: 250_000,
      accountsReceivable: 50_000,
      shortTermLiabilities: 50_000,
      longTermLiabilities: 20_000,
      outstandingShares: 100_000,
    });
    assert.ok(r);
    assert.equal(r!.fundAssets, 1_800_000);
    assert.equal(r!.fundLiabilities, 70_000);
    assert.equal(r!.netAssetValue, 1_730_000);
    assert.equal(r!.navPerShare, 17.3);
  });

  it('zero liabilities → NAV equals assets', () => {
    const r = calculateNav({
      totalInvestmentValue: 100_000,
      cashAndCashEquivalents: 0,
      accountsReceivable: 0,
      shortTermLiabilities: 0,
      longTermLiabilities: 0,
      outstandingShares: null,
    });
    assert.ok(r);
    assert.equal(r!.netAssetValue, 100_000);
    assert.equal(r!.navPerShare, null);
  });

  it('zero assets and liabilities → NAV 0', () => {
    const r = calculateNav({
      totalInvestmentValue: 0,
      cashAndCashEquivalents: 0,
      accountsReceivable: 0,
      shortTermLiabilities: 0,
      longTermLiabilities: 0,
      outstandingShares: 10,
    });
    assert.ok(r);
    assert.equal(r!.netAssetValue, 0);
    assert.equal(r!.navPerShare, 0);
  });

  it('negative NAV when liabilities exceed assets', () => {
    const r = calculateNav({
      totalInvestmentValue: 100_000,
      cashAndCashEquivalents: 0,
      accountsReceivable: 0,
      shortTermLiabilities: 150_000,
      longTermLiabilities: 0,
      outstandingShares: 10_000,
    });
    assert.ok(r);
    assert.equal(r!.netAssetValue, -50_000);
    assert.equal(r!.navPerShare, -5);
  });

  it('null shares → NAV without per-share', () => {
    const r = calculateNav({
      totalInvestmentValue: 1_500_000,
      cashAndCashEquivalents: 250_000,
      accountsReceivable: 50_000,
      shortTermLiabilities: 50_000,
      longTermLiabilities: 20_000,
      outstandingShares: null,
    });
    assert.ok(r);
    assert.equal(r!.netAssetValue, 1_730_000);
    assert.equal(r!.navPerShare, null);
  });

  it('zero shares → NAV kept, per-share null', () => {
    const r = calculateNav({
      totalInvestmentValue: 100,
      cashAndCashEquivalents: 0,
      accountsReceivable: 0,
      shortTermLiabilities: 0,
      longTermLiabilities: 0,
      outstandingShares: 0,
    });
    assert.ok(r);
    assert.equal(r!.netAssetValue, 100);
    assert.equal(r!.navPerShare, null);
  });

  it('negative asset → null', () => {
    assert.equal(
      calculateNav({
        totalInvestmentValue: -1,
        cashAndCashEquivalents: 0,
        accountsReceivable: 0,
        shortTermLiabilities: 0,
        longTermLiabilities: 0,
        outstandingShares: null,
      }),
      null
    );
  });

  it('decimal amounts', () => {
    const r = calculateNav({
      totalInvestmentValue: 100.5,
      cashAndCashEquivalents: 10.25,
      accountsReceivable: 5.25,
      shortTermLiabilities: 1.5,
      longTermLiabilities: 0.5,
      outstandingShares: 10,
    });
    assert.ok(r);
    assert.equal(r!.fundAssets, 116);
    assert.equal(r!.fundLiabilities, 2);
    assert.equal(r!.netAssetValue, 114);
    assert.equal(r!.navPerShare, 11.4);
  });
});

describe('formatting', () => {
  it('formats money', () => {
    assert.equal(formatNavMoney(1_730_000, 'PKR'), '1,730,000.00');
    assert.equal(formatNavMoney(17.3, 'PKR'), '17.30');
  });
});

describe('validateNavInput', () => {
  it('defaults → full example', () => {
    const v = validateNavInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result!.fundAssets, 1_800_000);
    assert.equal(v.result!.fundLiabilities, 70_000);
    assert.equal(v.result!.netAssetValue, 1_730_000);
    assert.equal(v.result!.navPerShare, 17.3);
  });

  it('empty → invalid', () => {
    const v = validateNavInput(createEmptyInput());
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
  });

  it('blank shares → NAV without per-share', () => {
    const v = validateNavInput({
      ...createDefaultInput(),
      outstandingShares: '',
    });
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result!.netAssetValue, 1_730_000);
    assert.equal(v.result!.navPerShare, null);
  });

  it('zero shares → NAV kept with shares error', () => {
    const v = validateNavInput({
      ...createDefaultInput(),
      outstandingShares: '0',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.outstandingShares);
    assert.ok(v.result);
    assert.equal(v.result!.netAssetValue, 1_730_000);
    assert.equal(v.result!.navPerShare, null);
  });

  it('negative liability error', () => {
    const v = validateNavInput({
      ...createDefaultInput(),
      shortTermLiabilities: '-10',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.shortTermLiabilities);
    assert.equal(v.result, null);
  });

  it('rounds NAV per share', () => {
    assert.equal(roundMoneyAmount(17.3, 'PKR'), 17.3);
  });
});
