import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateWacc,
  formatWaccPercent,
  interpretWacc,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateWaccInput } from './validation';

describe('calculateWacc', () => {
  it('700k/500k · 15%/8%/20% → ≈ 11.4167%', () => {
    const r = calculateWacc(0.15, 700_000, 0.08, 500_000, 0.2)!;
    assert.ok(Math.abs(r.wacc - 0.11416666666666667) < 1e-10);
    assert.equal(formatWaccPercent(r.wacc * 100), '11.42%');
  });

  it('all equity → Re', () => {
    const r = calculateWacc(0.12, 100_000, 0.08, 0, 0.2)!;
    assert.equal(r.wacc, 0.12);
  });

  it('all debt → Rd(1−T)', () => {
    const r = calculateWacc(0.12, 0, 0.08, 100_000, 0.2)!;
    assert.equal(r.wacc, 0.064);
  });

  it('equal financing 10%/6%/25% → 7.25%', () => {
    const r = calculateWacc(0.1, 100_000, 0.06, 100_000, 0.25)!;
    assert.ok(Math.abs(r.wacc - 0.0725) < 1e-12);
    assert.equal(formatWaccPercent(r.wacc * 100), '7.25%');
  });

  it('no tax → 10%', () => {
    const r = calculateWacc(0.12, 100_000, 0.08, 100_000, 0)!;
    assert.equal(r.wacc, 0.1);
  });

  it('zero rates → 0', () => {
    const r = calculateWacc(0, 100_000, 0, 100_000, 0.2)!;
    assert.equal(r.wacc, 0);
  });

  it('zero capital → null', () => {
    assert.equal(calculateWacc(0.1, 0, 0.08, 0, 0.2), null);
  });

  it('negative equity → null', () => {
    assert.equal(calculateWacc(0.1, -1, 0.08, 100, 0.2), null);
  });
});

describe('interpretWacc', () => {
  it('bands', () => {
    assert.match(interpretWacc(11.42), /blended required return/i);
    assert.match(interpretWacc(0), /0\.00%/);
    assert.match(interpretWacc(-1), /negative/i);
  });
});

describe('validateWaccInput', () => {
  it('defaults → 11.42%', () => {
    const v = validateWaccInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result!.formattedWacc, '11.42%');
    assert.equal(v.result!.formattedEquityWeight, '58.33%');
    assert.equal(v.result!.formattedDebtWeight, '41.67%');
    assert.equal(v.result!.formattedAfterTaxCostOfDebt, '6.40%');
  });

  it('empty → invalid', () => {
    assert.equal(validateWaccInput(createEmptyInput()).isValid, false);
  });

  it('zero total capital → invalid', () => {
    const v = validateWaccInput({
      ...createDefaultInput(),
      equity: '0',
      debt: '0',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.form);
  });

  it('negative debt → invalid', () => {
    const v = validateWaccInput({
      ...createDefaultInput(),
      debt: '-100',
    });
    assert.equal(v.isValid, false);
  });

  it('tax out of range → invalid', () => {
    const v = validateWaccInput({
      ...createDefaultInput(),
      corporateTaxRate: '120',
    });
    assert.equal(v.isValid, false);
  });
});
