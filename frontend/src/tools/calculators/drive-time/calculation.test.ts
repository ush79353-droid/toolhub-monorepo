import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  KM_PER_MILE,
  addHoursLocal,
  calculateCostPerKilometer,
  calculateCostPerPerson,
  calculateDriveTimeFromInput,
  calculateDrivingTimeHours,
  calculateFuelConsumptionLiters,
  calculateFuelCost,
  calculateTotalDriveCost,
  convertDistance,
  convertSpeed,
  formatTravelDuration,
  parseLocalDateTime,
  subtractHoursLocal,
  toLPer100Km,
} from './calculation';
import { createEmptyInput } from './types';
import { validateDriveTimeInputs } from './validation';

describe('Drive Time Calculator engine', () => {
  it('300 km / 60 km/h → 5 h', () => {
    assert.equal(calculateDrivingTimeHours(300, 60), 5);
  });

  it('150 km / 75 → 2 h', () => {
    assert.equal(calculateDrivingTimeHours(150, 75), 2);
  });

  it('100 mi / 50 mph → 2 h', () => {
    const km = convertDistance(100, 'mi', 'km');
    const kmh = convertSpeed(50, 'mph', 'km/h');
    assert.ok(Math.abs((calculateDrivingTimeHours(km, kmh) ?? 0) - 2) < 1e-9);
  });

  it('300 km · 60 · 45 min break → 5 h 45 min', () => {
    const r = calculateDriveTimeFromInput(createEmptyInput());
    assert.ok(r);
    assert.equal(r.drivingTimeHours, 5);
    assert.ok(Math.abs(r.breakHours - 0.75) < 1e-9);
    assert.ok(Math.abs(r.totalTripHours - 5.75) < 1e-9);
    assert.equal(formatTravelDuration(5.75), '5 h 45 min');
  });

  it('departure + duration → arrival', () => {
    const dep = parseLocalDateTime('2026-11-28T10:00')!;
    const arr = addHoursLocal(dep, 5.75);
    assert.equal(arr.getHours(), 15);
    assert.equal(arr.getMinutes(), 45);
  });

  it('arrival − duration → departure', () => {
    const arr = parseLocalDateTime('2026-11-28T18:00')!;
    const dep = subtractHoursLocal(arr, 4.5);
    assert.equal(dep.getHours(), 13);
    assert.equal(dep.getMinutes(), 30);
  });

  it('300 km · 7 L/100 → 21 L', () => {
    assert.equal(calculateFuelConsumptionLiters(300, 7), 21);
  });

  it('21 L · 280 → 5880', () => {
    assert.equal(calculateFuelCost(21, 280), 5880);
  });

  it('fuel 5880 + extras 800 → 6680', () => {
    assert.equal(calculateTotalDriveCost(5880, 800), 6680);
  });

  it('6680 / 4 → 1670', () => {
    assert.equal(calculateCostPerPerson(6680, 4), 1670);
  });

  it('6680 / 300 ≈ 22.266…', () => {
    const c = calculateCostPerKilometer(6680, 300)!;
    assert.ok(Math.abs(c - 6680 / 300) < 1e-9);
  });

  it('example input totals', () => {
    const r = calculateDriveTimeFromInput(createEmptyInput())!;
    assert.equal(r.fuelUsedLiters, 21);
    assert.equal(r.fuelCost, 5880);
    assert.equal(r.additionalExpenses, 800);
    assert.equal(r.totalTripCost, 6680);
    assert.equal(r.costPerPerson, 1670);
  });

  it('zero distance → 0 drive time', () => {
    assert.equal(calculateDrivingTimeHours(0, 60), 0);
  });

  it('nonzero distance · speed 0 → null', () => {
    assert.equal(calculateDrivingTimeHours(100, 0), null);
  });

  it('validation: speed 0 with distance', () => {
    const input = createEmptyInput();
    input.averageSpeed = '0';
    assert.ok(validateDriveTimeInputs(input).errors.averageSpeed);
  });

  it('validation: negative distance', () => {
    const input = createEmptyInput();
    input.distance = '-1';
    assert.ok(validateDriveTimeInputs(input).errors.distance);
  });

  it('validation: negative fuel price', () => {
    const input = createEmptyInput();
    input.fuelPrice = '-1';
    assert.ok(validateDriveTimeInputs(input).errors.fuelPrice);
  });

  it('validation: passengers 0', () => {
    const input = createEmptyInput();
    input.passengers = '0';
    assert.ok(validateDriveTimeInputs(input).errors.passengers);
  });

  it('mile conversion', () => {
    assert.ok(Math.abs(convertDistance(1, 'mi', 'km') - KM_PER_MILE) < 1e-12);
  });

  it('L/100 → mpg US', () => {
    const mpg = 235.214583 / 7;
    const back = toLPer100Km(mpg, 'mpgUS');
    assert.ok(back != null && Math.abs(back - 7) < 1e-6);
  });

  it('midnight crossing', () => {
    const dep = parseLocalDateTime('2026-11-28T22:00')!;
    const arr = addHoursLocal(dep, 5);
    assert.equal(arr.getDate(), 29);
    assert.equal(arr.getHours(), 3);
  });

  it('departure-from-arrival mode', () => {
    const input = createEmptyInput();
    input.scheduleMode = 'departureFromArrival';
    input.arrivalLocal = '2026-11-28T18:00';
    input.breakDuration = '30';
    // drive 5h + 0.5 break = 5.5 → dep 12:30
    const r = calculateDriveTimeFromInput(input)!;
    assert.ok(r.departureLabel?.includes('12:30'));
  });
});
