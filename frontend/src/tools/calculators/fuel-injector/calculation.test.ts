import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateInjectorFlowRate,
  calculatePressureAdjustedFlow,
  calculateTotalFuelMassFlow,
  calculateFuelInjectorFromInput,
} from './calculation';
import { createEmptyInput, createExampleFourCylinder } from './types';
import { validateFuelInjectorInputs } from './validation';

describe('Fuel Injector Calculator engine', () => {
  it('400 hp · 0.50 · 8 · 80% → 31.25 lb/hr', () => {
    assert.equal(calculateInjectorFlowRate(400, 0.5, 8, 0.8), 31.25);
  });

  it('300 hp · 0.50 · 6 · 80% → 31.25', () => {
    assert.ok(
      Math.abs(calculateInjectorFlowRate(300, 0.5, 6, 0.8)! - 31.25) < 1e-12,
    );
  });

  it('200 hp · 0.50 · 4 · 80% → 31.25', () => {
    assert.equal(calculateInjectorFlowRate(200, 0.5, 4, 0.8), 31.25);
  });

  it('500 hp · 0.60 · 8 · 80% → 46.875', () => {
    assert.equal(calculateInjectorFlowRate(500, 0.6, 8, 0.8), 46.875);
  });

  it('600 hp · 0.60 · 8 · 80% → 56.25', () => {
    assert.equal(calculateInjectorFlowRate(600, 0.6, 8, 0.8), 56.25);
  });

  it('400 · 0.50 · 8 · 100% → 25', () => {
    assert.equal(calculateInjectorFlowRate(400, 0.5, 8, 1), 25);
  });

  it('400 · 0.50 · 8 · 50% → 50', () => {
    assert.equal(calculateInjectorFlowRate(400, 0.5, 8, 0.5), 50);
  });

  it('total fuel flow 400 × 0.50 = 200', () => {
    assert.equal(calculateTotalFuelMassFlow(400, 0.5), 200);
  });

  it('pressure adjust 300 cc · 3→4 bar ≈ 346.41', () => {
    const q = calculatePressureAdjustedFlow(300, 3, 4)!;
    assert.ok(Math.abs(q - 346.41016151377546) < 1e-9);
  });

  it('default input uses target 400 hp → 31.25', () => {
    const r = calculateFuelInjectorFromInput(createEmptyInput())!;
    assert.equal(r.horsepowerUsed, 400);
    assert.equal(r.horsepowerSource, 'target');
    assert.equal(r.requiredFlowLbPerHour, 31.25);
    assert.equal(r.totalFuelMassFlowLbPerHour, 200);
  });

  it('four-cylinder example uses engine HP when target blank', () => {
    const r = calculateFuelInjectorFromInput(createExampleFourCylinder())!;
    assert.equal(r.horsepowerSource, 'engine');
    assert.equal(r.requiredFlowLbPerHour, 31.25);
  });

  it('zero horsepower validation', () => {
    const input = createEmptyInput();
    input.engineHorsepower = '0';
    input.targetHorsepower = '';
    assert.ok(validateFuelInjectorInputs(input).errors.engineHorsepower);
  });

  it('zero injectors validation', () => {
    const input = createEmptyInput();
    input.numberOfInjectors = '0';
    assert.ok(validateFuelInjectorInputs(input).errors.numberOfInjectors);
  });

  it('zero duty cycle validation', () => {
    const input = createEmptyInput();
    input.maxDutyCycle = '0';
    assert.ok(validateFuelInjectorInputs(input).errors.maxDutyCycle);
  });

  it('duty above 100 validation', () => {
    const input = createEmptyInput();
    input.maxDutyCycle = '101';
    assert.ok(validateFuelInjectorInputs(input).errors.maxDutyCycle);
  });

  it('negative BSFC validation', () => {
    const input = createEmptyInput();
    input.bsfc = '-0.1';
    assert.ok(validateFuelInjectorInputs(input).errors.bsfc);
  });

  it('zero density validation', () => {
    const input = createEmptyInput();
    input.fuelDensity = '0';
    assert.ok(validateFuelInjectorInputs(input).errors.fuelDensity);
  });
});
