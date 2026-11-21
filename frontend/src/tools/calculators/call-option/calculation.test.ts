import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateCallOption, roundMoney } from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateCallOptionInput } from './validation';

describe('calculateCallOption', () => {
  it('call · premium 5 · 1 contract → total 500', () => {
    const r = calculateCallOption({
      mode: 'call',
      assetPrice: 100,
      strikePrice: 100,
      optionPrice: 5,
      contracts: 1,
      currency: 'PKR',
    });
    assert.ok(r);
    assert.equal(r!.totalPremiumCost, 500);
    assert.equal(r!.breakEvenPrice, 105);
    assert.equal(r!.intrinsicPerShare, 0);
    assert.equal(r!.timeValuePerShare, 5);
    assert.equal(r!.profitLossAtAsset, -500);
    assert.equal(r!.moneyness, 'atm');
    assert.equal(r!.contractMultiplier, 100);
  });

  it('call ITM · S 110 · K 100 · premium 12 · 2 contracts', () => {
    const r = calculateCallOption({
      mode: 'call',
      assetPrice: 110,
      strikePrice: 100,
      optionPrice: 12,
      contracts: 2,
      currency: 'USD',
    });
    assert.ok(r);
    assert.equal(r!.totalPremiumCost, 2400);
    assert.equal(r!.breakEvenPrice, 112);
    assert.equal(r!.intrinsicPerShare, 10);
    assert.equal(r!.timeValuePerShare, 2);
    assert.equal(r!.profitLossAtAsset, -400);
    assert.equal(r!.moneyness, 'itm');
  });

  it('put · S 90 · K 100 · premium 8 · 1 contract', () => {
    const r = calculateCallOption({
      mode: 'put',
      assetPrice: 90,
      strikePrice: 100,
      optionPrice: 8,
      contracts: 1,
      currency: 'PKR',
    });
    assert.ok(r);
    assert.equal(r!.totalPremiumCost, 800);
    assert.equal(r!.breakEvenPrice, 92);
    assert.equal(r!.intrinsicPerShare, 10);
    assert.equal(r!.timeValuePerShare, -2);
    assert.equal(r!.profitLossAtAsset, 200);
    assert.equal(r!.moneyness, 'itm');
  });

  it('put OTM · S 105 · K 100 · premium 3', () => {
    const r = calculateCallOption({
      mode: 'put',
      assetPrice: 105,
      strikePrice: 100,
      optionPrice: 3,
      contracts: 1,
      currency: 'PKR',
    });
    assert.ok(r);
    assert.equal(r!.intrinsicPerShare, 0);
    assert.equal(r!.moneyness, 'otm');
    assert.equal(r!.breakEvenPrice, 97);
    assert.equal(r!.profitLossAtAsset, -300);
  });

  it('zero premium and zero contracts → zero total', () => {
    const r = calculateCallOption({
      mode: 'call',
      assetPrice: 50,
      strikePrice: 40,
      optionPrice: 0,
      contracts: 0,
      currency: 'PKR',
    });
    assert.ok(r);
    assert.equal(r!.totalPremiumCost, 0);
    assert.equal(r!.profitLossAtAsset, 0);
  });

  it('rejects fractional contracts', () => {
    const r = calculateCallOption({
      mode: 'call',
      assetPrice: 100,
      strikePrice: 100,
      optionPrice: 5,
      contracts: 1.5,
      currency: 'PKR',
    });
    assert.equal(r, null);
  });

  it('rejects negatives', () => {
    assert.equal(
      calculateCallOption({
        mode: 'call',
        assetPrice: -1,
        strikePrice: 100,
        optionPrice: 5,
        contracts: 1,
        currency: 'PKR',
      }),
      null
    );
  });

  it('roundMoney halves away from .xx5 bank quirks with 2dp', () => {
    assert.equal(roundMoney(10.005), 10.01);
    assert.equal(roundMoney(10.004), 10);
  });
});

describe('validateCallOptionInput', () => {
  it('default example validates', () => {
    const v = validateCallOptionInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result!.totalPremiumCost, 500);
  });

  it('empty input invalid', () => {
    const v = validateCallOptionInput(createEmptyInput());
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
  });

  it('fractional contracts rejected', () => {
    const v = validateCallOptionInput({
      ...createDefaultInput(),
      contracts: '1.2',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.contracts);
  });

  it('negative premium rejected', () => {
    const v = validateCallOptionInput({
      ...createDefaultInput(),
      optionPrice: '-1',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.optionPrice);
  });
});
