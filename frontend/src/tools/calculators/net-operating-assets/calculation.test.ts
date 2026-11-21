import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateNetOperatingAssets,
  calculateOperatingAssets,
  calculateOperatingLiabilities,
} from './calculation';
import { createDefaultInput } from './types';
import { validateNetOperatingAssetsInput } from './validation';

function nearly(actual: number | null, expected: number, eps = 1e-9) {
  assert.ok(actual !== null, 'expected a number');
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateOperatingAssets', () => {
  it('Company Alpha OA = 1,550,000', () => {
    nearly(
      calculateOperatingAssets(250_000, 300_000, 400_000, 100_000, 500_000),
      1_550_000
    );
  });

  it('rejects negative parts', () => {
    assert.equal(
      calculateOperatingAssets(-1, 0, 0, 0, 0),
      null
    );
  });
});

describe('calculateOperatingLiabilities', () => {
  it('Company Alpha OL = 600,000', () => {
    nearly(calculateOperatingLiabilities(400_000, 200_000), 600_000);
  });
});

describe('calculateNetOperatingAssets', () => {
  it('Company Alpha NOA = 950,000', () => {
    nearly(calculateNetOperatingAssets(1_550_000, 600_000), 950_000);
  });

  it('positive / zero / negative', () => {
    nearly(calculateNetOperatingAssets(800_000, 300_000), 500_000);
    nearly(calculateNetOperatingAssets(500_000, 500_000), 0);
    nearly(calculateNetOperatingAssets(300_000, 450_000), -150_000);
  });

  it('edge OA or OL zero', () => {
    nearly(calculateNetOperatingAssets(900_000, 0), 900_000);
    nearly(calculateNetOperatingAssets(0, 100_000), -100_000);
  });

  it('decimal example → 8,501.50', () => {
    const oa = calculateOperatingAssets(
      1000.25,
      2000.5,
      3000.75,
      500.25,
      5000.5
    )!;
    const ol = calculateOperatingLiabilities(2000.25, 1000.5)!;
    nearly(oa, 11_502.25);
    nearly(ol, 3000.75);
    nearly(calculateNetOperatingAssets(oa, ol), 8501.5);
  });

  it('large amounts', () => {
    nearly(calculateNetOperatingAssets(125_000_000, 48_500_000), 76_500_000);
  });
});

describe('validateNetOperatingAssetsInput', () => {
  it('validates Company Alpha', () => {
    const { isValid, result } = validateNetOperatingAssetsInput({
      ...createDefaultInput(),
      cash: '250000',
      accountsReceivable: '300000',
      inventory: '400000',
      prepaidExpenses: '100000',
      fixedAssets: '500000',
      accountsPayable: '400000',
      accruedOperatingExpenses: '200000',
    });
    assert.equal(isValid, true);
    nearly(result!.operatingAssets, 1_550_000);
    nearly(result!.operatingLiabilities, 600_000);
    nearly(result!.netOperatingAssets, 950_000);
  });

  it('all zeros → NOA 0', () => {
    const { result } = validateNetOperatingAssetsInput({
      ...createDefaultInput(),
      cash: '0',
      accountsReceivable: '0',
      inventory: '0',
      prepaidExpenses: '0',
      fixedAssets: '0',
      accountsPayable: '0',
      accruedOperatingExpenses: '0',
    });
    nearly(result!.netOperatingAssets, 0);
    assert.equal(result!.status, 'zeroNoa');
  });

  it('rejects negative cash', () => {
    const { isValid, errors } = validateNetOperatingAssetsInput({
      ...createDefaultInput(),
      cash: '-10',
      accountsReceivable: '0',
      inventory: '0',
      prepaidExpenses: '0',
      fixedAssets: '0',
      accountsPayable: '0',
      accruedOperatingExpenses: '0',
    });
    assert.equal(isValid, false);
    assert.ok(errors.cash);
  });

  it('blank → incomplete', () => {
    const { isValid, result } = validateNetOperatingAssetsInput(
      createDefaultInput()
    );
    assert.equal(isValid, false);
    assert.equal(result, null);
  });

  it('FAQ OA 620k path', () => {
    const { result } = validateNetOperatingAssetsInput({
      ...createDefaultInput(),
      cash: '50000',
      accountsReceivable: '100000',
      inventory: '150000',
      prepaidExpenses: '20000',
      fixedAssets: '300000',
      accountsPayable: '0',
      accruedOperatingExpenses: '0',
    });
    nearly(result!.operatingAssets, 620_000);
    nearly(result!.netOperatingAssets, 620_000);
  });
});
