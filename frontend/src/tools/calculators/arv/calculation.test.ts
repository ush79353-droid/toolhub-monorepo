import assert from 'node:assert/strict';
import {
  SQ_FT_PER_M2,
  calculateArv,
  calculateCurrentPropertyValue,
  calculateMaximumBid,
  calculateRoi,
  calculateTargetPurchasePrice,
  convertArea,
  convertPricePerArea,
} from './calculation';
import { createDefaultInput } from './types';
import { validateArvInput } from './validation';

function approx(actual: number, expected: number, eps = 1e-6) {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

// Test 1: Direct property valuation
{
  const pv = calculateCurrentPropertyValue({
    method: 'property-value',
    propertyValue: 300_000,
    averagePrice: 0,
    propertyArea: 0,
  });
  assert.equal(pv, 300_000);
  assert.equal(calculateArv(300_000, 50_000), 350_000);
}

// Test 2: Area-based property valuation
{
  const pv = calculateCurrentPropertyValue({
    method: 'average-price',
    propertyValue: 0,
    averagePrice: 200,
    propertyArea: 1_500,
  });
  assert.equal(pv, 300_000);
  assert.equal(calculateArv(pv!, 50_000), 350_000);
}

// Test 3: Maximum bid
{
  assert.equal(calculateMaximumBid(350_000, 70, 50_000), 195_000);
}

// Test 4: ROI ≈ 42.86%
{
  const roi = calculateRoi(350_000, 195_000, 50_000);
  assert.ok(roi);
  approx(roi.roiPercent, 42.8571428571, 1e-6);
  assert.equal(roi.totalInvestment, 245_000);
  assert.equal(roi.estimatedGrossProfit, 105_000);
}

// Test 5: Zero renovation value
{
  assert.equal(calculateArv(250_000, 0), 250_000);
}

// Test 6: Area unit conversion — 1000 ft² ≈ 92.90304 m²; PV stable
{
  const areaM2 = convertArea(1_000, 'ft2', 'm2');
  approx(areaM2, 1_000 / SQ_FT_PER_M2, 1e-9);
  approx(areaM2, 92.9030401597, 1e-6);

  const priceFt2 = 200;
  const priceM2 = convertPricePerArea(priceFt2, 'ft2', 'm2');
  const pvFt = priceFt2 * 1_000;
  const pvM = priceM2 * areaM2;
  approx(pvFt, pvM, 1e-6);
  approx(convertArea(areaM2, 'm2', 'ft2'), 1_000, 1e-6);
}

// Test 7: Negative maximum bid
{
  assert.equal(calculateMaximumBid(100_000, 70, 90_000), -20_000);
}

// Test 8: ROI denominator zero → unavailable
{
  assert.equal(calculateRoi(350_000, 0, 0), null);
}

// Test 9: Clearing required input clears results
{
  const full = validateArvInput({
    ...createDefaultInput(),
    propertyValue: '300000',
    renovationValue: '50000',
    renovationCost: '50000',
    purchaseRulePercent: '70',
  });
  assert.equal(full.isValid, true);
  assert.equal(full.result?.arv, 350_000);
  assert.equal(full.result?.maximumBid, 195_000);

  const cleared = validateArvInput({
    ...createDefaultInput(),
    propertyValue: '',
    renovationValue: '50000',
  });
  assert.equal(cleared.isValid, false);
  assert.equal(cleared.result, null);
}

// Test 10: Reset defaults
{
  const defaults = createDefaultInput();
  assert.equal(defaults.method, 'property-value');
  assert.equal(defaults.purchaseRulePercent, '70');
  assert.equal(defaults.currency, 'USD');
  assert.equal(defaults.areaUnit, 'ft2');
  assert.equal(defaults.propertyValue, '');
  assert.equal(defaults.targetRoiPercent, '');
  const validation = validateArvInput(defaults);
  assert.equal(validation.isValid, false);
  assert.equal(validation.result, null);
}

// Method switching / average incomplete
{
  const incomplete = validateArvInput({
    ...createDefaultInput(),
    method: 'average-price',
    averagePrice: '200',
    propertyArea: '',
    renovationValue: '50000',
  });
  assert.equal(incomplete.isValid, false);
  assert.equal(incomplete.result, null);

  const zeroArea = validateArvInput({
    ...createDefaultInput(),
    method: 'average-price',
    averagePrice: '200',
    propertyArea: '0',
    renovationValue: '50000',
  });
  assert.equal(zeroArea.isValid, false);
  assert.ok(zeroArea.errors.propertyArea);
}

// Invalid percentages
{
  const bad = validateArvInput({
    ...createDefaultInput(),
    propertyValue: '100000',
    renovationValue: '0',
    renovationCost: '10000',
    purchaseRulePercent: '110',
  });
  assert.ok(bad.errors.purchaseRulePercent);
  assert.equal(bad.result?.arv, 100_000);
  assert.equal(bad.result?.formattedMaximumBid, '');
}

// Target ROI reverse purchase price
{
  const pp = calculateTargetPurchasePrice(350_000, 25, 50_000);
  assert.equal(pp, 230_000);
}

// Negative ROI allowed
{
  const roi = calculateRoi(100_000, 80_000, 50_000);
  assert.ok(roi);
  approx(roi.roiPercent, -23.0769230769, 1e-6);
}

// Reject negatives
{
  assert.equal(calculateArv(-1, 0), null);
  assert.equal(calculateArv(100, -1), null);
  assert.equal(calculateMaximumBid(100, 70, -1), null);
  assert.equal(calculateRoi(100, -1, 0), null);
}

console.log('arv/calculation.test.ts: all assertions passed');
