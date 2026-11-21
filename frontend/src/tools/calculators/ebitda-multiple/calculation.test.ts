import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateEnterpriseValue,
  calculateEbitdaMultiple,
  calculateValuation,
  formatMultiple,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateEbitdaMultipleInput } from './validation';

function nearly(actual: number | null | undefined, expected: number, eps = 1e-9) {
  assert.ok(actual != null, `expected ~${expected}, got ${actual}`);
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateEnterpriseValue / calculateEbitdaMultiple', () => {
  it('standard case → EV 545M · 10.90×', () => {
    const r = calculateValuation({
      marketCapitalization: 450_000_000,
      debt: 100_000_000,
      minorityInterest: 5_000_000,
      preferredEquity: 10_000_000,
      cashAndCashEquivalents: 20_000_000,
      ebitda: 50_000_000,
    })!;
    nearly(r.enterpriseValue, 545_000_000);
    nearly(r.ebitdaMultiple, 10.9);
    assert.equal(formatMultiple(r.ebitdaMultiple!), '10.90');
  });

  it('no debt → 90M · 6.00×', () => {
    const r = calculateValuation({
      marketCapitalization: 100_000_000,
      debt: 0,
      minorityInterest: 0,
      preferredEquity: 0,
      cashAndCashEquivalents: 10_000_000,
      ebitda: 15_000_000,
    })!;
    nearly(r.enterpriseValue, 90_000_000);
    nearly(r.ebitdaMultiple, 6);
  });

  it('zero EBITDA → null multiple + warning', () => {
    const { multiple, warning } = calculateEbitdaMultiple(100_000_000, 0);
    assert.equal(multiple, null);
    assert.match(warning!, /zero/i);
  });

  it('negative EBITDA → signed multiple + warning', () => {
    const { multiple, warning } = calculateEbitdaMultiple(100_000_000, -10_000_000);
    nearly(multiple, -10);
    assert.match(warning!, /negative/i);
  });

  it('zero EV → 0×', () => {
    const { multiple } = calculateEbitdaMultiple(0, 20_000_000);
    nearly(multiple, 0);
  });

  it('rejects negative EV components', () => {
    assert.equal(
      calculateEnterpriseValue({
        marketCapitalization: -1,
        debt: 0,
        minorityInterest: 0,
        preferredEquity: 0,
        cashAndCashEquivalents: 0,
      }),
      null
    );
  });

  it('cash increase lowers EV', () => {
    const a = calculateEnterpriseValue({
      marketCapitalization: 100,
      debt: 0,
      minorityInterest: 0,
      preferredEquity: 0,
      cashAndCashEquivalents: 10,
    })!;
    const b = calculateEnterpriseValue({
      marketCapitalization: 100,
      debt: 0,
      minorityInterest: 0,
      preferredEquity: 0,
      cashAndCashEquivalents: 20,
    })!;
    nearly(a - b, 10);
  });

  it('debt increase raises EV', () => {
    const a = calculateEnterpriseValue({
      marketCapitalization: 100,
      debt: 10,
      minorityInterest: 0,
      preferredEquity: 0,
      cashAndCashEquivalents: 0,
    })!;
    const b = calculateEnterpriseValue({
      marketCapitalization: 100,
      debt: 25,
      minorityInterest: 0,
      preferredEquity: 0,
      cashAndCashEquivalents: 0,
    })!;
    nearly(b - a, 15);
  });
});

describe('validateEbitdaMultipleInput', () => {
  it('defaults → 10.90×', () => {
    const v = validateEbitdaMultipleInput(createDefaultInput());
    assert.equal(v.isValid, true);
    nearly(v.result!.enterpriseValue, 545_000_000);
    assert.equal(v.result!.formattedMultiple, '10.90×');
  });

  it('empty → invalid', () => {
    assert.equal(validateEbitdaMultipleInput(createEmptyInput()).isValid, false);
  });

  it('negative cash errors', () => {
    const input = createDefaultInput();
    input.cash = '-1';
    assert.equal(validateEbitdaMultipleInput(input).isValid, false);
  });

  it('negative debt errors', () => {
    const input = createDefaultInput();
    input.debt = '-100';
    assert.equal(validateEbitdaMultipleInput(input).isValid, false);
  });

  it('EBITDA change updates multiple only', () => {
    const a = validateEbitdaMultipleInput(createDefaultInput());
    const bInput = createDefaultInput();
    bInput.ebitda = '54500000';
    const b = validateEbitdaMultipleInput(bInput);
    nearly(a.result!.enterpriseValue, b.result!.enterpriseValue);
    nearly(b.result!.ebitdaMultiple!, 10);
  });

  it('zero EBITDA warns', () => {
    const input = createDefaultInput();
    input.ebitda = '0';
    const v = validateEbitdaMultipleInput(input);
    assert.equal(v.isValid, true);
    assert.equal(v.result!.ebitdaMultiple, null);
    assert.match(v.result!.warningMessage!, /zero/i);
  });
});
