import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateDupontAnalysis,
  formatDupontPercent,
  formatDupontRatio,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateDupontInput } from './validation';

function nearly(actual: number | null | undefined, expected: number, eps = 1e-9) {
  assert.ok(actual != null, `expected ~${expected}, got ${actual}`);
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateDupontAnalysis', () => {
  it('standard example → 12% · 1.25× · 2× · 30%', () => {
    const r = calculateDupontAnalysis({
      sales: 1_000_000,
      netIncome: 120_000,
      totalAssets: 800_000,
      totalEquity: 400_000,
    })!;
    nearly(r.netProfitMargin, 0.12);
    nearly(r.totalAssetTurnover, 1.25);
    nearly(r.financialLeverage, 2);
    nearly(r.returnOnEquity, 0.3);
    nearly(r.directRoe, 0.3);
    assert.equal(formatDupontPercent(r.netProfitMargin), '12.00');
    assert.equal(formatDupontRatio(r.totalAssetTurnover), '1.25');
    assert.equal(formatDupontPercent(r.returnOnEquity), '30.00');
  });

  it('NI 150k → ROE 37.5%', () => {
    const r = calculateDupontAnalysis({
      sales: 1_000_000,
      netIncome: 150_000,
      totalAssets: 800_000,
      totalEquity: 400_000,
    })!;
    nearly(r.netProfitMargin, 0.15);
    nearly(r.returnOnEquity, 0.375);
  });

  it('negative NI → negative ROE', () => {
    const r = calculateDupontAnalysis({
      sales: 1_000_000,
      netIncome: -50_000,
      totalAssets: 500_000,
      totalEquity: 250_000,
    })!;
    nearly(r.netProfitMargin, -0.05);
    nearly(r.totalAssetTurnover, 2);
    nearly(r.financialLeverage, 2);
    nearly(r.returnOnEquity, -0.2);
  });

  it('zero NI → zero ROE', () => {
    const r = calculateDupontAnalysis({
      sales: 1_000_000,
      netIncome: 0,
      totalAssets: 800_000,
      totalEquity: 400_000,
    })!;
    nearly(r.netProfitMargin, 0);
    nearly(r.returnOnEquity, 0);
  });

  it('rejects zero sales/assets/equity', () => {
    assert.equal(
      calculateDupontAnalysis({
        sales: 0,
        netIncome: 1,
        totalAssets: 1,
        totalEquity: 1,
      }),
      null
    );
    assert.equal(
      calculateDupontAnalysis({
        sales: 1,
        netIncome: 1,
        totalAssets: 0,
        totalEquity: 1,
      }),
      null
    );
    assert.equal(
      calculateDupontAnalysis({
        sales: 1,
        netIncome: 1,
        totalAssets: 1,
        totalEquity: 0,
      }),
      null
    );
  });

  it('negative equity flagged', () => {
    const r = calculateDupontAnalysis({
      sales: 100,
      netIncome: 10,
      totalAssets: 50,
      totalEquity: -25,
    })!;
    assert.equal(r.negativeEquity, true);
    nearly(r.financialLeverage, -2);
  });

  it('three-factor matches NI/Equity', () => {
    const r = calculateDupontAnalysis({
      sales: 250_000,
      netIncome: 37_500,
      totalAssets: 180_000,
      totalEquity: 90_000,
    })!;
    nearly(r.returnOnEquity, r.directRoe, 1e-12);
  });
});

describe('validateDupontInput', () => {
  it('defaults → 30%', () => {
    const v = validateDupontInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result!.formattedRoe, '30.00%');
    assert.equal(v.result!.formattedNpm, '12.00%');
    assert.equal(v.result!.formattedTat, '1.25×');
    assert.equal(v.result!.formattedFl, '2.00×');
  });

  it('empty → invalid', () => {
    assert.equal(validateDupontInput(createEmptyInput()).isValid, false);
  });

  it('zero sales errors', () => {
    const input = createDefaultInput();
    input.sales = '0';
    assert.equal(validateDupontInput(input).isValid, false);
  });

  it('zero equity errors', () => {
    const input = createDefaultInput();
    input.totalEquity = '0';
    assert.equal(validateDupontInput(input).isValid, false);
  });

  it('negative sales errors', () => {
    const input = createDefaultInput();
    input.sales = '-100';
    assert.equal(validateDupontInput(input).isValid, false);
  });

  it('negative equity warns', () => {
    const input = createDefaultInput();
    input.totalEquity = '-100000';
    const v = validateDupontInput(input);
    assert.equal(v.isValid, true);
    assert.equal(v.result!.negativeEquity, true);
    assert.match(v.result!.warningMessage!, /negative/i);
  });
});
