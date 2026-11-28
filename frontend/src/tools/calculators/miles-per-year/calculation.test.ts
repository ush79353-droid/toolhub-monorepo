import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateAnnualCommuteMileage,
  calculateAnnualFuelConsumption,
  calculateAnnualMiles,
  calculateFutureOdometer,
  calculateMilesPerYearFromInput,
  convertKilometersToMiles,
  convertMilesToKilometers,
  convertPeriodDistancePreservingAnnual,
} from './calculation';
import { createDailyExample, createEmptyInput } from './types';
import { validateMilesPerYearInputs } from './validation';

describe('Miles per Year Calculator engine', () => {
  it('1000 mi/month → 12000 mi/year', () => {
    assert.equal(calculateAnnualMiles(1000, 'month'), 12000);
  });

  it('500 mi/month → 6000', () => {
    assert.equal(calculateAnnualMiles(500, 'month'), 6000);
  });

  it('2000 mi/month → 24000', () => {
    assert.equal(calculateAnnualMiles(2000, 'month'), 24000);
  });

  it('30 mi/day → 10950', () => {
    assert.equal(calculateAnnualMiles(30, 'day'), 10950);
  });

  it('50 mi/day → 18250', () => {
    assert.equal(calculateAnnualMiles(50, 'day'), 18250);
  });

  it('100 mi/day → 36500', () => {
    assert.equal(calculateAnnualMiles(100, 'day'), 36500);
  });

  it('250 mi/week → ≈13035.71', () => {
    const a = calculateAnnualMiles(250, 'week')!;
    assert.ok(Math.abs(a - (250 * 365) / 7) < 1e-9);
  });

  it('100 mi/week → ≈5214.29', () => {
    const a = calculateAnnualMiles(100, 'week')!;
    assert.ok(Math.abs(a - (100 * 365) / 7) < 1e-9);
  });

  it('12000 mi/year → 12000', () => {
    assert.equal(calculateAnnualMiles(12000, 'year'), 12000);
  });

  it('1000 km/month → 12000 km annual', () => {
    assert.equal(calculateAnnualMiles(1000, 'month'), 12000);
  });

  it('1 mi → 1.609344 km', () => {
    assert.equal(convertMilesToKilometers(1), 1.609344);
  });

  it('1 km → ≈0.621371 mi', () => {
    assert.ok(Math.abs(convertKilometersToMiles(1) - 1 / 1.609344) < 1e-12);
  });

  it('0 mi/month → 0', () => {
    assert.equal(calculateAnnualMiles(0, 'month'), 0);
  });

  it('15 mi × 2 × 5 × 48 → 7200 commute', () => {
    assert.equal(calculateAnnualCommuteMileage(30, 5, 48), 7200);
  });

  it('12000 mi · 30 mpg → 400 US gal', () => {
    const f = calculateAnnualFuelConsumption(12000, 30, 'mpgUS')!;
    assert.equal(f.usGallons, 400);
  });

  it('400 gal × 3.50 → 1400', () => {
    assert.equal(400 * 3.5, 1400);
  });

  it('50000 + 12000 × 3 → 86000', () => {
    assert.equal(calculateFutureOdometer(50000, 12000, 3), 86000);
  });

  it('default fixture → 12000 mi', () => {
    const r = calculateMilesPerYearFromInput(createEmptyInput())!;
    assert.equal(r.annualMiles, 12000);
  });

  it('daily example → 10950', () => {
    const r = calculateMilesPerYearFromInput(createDailyExample())!;
    assert.equal(r.annualMiles, 10950);
  });

  it('period switch preserves annual', () => {
    const monthly = 1000;
    const daily = convertPeriodDistancePreservingAnnual(
      monthly,
      'month',
      'day',
    );
    assert.ok(Math.abs(daily * 365 - 12000) < 1e-9);
  });

  it('negative distance validation', () => {
    const input = createEmptyInput();
    input.distance = '-1';
    assert.ok(validateMilesPerYearInputs(input).errors.distance);
  });

  it('empty distance → no result', () => {
    const input = createEmptyInput();
    input.distance = '';
    assert.equal(validateMilesPerYearInputs(input).result, null);
  });

  it('commute mode fixture → 9600', () => {
    const input = createEmptyInput();
    input.mode = 'commute';
    const r = calculateMilesPerYearFromInput(input)!;
    assert.equal(r.annualMiles, 9600);
  });

  it('fuel cost with default annual', () => {
    const input = createEmptyInput();
    input.showFuelCost = true;
    const r = calculateMilesPerYearFromInput(input)!;
    assert.equal(r.annualFuelUsGallons, 400);
    assert.equal(r.annualFuelCost, 1400);
  });
});
