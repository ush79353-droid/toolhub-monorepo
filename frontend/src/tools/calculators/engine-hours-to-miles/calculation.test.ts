import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  KM_PER_MILE,
  calculateDistanceFromEngineHours,
  calculateEngineHoursFromDistance,
  calculateEngineHoursFromInput,
  calculateMaintenanceEquivalentMiles,
  convertTime,
  toMiles,
} from './calculation';
import {
  createEmptyInput,
  createExampleReverse,
  createExampleStationary,
} from './types';
import { validateEngineHoursInputs } from './validation';

describe('Engine Hours to Miles Converter engine', () => {
  it('1000 h · 30 mph → 30000 mi', () => {
    assert.equal(calculateDistanceFromEngineHours(1000, 30), 30000);
  });

  it('500 h · 50 km/h → 25000 km', () => {
    const input = createEmptyInput();
    input.engineHours = '500';
    input.averageSpeed = '50';
    input.averageSpeedUnit = 'km/h';
    input.resultDistanceUnit = 'km';
    const r = calculateEngineHoursFromInput(input)!;
    assert.ok(Math.abs(toMiles(25000, 'km') - (r.distanceMiles ?? 0)) < 1e-6);
    assert.ok(r.displayPrimary.includes('25,000'));
  });

  it('2000 h · 40 mph → 80000 mi', () => {
    assert.equal(calculateDistanceFromEngineHours(2000, 40), 80000);
  });

  it('60000 mi · 30 mph → 2000 h', () => {
    assert.equal(calculateEngineHoursFromDistance(60000, 30), 2000);
  });

  it('100 h · 0 mph → 0 mi', () => {
    assert.equal(calculateDistanceFromEngineHours(100, 0), 0);
  });

  it('500 idle · factor 30 → 15000 equiv', () => {
    assert.equal(calculateMaintenanceEquivalentMiles(500, 30), 15000);
  });

  it('stationary → actual 0', () => {
    const r = calculateEngineHoursFromInput(createExampleStationary())!;
    assert.equal(r.actualDistanceMiles, 0);
    assert.equal(r.maintenanceEquivalentMiles, 15000);
  });

  it('1 mi = 1.609344 km', () => {
    assert.ok(Math.abs(toMiles(KM_PER_MILE, 'km') - 1) < 1e-12);
  });

  it('1 h = 60 min', () => {
    assert.equal(convertTime(1, 'h', 'min'), 60);
  });

  it('1 day = 24 h', () => {
    assert.equal(convertTime(1, 'd', 'h'), 24);
  });

  it('default driving example', () => {
    const r = calculateEngineHoursFromInput(createEmptyInput())!;
    assert.equal(r.distanceMiles, 30000);
  });

  it('reverse example', () => {
    const r = calculateEngineHoursFromInput(createExampleReverse())!;
    assert.equal(r.estimatedDrivingHours, 2000);
  });

  it('negative hours validation', () => {
    const input = createEmptyInput();
    input.engineHours = '-1';
    assert.ok(validateEngineHoursInputs(input).errors.engineHours);
  });

  it('negative speed validation', () => {
    const input = createEmptyInput();
    input.averageSpeed = '-1';
    assert.ok(validateEngineHoursInputs(input).errors.averageSpeed);
  });

  it('positive distance · zero speed reverse', () => {
    const input = createExampleReverse();
    input.averageSpeed = '0';
    assert.ok(validateEngineHoursInputs(input).errors.averageSpeed);
  });
});
