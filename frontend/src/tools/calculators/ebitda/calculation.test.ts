import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateAmortizationFromEbitda,
  calculateDepreciationFromEbitda,
  calculateEbitda,
  calculateEbitdaMargin,
  calculateOperatingProfitFromEbitda,
} from './calculation';
import { createDefaultInput } from './types';
import { validateEbitdaInput } from './validation';

function nearly(actual: number | null, expected: number, eps = 1e-9) {
  assert.ok(actual !== null, 'expected a number');
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateEbitda', () => {
  it('computes standard EBITDA', () => {
    nearly(calculateEbitda(100_000, 10_000, 20_000), 130_000);
  });

  it('handles zero add-backs', () => {
    nearly(calculateEbitda(50_000, 0, 0), 50_000);
  });

  it('handles negative OP with positive EBITDA', () => {
    nearly(calculateEbitda(-20_000, 10_000, 30_000), 20_000);
  });

  it('handles negative EBITDA', () => {
    nearly(calculateEbitda(-100_000, 10_000, 20_000), -70_000);
  });

  it('handles zero EBITDA', () => {
    nearly(calculateEbitda(-30_000, 10_000, 20_000), 0);
  });

  it('rejects negative amortization', () => {
    assert.equal(calculateEbitda(100, -1, 0), null);
  });
});

describe('reverse calculations', () => {
  it('solves operating profit', () => {
    nearly(calculateOperatingProfitFromEbitda(150_000, 10_000, 20_000), 120_000);
  });

  it('solves amortization', () => {
    nearly(calculateAmortizationFromEbitda(130_000, 100_000, 20_000), 10_000);
  });

  it('solves depreciation', () => {
    nearly(calculateDepreciationFromEbitda(130_000, 100_000, 10_000), 20_000);
  });

  it('rejects negative reverse amortization', () => {
    assert.equal(calculateAmortizationFromEbitda(100, 100, 20), null);
  });
});

describe('calculateEbitdaMargin', () => {
  it('computes margin', () => {
    nearly(calculateEbitdaMargin(150_000, 600_000), 25);
  });

  it('computes negative margin', () => {
    nearly(calculateEbitdaMargin(-30_000, 300_000), -10);
  });

  it('is unavailable at zero revenue', () => {
    assert.equal(calculateEbitdaMargin(10_000, 0), null);
  });
});

describe('validateEbitdaInput', () => {
  it('validates the worked example', () => {
    const { isValid, result } = validateEbitdaInput({
      ...createDefaultInput(),
      operatingProfit: '100000',
      amortizationExpense: '10000',
      depreciationExpense: '20000',
    });
    assert.equal(isValid, true);
    nearly(result!.ebitda, 130_000);
  });

  it('computes margin when revenue provided', () => {
    const { isValid, result } = validateEbitdaInput({
      ...createDefaultInput(),
      operatingProfit: '100000',
      amortizationExpense: '10000',
      depreciationExpense: '20000',
      revenue: '520000',
    });
    assert.equal(isValid, true);
    nearly(result!.ebitdaMargin!, 25);
  });

  it('reverse amortization mode', () => {
    const { isValid, result } = validateEbitdaInput({
      ...createDefaultInput(),
      mode: 'amortization',
      ebitda: '130000',
      operatingProfit: '100000',
      depreciationExpense: '20000',
    });
    assert.equal(isValid, true);
    nearly(result!.amortizationExpense, 10_000);
  });

  it('rejects negative depreciation input', () => {
    const { isValid, errors } = validateEbitdaInput({
      ...createDefaultInput(),
      operatingProfit: '100',
      amortizationExpense: '0',
      depreciationExpense: '-1',
    });
    assert.equal(isValid, false);
    assert.ok(errors.depreciationExpense);
  });

  it('returns incomplete when blank', () => {
    const { isValid, result } = validateEbitdaInput(createDefaultInput());
    assert.equal(isValid, false);
    assert.equal(result, null);
  });
});
