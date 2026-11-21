import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateDebtToEquity,
  calculateEffectiveTaxRate,
  calculateLeveredBeta,
  calculateUnleveredBeta,
  formatUbBeta,
  interpretUnleveredBeta,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateUnleveredBetaInput } from './validation';

describe('calculateEffectiveTaxRate', () => {
  it('(100k − 80k) / 100k → 0.20', () => {
    assert.equal(calculateEffectiveTaxRate(80_000, 100_000), 0.2);
  });

  it('zero pre-tax → null', () => {
    assert.equal(calculateEffectiveTaxRate(0, 0), null);
  });
});

describe('calculateDebtToEquity', () => {
  it('2M / 1M → 2', () => {
    assert.equal(calculateDebtToEquity(2_000_000, 1_000_000), 2);
  });

  it('zero equity → null', () => {
    assert.equal(calculateDebtToEquity(100, 0), null);
  });

  it('negative debt → null', () => {
    assert.equal(calculateDebtToEquity(-1, 100), null);
  });
});

describe('calculateUnleveredBeta', () => {
  it('standard 1.20 / [1+(1−0.2)×2] → ≈ 0.4615', () => {
    const b = calculateUnleveredBeta(1.2, 0.2, 2)!;
    assert.ok(Math.abs(b - 1.2 / 2.6) < 1e-12);
    assert.equal(formatUbBeta(b), '0.4615');
  });

  it('no debt → βU = βL', () => {
    assert.equal(calculateUnleveredBeta(1.2, 0.2, 0), 1.2);
  });

  it('moderate debt 1.50 / 1.75 → ≈ 0.8571', () => {
    const b = calculateUnleveredBeta(1.5, 0.25, 1)!;
    assert.ok(Math.abs(b - 1.5 / 1.75) < 1e-12);
    assert.equal(formatUbBeta(b), '0.8571');
  });

  it('zero beta', () => {
    assert.equal(calculateUnleveredBeta(0, 0.2, 1), 0);
  });

  it('negative beta', () => {
    const b = calculateUnleveredBeta(-0.6, 0.2, 1)!;
    assert.ok(Math.abs(b - -0.6 / 1.8) < 1e-12);
    assert.equal(formatUbBeta(b), '-0.3333');
  });

  it('zero tax', () => {
    assert.equal(calculateUnleveredBeta(1.2, 0, 1), 0.6);
  });

  it('100% tax', () => {
    assert.equal(calculateUnleveredBeta(1.2, 1, 1), 1.2);
  });

  it('invalid tax → null', () => {
    assert.equal(calculateUnleveredBeta(1.2, 1.2, 1), null);
  });
});

describe('calculateLeveredBeta', () => {
  it('relever round-trip', () => {
    const u = calculateUnleveredBeta(1.2, 0.2, 2)!;
    const l = calculateLeveredBeta(u, 0.2, 2)!;
    assert.ok(Math.abs(l - 1.2) < 1e-12);
  });
});

describe('interpretUnleveredBeta', () => {
  it('bands', () => {
    assert.match(interpretUnleveredBeta(0.46), /below 1/i);
    assert.match(interpretUnleveredBeta(1), /near 1/i);
    assert.match(interpretUnleveredBeta(1.5), /above 1/i);
    assert.match(interpretUnleveredBeta(-0.3), /Negative/i);
  });
});

describe('validateUnleveredBetaInput', () => {
  it('defaults → ≈ 0.4615', () => {
    const v = validateUnleveredBetaInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result!.formattedUnleveredBeta, '0.4615');
    assert.equal(v.result!.formattedTaxRate, '20.00%');
    assert.equal(v.result!.formattedDebtToEquity, '2.00×');
  });

  it('manual tax mode', () => {
    const v = validateUnleveredBetaInput({
      ...createDefaultInput(),
      taxRateMode: 'manual',
      manualTaxRate: '20',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result!.formattedUnleveredBeta, '0.4615');
  });

  it('empty → invalid', () => {
    assert.equal(validateUnleveredBetaInput(createEmptyInput()).isValid, false);
  });

  it('zero equity → invalid', () => {
    const v = validateUnleveredBetaInput({
      ...createDefaultInput(),
      shareholdersEquity: '0',
    });
    assert.equal(v.isValid, false);
  });

  it('negative debt → invalid', () => {
    const v = validateUnleveredBetaInput({
      ...createDefaultInput(),
      totalDebt: '-100',
    });
    assert.equal(v.isValid, false);
  });

  it('out-of-range manual tax', () => {
    const v = validateUnleveredBetaInput({
      ...createDefaultInput(),
      taxRateMode: 'manual',
      manualTaxRate: '120',
    });
    assert.equal(v.isValid, false);
  });
});
