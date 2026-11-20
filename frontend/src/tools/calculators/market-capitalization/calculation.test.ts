import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateMarketCapitalization,
  formatCompactMarketCap,
  formatMarketCapMoney,
  formatShareCount,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateMarketCapitalizationInput } from './validation';

function nearly(actual: number | null | undefined, expected: number, eps = 1e-6) {
  assert.ok(actual != null, `expected ~${expected}, got ${actual}`);
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateMarketCapitalization', () => {
  it('100 × 10M → 1B', () => {
    const r = calculateMarketCapitalization({
      sharePrice: 100,
      outstandingShares: 10_000_000,
    })!;
    nearly(r.marketCapitalization, 1_000_000_000);
  });

  it('25.50 × 50M → 1.275B', () => {
    const r = calculateMarketCapitalization({
      sharePrice: 25.5,
      outstandingShares: 50_000_000,
    })!;
    nearly(r.marketCapitalization, 1_275_000_000);
  });

  it('15 × 2M → 30M', () => {
    const r = calculateMarketCapitalization({
      sharePrice: 15,
      outstandingShares: 2_000_000,
    })!;
    nearly(r.marketCapitalization, 30_000_000);
  });

  it('250 × 5B → 1.25T', () => {
    const r = calculateMarketCapitalization({
      sharePrice: 250,
      outstandingShares: 5_000_000_000,
    })!;
    nearly(r.marketCapitalization, 1_250_000_000_000);
  });

  it('zero price → 0', () => {
    const r = calculateMarketCapitalization({
      sharePrice: 0,
      outstandingShares: 1_000_000,
    })!;
    nearly(r.marketCapitalization, 0);
  });

  it('negative price → null', () => {
    assert.equal(
      calculateMarketCapitalization({
        sharePrice: -1,
        outstandingShares: 1_000_000,
      }),
      null
    );
  });

  it('negative/zero/fractional shares → null', () => {
    assert.equal(
      calculateMarketCapitalization({
        sharePrice: 10,
        outstandingShares: -1,
      }),
      null
    );
    assert.equal(
      calculateMarketCapitalization({
        sharePrice: 10,
        outstandingShares: 0,
      }),
      null
    );
    assert.equal(
      calculateMarketCapitalization({
        sharePrice: 10,
        outstandingShares: 1.5,
      }),
      null
    );
  });
});

describe('formatting', () => {
  it('formats money and shares', () => {
    assert.equal(formatMarketCapMoney(1_000_000_000, 'USD'), '1,000,000,000.00');
    assert.equal(formatShareCount(10_000_000), '10,000,000');
  });

  it('compact notation for billions', () => {
    const c = formatCompactMarketCap(1_000_000_000, 'USD');
    assert.match(c, /1\s?B/i);
  });
});

describe('validateMarketCapitalizationInput', () => {
  it('defaults → $1B', () => {
    const v = validateMarketCapitalizationInput(createDefaultInput());
    assert.equal(v.isValid, true);
    nearly(v.result!.marketCapitalization, 1_000_000_000);
    assert.match(v.result!.compactMarketCap, /1\s?B/i);
  });

  it('empty → invalid', () => {
    const v = validateMarketCapitalizationInput(createEmptyInput());
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
  });

  it('comma-separated shares', () => {
    const v = validateMarketCapitalizationInput({
      sharePrice: '100',
      outstandingShares: '10,000,000',
      currency: 'PKR',
    });
    assert.equal(v.isValid, true);
    nearly(v.result!.marketCapitalization, 1_000_000_000);
  });

  it('fractional shares → error', () => {
    const v = validateMarketCapitalizationInput({
      sharePrice: '100',
      outstandingShares: '1000.5',
      currency: 'PKR',
    });
    assert.equal(v.isValid, false);
    assert.match(v.errors.outstandingShares ?? '', /whole number/i);
  });
});
