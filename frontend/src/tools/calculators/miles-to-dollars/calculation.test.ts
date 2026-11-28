import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateActualRedemptionValue,
  calculateAwardEquivalentCost,
  calculateCentsPerMile,
  calculateMilesDollarValue,
  calculateMilesRequiredForTargetValue,
  calculateMilesToDollarsFromInput,
  calculatePriceDifference,
  calculateSavingsPercentage,
  convertCentsToDollars,
  convertDollarsToCents,
  convertMileValueUnit,
  toValuePerMileUSD,
} from './calculation';
import { createEmptyInput } from './types';
import { validateMilesToDollarsInputs } from './validation';

describe('Miles to Dollars Calculator engine', () => {
  it('1000 × 1.5¢ → $15', () => {
    assert.equal(calculateMilesDollarValue(1000, 0.015), 15);
  });
  it('5000 × 1.5¢ → $75', () => {
    assert.equal(calculateMilesDollarValue(5000, 0.015), 75);
  });
  it('10000 × 1.5¢ → $150', () => {
    assert.equal(calculateMilesDollarValue(10000, 0.015), 150);
  });
  it('20000 × 1.5¢ → $300', () => {
    assert.equal(calculateMilesDollarValue(20000, 0.015), 300);
  });
  it('25000 × 1.5¢ → $375', () => {
    assert.equal(calculateMilesDollarValue(25000, 0.015), 375);
  });
  it('40000 × 1.5¢ → $600', () => {
    assert.equal(calculateMilesDollarValue(40000, 0.015), 600);
  });
  it('50000 × 1.5¢ → $750', () => {
    assert.equal(calculateMilesDollarValue(50000, 0.015), 750);
  });
  it('100000 × 1.5¢ → $1500', () => {
    assert.equal(calculateMilesDollarValue(100000, 0.015), 1500);
  });

  it('25000 @ 1.5¢ + $50 fees → $425', () => {
    assert.equal(calculateAwardEquivalentCost(25000, 0.015, 50), 425);
  });

  it('$600 − $425 → $175', () => {
    assert.equal(calculatePriceDifference(600, 425), 175);
  });

  it('savings % ≈ 29.17', () => {
    const pct = calculateSavingsPercentage(600, 425);
    assert.ok(pct != null);
    assert.ok(Math.abs(pct! - 29.1666666667) < 1e-9);
  });

  it('($600 − $50) / 25000 → 2.20¢/mi', () => {
    const cents = calculateCentsPerMile(600, 50, 25000);
    assert.ok(cents != null);
    assert.ok(Math.abs(cents! - 2.2) < 1e-9);
    assert.ok(
      Math.abs(calculateActualRedemptionValue(600, 50, 25000)! - 0.022) < 1e-12,
    );
  });

  it('$300 target @ 1.5¢ → 20000 miles', () => {
    assert.equal(calculateMilesRequiredForTargetValue(300, 0.015), 20000);
  });

  it('zero miles → undefined redemption', () => {
    assert.equal(calculateCentsPerMile(600, 50, 0), null);
  });

  it('zero cash → undefined savings %', () => {
    assert.equal(calculateSavingsPercentage(0, 425), null);
  });

  it('cents ↔ dollars conversion', () => {
    assert.equal(convertCentsToDollars(1.5), 0.015);
    assert.equal(convertDollarsToCents(0.015), 1.5);
    assert.equal(toValuePerMileUSD(1.5, 'cents'), 0.015);
    assert.equal(toValuePerMileUSD(0.015, 'usd'), 0.015);
    assert.equal(convertMileValueUnit(1.5, 'cents', 'usd'), 0.015);
    assert.equal(convertMileValueUnit(0.015, 'usd', 'cents'), 1.5);
  });

  it('default fixture → $425 / $175 / 2.20¢', () => {
    const r = calculateMilesToDollarsFromInput(createEmptyInput());
    assert.ok(r);
    assert.equal(r!.estimatedMilesValue, 375);
    assert.equal(r!.awardEquivalentCost, 425);
    assert.equal(r!.priceDifference, 175);
    assert.ok(r!.savingsPercentage != null);
    assert.ok(Math.abs(r!.savingsPercentage! - 29.1666666667) < 1e-9);
    assert.ok(r!.actualRedemptionCentsPerMile != null);
    assert.ok(Math.abs(r!.actualRedemptionCentsPerMile! - 2.2) < 1e-9);
  });

  it('negative miles validation', () => {
    const v = validateMilesToDollarsInputs({
      ...createEmptyInput(),
      milesRequired: '-1',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.milesRequired);
  });

  it('negative fees validation', () => {
    const v = validateMilesToDollarsInputs({
      ...createEmptyInput(),
      additionalFees: '-5',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.additionalFees);
  });

  it('empty miles → no result', () => {
    const v = validateMilesToDollarsInputs({
      ...createEmptyInput(),
      milesRequired: '',
    });
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
  });

  it('invalid text → validation error', () => {
    const v = validateMilesToDollarsInputs({
      ...createEmptyInput(),
      valuePerMile: 'abc',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.valuePerMile);
  });

  it('fees > cash → negative redemption cents', () => {
    const cents = calculateCentsPerMile(40, 50, 25000);
    assert.ok(cents != null);
    assert.ok(cents! < 0);
  });

  it('convert optional → 40000 × 1.5¢ = $600', () => {
    const r = calculateMilesToDollarsFromInput({
      ...createEmptyInput(),
      showConvert: true,
      convertMiles: '40000',
    });
    assert.ok(r);
    assert.equal(r!.convertEstimatedValue, 600);
  });

  it('target optional → 20000 miles', () => {
    const r = calculateMilesToDollarsFromInput({
      ...createEmptyInput(),
      showTarget: true,
      targetDollars: '300',
    });
    assert.ok(r);
    assert.equal(r!.milesForTarget, 20000);
  });

  it('compare options populates option B', () => {
    const r = calculateMilesToDollarsFromInput({
      ...createEmptyInput(),
      showCompare: true,
    });
    assert.ok(r);
    assert.ok(r!.optionB);
    assert.ok(r!.compareNote);
  });
});
