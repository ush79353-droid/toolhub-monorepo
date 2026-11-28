import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateBSFC,
  calculateBSFCFromInput,
  calculateBrakeThermalEfficiency,
  calculateFuelConsumptionRate,
  calculateFuelEnergyInput,
  calculateRequiredBrakePower,
  calculateUsefulEnergyOutput,
  convertBSFC,
  convertPower,
  toGPerKWh,
  toKW,
} from './calculation';
import {
  createEmptyInput,
  createExampleInput,
} from './types';
import { validateBSFCInputs } from './validation';

describe('BSFC Calculator engine', () => {
  it('gasoline efficiency ≈ 33.18% for 250 g/kWh · 43.4 MJ/kg', () => {
    const eta = calculateBrakeThermalEfficiency(250, 43.4);
    assert.ok(eta != null);
    assert.ok(Math.abs(eta - 33.1797) < 0.02);
  });

  it('fuel consumption 100 kW · 250 g/kWh → 25 kg/h', () => {
    const m = calculateFuelConsumptionRate(250, 100);
    assert.equal(m, 25);
  });

  it('fuel energy input 25 kg/h · 43.4 → 1085 MJ/h', () => {
    const e = calculateFuelEnergyInput(25, 43.4);
    assert.equal(e, 1085);
  });

  it('useful energy output 100 kW → 360 MJ/h', () => {
    assert.equal(calculateUsefulEnergyOutput(100), 360);
  });

  it('reverse BSFC from 33.18% · 43.4 ≈ 250 g/kWh', () => {
    const b = calculateBSFC(33.18, 43.4);
    assert.ok(b != null);
    assert.ok(Math.abs(b - 250) < 0.2);
  });

  it('required power 25 kg/h · 250 g/kWh → 100 kW', () => {
    assert.equal(calculateRequiredBrakePower(25, 250), 100);
  });

  it('power conversion 100 kW ≈ 134.10 hp', () => {
    const hp = convertPower(100, 'kW', 'hp');
    assert.ok(Math.abs(hp - 134.102) < 0.02);
  });

  it('BSFC conversion 250 g/kWh ≈ 0.411 lb/(hp·h)', () => {
    const lb = convertBSFC(250, 'g/kWh', 'lb/hph');
    assert.ok(Math.abs(lb - 0.411) < 0.005);
  });

  it('zero BSFC → null efficiency', () => {
    assert.equal(calculateBrakeThermalEfficiency(0, 43.4), null);
  });

  it('negative BSFC → null', () => {
    assert.equal(calculateBrakeThermalEfficiency(-100, 43.4), null);
  });

  it('invalid LHV → null', () => {
    assert.equal(calculateBrakeThermalEfficiency(250, 0), null);
  });

  it('example input ≈ 33.18% efficiency', () => {
    const r = calculateBSFCFromInput(createExampleInput());
    assert.ok(r);
    assert.ok(Math.abs(r.brakeThermalEfficiencyPercent - 33.18) < 0.02);
    assert.equal(r.fuelConsumptionKgPerHour, 25);
    assert.equal(r.fuelEnergyInputMJPerHour, 1085);
    assert.equal(r.usefulEnergyOutputMJPerHour, 360);
  });

  it('empty form yields no result', () => {
    const v = validateBSFCInputs(createEmptyInput());
    assert.equal(v.result, null);
  });

  it('validation: negative BSFC', () => {
    const input = createExampleInput();
    input.bsfc = '-100';
    const v = validateBSFCInputs(input);
    assert.ok(v.errors.bsfc);
    assert.equal(v.result, null);
  });

  it('validation: zero BSFC', () => {
    const input = createExampleInput();
    input.bsfc = '0';
    const v = validateBSFCInputs(input);
    assert.ok(v.errors.bsfc);
  });

  it('validation: invalid custom LHV', () => {
    const input = createExampleInput();
    input.fuelType = 'custom';
    input.customLHV = '0';
    const v = validateBSFCInputs(input);
    assert.ok(v.errors.customLHV);
  });

  it('bsfc mode recovers ~250 g/kWh', () => {
    const input = createEmptyInput();
    input.mode = 'bsfc';
    input.efficiency = '33.18';
    input.fuelType = 'gasoline';
    const r = calculateBSFCFromInput(input);
    assert.ok(r);
    assert.ok(Math.abs(r.bsfcGPerKWh - 250) < 0.2);
  });

  it('enginePower mode recovers 100 kW', () => {
    const input = createEmptyInput();
    input.mode = 'enginePower';
    input.fuelMassFlow = '25';
    input.massFlowUnit = 'kg/h';
    input.bsfc = '250';
    input.fuelType = 'gasoline';
    const r = calculateBSFCFromInput(input);
    assert.ok(r);
    assert.ok(r.powerKW != null && Math.abs(r.powerKW - 100) < 0.01);
  });

  it('toKW / toGPerKWh round-trips', () => {
    assert.ok(Math.abs(toKW(134.102181, 'hp') - 100) < 0.01);
    assert.ok(Math.abs(toGPerKWh(0.25, 'kg/kWh') - 250) < 1e-9);
  });

  it('efficiency does not require power', () => {
    const input = createEmptyInput();
    input.bsfc = '250';
    input.fuelType = 'gasoline';
    const r = calculateBSFCFromInput(input);
    assert.ok(r);
    assert.ok(Math.abs(r.brakeThermalEfficiencyPercent - 33.18) < 0.02);
    assert.equal(r.powerKW, null);
  });
});
