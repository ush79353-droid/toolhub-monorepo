import assert from 'node:assert/strict';
import {
  GRAMS_PER,
  calculateBidAskFromSpread,
  calculateGoldMeltPlan,
  calculateGoldMeltValue,
  calculateGoldPurityFromKarat,
  convertPriceToPerGram,
  convertWeightToGrams,
  meltValueTenKaratOneGramAt2000PerOzt,
} from './calculation';

// Test 1 — 24K karat ratio
assert.ok(Math.abs(calculateGoldPurityFromKarat(24) - 100) < 1e-9);

// Test 2 — 18K
assert.equal(calculateGoldPurityFromKarat(18), 75);

// Test 3 — 14K
assert.ok(Math.abs(calculateGoldPurityFromKarat(14) - (14 / 24) * 100) < 1e-9);
assert.ok(Math.abs(calculateGoldPurityFromKarat(14) - 58.333333) < 0.001);

// Test 4 — troy ounce → grams
assert.equal(convertWeightToGrams(1, 'ozt'), 31.1034768);

// Test 5 — market price conversion
{
  const perGram = convertPriceToPerGram(2000, 'per-troy-ounce');
  assert.ok(Math.abs(perGram - 2000 / 31.1034768) < 1e-9);
}

// Test 6 — basic melt value
assert.equal(calculateGoldMeltValue(7.5, 100), 750);

// Test 7 — trade spread on spot value via prices
{
  const { bid, ask } = calculateBidAskFromSpread(1000, 5);
  assert.equal(bid, 950);
  assert.equal(ask, 1050);
}

// Test 8 — custom purity via plan
{
  const result = calculateGoldMeltPlan({
    karat: 'custom',
    purityPercent: 80,
    weight: 10,
    weightUnit: 'g',
    marketPrice: 100,
    marketPriceUnit: 'per-gram',
    spreadPercent: 5,
    currency: 'USD',
    bidPriceOverride: null,
    askPriceOverride: null,
  });
  assert.ok(result);
  assert.equal(result!.meltValue, 800);
  assert.ok(Math.abs(result!.bidValue - 760) < 1e-9);
  assert.ok(Math.abs(result!.askValue - 840) < 1e-9);
}

// Test 9 — all weight units convert
{
  assert.equal(convertWeightToGrams(1, 'g'), 1);
  assert.equal(convertWeightToGrams(1, 'kg'), 1000);
  assert.equal(convertWeightToGrams(1, 'ozt'), GRAMS_PER.ozt);
  assert.equal(convertWeightToGrams(1, 'oz'), GRAMS_PER.oz);
  assert.equal(convertWeightToGrams(1, 'dwt'), GRAMS_PER.dwt);
  assert.equal(convertWeightToGrams(1, 'gr'), GRAMS_PER.gr);
}

// Test 10 — price units
{
  assert.equal(convertPriceToPerGram(50, 'per-gram'), 50);
  assert.ok(
    Math.abs(convertPriceToPerGram(31_103.4768, 'per-kilogram') - 31.1034768) <
      1e-6,
  );
}

// Test 11 — manual bid/ask overrides
{
  const result = calculateGoldMeltPlan({
    karat: '18',
    purityPercent: 75,
    weight: 10,
    weightUnit: 'g',
    marketPrice: 100,
    marketPriceUnit: 'per-gram',
    spreadPercent: 5,
    currency: 'USD',
    bidPriceOverride: 90,
    askPriceOverride: 110,
  });
  assert.ok(result);
  assert.equal(result!.bidPricePerUnit, 90);
  assert.equal(result!.askPricePerUnit, 110);
  assert.equal(result!.bidValue, 675); // 7.5 * 90
  assert.equal(result!.askValue, 825); // 7.5 * 110
}

// Test 12 — worked 18K example with ozt price
{
  const result = calculateGoldMeltPlan({
    karat: '18',
    purityPercent: 75,
    weight: 10,
    weightUnit: 'g',
    marketPrice: 2000,
    marketPriceUnit: 'per-troy-ounce',
    spreadPercent: 5,
    currency: 'USD',
    bidPriceOverride: null,
    askPriceOverride: null,
  });
  assert.ok(result);
  const expected =
    10 * 0.75 * convertPriceToPerGram(2000, 'per-troy-ounce');
  assert.ok(Math.abs(result!.meltValue - expected) < 0.01);
}

// Test 13 — FAQ 10K 1g at $2000/ozt
{
  const v = meltValueTenKaratOneGramAt2000PerOzt();
  const expected = (10 / 24) * (2000 / GRAMS_PER.ozt);
  assert.ok(Math.abs(v - expected) < 1e-9);
}

console.log('gold-melt/calculation.test.ts: all assertions passed');
