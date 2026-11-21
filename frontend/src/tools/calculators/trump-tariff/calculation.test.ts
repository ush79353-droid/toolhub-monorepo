import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculatePassThrough,
  calculateTrumpTariff,
} from './calculation';
import {
  canPresentAsCurrentlyEffective,
  collectFieldErrors,
  isExpiredTariffStatus,
  isValidHtsusFormat,
} from './validation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
  type TrumpTariffInput,
} from './types';

function base(overrides: Partial<TrumpTariffInput> = {}): TrumpTariffInput {
  return {
    ...createDefaultInput(),
    unitCustomsValue: '1000',
    quantity: '1',
    baseTariffRate: '10',
    additionalTariffRate: '0',
    assumeAdditiveStacking: true,
    ...overrides,
  };
}

describe('calculateTrumpTariff', () => {
  it('Test 1: basic 10% tariff on $1000 → $100 duty', () => {
    const r = calculateTrumpTariff(base());
    assert.ok(r);
    assert.equal(r.totalTariff, 100);
    assert.equal(r.baseDuty, 100);
  });

  it('Test 2: combined 5% + 20% on $1000 → $250', () => {
    const r = calculateTrumpTariff(
      base({ baseTariffRate: '5', additionalTariffRate: '20' })
    );
    assert.ok(r);
    assert.equal(r.totalTariff, 250);
    assert.equal(r.combinedTariffRate, 25);
  });

  it('Test 3: $800 × 10 → $8000 customs value', () => {
    const r = calculateTrumpTariff(
      base({
        unitCustomsValue: '800',
        quantity: '10',
        baseTariffRate: '0',
        additionalTariffRate: '0',
      })
    );
    assert.ok(r);
    assert.equal(r.totalCustomsValue, 8000);
  });

  it('Test 4: worked example landed cost $10,300', () => {
    const r = calculateTrumpTariff(createExampleInput());
    assert.ok(r);
    assert.equal(r.totalCustomsValue, 8000);
    assert.equal(r.baseDuty, 400);
    assert.equal(r.additionalDuty, 1600);
    assert.equal(r.totalTariff, 2000);
    assert.equal(r.tariffInclusiveValue, 10000);
    assert.equal(r.estimatedLandedCost, 10300);
    assert.equal(r.landedCostPerUnit, 1030);
  });

  it('Test 5: zero tariff → $0 duty', () => {
    const r = calculateTrumpTariff(
      base({ baseTariffRate: '0', additionalTariffRate: '0' })
    );
    assert.ok(r);
    assert.equal(r.totalTariff, 0);
  });

  it('Test 6: invalid quantity -5', () => {
    const errors = collectFieldErrors(base({ quantity: '-5' }));
    assert.ok(errors.quantity);
    assert.equal(calculateTrumpTariff(base({ quantity: '-5' })), null);
  });

  it('Test 7: negative product value', () => {
    const errors = collectFieldErrors(base({ unitCustomsValue: '-10' }));
    assert.ok(errors.unitCustomsValue);
    assert.equal(
      calculateTrumpTariff(base({ unitCustomsValue: '-10' })),
      null
    );
  });

  it('Test 8: country mode without country', () => {
    const errors = collectFieldErrors(
      base({ mode: 'country', countryCode: '' })
    );
    assert.ok(errors.countryCode);
  });

  it('Test 9: expired / proposed rates not currently effective', () => {
    assert.equal(canPresentAsCurrentlyEffective('expired'), false);
    assert.equal(canPresentAsCurrentlyEffective('proposed'), false);
    assert.equal(canPresentAsCurrentlyEffective('effective'), true);
    assert.equal(isExpiredTariffStatus('expired'), true);
    assert.equal(isExpiredTariffStatus('proposed'), true);
  });

  it('Test 10: incompatible stacking refused without assumeAdditive', () => {
    const input = base({
      additionalTariffRate: '20',
      assumeAdditiveStacking: false,
    });
    const errors = collectFieldErrors(input);
    assert.ok(errors.form);
    assert.equal(calculateTrumpTariff(input), null);
  });

  it('Test 11: pass-through 60% of $200 on $1000 retail → $1120', () => {
    const p = calculatePassThrough({
      originalRetailPrice: 1000,
      addedTariffCost: 200,
      passThroughPercent: 60,
    });
    assert.ok(p);
    assert.equal(p.consumerPriceIncrease, 120);
    assert.equal(p.newRetailPrice, 1120);
  });

  it('Test 12: clear / empty defaults', () => {
    const empty = createEmptyInput('product');
    assert.equal(empty.unitCustomsValue, '');
    assert.equal(empty.quantity, '');
    const def = createDefaultInput();
    assert.equal(def.mode, 'product');
    assert.equal(def.quantity, '1');
  });

  it('Test 15: large amounts stay finite', () => {
    const r = calculateTrumpTariff(
      base({
        unitCustomsValue: '1000000',
        quantity: '100',
        baseTariffRate: '25',
        additionalTariffRate: '25',
      })
    );
    assert.ok(r);
    assert.ok(Number.isFinite(r.estimatedLandedCost));
    assert.equal(r.totalCustomsValue, 100_000_000);
    assert.equal(r.totalTariff, 50_000_000);
  });

  it('HTSUS format syntax only', () => {
    assert.equal(isValidHtsusFormat('8471.30.01'), true);
    assert.equal(isValidHtsusFormat('84713001'), true);
    assert.equal(isValidHtsusFormat('abc'), false);
  });

  it('example input includes pass-through on result', () => {
    const r = calculateTrumpTariff(createExampleInput());
    assert.ok(r);
    assert.ok(r.consumerPriceIncrease != null);
    assert.ok(r.newRetailPrice != null);
  });
});
