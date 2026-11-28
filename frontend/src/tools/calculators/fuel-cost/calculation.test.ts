import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateFuelConsumptionLiters,
  calculateFuelCost,
  calculateFuelCostFromInput,
  calculateTotalTripDistanceKm,
  fromLiters,
  toKm,
  toLPer100Km,
} from './calculation';
import { createEmptyInput, createExampleOneWay } from './types';
import { validateFuelCostInputs } from './validation';

describe('Fuel Cost Calculator engine', () => {
  it('100 km · 8 L/100 → 8 L', () => {
    assert.equal(calculateFuelConsumptionLiters(100, 8), 8);
  });

  it('200 km · 8 L/100 → 16 L', () => {
    assert.equal(calculateFuelConsumptionLiters(200, 8), 16);
  });

  it('300 km · 15 km/L → 20 L', () => {
    const l100 = toLPer100Km(15, 'km/L')!;
    assert.equal(calculateFuelConsumptionLiters(300, l100), 20);
  });

  it('240 mi · 30 US mpg → 8 US gal', () => {
    const km = toKm(240, 'mi');
    const l100 = toLPer100Km(30, 'mpgUS')!;
    const liters = calculateFuelConsumptionLiters(km, l100)!;
    assert.ok(Math.abs(fromLiters(liters, 'galUS') - 8) < 1e-6);
  });

  it('100 km · 8 · PKR 280 → 2240', () => {
    assert.equal(calculateFuelCost(8, 280), 2240);
  });

  it('200 km · 8 · PKR 280 → 4480', () => {
    assert.equal(calculateFuelCost(16, 280), 4480);
  });

  it('150 km one-way round trip → 300 km', () => {
    assert.equal(calculateTotalTripDistanceKm(150, true), 300);
  });

  it('default example → 22.5 L · PKR 6300', () => {
    const r = calculateFuelCostFromInput(createEmptyInput())!;
    assert.equal(r.totalDistanceKm, 300);
    assert.equal(r.fuelUsedLiters, 22.5);
    assert.equal(r.totalFuelCost, 6300);
    assert.equal(r.costPerKm, 21);
  });

  it('100 km · 5 · 300 → 1500', () => {
    const input = createExampleOneWay();
    input.fuelEfficiency = '5';
    input.fuelPrice = '300';
    const r = calculateFuelCostFromInput(input)!;
    assert.equal(r.fuelUsedLiters, 5);
    assert.equal(r.totalFuelCost, 1500);
  });

  it('zero distance → zero fuel and cost', () => {
    const input = createEmptyInput();
    input.oneWayDistance = '0';
    const r = calculateFuelCostFromInput(input)!;
    assert.equal(r.fuelUsedLiters, 0);
    assert.equal(r.totalFuelCost, 0);
  });

  it('negative distance validation', () => {
    const input = createEmptyInput();
    input.oneWayDistance = '-1';
    assert.ok(validateFuelCostInputs(input).errors.oneWayDistance);
  });

  it('negative price validation', () => {
    const input = createEmptyInput();
    input.fuelPrice = '-1';
    assert.ok(validateFuelCostInputs(input).errors.fuelPrice);
  });

  it('zero km/L validation', () => {
    const input = createEmptyInput();
    input.fuelEfficiencyUnit = 'km/L';
    input.fuelEfficiency = '0';
    assert.ok(validateFuelCostInputs(input).errors.fuelEfficiency);
  });

  it('zero mpg validation', () => {
    const input = createEmptyInput();
    input.fuelEfficiencyUnit = 'mpgUS';
    input.fuelEfficiency = '0';
    assert.ok(validateFuelCostInputs(input).errors.fuelEfficiency);
  });

  it('vehicle estimate medium gas', () => {
    const input = createEmptyInput();
    input.useEstimatedEfficiency = true;
    input.vehicleEstimate = 'mediumGas';
    const r = calculateFuelCostFromInput(input)!;
    assert.equal(r.economyL100, 8.5);
  });
});
