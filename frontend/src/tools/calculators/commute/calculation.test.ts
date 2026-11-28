import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateCommuteFromInput,
  calculateCostPerPerson,
  calculateFuelCost,
  calculateFuelUsed,
  calculateParkingAndTolls,
  calculatePublicTransportCost,
  calculateRoundTripDistance,
  calculateWearAndTear,
  compareCommuteCosts,
  convertDistance,
  fromLPer100Km,
  normalizeCommuteDays,
} from './calculation';
import { createEmptyInput, createExampleInput } from './types';
import { validateCommuteInputs } from './validation';

describe('Commute Calculator engine', () => {
  it('20 km one-way → 40 km round trip', () => {
    assert.equal(calculateRoundTripDistance(20), 40);
  });

  it('20 km · 22 days/month → 880 km/month', () => {
    const days = normalizeCommuteDays(22, 'monthly');
    assert.ok(days);
    assert.equal(40 * days.perMonth, 880);
  });

  it('880 km at 8 L/100 km → 70.4 L', () => {
    assert.equal(calculateFuelUsed(880, 8), 70.4);
  });

  it('70.4 L at 280/L → 19,712', () => {
    assert.equal(calculateFuelCost(70.4, 280), 19712);
  });

  it('200 parking/day × 22 → 4,400', () => {
    const days = normalizeCommuteDays(22, 'monthly')!;
    assert.equal(
      calculateParkingAndTolls(200, 'perCommuteDay', days),
      4400,
    );
  });

  it('880 km × 5/km wear → 4,400', () => {
    assert.equal(
      calculateWearAndTear(5, 'perKm', 880, { perMonth: 22 }),
      4400,
    );
  });

  it('example total → 28,512; per person 9,504', () => {
    const r = calculateCommuteFromInput(createExampleInput());
    assert.ok(r);
    assert.ok(Math.abs((r.monthlyTotalCarCost ?? 0) - 28512) < 0.01);
    assert.ok(Math.abs((r.monthlyCarCostPerPerson ?? 0) - 9504) < 0.01);
  });

  it('150 × 2 rides × 22 days → 6,600', () => {
    const pt = calculatePublicTransportCost(
      'perRide',
      150,
      22,
      2,
      null,
      'days',
    );
    assert.ok(pt);
    assert.equal(pt.monthly, 6600);
  });

  it('9,504 car vs 6,600 transit → 2,904 savings', () => {
    const c = compareCommuteCosts(9504, 6600);
    assert.equal(c.savings, 2904);
    assert.equal(c.cheaper, 'publicTransport');
  });

  it('100 km → ≈62.14 mi', () => {
    assert.ok(Math.abs(convertDistance(100, 'km', 'mi') - 62.137) < 0.01);
  });

  it('8 L/100 km → ≈29.40 mpg US', () => {
    const mpg = fromLPer100Km(8, 'mpgUS');
    assert.ok(mpg != null && Math.abs(mpg - 29.4018) < 0.02);
  });

  it('zero passengers → validation error', () => {
    const input = createExampleInput();
    input.peopleSharingRide = '0';
    const v = validateCommuteInputs(input);
    assert.ok(v.errors.peopleSharingRide);
  });

  it('negative distance → validation error', () => {
    const input = createExampleInput();
    input.oneWayDistance = '-5';
    assert.ok(validateCommuteInputs(input).errors.oneWayDistance);
  });

  it('negative fuel price → validation error', () => {
    const input = createExampleInput();
    input.fuelPrice = '-1';
    assert.ok(validateCommuteInputs(input).errors.fuelPrice);
  });

  it('zero ticket validity → validation error', () => {
    const input = createExampleInput();
    input.ticketMode = 'timeBasedPass';
    input.ticketValidity = '0';
    assert.ok(validateCommuteInputs(input).errors.ticketValidity);
  });

  it('empty fuel economy → incomplete car, transit still ok', () => {
    const input = createExampleInput();
    input.fuelEconomy = '';
    input.fuelPrice = '';
    const r = calculateCommuteFromInput(input);
    assert.ok(r);
    assert.equal(r.monthlyTotalCarCost, null);
    assert.ok(r.monthlyPublicTransportCost != null);
  });

  it('empty form yields no result', () => {
    assert.equal(validateCommuteInputs(createEmptyInput()).result, null);
  });

  it('weekly frequency annualizes ×52', () => {
    const days = normalizeCommuteDays(5, 'weekly');
    assert.ok(days);
    assert.equal(days.perYear, 260);
  });

  it('cost per person division', () => {
    assert.equal(calculateCostPerPerson(28512, 3), 9504);
  });

  it('example full savings ≈ 2904', () => {
    const r = calculateCommuteFromInput(createExampleInput());
    assert.ok(r);
    assert.ok(Math.abs((r.monthlySavings ?? 0) - 2904) < 0.01);
    assert.equal(r.cheaperOption, 'publicTransport');
  });
});
