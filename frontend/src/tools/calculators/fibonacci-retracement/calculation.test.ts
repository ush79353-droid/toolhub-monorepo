import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateFibonacci, formatFibPrice } from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateFibonacciInput } from './validation';

function nearly(actual: number | null | undefined, expected: number, eps = 1e-9) {
  assert.ok(actual != null, `expected ~${expected}, got ${actual}`);
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

function level(
  result: NonNullable<ReturnType<typeof calculateFibonacci>>,
  ratio: number
): number {
  const found = result.levels.find((l) => Math.abs(l.ratio - ratio) < 1e-12);
  assert.ok(found, `missing ratio ${ratio}`);
  return found!.price;
}

describe('calculateFibonacci', () => {
  it('uptrend retracement 61.8% → 138.2', () => {
    const r = calculateFibonacci({
      lowPrice: 100,
      highPrice: 200,
      trend: 'uptrend',
      levelType: 'retracement',
    })!;
    nearly(r.priceDifference, 100);
    nearly(level(r, 0), 200);
    nearly(level(r, 0.236), 176.4);
    nearly(level(r, 0.382), 161.8);
    nearly(level(r, 0.5), 150);
    nearly(level(r, 0.618), 138.2);
    nearly(level(r, 0.764), 123.6);
    nearly(level(r, 0.786), 121.4);
    nearly(level(r, 1), 100);
  });

  it('downtrend retracement 61.8% → 161.8', () => {
    const r = calculateFibonacci({
      lowPrice: 100,
      highPrice: 200,
      trend: 'downtrend',
      levelType: 'retracement',
    })!;
    nearly(level(r, 0), 100);
    nearly(level(r, 0.618), 161.8);
    nearly(level(r, 1), 200);
  });

  it('uptrend extension 161.8% → 261.8', () => {
    const r = calculateFibonacci({
      lowPrice: 100,
      highPrice: 200,
      trend: 'uptrend',
      levelType: 'extension',
    })!;
    nearly(level(r, 0), 100);
    nearly(level(r, 1), 200);
    nearly(level(r, 1.618), 261.8);
    nearly(level(r, 2.618), 361.8);
  });

  it('downtrend extension 161.8% → 38.2', () => {
    const r = calculateFibonacci({
      lowPrice: 100,
      highPrice: 200,
      trend: 'downtrend',
      levelType: 'extension',
    })!;
    nearly(level(r, 0), 200);
    nearly(level(r, 1), 100);
    nearly(level(r, 1.618), 38.2);
    nearly(level(r, 2.618), -61.8);
  });

  it('rejects equal/inverted/negative prices', () => {
    assert.equal(
      calculateFibonacci({
        lowPrice: 100,
        highPrice: 100,
        trend: 'uptrend',
        levelType: 'retracement',
      }),
      null
    );
    assert.equal(
      calculateFibonacci({
        lowPrice: 200,
        highPrice: 100,
        trend: 'uptrend',
        levelType: 'retracement',
      }),
      null
    );
    assert.equal(
      calculateFibonacci({
        lowPrice: -1,
        highPrice: 100,
        trend: 'uptrend',
        levelType: 'retracement',
      }),
      null
    );
  });
});

describe('validateFibonacciInput', () => {
  it('defaults → uptrend 61.8% = 138.2', () => {
    const v = validateFibonacciInput(createDefaultInput());
    assert.equal(v.isValid, true);
    const lvl = v.result!.levels.find((l) => l.ratio === 0.618)!;
    nearly(lvl.price, 138.2);
  });

  it('empty → invalid', () => {
    assert.equal(validateFibonacciInput(createEmptyInput()).isValid, false);
  });

  it('equal prices error', () => {
    const input = createDefaultInput();
    input.highPrice = '100';
    assert.equal(validateFibonacciInput(input).isValid, false);
  });

  it('formats prices', () => {
    assert.equal(formatFibPrice(138.2), '138.2');
  });
});
