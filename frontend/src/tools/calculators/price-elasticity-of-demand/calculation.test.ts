import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateMidpointElasticity,
  calculateRevenue,
  calculateRevenueIncreasePercent,
  classifyPed,
  classificationLabel,
} from './calculation';
import { validatePriceElasticityOfDemandInput } from './validation';
import { createDefaultInput } from './types';

const TOL = 1e-4;

describe('calculateMidpointElasticity', () => {
  it('P 50→60, Q 200→150 → −11/7 ≈ −1.5714', () => {
    const ped = calculateMidpointElasticity(50, 200, 60, 150);
    assert.ok(ped !== null);
    assert.ok(Math.abs(ped! - -11 / 7) < TOL);
  });

  it('elastic example ≈ −1.9412', () => {
    const ped = calculateMidpointElasticity(100, 100, 120, 70);
    assert.ok(ped !== null);
    assert.ok(Math.abs(ped! - -1.941176470588235) < TOL);
  });

  it('inelastic example ≈ −0.2821', () => {
    const ped = calculateMidpointElasticity(100, 100, 120, 95);
    assert.ok(ped !== null);
    assert.ok(Math.abs(ped! - -0.282051282051282) < TOL);
  });

  it('unit elastic → −1', () => {
    const ped = calculateMidpointElasticity(100, 100, 125, 80);
    assert.ok(ped !== null);
    assert.ok(Math.abs(ped! - -1) < 1e-9);
  });

  it('unchanged quantity → 0', () => {
    assert.equal(calculateMidpointElasticity(100, 100, 120, 100), 0);
  });

  it('positive PED → +1', () => {
    const ped = calculateMidpointElasticity(100, 100, 120, 120);
    assert.ok(ped !== null);
    assert.ok(Math.abs(ped! - 1) < 1e-9);
  });

  it('equal prices → null', () => {
    assert.equal(calculateMidpointElasticity(100, 100, 100, 80), null);
  });

  it('both quantities zero → null', () => {
    assert.equal(calculateMidpointElasticity(100, 0, 120, 0), null);
  });

  it('reversed observations same PED', () => {
    const a = calculateMidpointElasticity(50, 200, 60, 150);
    const b = calculateMidpointElasticity(60, 150, 50, 200);
    assert.ok(a !== null && b !== null);
    assert.ok(Math.abs(a! - b!) < 1e-12);
  });

  it('zero initial quantity still defined', () => {
    const ped = calculateMidpointElasticity(100, 0, 120, 100);
    assert.ok(ped !== null);
    assert.ok(Math.abs(ped! - 11) < TOL);
  });
});

describe('revenue helpers', () => {
  it('50×200 = 10000; 60×150 = 9000; −10%', () => {
    assert.equal(calculateRevenue(50, 200), 10000);
    assert.equal(calculateRevenue(60, 150), 9000);
    assert.equal(calculateRevenueIncreasePercent(10000, 9000), -10);
  });

  it('revenue +14%', () => {
    const pct = calculateRevenueIncreasePercent(10000, 11400);
    assert.ok(pct !== null);
    assert.ok(Math.abs(pct! - 14) < 1e-9);
  });

  it('zero initial revenue → null', () => {
    assert.equal(calculateRevenueIncreasePercent(0, 1000), null);
  });
});

describe('classifyPed', () => {
  it('maps magnitudes', () => {
    assert.equal(classifyPed(-1.5714), 'elastic');
    assert.equal(classifyPed(-0.5), 'inelastic');
    assert.equal(classifyPed(-1), 'unitElastic');
    assert.equal(classifyPed(0), 'perfectlyInelastic');
    assert.equal(classifyPed(1), 'positiveUnit');
    assert.equal(classifyPed(1.5), 'positiveRelationship');
    assert.equal(classificationLabel('elastic'), 'Elastic demand');
  });
});

describe('validatePriceElasticityOfDemandInput', () => {
  it('main example end-to-end', () => {
    const v = validatePriceElasticityOfDemandInput({
      ...createDefaultInput(),
      initialPrice: '50',
      initialQuantity: '200',
      finalPrice: '60',
      finalQuantity: '150',
    });
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.ok(Math.abs(v.result!.priceElasticity! - -11 / 7) < TOL);
    assert.equal(v.result!.classification, 'elastic');
    assert.equal(v.result!.initialRevenue, 10000);
    assert.equal(v.result!.finalRevenue, 9000);
    assert.equal(v.result!.revenueIncreasePercent, -10);
  });

  it('equal prices: PED undefined, revenue still computed', () => {
    const v = validatePriceElasticityOfDemandInput({
      ...createDefaultInput(),
      initialPrice: '100',
      initialQuantity: '100',
      finalPrice: '100',
      finalQuantity: '80',
    });
    assert.equal(v.result?.status, 'undefinedElasticity');
    assert.equal(v.result?.priceElasticity, null);
    assert.equal(v.result?.initialRevenue, 10000);
    assert.equal(v.result?.finalRevenue, 8000);
    assert.equal(v.result?.revenueIncreasePercent, -20);
  });

  it('negative price → error', () => {
    const v = validatePriceElasticityOfDemandInput({
      ...createDefaultInput(),
      initialPrice: '-10',
      initialQuantity: '1',
      finalPrice: '20',
      finalQuantity: '1',
    });
    assert.ok(v.errors.initialPrice);
    assert.equal(v.result, null);
  });

  it('unit elastic revenues equal', () => {
    const v = validatePriceElasticityOfDemandInput({
      ...createDefaultInput(),
      initialPrice: '100',
      initialQuantity: '100',
      finalPrice: '125',
      finalQuantity: '80',
    });
    assert.equal(v.result?.classification, 'unitElastic');
    assert.equal(v.result?.initialRevenue, 10000);
    assert.equal(v.result?.finalRevenue, 10000);
    assert.equal(v.result?.revenueIncreasePercent, 0);
  });
});
