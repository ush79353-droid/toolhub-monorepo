import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateRSI,
  formatRsi,
  interpretRsi,
  rsiFromAverages,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
} from './types';
import { validateRelativeStrengthIndexInput } from './validation';

describe('rsiFromAverages', () => {
  it('1.6 / 0.4 → RS 4 · RSI 80', () => {
    const r = rsiFromAverages(1.6, 0.4);
    assert.equal(r.relativeStrength, 4);
    assert.equal(r.rsi, 80);
  });

  it('no losses → 100', () => {
    assert.equal(rsiFromAverages(1, 0).rsi, 100);
  });

  it('no gains → 0', () => {
    assert.equal(rsiFromAverages(0, 1).rsi, 0);
  });

  it('flat → 50', () => {
    assert.equal(rsiFromAverages(0, 0).rsi, 50);
  });
});

describe('calculateRSI', () => {
  it('worked example period 5 → 80', () => {
    const r = calculateRSI({
      closingPrices: [100, 102, 101, 104, 103, 106],
      period: 5,
      method: 'wilder',
    });
    assert.equal(r.status, 'valid');
    assert.equal(r.rsi, 80);
    assert.equal(r.averageGain, 1.6);
    assert.equal(r.averageLoss, 0.4);
    assert.equal(r.relativeStrength, 4);
  });

  it('simple and wilder match on initial window', () => {
    const prices = [100, 102, 101, 104, 103, 106];
    const w = calculateRSI({
      closingPrices: prices,
      period: 5,
      method: 'wilder',
    });
    const s = calculateRSI({
      closingPrices: prices,
      period: 5,
      method: 'simple',
    });
    assert.equal(w.rsi, s.rsi);
  });

  it('all gains → 100', () => {
    const r = calculateRSI({
      closingPrices: [100, 101, 102, 103, 104, 105],
      period: 5,
      method: 'wilder',
    });
    assert.equal(r.rsi, 100);
  });

  it('all losses → 0', () => {
    const r = calculateRSI({
      closingPrices: [105, 104, 103, 102, 101, 100],
      period: 5,
      method: 'wilder',
    });
    assert.equal(r.rsi, 0);
  });

  it('flat prices → 50', () => {
    const r = calculateRSI({
      closingPrices: [100, 100, 100, 100, 100, 100],
      period: 5,
      method: 'wilder',
    });
    assert.equal(r.rsi, 50);
  });

  it('insufficient data', () => {
    const r = calculateRSI({
      closingPrices: [1, 2, 3, 4, 5],
      period: 14,
      method: 'wilder',
    });
    assert.equal(r.status, 'insufficient-data');
  });

  it('minimum 15 prices for period 14', () => {
    const prices = Array.from({ length: 15 }, (_, i) => 100 + (i % 3) - 1);
    const r = calculateRSI({
      closingPrices: prices,
      period: 14,
      method: 'wilder',
    });
    assert.equal(r.status, 'valid');
    assert.ok(r.rsi != null && r.rsi >= 0 && r.rsi <= 100);
  });

  it('Wilder smoothing continues after initial window', () => {
    const prices = [100, 102, 101, 104, 103, 106, 105, 108];
    const r = calculateRSI({
      closingPrices: prices,
      period: 5,
      method: 'wilder',
    });
    assert.equal(r.status, 'valid');
    assert.equal(r.series.length, 3); // RSI at indices 5,6,7
    // First point matches simple average
    assert.equal(r.series[0]!.rsi, 80);
    // Second: G=0 L=1 → avgG=(1.6*4+0)/5=1.28 · avgL=(0.4*4+1)/5=0.52
    assert.ok(Math.abs(r.series[1]!.averageGain - 1.28) < 1e-12);
    assert.ok(Math.abs(r.series[1]!.averageLoss - 0.52) < 1e-12);
    const rs = 1.28 / 0.52;
    const expected = 100 - 100 / (1 + rs);
    assert.ok(Math.abs(r.series[1]!.rsi - expected) < 1e-10);
  });

  it('simple-average rolling window', () => {
    const prices = [100, 102, 101, 104, 103, 106, 105];
    const r = calculateRSI({
      closingPrices: prices,
      period: 5,
      method: 'simple',
    });
    assert.equal(r.series.length, 2);
    assert.equal(r.series[0]!.rsi, 80);
    // Window changes indices 1..5: +2,-1,+3,-1,+3 then drop +2 add -1
    // gains: 0,3,0,3,0 sum=6 avg=1.2 · losses: 1,0,1,0,1 sum=3 avg=0.6 · RS=2 · RSI=100-100/3≈66.666
    const expected = 100 - 100 / (1 + 1.2 / 0.6);
    assert.ok(Math.abs(r.series[1]!.rsi - expected) < 1e-10);
  });

  it('invalid period', () => {
    const r = calculateRSI({
      closingPrices: [1, 2, 3],
      period: 0,
      method: 'wilder',
    });
    assert.equal(r.status, 'invalid');
  });

  it('negative price invalid', () => {
    const r = calculateRSI({
      closingPrices: [100, -1, 102],
      period: 2,
      method: 'wilder',
    });
    assert.equal(r.status, 'invalid');
  });
});

describe('interpretRsi', () => {
  it('bands', () => {
    assert.match(interpretRsi(24.8), /oversold/i);
    assert.match(interpretRsi(50), /neutral/i);
    assert.match(interpretRsi(78.35), /overbought/i);
  });
});

describe('formatting', () => {
  it('formats RSI', () => {
    assert.equal(formatRsi(80), '80.00');
  });
});

describe('validateRelativeStrengthIndexInput', () => {
  it('example → 80', () => {
    const v = validateRelativeStrengthIndexInput(createExampleInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result!.rsi, 80);
  });

  it('default blanks → missing', () => {
    const v = validateRelativeStrengthIndexInput(createDefaultInput());
    assert.equal(v.isValid, false);
  });

  it('empty → invalid', () => {
    const v = validateRelativeStrengthIndexInput(createEmptyInput());
    assert.equal(v.isValid, false);
  });

  it('insufficient with partial prices', () => {
    const v = validateRelativeStrengthIndexInput({
      ...createDefaultInput(),
      prices: ['100', '101', '102', '103', '104'].map((p) => ({
        id: p,
        price: p,
      })),
      period: '14',
    });
    assert.equal(v.result?.status, 'insufficient-data');
  });
});
