import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  annualizePurchaseFrequency,
  calculateAverageCustomerValue,
  calculateAveragePurchaseValue,
  calculateCLTVCACRatio,
  calculateCltvFromInput,
  calculateGrossProfitCLTV,
  calculatePurchaseFrequency,
  calculateRevenueCLTV,
} from './calculation';
import { createExampleInput, type CltvInput } from './types';
import { validateCltvInput } from './validation';

function base(patch: Partial<CltvInput> = {}): CltvInput {
  return { ...createExampleInput(), ...patch };
}

describe('cltv calculator', () => {
  it('Test 1: standard CLTV 50 × 5 × 3 = 750', () => {
    const r = calculateCltvFromInput(createExampleInput());
    assert.ok(r);
    assert.equal(r.revenueCLTV, 750);
    assert.equal(r.averageCustomerValue, 250);
  });

  it('Test 2: APV from revenue', () => {
    assert.equal(calculateAveragePurchaseValue(5_000_000, 100_000), 50);
  });

  it('Test 3: APF from purchases/customers', () => {
    assert.equal(calculatePurchaseFrequency(100_000, 20_000), 5);
  });

  it('Test 4: ACV = APV × APF', () => {
    assert.equal(calculateAverageCustomerValue(50, 5), 250);
  });

  it('Test 5: gross profit CLTV 750 × 40% = 300', () => {
    assert.equal(calculateGrossProfitCLTV(750, 0.4), 300);
    const r = calculateCltvFromInput(
      base({ useGrossMargin: true, grossProfitMargin: '40' }),
    );
    assert.ok(r);
    assert.equal(r.grossProfitCLTV, 300);
  });

  it('Test 6: CLTV:CAC 300 / 100 = 3', () => {
    assert.equal(calculateCLTVCACRatio(300, 100), 3);
    const r = calculateCltvFromInput(
      base({
        useGrossMargin: true,
        grossProfitMargin: '40',
        useCac: true,
        customerAcquisitionCost: '100',
      }),
    );
    assert.ok(r);
    assert.equal(r.cltvCACRatio, 3);
  });

  it('Test 7: monthly frequency annualizes', () => {
    // APV 20, period APF 2/month → annual 24 → ACV 480 → L 3 → 1440
    assert.equal(annualizePurchaseFrequency(2, 'monthly', 12), 24);
    const r = calculateCltvFromInput(
      base({
        averagePurchaseValue: '20',
        averagePurchaseFrequency: '24',
        averageCustomerLifespan: '3',
      }),
    );
    assert.ok(r);
    assert.equal(r.averageCustomerValue, 480);
    assert.equal(r.revenueCLTV, 1440);
  });

  it('Test 8: zero purchases rejected', () => {
    const v = validateCltvInput(
      base({
        useBusinessData: true,
        totalPurchases: '0',
        totalRevenue: '1000',
        numberOfCustomers: '10',
      }),
    );
    assert.equal(v.isValid, false);
  });

  it('Test 9: zero customers rejected', () => {
    const v = validateCltvInput(
      base({
        useBusinessData: true,
        totalPurchases: '100',
        totalRevenue: '1000',
        numberOfCustomers: '0',
      }),
    );
    assert.equal(v.isValid, false);
  });

  it('Test 10: invalid lifespan rejected', () => {
    const v = validateCltvInput(base({ averageCustomerLifespan: '0' }));
    assert.equal(v.isValid, false);
  });

  it('business-data Company Alpha → 750', () => {
    const r = calculateCltvFromInput(
      base({
        useBusinessData: true,
        totalRevenue: '5000000',
        totalPurchases: '100000',
        numberOfCustomers: '20000',
        reportingPeriod: 'annual',
        averageCustomerLifespan: '3',
      }),
    );
    assert.ok(r);
    assert.equal(r.averagePurchaseValue, 50);
    assert.equal(r.annualPurchaseFrequency, 5);
    assert.equal(r.revenueCLTV, 750);
  });

  it('revenue CLTV helper', () => {
    assert.equal(calculateRevenueCLTV(250, 3), 750);
  });
});
