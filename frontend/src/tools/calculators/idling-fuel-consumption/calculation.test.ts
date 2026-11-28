import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateIdlingCost,
  calculateIdlingFromInput,
  calculateTotalFuelConsumed,
  estimateDieselIdlingConsumption,
  estimatePetrolIdlingConsumption,
  fromLiters,
  toHours,
  toLiters,
  toLitersDisplacement,
} from './calculation';
import { createDieselExample, createEmptyInput } from './types';
import { validateIdlingInputs } from './validation';

describe('Idling Fuel Consumption engine', () => {
  it('petrol 2.0 L → 1.2 L/h', () => {
    assert.equal(estimatePetrolIdlingConsumption(2), 1.2);
  });

  it('diesel 2.0 L → 0.9 L/h', () => {
    assert.equal(estimateDieselIdlingConsumption(2), 0.9);
  });

  it('petrol 1.5 L → 0.9 L/h', () => {
    assert.ok(
      Math.abs(estimatePetrolIdlingConsumption(1.5)! - 0.9) < 1e-12,
    );
  });

  it('diesel 3.0 L → 1.35 L/h', () => {
    assert.equal(estimateDieselIdlingConsumption(3), 1.35);
  });

  it('petrol 2.0 L · 30 min → 0.6 L', () => {
    assert.equal(calculateTotalFuelConsumed(1.2, 0.5), 0.6);
  });

  it('diesel 2.0 L · 60 min → 0.9 L', () => {
    assert.equal(calculateTotalFuelConsumed(0.9, 1), 0.9);
  });

  it('petrol 2.0 L · 2 h → 2.4 L', () => {
    assert.equal(calculateTotalFuelConsumed(1.2, 2), 2.4);
  });

  it('0.6 L · PKR 280 → 168', () => {
    assert.equal(calculateIdlingCost(0.6, 280), 168);
  });

  it('2.4 L · PKR 280 → 672', () => {
    assert.equal(calculateIdlingCost(2.4, 280), 672);
  });

  it('0 minutes → 0 L', () => {
    assert.equal(calculateTotalFuelConsumed(1.2, 0), 0);
  });

  it('1 L → 1000 mL', () => {
    assert.equal(fromLiters(1, 'mL'), 1000);
  });

  it('1 US gal → 3.785411784 L', () => {
    assert.equal(toLiters(1, 'galUS'), 3.785411784);
  });

  it('1 UK gal → 4.54609 L', () => {
    assert.equal(toLiters(1, 'galUK'), 4.54609);
  });

  it('2000 cm³ → 2 L', () => {
    assert.equal(toLitersDisplacement(2000, 'cm3'), 2);
  });

  it('60 min → 1 h', () => {
    assert.equal(toHours(60, 'min'), 1);
  });

  it('default fixture → 1.2 L/h · 0.6 L · 168', () => {
    const r = calculateIdlingFromInput(createEmptyInput())!;
    assert.equal(r.effectiveConsumptionLph, 1.2);
    assert.equal(r.fuelConsumedLiters, 0.6);
    assert.equal(r.totalIdlingCost, 168);
  });

  it('diesel example → 0.9 L/h · 0.45 L', () => {
    const r = calculateIdlingFromInput(createDieselExample())!;
    assert.equal(r.effectiveConsumptionLph, 0.9);
    assert.equal(r.fuelConsumedLiters, 0.45);
  });

  it('negative engine validation', () => {
    const input = createEmptyInput();
    input.engineCapacity = '-1';
    assert.ok(validateIdlingInputs(input).errors.engineCapacity);
  });

  it('negative time validation', () => {
    const input = createEmptyInput();
    input.idlingTime = '-1';
    assert.ok(validateIdlingInputs(input).errors.idlingTime);
  });

  it('negative price validation', () => {
    const input = createEmptyInput();
    input.fuelPrice = '-1';
    assert.ok(validateIdlingInputs(input).errors.fuelPrice);
  });

  it('empty engine → no result', () => {
    const input = createEmptyInput();
    input.engineCapacity = '';
    assert.equal(validateIdlingInputs(input).result, null);
  });

  it('custom rate overrides estimate', () => {
    const input = createEmptyInput();
    input.useCustomConsumption = true;
    input.customConsumptionRate = '1.5';
    input.idlingTime = '3';
    input.timeUnit = 'h';
    const r = calculateIdlingFromInput(input)!;
    assert.equal(r.isCustomRate, true);
    assert.equal(r.fuelConsumedLiters, 4.5);
  });
});
