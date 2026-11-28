import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateDrivingCostFromKWhPer100Km,
  calculateFullChargeCost,
  calculatePartialChargingCost,
  convertEfficiencyToKWhPerKm,
  convertEnergyToKWh,
  generateChargingCostChartData,
} from './calculation';
import { createBlankInput, createEmptyInput } from './types';
import { validateTeslaChargingInputs } from './validation';

const approx = (actual: number, expected: number, tol = 0.02) => {
  assert.ok(
    Math.abs(actual - expected) < tol,
    `expected ≈ ${expected}, got ${actual}`,
  );
};

describe('Tesla Charging Cost Calculator engine', () => {
  it('60 kWh × 0.25 → 15', () => {
    assert.equal(calculateFullChargeCost(60, 0.25), 15);
  });
  it('75 × 0.20 → 15', () => {
    assert.equal(calculateFullChargeCost(75, 0.2), 15);
  });
  it('50 × 0.30 → 15', () => {
    assert.equal(calculateFullChargeCost(50, 0.3), 15);
  });
  it('80 × 0.15 → 12', () => {
    assert.equal(calculateFullChargeCost(80, 0.15), 12);
  });

  it('100 km · 20 · 0.25 → 5', () => {
    approx(calculateDrivingCostFromKWhPer100Km(100, 20, 0.25), 5);
  });
  it('200 km · 21.75 · 0.25 → 10.875', () => {
    approx(calculateDrivingCostFromKWhPer100Km(200, 21.75, 0.25), 10.875);
  });
  it('300 km · 15 · 0.20 → 9', () => {
    approx(calculateDrivingCostFromKWhPer100Km(300, 15, 0.2), 9);
  });
  it('50 km · 18 · 0.30 → 2.70', () => {
    approx(calculateDrivingCostFromKWhPer100Km(50, 18, 0.3), 2.7);
  });

  it('partial 60 kWh 20→80 @90% · 0.25 → 10', () => {
    approx(calculatePartialChargingCost(60, 20, 80, 0.25, 0.9), 10);
  });

  it('1000 Wh = 1 kWh', () => {
    assert.equal(convertEnergyToKWh(1000, 'Wh'), 1);
  });

  it('21.75 kWh/100km → 0.2175 kWh/km', () => {
    approx(convertEfficiencyToKWhPerKm(21.75, 'kWh/100km'), 0.2175, 1e-12);
  });

  it('chart from 0% interval 25 has points', () => {
    const pts = generateChargingCostChartData(60, 0.25, 0, 25, 1);
    assert.ok(pts.length >= 4);
    approx(pts[0]!.cost, 0);
    approx(pts.find((p) => p.socPercent === 100)!.cost, 15);
  });

  it('default fixture validates', () => {
    const v = validateTeslaChargingInputs(createEmptyInput());
    assert.ok(v.result);
    approx(v.result!.fullChargeCost!, 15);
    approx(v.result!.drivingCost!, 10.875);
  });

  it('negative price invalid', () => {
    const v = validateTeslaChargingInputs({
      ...createEmptyInput(),
      electricityPrice: '-1',
    });
    assert.ok(v.errors.electricityPrice);
  });

  it('blank → no result', () => {
    const v = validateTeslaChargingInputs(createBlankInput());
    assert.equal(v.result, null);
  });

  it('target ≤ start invalid in advanced', () => {
    const v = validateTeslaChargingInputs({
      ...createEmptyInput(),
      advancedMode: true,
      startBatteryPercent: '80',
      targetBatteryPercent: '20',
    });
    assert.ok(v.errors.targetBatteryPercent);
  });
});
