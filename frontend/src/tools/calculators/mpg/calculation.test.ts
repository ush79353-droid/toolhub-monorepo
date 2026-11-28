import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateCostPerMile,
  calculateFuelRangeMiles,
  calculateFuelUsedUSGallons,
  calculateKilometersPerLiter,
  calculateLitersPer100Km,
  calculateMPG,
  calculateMPGImprovement,
  calculateMpgFromInput,
  calculateTripCost,
  convertFuelEconomy,
  convertFuelVolume,
  fromUSMpg,
  LITERS_PER_IMP_GAL,
  LITERS_PER_US_GAL,
  toMiles,
  toUSGallons,
  toUSMpg,
} from './calculation';
import { createEmptyInput } from './types';
import { validateMpgInputs } from './validation';

describe('MPG Calculator engine', () => {
  const mpgCases: Array<[number, number, number]> = [
    [100, 5, 20],
    [150, 5, 30],
    [200, 10, 20],
    [250, 10, 25],
    [300, 10, 30],
    [350, 10, 35],
    [400, 10, 40],
    [450, 15, 30],
    [500, 20, 25],
    [600, 15, 40],
  ];

  for (const [mi, gal, mpg] of mpgCases) {
    it(`${mi} mi / ${gal} US gal → ${mpg} MPG`, () => {
      assert.equal(calculateMPG(mi, gal), mpg);
    });
  }

  it('300 mi / 30 MPG → 10 US gal', () => {
    assert.equal(calculateFuelUsedUSGallons(300, 30), 10);
  });

  it('500 mi / 25 MPG → 20 US gal', () => {
    assert.equal(calculateFuelUsedUSGallons(500, 25), 20);
  });

  it('12 US gal × 30 MPG → 360 mi', () => {
    assert.equal(calculateFuelRangeMiles(12, 30), 360);
  });

  it('15 US gal × 40 MPG → 600 mi', () => {
    assert.equal(calculateFuelRangeMiles(15, 40), 600);
  });

  it('30 US MPG ≈ 7.84 L/100 km', () => {
    const l100 = calculateLitersPer100Km(30);
    assert.ok(l100 != null);
    assert.ok(Math.abs(l100! - 7.8404861) < 1e-5);
  });

  it('30 US MPG ≈ 12.75 km/L', () => {
    const kml = calculateKilometersPerLiter(30);
    assert.ok(kml != null);
    assert.ok(Math.abs(kml! - 12.754311) < 1e-4);
  });

  it('30 US MPG ≈ 36.03 Imp MPG', () => {
    const imp = fromUSMpg(30, 'imp-mpg');
    assert.ok(imp != null);
    assert.ok(Math.abs(imp! - 36.03) < 0.02);
  });

  it('1 US gal = 3.785411784 L', () => {
    assert.ok(
      Math.abs(convertFuelVolume(1, 'us-gal', 'L') - LITERS_PER_US_GAL) < 1e-12,
    );
  });

  it('1 Imp gal = 4.54609 L', () => {
    assert.ok(
      Math.abs(convertFuelVolume(1, 'imp-gal', 'L') - LITERS_PER_IMP_GAL) <
        1e-12,
    );
  });

  it('fuel costs', () => {
    assert.equal(calculateTripCost(100 / 25, 4), 16);
    assert.equal(calculateTripCost(200 / 20, 3), 30);
    assert.equal(calculateTripCost(300 / 30, 3.5), 35);
    assert.equal(calculateTripCost(500 / 25, 4), 80);
    assert.equal(calculateTripCost(600 / 30, 3), 60);
  });

  it('cost per mile 35/300', () => {
    const c = calculateCostPerMile(35, 300);
    assert.ok(c != null);
    assert.ok(Math.abs(c! - 35 / 300) < 1e-12);
  });

  it('default fixture → 30 US MPG', () => {
    const r = calculateMpgFromInput(createEmptyInput());
    assert.ok(r);
    assert.equal(r!.mpgUS, 30);
  });

  it('trip cost section → $35', () => {
    const r = calculateMpgFromInput({
      ...createEmptyInput(),
      showTripCost: true,
      tripDistance: '300',
      fuelPrice: '3.50',
      fuelPriceUnit: 'per-us-gal',
    });
    assert.ok(r);
    assert.equal(r!.tripCost, 35);
    assert.equal(r!.tripFuelNeeded, 10);
  });

  it('compare 25 vs 40 MPG @ 1000 mi · $3.50', () => {
    const r = calculateMpgFromInput({
      ...createEmptyInput(),
      calculationMode: 'fuel-economy',
      distance: '1000',
      fuelUsed: '40',
      showCompare: true,
      compareEconomyB: '40',
      compareDistance: '1000',
      fuelPrice: '3.50',
      fuelPriceUnit: 'per-us-gal',
    });
    assert.ok(r);
    // main economy from 1000/40 = 25
    assert.equal(r!.mpgUS, 25);
    assert.equal(r!.compareFuelA, 40);
    assert.equal(r!.compareFuelB, 25);
    assert.equal(r!.fuelSavings, 15);
    assert.equal(r!.compareCostA, 140);
    assert.equal(r!.compareCostB, 87.5);
    assert.equal(r!.costSavings, 52.5);
    assert.ok(r!.fuelReductionPct != null);
    assert.ok(Math.abs(r!.fuelReductionPct! - 37.5) < 1e-9);
  });

  it('improve 25 → 30 MPG', () => {
    const imp = calculateMPGImprovement(25, 30);
    assert.ok(imp);
    assert.equal(imp!.improvementPct, 20);
    assert.ok(Math.abs(imp!.consumptionReductionPct - (1 - 25 / 30) * 100) < 1e-9);
  });

  it('zero fuel with positive distance → invalid', () => {
    const v = validateMpgInputs({
      ...createEmptyInput(),
      fuelUsed: '0',
    });
    assert.equal(v.isValid, false);
  });

  it('negative distance validation', () => {
    const v = validateMpgInputs({
      ...createEmptyInput(),
      distance: '-1',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.distance);
  });

  it('empty distance → no result', () => {
    const v = validateMpgInputs({
      ...createEmptyInput(),
      distance: '',
    });
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
  });

  it('economy unit convert US ↔ L/100km round-trip', () => {
    const l100 = convertFuelEconomy(30, 'us-mpg', 'L/100km');
    assert.ok(l100 != null);
    const back = convertFuelEconomy(l100!, 'L/100km', 'us-mpg');
    assert.ok(back != null);
    assert.ok(Math.abs(back! - 30) < 1e-9);
  });

  it('toMiles / toUSGallons sanity', () => {
    assert.ok(Math.abs(toMiles(1.609344, 'km') - 1) < 1e-9);
    assert.ok(Math.abs(toUSGallons(LITERS_PER_US_GAL, 'L') - 1) < 1e-12);
  });

  it('toUSMpg imp → us', () => {
    const us = toUSMpg(36.02352046, 'imp-mpg');
    assert.ok(us != null);
    assert.ok(Math.abs(us! - 30) < 0.01);
  });

  it('fuel-used mode', () => {
    const r = calculateMpgFromInput({
      ...createEmptyInput(),
      calculationMode: 'fuel-used',
      distance: '300',
      fuelEconomy: '30',
      fuelEconomyUnit: 'us-mpg',
    });
    assert.ok(r);
    assert.ok(Math.abs(r!.fuelUsedValue - 10) < 1e-9);
  });

  it('distance mode', () => {
    const r = calculateMpgFromInput({
      ...createEmptyInput(),
      calculationMode: 'distance',
      fuelUsed: '12',
      fuelUsedUnit: 'us-gal',
      fuelEconomy: '30',
      fuelEconomyUnit: 'us-mpg',
    });
    assert.ok(r);
    assert.ok(Math.abs(r!.distanceValue - 360) < 1e-9);
  });
});
