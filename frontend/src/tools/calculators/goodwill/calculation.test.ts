import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateAcquisitionResidual,
  calculateBargainPurchaseDifference,
  calculateGoodwill,
  calculateNetIdentifiableAssets,
} from './calculation';
import { createDefaultInput } from './types';
import { validateGoodwillInput } from './validation';

function nearly(actual: number | null, expected: number, eps = 1e-9) {
  assert.ok(actual !== null, 'expected a number');
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateNetIdentifiableAssets', () => {
  it('computes assets minus liabilities', () => {
    nearly(calculateNetIdentifiableAssets(450_000, 400_000), 50_000);
    nearly(calculateNetIdentifiableAssets(900_000, 350_000), 550_000);
  });

  it('allows negative net assets', () => {
    nearly(calculateNetIdentifiableAssets(200_000, 400_000), -200_000);
  });
});

describe('calculateAcquisitionResidual and goodwill', () => {
  it('reference example → 950,000 goodwill', () => {
    const net = calculateNetIdentifiableAssets(450_000, 400_000)!;
    const residual = calculateAcquisitionResidual(1_000_000, net)!;
    nearly(residual, 950_000);
    nearly(calculateGoodwill(residual), 950_000);
  });

  it('standard goodwill 400,000', () => {
    const net = calculateNetIdentifiableAssets(600_000, 200_000)!;
    nearly(calculateGoodwill(calculateAcquisitionResidual(800_000, net)!), 400_000);
  });

  it('zero goodwill', () => {
    const net = calculateNetIdentifiableAssets(700_000, 200_000)!;
    nearly(calculateGoodwill(calculateAcquisitionResidual(500_000, net)!), 0);
  });

  it('bargain purchase residual -200,000', () => {
    const net = calculateNetIdentifiableAssets(700_000, 200_000)!;
    const residual = calculateAcquisitionResidual(300_000, net)!;
    nearly(residual, -200_000);
    nearly(calculateGoodwill(residual), 0);
    nearly(calculateBargainPurchaseDifference(residual), 200_000);
  });

  it('zero liabilities', () => {
    const net = calculateNetIdentifiableAssets(400_000, 0)!;
    nearly(calculateGoodwill(calculateAcquisitionResidual(500_000, net)!), 100_000);
  });

  it('negative net assets → higher goodwill', () => {
    const net = calculateNetIdentifiableAssets(200_000, 400_000)!;
    nearly(calculateGoodwill(calculateAcquisitionResidual(300_000, net)!), 500_000);
  });

  it('all zero', () => {
    nearly(calculateGoodwill(calculateAcquisitionResidual(0, 0)!), 0);
  });
});

describe('validateGoodwillInput', () => {
  it('validates Company Alpha', () => {
    const { isValid, result } = validateGoodwillInput({
      ...createDefaultInput(),
      purchasePrice: '1000000',
      fairValueOfAssets: '450000',
      fairValueOfLiabilities: '400000',
    });
    assert.equal(isValid, true);
    nearly(result!.goodwill, 950_000);
    nearly(result!.netIdentifiableAssets, 50_000);
  });

  it('flags bargain purchase', () => {
    const { result } = validateGoodwillInput({
      ...createDefaultInput(),
      purchasePrice: '300000',
      fairValueOfAssets: '700000',
      fairValueOfLiabilities: '200000',
    });
    assert.equal(result!.status, 'potentialBargainPurchase');
    nearly(result!.goodwill, 0);
    nearly(result!.bargainPurchaseDifference, 200_000);
  });

  it('rejects negative purchase price', () => {
    const { isValid, errors } = validateGoodwillInput({
      ...createDefaultInput(),
      purchasePrice: '-100',
      fairValueOfAssets: '100',
      fairValueOfLiabilities: '0',
    });
    assert.equal(isValid, false);
    assert.ok(errors.purchasePrice);
  });

  it('rejects negative assets', () => {
    const { isValid, errors } = validateGoodwillInput({
      ...createDefaultInput(),
      purchasePrice: '100',
      fairValueOfAssets: '-100',
      fairValueOfLiabilities: '0',
    });
    assert.equal(isValid, false);
    assert.ok(errors.fairValueOfAssets);
  });

  it('returns incomplete when blank', () => {
    const { isValid, result } = validateGoodwillInput(createDefaultInput());
    assert.equal(isValid, false);
    assert.equal(result, null);
  });
});
