import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateDistanceMeters,
  calculateMilesToHoursFromInput,
  calculateRequiredSpeedMps,
  calculateTravelTimeSeconds,
  convertDistance,
  convertSpeed,
  convertTime,
  formatDuration,
  fromMeters,
  fromMetersPerSecond,
  fromSeconds,
  toMeters,
  toMetersPerSecond,
  toSeconds,
  KM_PER_MILE,
} from './calculation';
import {
  createEmptyInput,
  createDistanceModeExample,
  createSpeedModeExample,
} from './types';
import { validateMilesToHoursInputs } from './validation';

describe('Miles to Hours Converter engine', () => {
  const cases: Array<[number, number, number]> = [
    [30, 30, 1],
    [60, 60, 1],
    [100, 50, 2],
    [120, 40, 3],
    [150, 50, 3],
    [180, 60, 3],
    [240, 60, 4],
    [300, 60, 5],
    [100, 40, 2.5],
    [75, 50, 1.5],
  ];

  for (const [mi, mph, hours] of cases) {
    it(`${mi} mi / ${mph} mph → ${hours} h`, () => {
      const t = calculateTravelTimeSeconds(
        toMeters(mi, 'mi'),
        toMetersPerSecond(mph, 'mph'),
      );
      assert.ok(t != null);
      assert.ok(Math.abs(fromSeconds(t!, 'h') - hours) < 1e-9);
    });
  }

  it('60 mph × 2 h → 120 mi', () => {
    const d = calculateDistanceMeters(
      toMetersPerSecond(60, 'mph'),
      toSeconds(2, 'h'),
    );
    assert.ok(d != null);
    assert.ok(Math.abs(fromMeters(d!, 'mi') - 120) < 1e-9);
  });

  it('50 mph × 3 h → 150 mi', () => {
    const d = calculateDistanceMeters(
      toMetersPerSecond(50, 'mph'),
      toSeconds(3, 'h'),
    );
    assert.ok(d != null);
    assert.ok(Math.abs(fromMeters(d!, 'mi') - 150) < 1e-9);
  });

  it('240 mi ÷ 4 h → 60 mph', () => {
    const s = calculateRequiredSpeedMps(toMeters(240, 'mi'), toSeconds(4, 'h'));
    assert.ok(s != null);
    assert.ok(Math.abs(fromMetersPerSecond(s!, 'mph') - 60) < 1e-9);
  });

  it('150 mi ÷ 2.5 h → 60 mph', () => {
    const s = calculateRequiredSpeedMps(
      toMeters(150, 'mi'),
      toSeconds(2.5, 'h'),
    );
    assert.ok(s != null);
    assert.ok(Math.abs(fromMetersPerSecond(s!, 'mph') - 60) < 1e-9);
  });

  it('100 mi ÷ 2 h → 50 mph', () => {
    const s = calculateRequiredSpeedMps(toMeters(100, 'mi'), toSeconds(2, 'h'));
    assert.ok(s != null);
    assert.ok(Math.abs(fromMetersPerSecond(s!, 'mph') - 50) < 1e-9);
  });

  it('1 mi → 1.609344 km', () => {
    assert.ok(Math.abs(convertDistance(1, 'mi', 'km') - KM_PER_MILE) < 1e-12);
  });

  it('60 mph → 96.56064 km/h', () => {
    assert.ok(Math.abs(convertSpeed(60, 'mph', 'km/h') - 96.56064) < 1e-9);
  });

  it('1 h → 60 min · 3600 s', () => {
    assert.equal(convertTime(1, 'h', 'min'), 60);
    assert.equal(convertTime(1, 'h', 's'), 3600);
  });

  it('1.5 h → 90 min · 2.75 h → 165 min', () => {
    assert.equal(convertTime(1.5, 'h', 'min'), 90);
    assert.equal(convertTime(2.75, 'h', 'min'), 165);
  });

  it('120 min → 2 h · 3600 s → 1 h', () => {
    assert.equal(convertTime(120, 'min', 'h'), 2);
    assert.equal(convertTime(3600, 's', 'h'), 1);
  });

  it('formatDuration 1.5 h → 1 hour 30 minutes', () => {
    assert.equal(formatDuration(1.5 * 3600), '1 hour 30 minutes');
  });

  it('formatDuration 2.75 h → 2 hours 45 minutes', () => {
    assert.equal(formatDuration(2.75 * 3600), '2 hours 45 minutes');
  });

  it('formatDuration 0.25 h → 15 minutes', () => {
    assert.equal(formatDuration(0.25 * 3600), '15 minutes');
  });

  it('default fixture → 3 h', () => {
    const r = calculateMilesToHoursFromInput(createEmptyInput());
    assert.ok(r);
    assert.ok(Math.abs(r!.timeHours - 3) < 1e-9);
    assert.equal(r!.formattedDuration, '3 hours');
  });

  it('distance mode example → 150 mi', () => {
    const r = calculateMilesToHoursFromInput(createDistanceModeExample());
    assert.ok(r);
    assert.ok(Math.abs(r!.distanceValue - 150) < 1e-9);
  });

  it('speed mode example → 60 mph', () => {
    const r = calculateMilesToHoursFromInput(createSpeedModeExample());
    assert.ok(r);
    assert.ok(Math.abs(r!.speedValue - 60) < 1e-9);
  });

  it('zero distance → 0 time', () => {
    const r = calculateMilesToHoursFromInput({
      ...createEmptyInput(),
      distance: '0',
    });
    assert.ok(r);
    assert.equal(r!.timeSeconds, 0);
  });

  it('zero speed with positive distance → no result', () => {
    const v = validateMilesToHoursInputs({
      ...createEmptyInput(),
      speed: '0',
    });
    assert.equal(v.isValid, false);
  });

  it('negative distance validation', () => {
    const v = validateMilesToHoursInputs({
      ...createEmptyInput(),
      distance: '-1',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.distance);
  });

  it('empty distance → no result', () => {
    const v = validateMilesToHoursInputs({
      ...createEmptyInput(),
      distance: '',
    });
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
  });

  it('compare speeds 180 mi 45 vs 60 → 1 h saved / 25%', () => {
    const r = calculateMilesToHoursFromInput({
      ...createEmptyInput(),
      distance: '180',
      speed: '45',
      showCompare: true,
      compareSpeedB: '60',
      compareSpeedBUnit: 'mph',
    });
    assert.ok(r);
    assert.ok(r!.timeSavedHours != null);
    assert.ok(Math.abs(r!.timeSavedHours! - 1) < 1e-9);
    assert.ok(r!.percentageSaved != null);
    assert.ok(Math.abs(r!.percentageSaved! - 25) < 1e-9);
  });

  it('breaks 2 × 15 min on 4 h drive → 4.5 h trip', () => {
    const r = calculateMilesToHoursFromInput({
      ...createEmptyInput(),
      distance: '200',
      speed: '50',
      showBreaks: true,
      numberOfBreaks: '2',
      breakDuration: '15',
      breakDurationUnit: 'min',
    });
    assert.ok(r);
    assert.ok(r!.totalTripHours != null);
    assert.ok(Math.abs(r!.totalTripHours! - 4.5) < 1e-9);
  });
});
