import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculatePriceToBook,
  formatRatio,
  interpretPbRatio,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validatePriceToBookInput } from './validation';

describe('calculatePriceToBook', () => {
  it('standard example → P/B 2.00', () => {
    const r = calculatePriceToBook({
      totalStockholderEquity: 500_000,
      preferredEquity: 50_000,
      commonSharesOutstanding: 10_000,
      sharePrice: 90,
      goodwill: 0,
      otherIntangibleAssets: 0,
      includeTangible: false,
    });
    assert.ok(r);
    assert.equal(r!.commonBookEquity, 450_000);
    assert.equal(r!.bookValuePerShare, 45);
    assert.equal(r!.priceToBookRatio, 2);
  });

  it('no preferred equity', () => {
    const r = calculatePriceToBook({
      totalStockholderEquity: 300_000,
      preferredEquity: 0,
      commonSharesOutstanding: 10_000,
      sharePrice: 60,
      goodwill: 0,
      otherIntangibleAssets: 0,
      includeTangible: false,
    });
    assert.ok(r);
    assert.equal(r!.bookValuePerShare, 30);
    assert.equal(r!.priceToBookRatio, 2);
  });

  it('P/B below 1', () => {
    const r = calculatePriceToBook({
      totalStockholderEquity: 1_000_000,
      preferredEquity: 0,
      commonSharesOutstanding: 10_000,
      sharePrice: 80,
      goodwill: 0,
      otherIntangibleAssets: 0,
      includeTangible: false,
    });
    assert.ok(r);
    assert.equal(r!.bookValuePerShare, 100);
    assert.equal(r!.priceToBookRatio, 0.8);
  });

  it('tangible book', () => {
    const r = calculatePriceToBook({
      totalStockholderEquity: 500_000,
      preferredEquity: 50_000,
      commonSharesOutstanding: 10_000,
      sharePrice: 90,
      goodwill: 60_000,
      otherIntangibleAssets: 40_000,
      includeTangible: true,
    });
    assert.ok(r);
    assert.equal(r!.tangibleCommonEquity, 350_000);
    assert.equal(r!.tangibleBookValuePerShare, 35);
    assert.ok(
      Math.abs(r!.priceToTangibleBookRatio! - 90 / 35) < 1e-12
    );
  });

  it('zero shares → null', () => {
    assert.equal(
      calculatePriceToBook({
        totalStockholderEquity: 100,
        preferredEquity: 0,
        commonSharesOutstanding: 0,
        sharePrice: 10,
        goodwill: 0,
        otherIntangibleAssets: 0,
        includeTangible: false,
      }),
      null
    );
  });

  it('negative book equity → BVPS negative, P/B null', () => {
    const r = calculatePriceToBook({
      totalStockholderEquity: -100_000,
      preferredEquity: 0,
      commonSharesOutstanding: 10_000,
      sharePrice: 5,
      goodwill: 0,
      otherIntangibleAssets: 0,
      includeTangible: false,
    });
    assert.ok(r);
    assert.equal(r!.bookValuePerShare, -10);
    assert.equal(r!.priceToBookRatio, null);
  });

  it('zero BVPS → P/B null', () => {
    const r = calculatePriceToBook({
      totalStockholderEquity: 50_000,
      preferredEquity: 50_000,
      commonSharesOutstanding: 10_000,
      sharePrice: 10,
      goodwill: 0,
      otherIntangibleAssets: 0,
      includeTangible: false,
    });
    assert.ok(r);
    assert.equal(r!.bookValuePerShare, 0);
    assert.equal(r!.priceToBookRatio, null);
  });
});

describe('interpretPbRatio', () => {
  it('bands', () => {
    assert.match(interpretPbRatio(0.8), /below/i);
    assert.match(interpretPbRatio(1), /approximately equal/i);
    assert.match(interpretPbRatio(2), /times reported book/i);
  });
});

describe('formatting', () => {
  it('formats ratio', () => {
    assert.equal(formatRatio(2), '2.00');
  });
});

describe('validatePriceToBookInput', () => {
  it('defaults → 2.00×', () => {
    const v = validatePriceToBookInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result!.priceToBookRatio, 2);
    assert.equal(v.result!.bookValuePerShare, 45);
  });

  it('defaults with tangible open', () => {
    const v = validatePriceToBookInput({
      ...createDefaultInput(),
      showTangible: true,
    });
    assert.ok(v.result);
    assert.equal(v.result!.tangibleBookValuePerShare, 35);
  });

  it('empty → invalid', () => {
    const v = validatePriceToBookInput(createEmptyInput());
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
  });
});
