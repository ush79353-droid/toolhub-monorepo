import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateGrossVehicleWeight,
  calculateGvwrFromInput,
  calculateGvwrUtilization,
  calculateMaximumPayload,
  calculateOverloadedWeight,
  calculateRemainingCapacity,
  fromKg,
  toKg,
} from './calculation';
import { createCapacityExample, createEmptyInput } from './types';
import { validateGvwrInputs } from './validation';

describe('GVWR Calculator engine', () => {
  it('1000 + 500 → 1500 kg GVW', () => {
    assert.equal(calculateGrossVehicleWeight(1000, 500), 1500);
  });

  it('2000 + 1000 → 3000 kg GVW', () => {
    assert.equal(calculateGrossVehicleWeight(2000, 1000), 3000);
  });

  it('1500 + 0 → 1500 kg GVW', () => {
    assert.equal(calculateGrossVehicleWeight(1500, 0), 1500);
  });

  it('2500 + 750 → 3250 kg GVW', () => {
    assert.equal(calculateGrossVehicleWeight(2500, 750), 3250);
  });

  it('GVWR 2500, GVW 2100 → 400 remaining', () => {
    assert.equal(calculateRemainingCapacity(2500, 2100), 400);
  });

  it('GVWR 3000, GVW 3250 → 250 overload', () => {
    assert.equal(calculateOverloadedWeight(3250, 3000), 250);
  });

  it('GVWR 2500, GVW 2100 → 84% utilization', () => {
    assert.equal(calculateGvwrUtilization(2100, 2500), 84);
  });

  it('GVWR 2000, GVW 2000 → 100% utilization', () => {
    assert.equal(calculateGvwrUtilization(2000, 2000), 100);
  });

  it('GVWR 3500, unloaded 2300 → 1200 max payload', () => {
    assert.equal(calculateMaximumPayload(3500, 2300), 1200);
  });

  it('1000 kg → ≈2204.62 lb', () => {
    assert.ok(Math.abs(fromKg(1000, 'lb') - 2204.6226218487757) < 1e-9);
  });

  it('2000 lb → 907.18474 kg', () => {
    assert.equal(toKg(2000, 'lb'), 907.18474);
  });

  it('1 t → 1000 kg', () => {
    assert.equal(toKg(1, 't'), 1000);
  });

  it('1 US ton → 2000 lb', () => {
    assert.ok(Math.abs(fromKg(toKg(1, 'usTon'), 'lb') - 2000) < 1e-9);
  });

  it('default fixture → 1500 kg GVW', () => {
    const r = calculateGvwrFromInput(createEmptyInput())!;
    assert.equal(r.grossVehicleWeightKg, 1500);
    assert.equal(r.formattedGvw, '1,500.00 kg');
  });

  it('capacity example → remaining / utilization', () => {
    const r = calculateGvwrFromInput(createCapacityExample())!;
    assert.equal(r.grossVehicleWeightKg, 2100);
    assert.equal(r.remainingCapacityKg, 400);
    assert.equal(r.utilizationPercent, 84);
    assert.equal(r.loadingStatus, 'within');
  });

  it('negative tare validation', () => {
    const input = createEmptyInput();
    input.tareWeight = '-1';
    assert.ok(validateGvwrInputs(input).errors.tareWeight);
  });

  it('negative payload validation', () => {
    const input = createEmptyInput();
    input.payloadWeight = '-1';
    assert.ok(validateGvwrInputs(input).errors.payloadWeight);
  });

  it('GVWR = 0 validation', () => {
    const input = createCapacityExample();
    input.manufacturerGvwr = '0';
    assert.ok(validateGvwrInputs(input).errors.manufacturerGvwr);
  });

  it('missing inputs → no result', () => {
    const input = createEmptyInput();
    input.tareWeight = '';
    assert.equal(validateGvwrInputs(input).result, null);
  });

  it('maximum payload mode', () => {
    const input = createEmptyInput();
    input.mode = 'maximumPayload';
    input.manufacturerGvwr = '3500';
    input.unloadedWeight = '2300';
    const r = calculateGvwrFromInput(input)!;
    assert.equal(r.maximumPayloadKg, 1200);
  });

  it('overload status', () => {
    const input = createCapacityExample();
    input.tareWeight = '2800';
    input.payloadWeight = '500';
    input.manufacturerGvwr = '3000';
    const r = calculateGvwrFromInput(input)!;
    assert.equal(r.overloadedWeightKg, 300);
    assert.equal(r.loadingStatus, 'over');
    assert.equal(r.isOverloaded, true);
  });
});
