import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateAverageEquity,
  calculateROE,
  formatRoePercent,
  interpretROE,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateReturnOnEquityInput } from './validation';

describe('calculateROE', () => {
  it('35000 / 450000 → ≈ 7.777…%', () => {
    const r = calculateROE(35_000, 450_000)!;
    assert.ok(Math.abs(r.roePercentage - 35000 / 450000 * 100) < 1e-12);
    assert.equal(formatRoePercent(r.roePercentage), '7.78%');
  });

  it('120000 / 600000 → 20%', () => {
    assert.equal(calculateROE(120_000, 600_000)!.roePercentage, 20);
  });

  it('zero profit → 0%', () => {
    assert.equal(calculateROE(0, 250_000)!.roePercentage, 0);
  });

  it('negative profit → -10%', () => {
    assert.equal(calculateROE(-25_000, 250_000)!.roePercentage, -10);
  });

  it('above 100%', () => {
    assert.equal(calculateROE(150_000, 100_000)!.roePercentage, 150);
  });

  it('zero equity → null', () => {
    assert.equal(calculateROE(30_000, 0), null);
  });

  it('negative equity → -25% with flag', () => {
    const r = calculateROE(50_000, -200_000)!;
    assert.equal(r.roePercentage, -25);
    assert.equal(r.hasNegativeEquity, true);
  });
});

describe('calculateAverageEquity', () => {
  it('(400k + 500k) / 2 → 450k', () => {
    assert.equal(calculateAverageEquity(400_000, 500_000), 450_000);
  });

  it('average zero → null', () => {
    assert.equal(calculateAverageEquity(100, -100), null);
  });
});

describe('interpretROE', () => {
  it('bands', () => {
    assert.match(interpretROE(7.78, false), /Positive ROE/i);
    assert.match(interpretROE(0, false), /Zero ROE/i);
    assert.match(interpretROE(-10, false), /Negative ROE/i);
    assert.match(interpretROE(30, false), /relatively high/i);
    assert.match(interpretROE(-25, true), /negative/i);
  });
});

describe('validateReturnOnEquityInput', () => {
  it('defaults → ≈ 7.78%', () => {
    const v = validateReturnOnEquityInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result!.formattedRoe, '7.78%');
  });

  it('average equity path → 20%', () => {
    const v = validateReturnOnEquityInput({
      ...createDefaultInput(),
      netProfit: '90000',
      useAverageEquity: true,
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result!.roePercentage, 20);
    assert.equal(v.result!.usedAverageEquity, true);
  });

  it('empty → invalid', () => {
    assert.equal(validateReturnOnEquityInput(createEmptyInput()).isValid, false);
  });

  it('zero equity error', () => {
    const v = validateReturnOnEquityInput({
      ...createDefaultInput(),
      shareholdersEquity: '0',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.shareholdersEquity);
  });

  it('negative equity warning', () => {
    const v = validateReturnOnEquityInput({
      ...createDefaultInput(),
      netProfit: '50000',
      shareholdersEquity: '-200000',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result!.roePercentage, -25);
    assert.ok(v.result!.warningMessage);
  });
});
