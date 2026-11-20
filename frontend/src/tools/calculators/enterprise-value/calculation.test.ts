import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateEnterpriseValue, formatEvMoney } from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateEnterpriseValueInput } from './validation';

function nearly(actual: number | null | undefined, expected: number, eps = 1e-9) {
  assert.ok(actual != null, `expected ~${expected}, got ${actual}`);
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateEnterpriseValue', () => {
  it('all components → 585M', () => {
    const r = calculateEnterpriseValue({
      marketCapitalization: 500_000_000,
      minorityInterest: 20_000_000,
      preferredShares: 15_000_000,
      debt: 100_000_000,
      cashAndCashEquivalents: 50_000_000,
    })!;
    nearly(r.enterpriseValue, 585_000_000);
    nearly(r.totalClaims, 635_000_000);
    nearly(r.netDebt, 50_000_000);
  });

  it('reference article → 250,325,000', () => {
    const r = calculateEnterpriseValue({
      marketCapitalization: 156_825_000,
      minorityInterest: 0,
      preferredShares: 0,
      debt: 143_500_000,
      cashAndCashEquivalents: 50_000_000,
    })!;
    nearly(r.enterpriseValue, 250_325_000);
  });

  it('debt-free → 80M', () => {
    const r = calculateEnterpriseValue({
      marketCapitalization: 100_000_000,
      minorityInterest: 0,
      preferredShares: 0,
      debt: 0,
      cashAndCashEquivalents: 20_000_000,
    })!;
    nearly(r.enterpriseValue, 80_000_000);
  });

  it('zero cash → 250M', () => {
    const r = calculateEnterpriseValue({
      marketCapitalization: 200_000_000,
      minorityInterest: 0,
      preferredShares: 0,
      debt: 50_000_000,
      cashAndCashEquivalents: 0,
    })!;
    nearly(r.enterpriseValue, 250_000_000);
  });

  it('all zeros → 0', () => {
    const r = calculateEnterpriseValue({
      marketCapitalization: 0,
      minorityInterest: 0,
      preferredShares: 0,
      debt: 0,
      cashAndCashEquivalents: 0,
    })!;
    nearly(r.enterpriseValue, 0);
  });

  it('negative EV preserved when cash exceeds claims', () => {
    const r = calculateEnterpriseValue({
      marketCapitalization: 10,
      minorityInterest: 0,
      preferredShares: 0,
      debt: 0,
      cashAndCashEquivalents: 50,
    })!;
    nearly(r.enterpriseValue, -40);
  });

  it('rejects negative components', () => {
    assert.equal(
      calculateEnterpriseValue({
        marketCapitalization: -1,
        minorityInterest: 0,
        preferredShares: 0,
        debt: 0,
        cashAndCashEquivalents: 0,
      }),
      null
    );
  });

  it('cash increase lowers EV', () => {
    const a = calculateEnterpriseValue({
      marketCapitalization: 100,
      minorityInterest: 0,
      preferredShares: 0,
      debt: 0,
      cashAndCashEquivalents: 10,
    })!;
    const b = calculateEnterpriseValue({
      marketCapitalization: 100,
      minorityInterest: 0,
      preferredShares: 0,
      debt: 0,
      cashAndCashEquivalents: 25,
    })!;
    nearly(a.enterpriseValue - b.enterpriseValue, 15);
  });
});

describe('validateEnterpriseValueInput', () => {
  it('defaults → 585M', () => {
    const v = validateEnterpriseValueInput(createDefaultInput());
    assert.equal(v.isValid, true);
    nearly(v.result!.enterpriseValue, 585_000_000);
    assert.match(v.result!.formattedEv, /585,000,000/);
  });

  it('empty → invalid', () => {
    assert.equal(
      validateEnterpriseValueInput(createEmptyInput()).isValid,
      false
    );
  });

  it('negative debt errors', () => {
    const input = createDefaultInput();
    input.debt = '-1';
    assert.equal(validateEnterpriseValueInput(input).isValid, false);
  });

  it('formats money', () => {
    assert.equal(formatEvMoney(585000000, 'USD'), '585,000,000.00');
  });
});
