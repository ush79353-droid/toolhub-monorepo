import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateCarpoolingFromInput,
  calculateCostPerPerson,
  calculateFuelCost,
  calculateFuelUsed,
  calculatePassengerContribution,
  calculateRoundTripDistance,
  convertDistance,
  fromLPer100Km,
  toLPer100Km,
} from './calculation';
import { createEmptyInput, createExampleInput } from './types';
import { validateCarpoolingInputs } from './validation';

describe('Carpooling Calculator engine', () => {
  it('100 km at 8 L/100 km → 8 L fuel', () => {
    assert.equal(calculateFuelUsed(100, 8), 8);
  });

  it('8 L at $1.50/L → $12 fuel cost', () => {
    assert.equal(calculateFuelCost(8, 1.5), 12);
  });

  it('$30 trip shared by 3 → $10 per person', () => {
    assert.equal(calculateCostPerPerson(30, 3), 10);
  });

  it('example 120 km · 8 L/100 · $1.50 · 4 people · $8 extras → $5.60', () => {
    const r = calculateCarpoolingFromInput(createExampleInput());
    assert.ok(r);
    assert.ok(Math.abs(r.fuelUsedLiters - 9.6) < 1e-9);
    assert.ok(Math.abs(r.fuelCost - 14.4) < 1e-9);
    assert.ok(Math.abs(r.totalTripCost - 22.4) < 1e-9);
    assert.ok(Math.abs(r.costPerPerson - 5.6) < 1e-9);
    assert.ok(Math.abs(r.driverReimbursement - 16.8) < 1e-9);
  });

  it('120 km round trip → 240 km total', () => {
    assert.equal(calculateRoundTripDistance(120, true), 240);
  });

  it('100 km → ≈62.14 mi', () => {
    const mi = convertDistance(100, 'km', 'mi');
    assert.ok(Math.abs(mi - 62.137) < 0.01);
  });

  it('8 L/100 km → ≈29.40 mpg US', () => {
    const mpg = fromLPer100Km(8, 'mpgUS');
    assert.ok(mpg != null && Math.abs(mpg - 29.4018) < 0.02);
  });

  it('$30 equal split driver + 2 passengers → $10 each', () => {
    const s = calculatePassengerContribution(30, 3, 'equalSplit', null);
    assert.ok(s);
    assert.equal(s.passengerContribution, 10);
    assert.equal(s.driverPays, 10);
  });

  it('$30 driver free with 3 people → $15 per passenger', () => {
    const s = calculatePassengerContribution(30, 3, 'driverFree', null);
    assert.ok(s);
    assert.equal(s.passengerContribution, 15);
    assert.equal(s.driverPays, 0);
  });

  it('0 travelers → validation error', () => {
    const input = createExampleInput();
    input.numberOfPeople = '0';
    const v = validateCarpoolingInputs(input);
    assert.ok(v.errors.numberOfPeople);
    assert.equal(v.result, null);
  });

  it('negative distance → validation error', () => {
    const input = createExampleInput();
    input.distance = '-10';
    const v = validateCarpoolingInputs(input);
    assert.ok(v.errors.distance);
  });

  it('zero fuel economy → validation error', () => {
    const input = createExampleInput();
    input.fuelEconomy = '0';
    const v = validateCarpoolingInputs(input);
    assert.ok(v.errors.fuelEconomy);
  });

  it('missing fuel price → incomplete', () => {
    const input = createExampleInput();
    input.fuelPrice = '';
    const v = validateCarpoolingInputs(input);
    assert.equal(v.result, null);
  });

  it('negative parking → validation error', () => {
    const input = createExampleInput();
    input.parking = '-2';
    const v = validateCarpoolingInputs(input);
    assert.ok(v.errors.parking);
  });

  it('empty form yields no result', () => {
    assert.equal(validateCarpoolingInputs(createEmptyInput()).result, null);
  });

  it('mpg US round-trip to L/100 km', () => {
    const l100 = toLPer100Km(29.40182275, 'mpgUS');
    assert.ok(l100 != null && Math.abs(l100 - 8) < 0.01);
  });

  it('savings comparison: 4 solo vs shared', () => {
    const input = createExampleInput();
    input.enableSavings = true;
    input.soloFuelEconomy = '8';
    const r = calculateCarpoolingFromInput(input);
    assert.ok(r);
    assert.ok(r.separateTravelCost != null);
    assert.ok(r.totalSavings != null && r.totalSavings > 0);
  });
});
