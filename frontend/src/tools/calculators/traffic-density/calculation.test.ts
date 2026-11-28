import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateAverageHeadway,
  calculateAverageTrafficSpeed,
  calculateAverageVehicleSpacing,
  calculateTrafficDensity,
  calculateTrafficFlow,
  convertFlowToVehiclesPerHour,
  computeFromObservations,
} from './calculation';
import { createEmptyInput } from './types';
import { validateTrafficDensityInputs } from './validation';

function approx(actual: number, expected: number, tol = 1e-9) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`,
  );
}

describe('Traffic Density Calculator engine', () => {
  it('120 vehicles / 5 min → 1440 veh/h', () => {
    approx(calculateTrafficFlow(120, 5, 'min'), 1440);
  });

  it('20 vehicles / 2 km → 10 veh/km', () => {
    approx(calculateTrafficDensity(20, 2, 'km'), 10);
  });

  it('600 / 10 → 60 km/h', () => {
    approx(calculateAverageTrafficSpeed(600, 10), 60);
  });

  it('headway 600 veh/h → 6 s', () => {
    approx(calculateAverageHeadway(600), 6);
  });

  it('spacing 20 veh/km → 50 m', () => {
    approx(calculateAverageVehicleSpacing(20), 50);
  });

  it('full observation fixture', () => {
    const r = computeFromObservations({
      passingVehicles: 100,
      observationTime: 10,
      observationTimeUnit: 'min',
      segmentVehicles: 20,
      roadLength: 2,
      roadLengthUnit: 'km',
      flowUnit: 'vehicles/h',
      densityUnit: 'vehicles/km',
      speedUnit: 'km/h',
      headwayUnit: 's',
    });
    approx(r.trafficFlowVehiclesPerHour!, 600);
    approx(r.trafficDensityVehiclesPerKm!, 10);
    approx(r.averageSpeedKmPerHour!, 60);
    approx(r.headwaySeconds!, 6);
    approx(r.spacingMeters!, 100);
  });

  it('1 veh/s → 3600 veh/h', () => {
    approx(convertFlowToVehiclesPerHour(1, 'vehicles/s'), 3600);
  });

  it('zero density → no speed', () => {
    const r = computeFromObservations({
      passingVehicles: 100,
      observationTime: 10,
      observationTimeUnit: 'min',
      segmentVehicles: 0,
      roadLength: 2,
      roadLengthUnit: 'km',
      flowUnit: 'vehicles/h',
      densityUnit: 'vehicles/km',
      speedUnit: 'km/h',
      headwayUnit: 's',
    });
    assert.equal(r.averageSpeedKmPerHour, null);
    assert.ok(r.speedNote);
  });

  it('zero flow → no headway', () => {
    const r = computeFromObservations({
      passingVehicles: 0,
      observationTime: 10,
      observationTimeUnit: 'min',
      segmentVehicles: 20,
      roadLength: 2,
      roadLengthUnit: 'km',
      flowUnit: 'vehicles/h',
      densityUnit: 'vehicles/km',
      speedUnit: 'km/h',
      headwayUnit: 's',
    });
    assert.equal(r.headwaySeconds, null);
    assert.ok(r.headwayNote);
  });

  it('default fixture validates', () => {
    const v = validateTrafficDensityInputs(createEmptyInput());
    assert.equal(Object.keys(v.errors).length, 0);
    assert.ok(v.result);
    approx(v.result!.trafficFlowVehiclesPerHour!, 600);
  });

  it('fractional vehicles invalid', () => {
    const v = validateTrafficDensityInputs({
      ...createEmptyInput(),
      passingVehicles: '1.5',
    });
    assert.ok(v.errors.passingVehicles);
  });

  it('direct speed mode', () => {
    const v = validateTrafficDensityInputs({
      ...createEmptyInput(),
      mode: 'calculate-speed',
      directFlow: '600',
      directDensity: '10',
    });
    assert.ok(v.result);
    approx(v.result!.averageSpeedKmPerHour!, 60);
  });

  it('blank → no result', () => {
    const v = validateTrafficDensityInputs({
      ...createEmptyInput(),
      passingVehicles: '',
      observationTime: '',
      segmentVehicles: '',
      roadLength: '',
    });
    assert.equal(v.result, null);
  });
});
