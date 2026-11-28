import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateFuelMassFlowLbPerHour,
  calculateFuelPumpFromInput,
  calculateFuelRailPressureBar,
  calculateFuelVolumeFlowLPerHour,
  calculateTargetPumpFlow,
  interpolateFuelPumpPerformance,
} from './calculation';
import { createEmptyInput } from './types';
import { validateFuelPumpInputs } from './validation';

describe('Fuel Pump Calculator engine', () => {
  it('300 hp · 0.50 → 150 lb/hr', () => {
    assert.equal(calculateFuelMassFlowLbPerHour(300, 0.5), 150);
  });

  it('300 hp · 0.50 · 0.745 kg/L ≈ 91.33 L/hr', () => {
    const q = calculateFuelVolumeFlowLPerHour(300, 0.5, 0.745)!;
    assert.ok(Math.abs(q - 91.32732281879194) < 1e-9);
  });

  it('400 hp · 0.50 → 200 lb/hr', () => {
    assert.equal(calculateFuelMassFlowLbPerHour(400, 0.5), 200);
  });

  it('400 hp · 0.50 · 0.745 ≈ 121.77 L/hr', () => {
    const q = calculateFuelVolumeFlowLPerHour(400, 0.5, 0.745)!;
    assert.ok(Math.abs(q - 121.76976375838926) < 1e-9);
  });

  it('500 hp · 0.60 → 300 lb/hr', () => {
    assert.equal(calculateFuelMassFlowLbPerHour(500, 0.6), 300);
  });

  it('500 hp · 0.60 · 0.745 ≈ 182.65 L/hr', () => {
    const q = calculateFuelVolumeFlowLPerHour(500, 0.6, 0.745)!;
    assert.ok(Math.abs(q - 182.65464563758388) < 1e-9);
  });

  it('3 bar + 1 bar referenced → 4 bar', () => {
    assert.equal(
      calculateFuelRailPressureBar(3, 1, 'manifoldReferenced'),
      4,
    );
  });

  it('3 bar + 0 boost referenced → 3 bar', () => {
    assert.equal(
      calculateFuelRailPressureBar(3, 0, 'manifoldReferenced'),
      3,
    );
  });

  it('3 bar + 1 boost fixed → 3 bar rail', () => {
    assert.equal(calculateFuelRailPressureBar(3, 1, 'fixedRail'), 3);
  });

  it('100 L/hr · 20% margin → 120', () => {
    assert.equal(calculateTargetPumpFlow(100, 20), 120);
  });

  it('default example ~91.33 L/hr', () => {
    const r = calculateFuelPumpFromInput(createEmptyInput())!;
    assert.ok(
      Math.abs(r.requiredFuelFlowLitersPerHour - 91.32732281879194) < 1e-9,
    );
    assert.equal(r.fuelRailPressureBar, 3);
  });

  it('curve interpolate mid', () => {
    const { flow } = interpolateFuelPumpPerformance(
      [
        { pressureBar: 2, flowLitersPerHour: 200 },
        { pressureBar: 4, flowLitersPerHour: 100 },
      ],
      3,
    );
    assert.equal(flow, 150);
  });

  it('curve outside range → null', () => {
    const { flow, warning } = interpolateFuelPumpPerformance(
      [
        { pressureBar: 2, flowLitersPerHour: 200 },
        { pressureBar: 4, flowLitersPerHour: 100 },
      ],
      5,
    );
    assert.equal(flow, null);
    assert.ok(warning);
  });

  it('zero power validation', () => {
    const input = createEmptyInput();
    input.power = '0';
    assert.ok(validateFuelPumpInputs(input).errors.power);
  });

  it('negative power validation', () => {
    const input = createEmptyInput();
    input.power = '-1';
    assert.ok(validateFuelPumpInputs(input).errors.power);
  });

  it('zero density validation', () => {
    const input = createEmptyInput();
    input.fuelDensity = '0';
    assert.ok(validateFuelPumpInputs(input).errors.fuelDensity);
  });

  it('invalid BSFC validation', () => {
    const input = createEmptyInput();
    input.bsfc = '-0.1';
    assert.ok(validateFuelPumpInputs(input).errors.bsfc);
  });
});
