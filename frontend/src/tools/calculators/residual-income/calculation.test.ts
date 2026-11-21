import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateEquityCharge,
  calculateResidualIncome,
  formatRiMoney,
  interpretResidualIncome,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateResidualIncomeInput } from './validation';

describe('calculateEquityCharge', () => {
  it('800000 × 10% → 80000', () => {
    assert.equal(calculateEquityCharge(800_000, 10), 80_000);
  });

  it('500000000 × 12% → 60000000', () => {
    assert.equal(calculateEquityCharge(500_000_000, 12), 60_000_000);
  });

  it('zero cost → 0', () => {
    assert.equal(calculateEquityCharge(200_000, 0), 0);
  });

  it('decimal 12.5%', () => {
    assert.equal(calculateEquityCharge(100_000, 12.5), 12_500);
  });

  it('negative equity → null', () => {
    assert.equal(calculateEquityCharge(-1, 10), null);
  });
});

describe('calculateResidualIncome', () => {
  it('positive RI', () => {
    assert.equal(calculateResidualIncome(140_000, 80_000), 60_000);
  });

  it('negative RI (Company Alpha)', () => {
    assert.equal(
      calculateResidualIncome(17_000_000, 60_000_000),
      -43_000_000
    );
  });

  it('zero RI', () => {
    assert.equal(calculateResidualIncome(10_000, 10_000), 0);
  });

  it('negative net income', () => {
    assert.equal(calculateResidualIncome(-20_000, 10_000), -30_000);
  });
});

describe('interpretResidualIncome', () => {
  it('bands', () => {
    assert.match(interpretResidualIncome(60_000), /Positive/i);
    assert.match(interpretResidualIncome(0), /Zero/i);
    assert.match(interpretResidualIncome(-43_000_000), /Negative/i);
  });
});

describe('formatting', () => {
  it('formats money', () => {
    assert.equal(formatRiMoney(80000, 'PKR'), '80,000.00');
  });
});

describe('validateResidualIncomeInput', () => {
  it('defaults → RI 60000', () => {
    const v = validateResidualIncomeInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result!.equityCharge, 80_000);
    assert.equal(v.result!.residualIncome, 60_000);
  });

  it('Company Alpha negative RI', () => {
    const v = validateResidualIncomeInput({
      ...createDefaultInput(),
      equityCapital: '500000000',
      costOfEquity: '12',
      netIncome: '17000000',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result!.equityCharge, 60_000_000);
    assert.equal(v.result!.residualIncome, -43_000_000);
  });

  it('empty → invalid', () => {
    const v = validateResidualIncomeInput(createEmptyInput());
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
  });

  it('negative equity rejected', () => {
    const v = validateResidualIncomeInput({
      ...createDefaultInput(),
      equityCapital: '-100',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.equityCapital);
  });
});
