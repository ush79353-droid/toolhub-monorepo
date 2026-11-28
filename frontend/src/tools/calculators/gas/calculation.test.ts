import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateAnnualFuelCost,
  calculateCostPerKm,
  calculateCostPerPerson,
  calculateFuelCost,
  calculateFuelRequired,
  calculateGasFromInput,
  calculateMaximumDrivingRangeKm,
  calculateMonthlyFuelCost,
  calculateTotalDistanceKm,
  calculateWeeklyFuelCost,
  fromLiters,
  toKm,
  toLPer100Km,
} from './calculation';
import { createEmptyInput, createRoundTripExample } from './types';
import { validateGasInputs } from './validation';

describe('Gas Calculator engine', () => {
  it('100 km · 5 L/100 → 5 L', () => {
    assert.equal(calculateFuelRequired(100, 5), 5);
  });

  it('250 km · 7.5 L/100 → 18.75 L', () => {
    assert.equal(calculateFuelRequired(250, 7.5), 18.75);
  });

  it('500 km · 8 L/100 → 40 L', () => {
    assert.equal(calculateFuelRequired(500, 8), 40);
  });

  it('1,000 km · 6 L/100 → 60 L', () => {
    assert.equal(calculateFuelRequired(1000, 6), 60);
  });

  it('18.75 L · PKR 280 → 5250', () => {
    assert.equal(calculateFuelCost(18.75, 280), 5250);
  });

  it('5250 / 3 passengers → 1750', () => {
    assert.equal(calculateCostPerPerson(5250, 3), 1750);
  });

  it('5250 / 250 km → 21/km', () => {
    assert.equal(calculateCostPerKm(5250, 250), 21);
  });

  it('40 L · 7.5 L/100 → 533.333… km range', () => {
    const range = calculateMaximumDrivingRangeKm(40, 7.5)!;
    assert.ok(Math.abs(range - 533.3333333333334) < 1e-9);
  });

  it('200 km one-way round trip → 400 km', () => {
    assert.equal(calculateTotalDistanceKm(200, true), 400);
  });

  it('default fixture → 18.75 L · 5250 · 1750 · 21/km', () => {
    const r = calculateGasFromInput(createEmptyInput())!;
    assert.equal(r.totalDistanceKm, 250);
    assert.equal(r.fuelRequiredLiters, 18.75);
    assert.equal(r.totalFuelCost, 5250);
    assert.equal(r.costPerPerson, 1750);
    assert.equal(r.costPerKm, 21);
    assert.ok(r.maximumRangeKm != null);
    assert.ok(Math.abs(r.maximumRangeKm! - 533.3333333333334) < 1e-9);
  });

  it('zero distance → zero fuel and cost', () => {
    const input = createEmptyInput();
    input.oneWayDistance = '0';
    const r = calculateGasFromInput(input)!;
    assert.equal(r.fuelRequiredLiters, 0);
    assert.equal(r.totalFuelCost, 0);
    assert.equal(r.costPerKm, null);
  });

  it('negative distance validation', () => {
    const input = createEmptyInput();
    input.oneWayDistance = '-1';
    assert.ok(validateGasInputs(input).errors.oneWayDistance);
  });

  it('zero fuel efficiency validation', () => {
    const input = createEmptyInput();
    input.fuelEfficiency = '0';
    assert.ok(validateGasInputs(input).errors.fuelEfficiency);
  });

  it('negative fuel price validation', () => {
    const input = createEmptyInput();
    input.fuelPrice = '-1';
    assert.ok(validateGasInputs(input).errors.fuelPrice);
  });

  it('zero passengers validation', () => {
    const input = createEmptyInput();
    input.passengers = '0';
    assert.ok(validateGasInputs(input).errors.passengers);
  });

  it('km/L conversion · 300 km · 15 km/L → 20 L', () => {
    const l100 = toLPer100Km(15, 'km/L')!;
    assert.equal(calculateFuelRequired(300, l100), 20);
  });

  it('mi · US mpg conversion', () => {
    const km = toKm(240, 'mi');
    const l100 = toLPer100Km(30, 'mpgUS')!;
    const liters = calculateFuelRequired(km, l100)!;
    assert.ok(Math.abs(fromLiters(liters, 'galUS') - 8) < 1e-6);
  });

  it('round-trip example 200 km → 400 km total', () => {
    const r = calculateGasFromInput(createRoundTripExample())!;
    assert.equal(r.totalDistanceKm, 400);
  });

  it('weekly / monthly / annual recurring costs', () => {
    const weekly = calculateWeeklyFuelCost(5250, 5)!;
    assert.equal(weekly, 26250);
    assert.equal(calculateAnnualFuelCost(weekly), 26250 * 52);
    assert.equal(calculateMonthlyFuelCost(weekly), (26250 * 52) / 12);
  });

  it('vehicle comparison savings over 1000 km', () => {
    const input = createEmptyInput();
    input.oneWayDistance = '1000';
    input.fuelEfficiency = '8';
    input.comparisonEfficiency = '6';
    input.passengers = '1';
    const r = calculateGasFromInput(input)!;
    assert.equal(r.totalFuelCost, 22400);
    assert.equal(r.comparisonFuelCost, 16800);
    assert.equal(r.estimatedSavings, 5600);
  });

  it('20% consumption reduction improves cost', () => {
    const input = createEmptyInput();
    input.consumptionReductionPercent = '20';
    const r = calculateGasFromInput(input)!;
    assert.ok(r.improvedEconomyL100 != null);
    assert.equal(r.improvedEconomyL100, 6);
    assert.equal(r.improvedFuelCost, 4200);
    assert.equal(r.improvementSavings, 1050);
  });
});
